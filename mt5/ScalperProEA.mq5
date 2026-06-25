//+------------------------------------------------------------------+
//|                                                 ScalperProEA.mq5  |
//|              Multi-asset scalping EA for MetaTrader 5 (MQL5)      |
//|   Works with Forex, Metals, Commodities, Indices and Stocks      |
//+------------------------------------------------------------------+
//  DISCLAIMER: Trading involves substantial risk. No expert advisor
//  can guarantee profit. ALWAYS backtest in the Strategy Tester and
//  forward-test on a DEMO account before using real funds.
//+------------------------------------------------------------------+
#property copyright "ScalperProEA"
#property version   "1.00"
#property strict
#property description "Fast multi-asset scalper: EMA trend + RSI pullback + ATR risk, with spread/time filters and trailing stop."

#include <Trade/Trade.mqh>
#include <Trade/PositionInfo.mqh>
#include <Trade/SymbolInfo.mqh>

CTrade        trade;
CPositionInfo position;
CSymbolInfo   sym;

//============================ INPUTS =================================
input group "=== Money Management ==="
input bool    InpUseRiskPercent   = true;     // Use % risk position sizing
input double  InpRiskPercent      = 0.5;       // Risk per trade (% of balance)
input double  InpFixedLot         = 0.01;      // Fixed lot (if risk % off)
input double  InpMaxLot           = 5.0;       // Hard lot cap

input group "=== Stops & Targets (ATR based) ==="
input int     InpATRPeriod        = 14;        // ATR period
input double  InpSL_ATR           = 1.5;       // Stop loss = ATR * this
input double  InpTP_ATR           = 1.0;       // Take profit = ATR * this  (scalp: TP<SL ratio OK with high win-rate)
input double  InpMinStopPoints    = 0;         // Min SL distance in points (0 = broker min)

input group "=== Entry Signal ==="
input ENUM_TIMEFRAMES InpTimeframe = PERIOD_M1; // Working timeframe (scalp = M1/M5)
input int     InpFastEMA          = 8;         // Fast EMA
input int     InpSlowEMA          = 21;        // Slow EMA (trend)
input int     InpTrendEMA         = 50;        // Higher trend filter EMA
input int     InpRSIPeriod        = 7;         // RSI period
input double  InpRSIBuyLevel      = 40.0;      // Buy when RSI pulls below this (in uptrend)
input double  InpRSISellLevel     = 60.0;      // Sell when RSI pulls above this (in downtrend)

input group "=== Trailing Stop & Break-even ==="
input bool    InpUseTrailing      = true;      // Enable trailing stop
input double  InpTrailStartATR    = 0.8;       // Start trailing after profit >= ATR*this
input double  InpTrailGapATR      = 0.6;       // Trailing distance = ATR*this
input bool    InpUseBreakEven     = true;      // Move SL to break-even
input double  InpBE_TriggerATR    = 0.5;       // BE trigger = ATR*this
input double  InpBE_LockPoints    = 20;        // Points locked above entry at BE

input group "=== Filters ==="
input double  InpMaxSpreadPoints  = 25;        // Max allowed spread (points). 0 = ignore
input int     InpMaxPositions     = 1;         // Max simultaneous positions (this symbol+magic)
input bool    InpOnePerBar        = true;      // Only one entry per bar
input bool    InpUseTimeFilter    = false;     // Restrict trading hours (server time)
input int     InpStartHour        = 7;         // Trading start hour
input int     InpEndHour          = 21;        // Trading end hour

input group "=== General ==="
input long    InpMagic            = 990155;    // Magic number
input int     InpSlippage         = 10;        // Max deviation (points)
input string  InpComment          = "ScalperProEA";

//============================ GLOBALS ================================
int      hFastEMA, hSlowEMA, hTrendEMA, hRSI, hATR;
datetime g_lastBarTime = 0;

//+------------------------------------------------------------------+
//| Init                                                             |
//+------------------------------------------------------------------+
int OnInit()
{
   if(!sym.Name(_Symbol))
      return(INIT_FAILED);

   trade.SetExpertMagicNumber(InpMagic);
   trade.SetDeviationInPoints(InpSlippage);
   trade.SetTypeFillingBySymbol(_Symbol);
   trade.SetAsyncMode(false);

   hFastEMA  = iMA(_Symbol, InpTimeframe, InpFastEMA,  0, MODE_EMA, PRICE_CLOSE);
   hSlowEMA  = iMA(_Symbol, InpTimeframe, InpSlowEMA,  0, MODE_EMA, PRICE_CLOSE);
   hTrendEMA = iMA(_Symbol, InpTimeframe, InpTrendEMA, 0, MODE_EMA, PRICE_CLOSE);
   hRSI      = iRSI(_Symbol, InpTimeframe, InpRSIPeriod, PRICE_CLOSE);
   hATR      = iATR(_Symbol, InpTimeframe, InpATRPeriod);

   if(hFastEMA==INVALID_HANDLE || hSlowEMA==INVALID_HANDLE || hTrendEMA==INVALID_HANDLE ||
      hRSI==INVALID_HANDLE || hATR==INVALID_HANDLE)
   {
      Print("Failed to create indicator handles");
      return(INIT_FAILED);
   }

   Print("ScalperProEA initialized on ", _Symbol, " ", EnumToString(InpTimeframe));
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Deinit                                                           |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   IndicatorRelease(hFastEMA);
   IndicatorRelease(hSlowEMA);
   IndicatorRelease(hTrendEMA);
   IndicatorRelease(hRSI);
   IndicatorRelease(hATR);
}

