
import React from 'react';
import { TradeXCloudLogo } from './icons';

interface MarketingBrochureProps {
  price?: number;
  hiddenOnScreen?: boolean;
}

const MarketingBrochure: React.FC<MarketingBrochureProps> = ({ price = 1999, hiddenOnScreen = false }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="marketing-brochure" className={`bg-secondary min-h-screen p-0 sm:p-8 flex flex-col items-center gap-8 print:bg-white print:p-0 ${hiddenOnScreen ? 'hidden print:flex' : 'flex'}`}>
      {/* Print Controls - Hidden in Print */}
      <div className="w-full max-w-[210mm] flex justify-between items-center bg-primary p-4 rounded-xl shadow-lg border border-accent/20 print:hidden sticky top-0 z-50 backdrop-blur-md bg-primary/80">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Official Product Brochure</h2>
          <p className="text-sm text-text-secondary"><span className="text-brand">Trade</span> <span className="text-orange-500">X</span> <span className="text-brand">Cloud</span> - Global Trade Operating System</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-brand text-primary px-6 py-2 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save as PDF
        </button>
      </div>

      {/* --- PAGE 1: COVER --- */}
      <div className="h-[297mm] w-[210mm] relative overflow-hidden flex flex-col items-center justify-center p-12 bg-slate-900 border-b-[16px] border-emerald-500 shadow-2xl print:shadow-none print:border-b-0">
        <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000" alt="Logistics" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-bl-full -mr-24 -mt-24 blur-3xl"></div>
        
        <div className="z-10 text-center space-y-10">
          <div className="inline-block p-8 bg-white/10 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/20">
            <TradeXCloudLogo className="w-56 h-56 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-white tracking-tighter">
              <span className="text-emerald-400">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-400">Cloud</span>
            </h1>
            <p className="text-emerald-400 text-2xl font-black uppercase tracking-[0.4em]">The Future of Global Trade</p>
          </div>
          
          <div className="max-w-md mx-auto h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
          
          <h2 className="text-3xl font-light text-emerald-100/80 italic max-w-lg mx-auto leading-relaxed">
            "Empowering Exporters with Artificial Intelligence & Real-Time Global Intelligence"
          </h2>
          
          <div className="grid grid-cols-3 gap-8 pt-16">
            <div className="text-center">
              <div className="text-emerald-400 font-black text-4xl">AI</div>
              <div className="text-[10px] font-black text-emerald-200/50 uppercase tracking-widest mt-1">Engine</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-emerald-400 font-black text-4xl">BIG</div>
              <div className="text-[10px] font-black text-emerald-200/50 uppercase tracking-widest mt-1">Data</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-400 font-black text-4xl">GLOBAL</div>
              <div className="text-[10px] font-black text-emerald-200/50 uppercase tracking-widest mt-1">Reach</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 text-emerald-500/60 font-black text-sm tracking-[0.5em]">
          WWW.TRADEXCLOUD.COM
        </div>
      </div>

      {/* --- PAGE 2: WHAT IS TRADE X CLOUD? --- */}
      <div className="h-[297mm] w-[210mm] p-20 bg-white relative flex flex-col shadow-2xl print:shadow-none">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
             <TradeXCloudLogo className="w-12 h-12" />
             <span className="font-black text-2xl text-slate-900 tracking-tighter">
               <span className="text-emerald-600">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-600">Cloud</span>
             </span>
          </div>
          <div className="text-slate-300 text-xs font-black tracking-widest">01 / INTRODUCTION</div>
        </div>

        <div className="flex gap-12 items-start">
            <div className="flex-1 space-y-8">
                <h3 className="text-5xl font-black text-slate-900 leading-[1.1]">What is <span className="text-emerald-600">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-600">Cloud</span>?</h3>
                <div className="w-20 h-2 bg-emerald-500"></div>
                <p className="text-slate-600 text-xl leading-relaxed font-medium">
                    Trade X Cloud is a comprehensive **Global Trade Operating System** designed for modern exporters. It bridges the gap between local manufacturing and international markets using advanced AI algorithms.
                </p>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">✓</div>
                        <div>
                            <h5 className="font-bold text-slate-800">Market Intelligence Engine</h5>
                            <p className="text-slate-500 text-sm">Real-time data on HS codes, compliance, and trade trends.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">✓</div>
                        <div>
                            <h5 className="font-bold text-slate-800">Verified Lead Generation</h5>
                            <p className="text-slate-500 text-sm">Access to millions of verified buyers and suppliers globally.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">✓</div>
                        <div>
                            <h5 className="font-bold text-slate-800">Logistics & Profit Control</h5>
                            <p className="text-slate-500 text-sm">End-to-end cost calculation and shipment management.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-72 h-[500px] rounded-[40px] overflow-hidden shadow-2xl rotate-3">
                <img src="https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=800" alt="Analysis" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
        </div>

        <div className="mt-auto pt-12 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[10px] font-bold tracking-widest">
            <span>DIAGNOSTIC INFOTECH PRODUCT</span>
            <span>CONFIDENTIAL & PROPRIETARY</span>
        </div>
      </div>

      {/* --- PAGE 3: THE EXPORT WORKFLOW --- */}
      <div className="h-[297mm] w-[210mm] p-20 bg-slate-50 relative flex flex-col shadow-2xl print:shadow-none">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
             <TradeXCloudLogo className="w-12 h-12" />
             <span className="font-black text-2xl text-slate-900 tracking-tighter">
               <span className="text-emerald-600">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-600">Cloud</span>
             </span>
          </div>
          <div className="text-slate-300 text-xs font-black tracking-widest">02 / WORKFLOW</div>
        </div>

        <h3 className="text-5xl font-black text-slate-900 mb-12 text-center">How Export is Done</h3>
        
        <div className="grid grid-cols-1 gap-8 relative">
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-emerald-200"></div>
            
            {[
                { step: "01", title: "Market Discovery", desc: "Use AI Market Intel to find high-demand products and profitable target countries based on real-time trade data." },
                { step: "02", title: "Buyer Acquisition", desc: "Extract high-intent leads via Google Map Extractor and Buyer Finder. Verify their legitimacy instantly." },
                { step: "03", title: "Cost & Profit Analysis", desc: "Calculate FOB, CIF, and DDP prices using our Precision Profit Calculator. Ensure every shipment is profitable." },
                { step: "04", title: "Compliance & Logistics", desc: "Get HS Code assistance and compliance checklists. Book consignments and track them through our integrated portal." },
                { step: "05", title: "Scale & Automate", desc: "Manage outreach campaigns and track your export goals. Scale from one shipment to a multi-crore enterprise." }
            ].map((item, i) => (
                <div key={i} className="flex gap-12 items-center relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-500/30">
                        {item.step}
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                        <h4 className="text-xl font-black text-slate-800 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-8 pt-12">
            <img src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=800" alt="Port" className="h-32 w-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
            <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" alt="Cargo" className="h-32 w-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
        </div>
      </div>

      {/* --- PAGE 4: BENEFITS & VALUE --- */}
      <div className="h-[297mm] w-[210mm] p-20 bg-white relative flex flex-col shadow-2xl print:shadow-none">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
             <TradeXCloudLogo className="w-12 h-12" />
             <span className="font-black text-2xl text-slate-900 tracking-tighter">
               <span className="text-emerald-600">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-600">Cloud</span>
             </span>
          </div>
          <div className="text-slate-300 text-xs font-black tracking-widest">03 / BENEFITS</div>
        </div>

        <h3 className="text-5xl font-black text-slate-900 mb-6">Why Invest in <span className="text-emerald-600">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-600">Cloud</span>?</h3>
        <p className="text-slate-500 text-xl mb-16 max-w-2xl">The difference between a struggling trader and a successful exporter is access to the right data at the right time.</p>

        <div className="grid grid-cols-2 gap-12">
            {[
                { title: "Risk Mitigation", desc: "Identify high-risk buyers and countries before you ship. Protect your capital with AI-driven risk analysis.", icon: "🛡️" },
                { title: "Time Efficiency", desc: "What takes a team weeks to research, Trade X Cloud does in seconds. Focus on closing deals, not data entry.", icon: "⚡" },
                { title: "Cost Optimization", desc: "Save lakhs in hidden logistics costs by knowing the exact market rates and port charges in advance.", icon: "💰" },
                { title: "Global Network", desc: "Instantly connect with verified OEMs and Suppliers to fulfill large international orders with confidence.", icon: "🌐" }
            ].map((benefit, i) => (
                <div key={i} className="space-y-4 p-8 bg-emerald-50 rounded-[40px] border border-emerald-100">
                    <div className="text-4xl">{benefit.icon}</div>
                    <h4 className="text-2xl font-black text-slate-800">{benefit.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
            ))}
        </div>

        <div className="mt-20 flex-1 flex items-center justify-center">
            <div className="relative w-full h-64 rounded-[50px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=1200" alt="Success" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <div className="text-5xl font-black mb-2">98%</div>
                        <div className="text-sm font-bold uppercase tracking-widest">Customer Success Rate</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- PAGE 5: PRICING & CALL TO ACTION --- */}
      <div className="h-[297mm] w-[210mm] p-20 bg-slate-900 text-white relative flex flex-col shadow-2xl print:shadow-none">
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-4">
             <TradeXCloudLogo className="w-12 h-12" />
             <span className="font-black text-2xl text-white tracking-tighter">
               <span className="text-emerald-400">Trade</span> <span className="text-orange-500">X</span> <span className="text-emerald-400">Cloud</span>
             </span>
          </div>
          <div className="text-emerald-500/40 text-xs font-black tracking-widest">04 / PRICING</div>
        </div>

        <div className="text-center space-y-6 mb-20">
            <h3 className="text-6xl font-black tracking-tighter">Ready to Scale Your Success?</h3>
            <p className="text-emerald-100/60 text-xl max-w-xl mx-auto">Join the elite club of international exporters using AI to dominate global markets.</p>
        </div>

        <div className="bg-white rounded-[60px] p-12 text-slate-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-bl-full flex items-center justify-center pt-4 pl-4">
                <span className="text-white font-black text-xs rotate-45">BEST VALUE</span>
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                    <h4 className="text-3xl font-black tracking-tight">Annual Professional Plan</h4>
                    <ul className="space-y-4">
                        {["Unlimited Market Intelligence", "Verified Buyer/Supplier Access", "Precision Profit Calculator", "Google Map Data Extractor", "24/7 AI Trade Assistant"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 font-bold text-slate-600">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-center p-10 bg-slate-50 rounded-[40px] border border-slate-100 min-w-[250px]">
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Investment</div>
                    <div className="text-6xl font-black text-emerald-500 tracking-tighter">₹{price.toLocaleString('en-IN')}</div>
                    <div className="text-slate-400 text-xs font-bold mt-2 uppercase">Per Year + GST</div>
                </div>
            </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-12">
            <div className="space-y-4">
                <h5 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Contact Us</h5>
                <p className="text-2xl font-bold">sales@tradexcloud.com</p>
                <p className="text-slate-400">+91 98765 43210</p>
            </div>
            <div className="space-y-4 text-right">
                <h5 className="text-emerald-400 font-black uppercase tracking-widest text-sm">Headquarters</h5>
                <p className="text-slate-200">Diagnostic Infotech Tower,<br />Tech Park, Mumbai, India</p>
            </div>
        </div>

        <div className="mt-auto pt-12 border-t border-white/10 flex justify-between items-center">
            <div className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase">Diagnostic Infotech Product</div>
            <div className="text-[10px] text-white/20">© 2025 TRADE X CLOUD. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </div>
  );
};

export default MarketingBrochure;
