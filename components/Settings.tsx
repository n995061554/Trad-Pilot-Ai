
import React, { useState, useEffect, useRef } from 'react';
import { translations, currencies, Currency } from '../translations';
import { LanguageIcon, CurrencyIcon, DragHandleIcon, BackArrowIcon, DownloadIcon, HistoryIcon, WalletIcon, ShieldCheckIcon, CertificateIcon, AiIcon, PremiumEliteBadge, IconUnlimited, IconTurboAi, IconBulkExport, IconValidity, BrainIcon } from './icons';
import { themes } from '../themes';
import { Page, CompanyDetails, IconSet, Font } from '../types';
import { iconSets } from './icons';

const initialDetails: CompanyDetails = {
    companyName: '',
    address: '',
    email: '',
    phone: '',
    gstin: '',
    iecCode: '',
    logo: '',
    upiId: '',
    bankDetails: '',
};

const availableFonts: { name: Font, family: string }[] = [
    { name: 'Inter', family: "'Inter', sans-serif" },
    { name: 'Roboto', family: "'Roboto', sans-serif" },
    { name: 'Lato', family: "'Lato', sans-serif" },
    { name: 'Poppins', family: "'Poppins', sans-serif" },
];

interface SettingsProps {
    language: string;
    onLanguageChange: (lang: string) => void;
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    theme: string;
    onThemeChange: (themeName: string) => void;
    font: Font;
    onFontChange: (fontName: Font) => void;
    iconSet: IconSet;
    onIconSetChange: (style: IconSet) => void;
    applyTheme: (themeName: string) => void;
    navOrder: Page[];
    onNavOrderChange: (newOrder: Page[]) => void;
    profile: CompanyDetails | null;
    onProfileUpdate: (newProfile: CompanyDetails) => void;
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
    subscriptionPrice: number;
    onRechargeClick: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    language, onLanguageChange, 
    currency, onCurrencyChange, 
    theme, onThemeChange, 
    font, onFontChange, 
    iconSet, onIconSetChange, 
    applyTheme, 
    navOrder, onNavOrderChange, 
    profile, onProfileUpdate, 
    t, setActivePage,
    subscriptionPrice,
    onRechargeClick
}) => {
    const [localLanguage, setLocalLanguage] = useState(language);
    const [localCurrency, setLocalCurrency] = useState(currency);
    const [localTheme, setLocalTheme] = useState(theme);
    const [localFont, setLocalFont] = useState(font);
    const [localIconSet, setLocalIconSet] = useState(iconSet);
    const [localProfile, setLocalProfile] = useState<CompanyDetails>(profile || initialDetails);
    const [localNavOrder, setLocalNavOrder] = useState<Page[]>(navOrder);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'dirty' | 'saved'>('idle');
    const [isPrinting, setIsPrinting] = useState(false);
    const [localCustomApiKey, setLocalCustomApiKey] = useState(() => {
        return typeof window !== 'undefined' ? (localStorage.getItem('custom_gemini_api_key') || '') : '';
    });
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const [draggedOver, setDraggedOver] = useState<number | null>(null);

    useEffect(() => { setLocalProfile(profile || initialDetails); }, [profile]);
    useEffect(() => { applyTheme(localTheme); return () => { applyTheme(theme); }; }, [localTheme, applyTheme, theme]);
    useEffect(() => {
      document.documentElement.style.setProperty('--font-family', `"${localFont}", sans-serif`);
      return () => { document.documentElement.style.setProperty('--font-family', `"${font}", sans-serif`); };
    }, [localFont, font]);
    useEffect(() => { if (saveStatus === 'saved') { const timer = setTimeout(() => setSaveStatus('idle'), 2000); return () => clearTimeout(timer); } }, [saveStatus]);

    const handleSave = () => {
        onLanguageChange(localLanguage);
        onCurrencyChange(localCurrency);
        onThemeChange(localTheme);
        onFontChange(localFont);
        onIconSetChange(localIconSet);
        onNavOrderChange(localNavOrder);
        onProfileUpdate(localProfile);
        if (typeof window !== 'undefined') {
            localStorage.setItem('custom_gemini_api_key', localCustomApiKey.trim());
        }
        setSaveStatus('saved');
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalProfile(prev => ({ ...prev, [name]: value }));
        setSaveStatus('dirty');
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalProfile(prev => ({ ...prev, logo: reader.result as string }));
                setSaveStatus('dirty');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => { setLocalProfile(prev => ({ ...prev, logo: '' })); setSaveStatus('dirty'); };
    const handleDownloadBrochure = () => {
        setIsPrinting(true);
        const originalTitle = document.title;
        document.title = "Trade_X_Cloud_Marketing_Brochure_2025";
        setTimeout(() => { window.print(); setIsPrinting(false); document.title = originalTitle; }, 300);
    };

    const allPageDetails: Record<Page, { label: string }> = {
        'dashboard': { label: t('dashboard') },
        'study-guide': { label: t('studyGuide') },
        'market-intel': { label: t('marketIntel') },
        'resource-hub': { label: t('resourceHub') },
        'buyer-finder': { label: t('buyerFinder') },
        'supplier-finder': { label: t('supplierFinder') },
        'oem-finder': { label: t('oemFinder') },
        'map-extractor': { label: t('mapExtractor') },
        'campaign-manager': { label: t('campaignManager') },
        'goal-planner': { label: t('goalPlanner') },
        'profit-calculator': { label: t('profitCalculator') },
        'shipment-experience': { label: t('shipmentExperience') },
        'risk': { label: t('riskAnalysis') },
        'settings': { label: t('settings') },
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => { dragItem.current = index; e.dataTransfer.effectAllowed = 'move'; };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => { e.preventDefault(); dragOverItem.current = index; setDraggedOver(index); };
    const handleDragLeave = () => setDraggedOver(null);
    const handleDrop = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newNavOrder = [...localNavOrder];
        const dragItemContent = newNavOrder.splice(dragItem.current, 1)[0];
        newNavOrder.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null; dragOverItem.current = null; setDraggedOver(null); setLocalNavOrder(newNavOrder); setSaveStatus('dirty');
    };
    const handleDragEnd = () => { dragItem.current = null; dragOverItem.current = null; setDraggedOver(null); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    return (
        <div>
            <header className="mb-8">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                  <BackArrowIcon />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('settings')}</h1>
                <p className="text-md text-text-secondary">Manage your application preferences and company profile.</p>
            </header>

            <div className="bg-primary p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <div className="space-y-10">
                    {/* Membership & Policy Section */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Software Membership & Usage Policy</h2>
                        <p className="text-sm text-text-secondary mb-6">Detailed conditions for software access and premium upgradation.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             {/* Free Trial Card */}
                             <div className="p-5 bg-secondary/50 rounded-2xl border border-brand/10 hover:border-brand/30 transition-colors shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-brand/10 text-brand rounded-lg">
                                        <HistoryIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-text-primary">24-Hour Free Trial</h3>
                                </div>
                                <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside">
                                    <li>Activates immediately upon first successful login.</li>
                                    <li>Unlimited AI searches across all "Finder" and "Extractor" tools.</li>
                                    <li>Full access to Market Intelligence with real-time grounding.</li>
                                    <li>Valid for exactly 24 hours from timestamp of account creation.</li>
                                </ul>
                             </div>

                             {/* Standard Usage Card */}
                             <div className="p-5 bg-secondary/50 rounded-2xl border border-accent/20 hover:border-accent/40 transition-colors shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-accent/20 text-text-primary rounded-lg">
                                        <ShieldCheckIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-text-primary">Standard Usage (Post-Trial)</h3>
                                </div>
                                <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside">
                                    <li>10 FREE searches per day for every module category.</li>
                                    <li>Daily quota resets at 12:00 AM (Local Time).</li>
                                    <li>Overage charge of <span className="text-brand font-bold">₹0.20 per search</span> apply after quota.</li>
                                    <li>Charges are deducted automatically from your app wallet.</li>
                                </ul>
                             </div>
                        </div>

                        {/* Wallet & Recharge Section - NEW */}
                        <div className="mb-8 p-6 bg-brand/5 rounded-3xl border border-brand/20 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-brand text-primary rounded-2xl shadow-lg shadow-brand/20">
                                    <WalletIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">App Wallet & Credits</h3>
                                    <p className="text-sm text-text-secondary">Manage your balance for overage searches and premium services.</p>
                                </div>
                            </div>
                            <button 
                                onClick={onRechargeClick}
                                className="w-full md:w-auto bg-brand text-primary font-black py-4 px-8 rounded-2xl shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <WalletIcon className="w-5 h-5" />
                                Recharge Wallet Now
                            </button>
                        </div>

                        {/* Premium Upgradation Conditions Card - REDESIGNED */}
                        <div className="p-8 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-600/15 rounded-[2.5rem] border-2 border-yellow-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.1)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <PremiumEliteBadge className="w-24 h-24 drop-shadow-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter italic">Premium Gold Membership</h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                        <div className="h-0.5 w-8 bg-yellow-600 rounded-full"></div>
                                        <p className="text-xs text-yellow-600 font-black uppercase tracking-[0.3em]">The Elite Exporter Standard</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 text-yellow-600 shadow-inner">
                                        <IconUnlimited className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary text-sm uppercase tracking-wide">Unlimited Searches</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed mt-1">Zero daily limits. All per-search charges (₹0.20) are permanently waived.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 text-yellow-600 shadow-inner">
                                        <IconBulkExport className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary text-sm uppercase tracking-wide">Bulk Leads Export</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed mt-1">Export up to 500 verified global leads daily in CSV format without restriction.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 text-yellow-600 shadow-inner">
                                        <IconTurboAi className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary text-sm uppercase tracking-wide">Priority AI Processing</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed mt-1">Fast-track access to high-performance reasoning for deep market analysis.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-yellow-500/30 text-yellow-600 shadow-inner">
                                        <IconValidity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary text-sm uppercase tracking-wide">12-Month Elite Access</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed mt-1">One-time upgrade fee guarantees gold-tier status for 365 days.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 flex items-center gap-4 relative z-10">
                                <div className="bg-yellow-500 text-primary p-2 rounded-full shadow-lg">
                                    <AiIcon className="w-4 h-4" />
                                </div>
                                <p className="text-[11px] text-text-secondary italic font-medium">
                                    Premium Gold members receive complimentary verification support for Export documents (FSSAI, APEDA) via our priority helpdesk.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Profile Section */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">{t('companyProfile')}</h2>
                        <p className="text-sm text-text-secondary mb-4">This information will be used to automatically populate details in documents and communications.</p>
                        <div className="bg-secondary p-6 rounded-lg">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <input name="companyName" value={localProfile.companyName} onChange={handleProfileChange} placeholder="Company Name" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                                       <input name="email" value={localProfile.email} onChange={handleProfileChange} placeholder="Contact Email" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                                       <input name="phone" value={localProfile.phone} onChange={handleProfileChange} placeholder="Contact Phone" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                                       <input name="gstin" value={localProfile.gstin} onChange={handleProfileChange} placeholder="GSTIN" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                                       <input name="iecCode" value={localProfile.iecCode} onChange={handleProfileChange} placeholder="IEC Code" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" />
                                    </div>
                                     <div>
                                        <textarea name="address" rows={3} value={localProfile.address} onChange={handleProfileChange} placeholder="Company Address" className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"></textarea>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                     <label className="block text-sm font-medium text-text-secondary text-center">Company Logo</label>
                                     <div className="mt-1 flex justify-center items-center w-full h-40 bg-accent border-2 border-highlight border-dashed rounded-md">
                                        {localProfile.logo ? (
                                            <img src={localProfile.logo} alt="Company Logo" className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <div className="text-center text-text-secondary"><svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l-6-6-6 6M28 8v12a4 4 0 01-4 4H12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p className="text-xs">PNG, JPG</p></div>
                                        )}
                                     </div>
                                     <div className="flex gap-2 mt-2">
                                         <label htmlFor="file-upload" className="flex-1 cursor-pointer bg-highlight text-text-primary text-sm font-semibold py-2 px-4 rounded-lg hover:bg-brand hover:text-primary transition text-center">
                                             <span>Upload</span>
                                             <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                                         </label>
                                        {localProfile.logo && (<button type="button" onClick={handleRemoveLogo} className="bg-red-500/50 text-red-200 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-500/80 transition">Remove</button>)}
                                     </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Document Center & Marketing Assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Document Center */}
                        <div className="bg-secondary rounded-[2.5rem] p-8 border border-accent/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                                    <CertificateIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-text-primary tracking-tight">{t('documentCenter')}</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { id: 'user-manual', label: t('userManual'), icon: <BrainIcon className="w-4 h-4" /> },
                                    { id: 'terms', label: t('termsConditions'), icon: <ShieldCheckIcon className="w-4 h-4" /> },
                                    { id: 'privacy', label: t('privacyPolicy'), icon: <ShieldCheckIcon className="w-4 h-4" /> },
                                ].map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => window.print()}
                                        className="w-full flex items-center justify-between p-4 bg-primary/50 hover:bg-brand/5 rounded-2xl border border-accent/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-text-secondary group-hover:text-brand transition-colors">
                                                {doc.icon}
                                            </div>
                                            <span className="font-bold text-text-primary">{doc.label}</span>
                                        </div>
                                        <div className="p-2 bg-brand/10 text-brand rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DownloadIcon className="w-4 h-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Marketing Assets */}
                        <div className="bg-secondary rounded-[2.5rem] p-8 border border-accent/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                                    <DownloadIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-text-primary tracking-tight">Marketing Assets</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 bg-primary/50 rounded-3xl border border-accent/10">
                                    <h4 className="font-black text-text-primary mb-2">Official Product Brochure</h4>
                                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">Download the latest high-resolution PDF brochure for offline presentation and client meetings.</p>
                                    <button 
                                        onClick={handleDownloadBrochure}
                                        disabled={isPrinting}
                                        className="w-full flex items-center justify-center gap-2 bg-brand text-primary font-black py-3.5 rounded-xl shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        {isPrinting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Preparing PDF...</span>
                                            </>
                                        ) : (
                                            <>
                                                <DownloadIcon className="w-5 h-5" />
                                                {t('downloadPdf')}
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="p-4 bg-primary/50 border border-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand transition-colors flex items-center justify-center gap-2">
                                        <DownloadIcon className="w-3 h-3" /> Brand Assets (ZIP)
                                    </button>
                                    <button className="p-4 bg-primary/50 border border-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand transition-colors flex items-center justify-center gap-2">
                                        <DownloadIcon className="w-3 h-3" /> Press Kit (PDF)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language Settings */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Language & Currency</h2>
                        <p className="text-sm text-text-secondary mb-4">Choose the language and currency for the application.</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary p-6 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Language</label>
                                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary"><LanguageIcon /></span><select value={localLanguage} onChange={e => { setLocalLanguage(e.target.value); setSaveStatus('dirty'); }} className="w-full bg-accent border-highlight rounded-md py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-brand focus:border-brand text-sm">{Object.keys(translations).map(lang => (<option key={lang} value={lang}>{translations[lang as keyof typeof translations].languageName}</option>))}</select></div>
                            </div>
                            <div>
                                 <label className="block text-sm font-medium text-text-primary mb-2">Currency</label>
                                <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary"><CurrencyIcon /></span><select value={localCurrency.code} onChange={e => { setLocalCurrency(currencies.find(c => c.code === e.target.value)!); setSaveStatus('dirty'); }} className="w-full bg-accent border-highlight rounded-md py-2 pl-10 pr-4 text-text-primary focus:outline-none focus:ring-brand focus:border-brand text-sm">{currencies.map(c => (<option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>))}</select></div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop App & API Settings */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Desktop App & API Settings</h2>
                        <p className="text-sm text-text-secondary mb-4">Configure custom settings for PC desktop execution (Electron/Tauri) and local search queries.</p>
                        <div className="bg-secondary p-6 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Custom Gemini API Key</label>
                                <input 
                                    type="password" 
                                    value={localCustomApiKey} 
                                    onChange={e => { setLocalCustomApiKey(e.target.value); setSaveStatus('dirty'); }} 
                                    placeholder="Enter your personal Gemini API Key (e.g. AIzaSy...)" 
                                    className="block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                                />
                                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                                    By providing a custom API Key, your desktop app will execute all search and extraction tools locally using your personal Gemini account. Leaving this field blank falls back to the application's default pre-configured API Key.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Theme Settings */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Appearance</h2>
                        <p className="text-sm text-text-secondary mb-4">Select a visual theme and icon style for the application.</p>
                        <div className="bg-secondary p-6 rounded-lg space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-3">Theme</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">{themes.map((themeOption) => (<div key={themeOption.name} onClick={() => { setLocalTheme(themeOption.name); setSaveStatus('dirty'); }} className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${localTheme === themeOption.name ? 'border-brand ring-2 ring-brand/50' : 'border-accent hover:border-highlight'}`}><h3 className="font-semibold text-text-primary mb-3">{themeOption.name}</h3><div className="flex space-x-2"><div title="Primary" className="w-6 h-6 rounded-full border border-accent/50" style={{ backgroundColor: themeOption.colors['primary'] }}></div><div title="Secondary" className="w-6 h-6 rounded-full border border-accent/50" style={{ backgroundColor: themeOption.colors['secondary'] }}></div><div title="Text" className="w-6 h-6 rounded-full border border-accent/50" style={{ backgroundColor: themeOption.colors['text-primary'] }}></div><div title="Brand" className="w-6 h-6 rounded-full border border-accent/50" style={{ backgroundColor: themeOption.colors['brand'] }}></div></div></div>))}</div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-3">Font Style</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">{availableFonts.map((fontOption) => (<button key={fontOption.name} type="button" onClick={() => { setLocalFont(fontOption.name); setSaveStatus('dirty'); }} className={`p-4 rounded-lg cursor-pointer border-2 transition-all text-center ${localFont === fontOption.name ? 'border-brand ring-2 ring-brand/50 bg-accent' : 'border-accent hover:border-highlight bg-primary'}`} style={{ fontFamily: fontOption.family }}><span className="text-2xl font-semibold text-text-primary">Aa</span><p className="font-semibold text-text-secondary mt-2">{fontOption.name}</p></button>))}</div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-text-primary mb-3">Icon Style</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {(['Line', 'Solid', 'Duo-tone'] as IconSet[]).map(style => (
                                        <button key={style} type="button" onClick={() => { setLocalIconSet(style); setSaveStatus('dirty'); }} className={`p-4 rounded-lg cursor-pointer border-2 transition-all text-center ${localIconSet === style ? 'border-brand ring-2 ring-brand/50 bg-accent' : 'border-accent hover:border-highlight bg-primary'}`}>
                                            <div className="flex justify-center items-center h-12 text-text-primary">
                                               {React.createElement(iconSets[style.toLowerCase() as keyof typeof iconSets].SettingsIcon)}
                                            </div>
                                            <p className="font-semibold text-text-primary mt-2">{style}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Menu Sequence Settings */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Customize Menu Sequence</h2>
                        <p className="text-sm text-text-secondary mb-4">Drag and drop to reorder the sidebar menu items.</p>
                        <div className="bg-secondary p-2 rounded-lg space-y-1">
                            {localNavOrder.map((pageId, index) => (
                                <div
                                    key={pageId}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    className={`flex items-center p-3 rounded-md transition-colors ${draggedOver === index ? 'bg-highlight' : 'bg-secondary'}`}
                                >
                                    <span className="text-text-secondary mr-3"><DragHandleIcon /></span>
                                    <span className="text-text-primary font-semibold">{allPageDetails[pageId]?.label || pageId}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                 <div className="mt-8 pt-6 border-t border-accent flex justify-end items-center gap-4 min-h-[40px]">
                    {saveStatus === 'saved' && <span className="text-green-400 text-sm">All changes saved</span>}
                    {saveStatus === 'dirty' && (
                        <button
                            onClick={handleSave}
                            className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