//+------------------------------------------------------------------+
//| Helper: read one indicator value at shift                        |
//+------------------------------------------------------------------+
bool Val(int handle, int shift, double &out)
{
   double buf[];
   if(CopyBuffer(handle, 0, shift, 1, buf) < 1)
      return(false);
   out = buf[0];
   return(true);
}

//+------------------------------------------------------------------+
//| Count open positions for this symbol & magic                     |
//+------------------------------------------------------------------+
int CountPositions()
{
   int n = 0;
   for(int i = PositionsTotal()-1; i >= 0; i--)
   {
      if(position.SelectByIndex(i))
         if(position.Symbol()==_Symbol && position.Magic()==InpMagic)
            n++;
   }
   return(n);
}

//+------------------------------------------------------------------+
//| Spread filter                                                    |
//+------------------------------------------------------------------+
bool SpreadOK()
{
   if(InpMaxSpreadPoints <= 0) return(true);
   double spread = (double)SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   return(spread <= InpMaxSpreadPoints);
}

//+------------------------------------------------------------------+
//| Time filter                                                      |
//+------------------------------------------------------------------+
bool TimeOK()
{
   if(!InpUseTimeFilter) return(true);
   MqlDateTime t;
   TimeToStruct(TimeCurrent(), t);
   if(InpStartHour <= InpEndHour)
      return(t.hour >= InpStartHour && t.hour < InpEndHour);
   // wraps midnight
   return(t.hour >= InpStartHour || t.hour < InpEndHour);
}

//+------------------------------------------------------------------+
//| Normalize lot to broker constraints                              |
//+------------------------------------------------------------------+
double NormalizeLot(double lot)
{
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double step   = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(step <= 0) step = 0.01;

   lot = MathFloor(lot/step) * step;
   lot = MathMax(lot, minLot);
   lot = MathMin(lot, maxLot);
   lot = MathMin(lot, InpMaxLot);
   return(NormalizeDouble(lot, 2));
}

//+------------------------------------------------------------------+
//| Position size from risk % and SL distance (price units)          |
//+------------------------------------------------------------------+
double CalcLot(double slPrice, double entryPrice)
{
   if(!InpUseRiskPercent)
      return(NormalizeLot(InpFixedLot));

   double balance   = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskMoney = balance * InpRiskPercent / 100.0;

   double tickVal  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double slDist   = MathAbs(entryPrice - slPrice);

   if(tickVal <= 0 || tickSize <= 0 || slDist <= 0)
      return(NormalizeLot(InpFixedLot));

   double lossPerLot = (slDist / tickSize) * tickVal; // money lost per 1.0 lot if SL hit
   if(lossPerLot <= 0)
      return(NormalizeLot(InpFixedLot));

   double lot = riskMoney / lossPerLot;
   return(NormalizeLot(lot));
}

//+------------------------------------------------------------------+
//| Build signal: returns +1 buy, -1 sell, 0 none                    |
//+------------------------------------------------------------------+
int GetSignal()
{
   double fast1, slow1, trend1, rsi1;
   double fast2, slow2;
   // use closed bar (shift 1) to avoid repaint
   if(!Val(hFastEMA, 1, fast1) || !Val(hSlowEMA, 1, slow1) ||
      !Val(hTrendEMA, 1, trend1) || !Val(hRSI, 1, rsi1) ||
      !Val(hFastEMA, 2, fast2) || !Val(hSlowEMA, 2, slow2))
      return(0);

   double close1 = iClose(_Symbol, InpTimeframe, 1);

   bool upTrend   = (fast1 > slow1) && (close1 > trend1);
   bool downTrend = (fast1 < slow1) && (close1 < trend1);

   // momentum confirmation: fast EMA turning in trend direction
   bool fastRising  = (fast1 > fast2);
   bool fastFalling = (fast1 < fast2);

   // BUY: uptrend + RSI pulled back (oversold-ish) + momentum recovering
   if(upTrend && rsi1 <= InpRSIBuyLevel && fastRising)
      return(+1);

   // SELL: downtrend + RSI pulled up + momentum rolling over
   if(downTrend && rsi1 >= InpRSISellLevel && fastFalling)
      return(-1);

   return(0);
}

