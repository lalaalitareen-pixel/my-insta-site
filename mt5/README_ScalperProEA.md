# ScalperProEA — MetaTrader 5 Multi-Asset Scalper

A fast scalping Expert Advisor (EA) for **MetaTrader 5 / MQL5** that works on
**Forex, metals (XAUUSD, XAGUSD), commodities (oil, gas), indices, and stocks/CFDs**.

> ⚠️ **No EA is guaranteed profitable.** This is a tool, not a money printer.
> Markets change. Always backtest in the Strategy Tester and run it on a
> **demo account** for weeks before considering real funds. Trade at your own risk.

## Strategy in one paragraph

Trend + pullback scalping. It only trades **with** the trend (Fast EMA vs Slow EMA,
confirmed by a higher Trend EMA), then enters on a short **RSI pullback** when
momentum turns back in the trend direction. Stops, targets and the trailing stop
are all **ATR-based**, so the EA auto-adapts to each instrument's volatility — that's
what lets the same settings behave sensibly on EURUSD, Gold, and an index alike.
Position size is calculated from a **fixed % risk** per trade.

## Install

1. Open MetaTrader 5 → **File → Open Data Folder**.
2. Go to `MQL5/Experts/`.
3. Copy `ScalperProEA.mq5` there.
4. Open **MetaEditor** (F4), open the file, press **Compile** (F7). You should get
   `0 errors, 0 warnings`.
5. Back in MT5, refresh the **Navigator → Expert Advisors** list.
6. Drag **ScalperProEA** onto a chart. In *Common* tab, enable **Algo Trading**
   (and allow it globally with the **Algo Trading** toolbar button).

## Recommended starting points

- **Timeframe:** M1 or M5 (scalping). Set `InpTimeframe` to match the chart.
- **Gold (XAUUSD):** `InpMaxSpreadPoints` ~ 30–50, keep ATR stops.
- **Forex majors:** `InpMaxSpreadPoints` ~ 15–25.
- **Indices/stocks (CFDs):** widen `InpMaxSpreadPoints`; check the symbol's
  `Volume min/step` so lot sizing is valid.
- **Risk:** start at `InpRiskPercent = 0.5` (half a percent). Lower is safer.

## Key inputs

| Group | Input | Meaning |
|-------|-------|---------|
| Money | `InpUseRiskPercent` / `InpRiskPercent` | Auto lot from % of balance vs SL distance |
| Money | `InpFixedLot` | Used when risk % is off |
| Stops | `InpSL_ATR`, `InpTP_ATR` | SL/TP = ATR × multiplier |
| Entry | `InpFastEMA / InpSlowEMA / InpTrendEMA` | Trend structure |
| Entry | `InpRSIPeriod`, `InpRSIBuyLevel`, `InpRSISellLevel` | Pullback trigger |
| Trail | `InpUseTrailing`, `InpUseBreakEven` | Lock in profit |
| Filter | `InpMaxSpreadPoints` | Skip trades when spread too wide (vital for scalping) |
| Filter | `InpMaxPositions`, `InpOnePerBar` | Frequency control |
| Filter | `InpUseTimeFilter`, `InpStartHour`, `InpEndHour` | Trade only active hours (server time) |
| General | `InpMagic` | Unique ID so the EA only manages its own trades |

## How to backtest (do this first)

1. MT5 → **View → Strategy Tester** (Ctrl+R).
2. Expert: `ScalperProEA`. Symbol: e.g. `XAUUSD`. Period: `M5`.
3. Modelling: **Every tick based on real ticks** (most realistic for scalping).
4. Set a realistic **date range** (at least 6–12 months) and **spread = Current**
   or a fixed realistic value.
5. Run, then read the report: focus on **Profit Factor**, **max drawdown**,
   **recovery factor**, and the equity curve shape — not just net profit.
6. Optimize a couple of parameters at a time (e.g. `InpSL_ATR`, `InpTP_ATR`,
   `InpRSIBuyLevel`) — avoid over-fitting.

## Important notes

- Entry signals use the **closed bar** (shift 1) to avoid repainting.
- For **stocks/CFDs**, confirm the symbol is tradable in your account hours and
  that tick value/size are reported correctly (the lot math depends on them).
- Scalping is **spread- and latency-sensitive**. A low-spread account and a VPS
  near your broker materially affect results.
- This EA does not martingale or grid — by design. Risk stays bounded per trade.
