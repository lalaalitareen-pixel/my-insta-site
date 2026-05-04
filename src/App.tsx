import { useState, useEffect, useMemo } from 'react';
import { 
  Download, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ExternalLink,
  Instagram,
  Settings,
  EyeOff,
  Layers,
  SmartphoneNfc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const APK_DATA = [
  {
    id: 'myinsta-unclone',
    name: 'MyInsta UnClone (com.instagram)',
    type: 'UnClone',
    description: 'Requires uninstalling the official Instagram app. Best stability and system integration.',
    icon: <Instagram className="w-8 h-8 text-white" />,
    version: 'v26.0',
    size: '64 MB',
    rating: 4.9,
    downloads: '10M+',
    bgColor: 'bg-linear-to-br from-brand-primary to-brand-secondary',
    features: ['Official Package Name', 'Best Performance', 'All Features Enabled']
  },
  {
    id: 'myinsta-clone',
    name: 'MyInsta Clone (com.myinsta)',
    type: 'Clone',
    description: 'Install alongside the official Instagram app. Perfect for second accounts.',
    icon: <Layers className="w-8 h-8 text-white" />,
    version: 'v26.0',
    size: '64 MB',
    rating: 4.8,
    downloads: '8M+',
    bgColor: 'bg-linear-to-br from-indigo-600 to-purple-500',
    features: ['Parallel Install', 'Separate Data', 'Dual Account Support']
  }
];

const FEATURES = [
  { title: "Save Reels & Photos", desc: "Download high-quality media with a single tap directly to your gallery.", icon: <Download size={24} /> },
  { title: "Ghost Mode", desc: "Watch stories, read DMs, and join live streams without anyone knowing.", icon: <EyeOff size={24} /> },
  { title: "Monet Theme", desc: "Experience the beautiful Material You interface that adapts to your wallpaper.", icon: <Smartphone size={24} /> },
  { title: "Developer Options", desc: "Full access to Instagram's internal experimental features and settings.", icon: <Settings size={24} /> },
  { title: "No Ads", desc: "Remove all sponsored posts, story ads, and suggestions from your feed.", icon: <Zap size={24} /> },
  { title: "Privacy Plus", desc: "Disable typing indicator, screenshot alerts, and seen receipts globally.", icon: <ShieldCheck size={24} /> }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAPKs = useMemo(() => {
    return APK_DATA.filter(apk => 
      apk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      apk.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-vibrant group-hover:scale-110 transition-transform">
              <Instagram className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-800">
              MyInsta<span className="gradient-text">.APK</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {['Home', 'Features', 'Packages', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-primary transition-colors font-display tracking-wide uppercase text-xs">{item}</a>
            ))}
            <button className="btn-primary flex items-center gap-2 py-2.5">
              <Download size={18} />
              Download Latest
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b shadow-xl md:hidden p-6"
          >
            <div className="flex flex-col gap-4 text-lg font-medium text-slate-700 font-display">
              {['Home', 'Features', 'Packages', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}>{item}</a>
              ))}
              <button className="btn-primary w-full mt-2">Download Now</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 opacity-30">
            <div className="w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4"></div>
          </div>
          <div className="absolute bottom-0 left-0 -z-10 opacity-20">
            <div className="w-[400px] h-[400px] bg-brand-secondary/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/4"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-bold uppercase tracking-widest mb-8 border border-brand-primary/20">
                <CheckCircle2 size={14} /> Official v26.0 Released
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-extrabold text-slate-900 leading-[1.05] mb-8 tracking-tighter">
                Unleash The <br />
                Power of <span className="gradient-text">Insta</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-10 font-medium">
                Experience Instagram without limits. Download media, enjoy advanced privacy, and customize everything. The #1 trusted MOD APK for 2026.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <a href="#packages" className="btn-primary text-lg flex items-center justify-center gap-3 px-10 shadow-xl shadow-brand-primary/30">
                  <Download size={22} /> Get MyInsta APK
                </a>
                <a href="#features" className="px-10 py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                  Explore Features <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="flex items-center gap-6 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-soft max-w-md">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 ring-4 ring-green-50">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Verified & Secure</p>
                  <p className="text-slate-500 font-medium">Scanned by Virustotal & Play Protect</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center py-10"
            >
              <div className="relative w-72 md:w-85 h-[620px] bg-slate-900 rounded-[3.5rem] p-4 shadow-2xl border-[12px] border-slate-800 ring-4 ring-brand-primary/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-800 rounded-b-2xl"></div>
                <div className="w-full h-full bg-slate-50 rounded-[2.8rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_top,_#fff_0%,_transparent_100%)]">
                  <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-2xl mb-8 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/20 rounded-3xl scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Instagram className="text-white w-14 h-14 relative z-10" />
                  </div>
                  <h3 className="text-3xl font-display font-black text-slate-900 mb-2">MyInsta</h3>
                  <p className="text-slate-400 font-bold text-sm mb-10 tracking-widest uppercase">The Next Level</p>
                  <div className="w-full space-y-4">
                    {[
                      { icon: <Download />, label: "Media Downloader" },
                      { icon: <EyeOff />, label: "Infinite Ghost Mode" },
                      { icon: <SmartphoneNfc />, label: "Monet Engine 2.0" }
                    ].map((item, i) => (
                      <div key={i} className="h-12 w-full rounded-2xl bg-white shadow-soft flex items-center px-5 gap-4 border border-slate-100">
                        <div className="text-brand-primary">{item.icon}</div>
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Decoration */}
              <div className="absolute -right-10 bottom-20 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 top-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-slate-50/70 border-y border-slate-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Exclusive Benefits</span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 mb-8 tracking-tight">Why Choose MyInsta?</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed italic">"The most comprehensive Instagram modification ever built, designed for those who want more from their social life."</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {FEATURES.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] card-hover relative group cursor-default"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:gradient-bg group-hover:text-white transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-lg">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages / Downloads */}
        <section id="packages" className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 tracking-tighter">Available Packages</h2>
                <p className="text-slate-500 text-xl font-medium">Select the binary that aligns with your mobile architecture and preference.</p>
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                <input 
                  type="text" 
                  placeholder="Find versions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all text-lg font-medium"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {filteredAPKs.map((apk) => (
                <div key={apk.id} className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-100 shadow-xl overflow-hidden relative group hover:border-brand-primary/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-8 mb-12 relative">
                    <div className="flex items-center gap-8">
                      <div className={`w-24 h-24 rounded-[2rem] ${apk.bgColor} flex items-center justify-center shadow-2xl transform group-hover:rotate-6 transition-transform duration-500`}>
                        {apk.icon}
                      </div>
                      <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-widest mb-3 border border-slate-200">{apk.type} Official</span>
                        <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight">{apk.name}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-amber-500 gap-1.5 font-black text-xl mb-1">
                        <Star size={22} fill="currentColor" /> {apk.rating}
                      </div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-wider">{apk.size} • {apk.downloads} ACTIVE</p>
                    </div>
                  </div>

                  <p className="text-slate-500 mb-10 leading-relaxed text-xl font-medium">
                    {apk.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {apk.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4 text-base font-bold text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-50">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary w-full py-6 text-2xl flex items-center justify-center gap-4 rounded-[2rem]">
                    <Download size={32} /> GET LATEST APK
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="py-32 bg-slate-950 text-white relative border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="relative">
                <h2 className="text-5xl md:text-7xl font-display font-black mb-12 tracking-tighter">Installation <br /><span className="gradient-text">Blueprint</span></h2>
                <div className="space-y-10">
                  {[
                    { step: "01", title: "Select Package", desc: "Choose between Clone (Parallel) or UnClone (Full Integration) based on your device setup." },
                    { step: "02", title: "Authorize Sources", desc: "Enable 'Install Unknown Apps' for your file manager in Android Settings > Apps > Special Access." },
                    { step: "03", title: "Execute Binary", desc: "Locate the APK in your downloads and tap to initiate the local installation procedure." },
                    { step: "04", title: "Final Setup", desc: "Open MyInsta, authenticate your profile, and navigate to Dev Settings for full customization." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black font-display group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:scale-110">
                        {s.step}
                      </div>
                      <div>
                        <h4 className="text-2xl font-display font-bold mb-3 tracking-tight">{s.title}</h4>
                        <p className="text-white/40 leading-relaxed text-lg font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative p-1">
                <div className="relative bg-white/5 border border-white/10 p-12 md:p-16 rounded-[4rem] backdrop-blur-3xl">
                  <div className="flex items-center gap-5 mb-12">
                    <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                      <Info className="text-white" size={32} />
                    </div>
                    <h3 className="text-3xl font-display font-black tracking-tight">System Intel</h3>
                  </div>
                  <div className="space-y-8 text-white/70">
                    {[
                      { icon: <Layers className="text-brand-primary" />, text: "Clone users can maintain the official Instagram app simultaneously without conflicts." },
                      { icon: <Instagram className="text-brand-secondary" />, text: "UnClone users MUST purge the official Meta application before attempting install." },
                      { icon: <ShieldCheck className="text-brand-accent" />, text: "Instasmash/ARMv7 architecture requires specifically the Clone builds for stability." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-start">
                        <div className="shrink-0 mt-1">{item.icon}</div>
                        <p className="text-lg font-medium leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 bg-slate-50/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 mb-8 tracking-tight text-center">Common Queries</h2>
              <p className="text-slate-500 text-xl font-medium">Technical intelligence for the MyInsta ecosystem.</p>
            </div>

            <div className="space-y-6">
              {[
                { q: "What is MyInsta?", a: "MyInsta is an advanced Android application binary (APK) that modifies the base Instagram framework to enable premium features like ad-blocking, media extraction, and ghost mode." },
                { q: "Is MyInsta safe?", a: "Yes, all builds are checked via heuristic analysis and MD5 checksum verification. We prioritize device integrity above all else." },
                { q: "Does it work on iOS/iPhone?", a: "Negative. MyInsta is strictly compiled for Android's Dalvik/ART runtime. Apple's iOS platform is not supported." },
                { q: "How to update correctly?", a: "Visit MyInsta.APK to retrieve the latest version. Install the new APK over the existing one to retain your data and configuration." }
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-[2rem] p-10 cursor-pointer outline-none border border-slate-100 shadow-soft hover:shadow-xl transition-all">
                  <summary className="flex items-center justify-between list-none font-display font-black text-2xl text-slate-900 tracking-tight">
                    {faq.q}
                    <span className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-300 group-open:rotate-180 group-open:gradient-bg group-open:text-white group-open:border-transparent">
                      <ChevronRight size={20} />
                    </span>
                  </summary>
                  <div className="mt-8 text-slate-500 leading-relaxed text-xl font-medium border-t border-slate-50 pt-8">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 pb-48">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-6xl md:text-8xl font-display font-black text-slate-900 mb-10 tracking-tighter">Ready to Ascend?</h2>
              <p className="text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                Experience the social media revolution. Secure, private, and powerful. Download the latest version of <span className="gradient-text font-black">MyInsta</span> today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a href="#packages" className="btn-primary px-12 py-5 rounded-[2rem] text-2xl flex items-center gap-4 transition-transform hover:scale-110 active:scale-95 shadow-2xl">
                  <Download size={28} /> GET MYINSTA NOW
                </a>
              </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-20 mb-24">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-vibrant">
                  <Instagram className="text-white w-8 h-8" />
                </div>
                <span className="text-3xl font-display font-black text-slate-900 tracking-tighter">MyInsta<span className="gradient-text">.APK</span></span>
              </div>
              <p className="text-slate-500 max-w-md mb-12 text-xl font-medium leading-relaxed">
                The authoritative hub for modified Android applications. We deliver security-first binaries with unmatched feature sets.
              </p>
            </div>

            <div>
              <h5 className="font-display font-black text-slate-900 mb-10 text-xl tracking-tight uppercase tracking-widest text-xs opacity-40">Core Versions</h5>
              <ul className="space-y-6 text-slate-500 font-bold text-lg">
                <li><a href="#packages" className="hover:text-brand-primary transition-colors">MyInsta UnClone</a></li>
                <li><a href="#packages" className="hover:text-brand-primary transition-colors">MyInsta Clone</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display font-black text-slate-900 mb-10 text-xl tracking-tight uppercase tracking-widest text-xs opacity-40">Resources</h5>
              <ul className="space-y-6 text-slate-500 font-bold text-lg">
                <li><a href="#faq" className="hover:text-brand-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display font-black text-slate-900 mb-10 text-xl tracking-tight uppercase tracking-widest text-xs opacity-40">Network</h5>
              <ul className="space-y-6 text-slate-500 font-bold text-lg">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">GitHub Org</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-slate-400 font-bold text-lg">© 2026 MyInsta Official Deployment. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