//+------------------------------------------------------------------+
//| Open a trade                                                     |
//+------------------------------------------------------------------+
void OpenTrade(int dir, double atr)
{
   sym.RefreshRates();
   double point  = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   int    digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   long   stopLevel = SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double minStop = MathMax(InpMinStopPoints, (double)stopLevel) * point;

   double slDistance = MathMax(atr * InpSL_ATR, minStop);
   double tpDistance = MathMax(atr * InpTP_ATR, minStop);

   double price, sl, tp;
   if(dir > 0)
   {
      price = sym.Ask();
      sl    = NormalizeDouble(price - slDistance, digits);
      tp    = NormalizeDouble(price + tpDistance, digits);
   }
   else
   {
      price = sym.Bid();
      sl    = NormalizeDouble(price + slDistance, digits);
      tp    = NormalizeDouble(price - tpDistance, digits);
   }

   double lot = CalcLot(sl, price);
   if(lot <= 0) return;

   bool ok;
   if(dir > 0)
      ok = trade.Buy(lot, _Symbol, price, sl, tp, InpComment);
   else
      ok = trade.Sell(lot, _Symbol, price, sl, tp, InpComment);

   if(!ok)
      PrintFormat("Order failed (%s): retcode=%d %s", (dir>0?"BUY":"SELL"),
                  trade.ResultRetcode(), trade.ResultRetcodeDescription());
}

//+------------------------------------------------------------------+
//| Manage open positions: break-even + trailing                     |
//+------------------------------------------------------------------+
void ManagePositions(double atr)
{
   if(!InpUseTrailing && !InpUseBreakEven) return;

   double point  = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   int    digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);

   for(int i = PositionsTotal()-1; i >= 0; i--)
   {
      if(!position.SelectByIndex(i)) continue;
      if(position.Symbol()!=_Symbol || position.Magic()!=InpMagic) continue;

      long   type   = position.PositionType();
      double open   = position.PriceOpen();
      double curSL  = position.StopLoss();
      double curTP  = position.TakeProfit();
      double newSL  = curSL;

      double priceNow = (type==POSITION_TYPE_BUY) ? sym.Bid() : sym.Ask();
      double profitDist = (type==POSITION_TYPE_BUY) ? (priceNow-open) : (open-priceNow);

      // Break-even
      if(InpUseBreakEven && profitDist >= atr*InpBE_TriggerATR)
      {
         double be = (type==POSITION_TYPE_BUY)
                     ? open + InpBE_LockPoints*point
                     : open - InpBE_LockPoints*point;
         if(type==POSITION_TYPE_BUY  && (curSL < be)) newSL = be;
         if(type==POSITION_TYPE_SELL && (curSL > be || curSL==0)) newSL = be;
      }

      // Trailing
      if(InpUseTrailing && profitDist >= atr*InpTrailStartATR)
      {
         double gap = atr*InpTrailGapATR;
         double trail = (type==POSITION_TYPE_BUY) ? priceNow-gap : priceNow+gap;
         if(type==POSITION_TYPE_BUY  && trail > newSL) newSL = trail;
         if(type==POSITION_TYPE_SELL && (trail < newSL || newSL==0)) newSL = trail;
      }

      newSL = NormalizeDouble(newSL, digits);
      if(newSL != curSL && newSL > 0)
      {
         // only modify if it actually improves protection
         if((type==POSITION_TYPE_BUY  && newSL > curSL) ||
            (type==POSITION_TYPE_SELL && (newSL < curSL || curSL==0)))
            trade.PositionModify(position.Ticket(), newSL, curTP);
      }
   }
}

//+------------------------------------------------------------------+
//| Tick                                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   double atr;
   if(!Val(hATR, 1, atr) || atr <= 0) return;

   sym.RefreshRates();

   // manage existing trades every tick
   ManagePositions(atr);

   // new-bar gate
   datetime barTime = (datetime)SeriesInfoInteger(_Symbol, InpTimeframe, SERIES_LASTBAR_DATE);
   bool newBar = (barTime != g_lastBarTime);

   if(InpOnePerBar && !newBar)
      return;
   g_lastBarTime = barTime;

   // filters
   if(!TimeOK())   return;
   if(!SpreadOK()) return;
   if(CountPositions() >= InpMaxPositions) return;

   int sig = GetSignal();
   if(sig != 0)
      OpenTrade(sig, atr);
}
//+------------------------------------------------------------------+
