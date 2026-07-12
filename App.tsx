
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShipmentExperience from './components/ConsignmentBooker';
import MarketIntel from './components/MarketIntel';
import RiskAnalysis from './components/RiskAnalysis';
import BuyerFinder from './components/BuyerFinder';
import SupplierFinder from './components/SupplierFinder';
import OEMFinder from './components/OEMFinder';
import StudyGuide from './components/StudyGuide';
import ResourceHub from './components/ResourceHub';
import CampaignManager from './components/CampaignManager';
import GoogleMapExtractor from './components/GoogleMapExtractor';
import GoalPlanner from './components/GoalPlanner';
import ProfitCalculator from './components/ProfitCalculator';
import Settings from './components/Settings';
import Login from './components/Login';
import SubscriptionExpired from './components/SubscriptionExpired';
import RechargeModal from './components/RechargeModal';
import MarketingBrochure from './components/MarketingBrochure';
import { MASTER_PAYMENT_DETAILS } from './constants';
import { Page, CompanyDetails, IconSet, Font } from './types';
import { translations, Currency } from './translations';
import { themes } from './themes';
import { WalletIcon, ShieldCheckIcon, CertificateIcon, BrainIcon, DownloadIcon, AiIcon, QrCodeIcon, HistoryIcon } from './components/icons';

const initialNavOrder: Page[] = [
    'dashboard',
    'study-guide',
    'market-intel',
    'resource-hub',
    'buyer-finder',
    'supplier-finder',
    'oem-finder',
    'map-extractor',
    'campaign-manager',
    'goal-planner',
    'profit-calculator',
    'shipment-experience',
    'risk',
    'settings',
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [companyProfile, setCompanyProfile] = useState<CompanyDetails | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState<Currency>({ code: 'INR', symbol: '₹' });
  const [theme, setTheme] = useState('Mint Breeze');
  const [font, setFont] = useState<Font>('Lato');
  const [navOrder, setNavOrder] = useState<Page[]>(initialNavOrder);
  const [iconSet, setIconSet] = useState<IconSet>('Duo-tone');

  // Subscription & Pricing State
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<Date | null>(null);
  const [trialExpiry, setTrialExpiry] = useState<Date | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [subscriptionCost, setSubscriptionCost] = useState(1999);
  const [premiumCost, setPremiumCost] = useState(4999);
  const [isPremium, setIsPremium] = useState(false);

  // UI State
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [premiumPaymentView, setPremiumPaymentView] = useState(false);

  const applyTheme = (themeName: string) => {
    const selectedTheme = themes.find(t => t.name === themeName);
    if (!selectedTheme) return;

    const root = document.documentElement;
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };
  
  const applyFont = (fontName: Font) => {
    document.documentElement.style.setProperty('--font-family', `"${fontName}", sans-serif`);
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);

      const savedExpiry = localStorage.getItem('subscriptionExpiry');
      if (savedExpiry) setSubscriptionExpiry(new Date(savedExpiry));
      
      const savedTrial = localStorage.getItem('trialExpiry');
      if (savedTrial) setTrialExpiry(new Date(savedTrial));

      const savedBalance = localStorage.getItem('walletBalance');
      if (savedBalance) setWalletBalance(Number(savedBalance));

      const savedPremium = localStorage.getItem('isPremium');
      if (savedPremium === 'true') setIsPremium(true);

      const savedProfile = localStorage.getItem('companyProfile');
      if (savedProfile) setCompanyProfile(JSON.parse(savedProfile));
    }
    
    const sidebarStatus = localStorage.getItem('sidebarCollapsed');
    if (sidebarStatus === 'true') setIsSidebarCollapsed(true);
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) setCurrency(JSON.parse(savedCurrency));
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { setTheme(savedTheme); applyTheme(savedTheme); } else { applyTheme('Mint Breeze'); }
    const savedFont = localStorage.getItem('font') as Font;
    if (savedFont) { setFont(savedFont); applyFont(savedFont); } else { applyFont('Lato'); }
    const savedNavOrder = localStorage.getItem('navOrder');
    if (savedNavOrder) setNavOrder(JSON.parse(savedNavOrder));
    const savedIconSet = localStorage.getItem('iconSet') as IconSet;
    if (savedIconSet) setIconSet(savedIconSet);
  }, []);

  const isTrialActive = trialExpiry ? new Date() < trialExpiry : false;

  const handleUpgradeToPremium = () => {
    if (walletBalance >= premiumCost) {
      const newBalance = walletBalance - premiumCost;
      setWalletBalance(newBalance);
      localStorage.setItem('walletBalance', String(newBalance));
      setIsPremium(true);
      localStorage.setItem('isPremium', 'true');
      setShowPremiumModal(false);
      setPremiumPaymentView(false);
      alert("Congratulations! You are now a Premium Member.");
    } else {
      setPremiumPaymentView(true);
    }
  };

  const handleConfirmPremiumPayment = () => {
      const neededAmount = premiumCost - walletBalance;
      const newBalance = walletBalance + neededAmount;
      setWalletBalance(newBalance);
      localStorage.setItem('walletBalance', String(newBalance));
      const finalBalance = newBalance - premiumCost;
      setWalletBalance(finalBalance);
      localStorage.setItem('walletBalance', String(finalBalance));
      setIsPremium(true);
      localStorage.setItem('isPremium', 'true');
      setShowPremiumModal(false);
      setPremiumPaymentView(false);
      alert("Payment Successful! Your Premium status is now active.");
  };

  const handleDeductWallet = (amount: number) => {
    if (isTrialActive || isPremium) return true;
    const newBalance = walletBalance - amount;
    if (newBalance < 0) {
      setShowRechargeModal(true);
      return false;
    }
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', String(newBalance));
    return true;
  };

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setActivePage('dashboard');

    if (!localStorage.getItem('subscriptionExpiry')) {
      const initialExpiry = new Date();
      initialExpiry.setDate(initialExpiry.getDate() + 365); // 1 year sub
      setSubscriptionExpiry(initialExpiry);
      localStorage.setItem('subscriptionExpiry', initialExpiry.toISOString());
      
      const trial = new Date();
      trial.setHours(trial.getHours() + 24);
      setTrialExpiry(trial);
      localStorage.setItem('trialExpiry', trial.toISOString());

      setWalletBalance(0);
      localStorage.setItem('walletBalance', '0');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCompanyProfile(null);
    setSubscriptionExpiry(null);
    setTrialExpiry(null);
    setWalletBalance(0);
    setNavOrder(initialNavOrder);
  };

  const handleProfileUpdate = (newProfile: CompanyDetails) => {
    localStorage.setItem('companyProfile', JSON.stringify(newProfile));
    setCompanyProfile(newProfile);
  };
  
  const toggleSidebar = () => {
      setIsSidebarCollapsed(prevState => {
          const newState = !prevState;
          localStorage.setItem('sidebarCollapsed', String(newState));
          return newState;
      });
  };
  
  const handleLanguageChange = (lang: string) => { setLanguage(lang); localStorage.setItem('language', lang); }
  const handleCurrencyChange = (curr: Currency) => { setCurrency(curr); localStorage.setItem('currency', JSON.stringify(curr)); }
  const handleThemeChange = (themeName: string) => { setTheme(themeName); localStorage.setItem('theme', themeName); applyTheme(themeName); };
  const handleFontChange = (fontName: Font) => { setFont(fontName); localStorage.setItem('font', fontName); applyFont(fontName); }
  const handleIconSetChange = (style: IconSet) => { setIconSet(style); localStorage.setItem('iconSet', style); };
  const handleNavOrderChange = (newOrder: Page[]) => { setNavOrder(newOrder); localStorage.setItem('navOrder', JSON.stringify(newOrder)); };
  const handleRecharge = (amount: number) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', String(newBalance));
    alert(`Payment of ₹${amount} successful!`);
  };

  const handleRenew = () => {
    if (walletBalance >= subscriptionCost) {
      const newBalance = walletBalance - subscriptionCost;
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      setWalletBalance(newBalance);
      localStorage.setItem('walletBalance', String(newBalance));
      setSubscriptionExpiry(newExpiryDate);
      localStorage.setItem('subscriptionExpiry', newExpiryDate.toISOString());
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language as keyof typeof translations]?.[key] || translations.en[key];
  }

  const isSubscriptionActive = subscriptionExpiry ? new Date() < subscriptionExpiry : false;

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;
  if (!isSubscriptionActive) return <SubscriptionExpired walletBalance={walletBalance} subscriptionCost={subscriptionCost} onRecharge={handleRecharge} onRenew={handleRenew} onRechargeClick={() => setShowRechargeModal(true)} />;

  const renderContent = () => {
    const props = { t, setActivePage, isPremium, isTrialActive, walletBalance, onDeductWallet: handleDeductWallet, onRechargeClick: () => setShowRechargeModal(true) };
    switch (activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} t={t} walletBalance={walletBalance} onRechargeClick={() => setShowRechargeModal(true)} />;
      case 'study-guide': return <StudyGuide t={t} setActivePage={setActivePage} />;
      case 'shipment-experience': return <ShipmentExperience t={t} currency={currency} setActivePage={setActivePage} />;
      case 'goal-planner': return <GoalPlanner t={t} currency={currency} setActivePage={setActivePage} />;
      case 'profit-calculator': return <ProfitCalculator t={t} currency={currency} setActivePage={setActivePage} />;
      case 'market-intel': return <MarketIntel t={t} setActivePage={setActivePage} />;
      case 'buyer-finder': return <BuyerFinder {...props} />;
      case 'supplier-finder': return <SupplierFinder {...props} />;
      case 'oem-finder': return <OEMFinder {...props} />;
      case 'map-extractor': return <GoogleMapExtractor {...props} />;
      case 'resource-hub': return <ResourceHub {...props} onRechargeClick={() => setShowRechargeModal(true)} />;
      case 'campaign-manager': return <CampaignManager t={t} setActivePage={setActivePage} />;
      case 'risk': return <RiskAnalysis t={t} setActivePage={setActivePage} />;
      case 'settings':
        return <Settings 
                    language={language} onLanguageChange={handleLanguageChange} 
                    currency={currency} onCurrencyChange={handleCurrencyChange} 
                    theme={theme} onThemeChange={handleThemeChange}
                    font={font} onFontChange={handleFontChange}
                    iconSet={iconSet} onIconSetChange={handleIconSetChange}
                    applyTheme={applyTheme}
                    navOrder={navOrder} onNavOrderChange={handleNavOrderChange}
                    profile={companyProfile} onProfileUpdate={handleProfileUpdate}
                    t={t} 
                    setActivePage={setActivePage}
                    subscriptionPrice={subscriptionCost}
                    onRechargeClick={() => setShowRechargeModal(true)}
                />;
      default: return <Dashboard setActivePage={setActivePage} t={t} />;
    }
  };

  const amountToPayForPremium = Math.max(0, premiumCost - walletBalance);
  const upiId = MASTER_PAYMENT_DETAILS.upiId;
  const companyName = MASTER_PAYMENT_DETAILS.companyName;
  const bankDetails = MASTER_PAYMENT_DETAILS.bankDetails;

  return (
    <div className="flex h-screen bg-primary font-sans overflow-hidden text-text-primary">
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-secondary max-w-2xl w-full rounded-3xl shadow-2xl border border-yellow-500/30 overflow-hidden animate-zoomIn">
            {!premiumPaymentView ? (
              <>
                <div className="relative h-56 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-400 flex flex-col items-center justify-center text-white text-center p-8">
                    <button onClick={() => { setShowPremiumModal(false); setPremiumPaymentView(false); }} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors font-bold w-10 h-10 flex items-center justify-center text-2xl">&times;</button>
                    <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner ring-4 ring-white/10">
                        <CertificateIcon className="w-14 h-14 text-yellow-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter drop-shadow-md">PREMIUM UNLOCKED</h2>
                    <p className="text-yellow-50 text-sm font-bold opacity-95 mt-2 uppercase tracking-widest">Scale your export business to the elite level.</p>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {[
                            { icon: <BrainIcon />, title: "Unlimited Operations", desc: "Totally Free Supplier, Logistics, Embassy, Port, Compliance, & HS Code search." },
                            { icon: <ShieldCheckIcon />, title: "Elite Discovery", desc: "No daily credits on Buyer Finder or OEM search. Real-time verification." },
                            { icon: <DownloadIcon />, title: "Bulk Leads Export", desc: "Download hundreds of verified buyer/supplier contacts in one click." },
                            { icon: <AiIcon />, title: "Priority Support", desc: "Direct channel to trade experts for documentation and compliance help." }
                        ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="p-3 bg-yellow-500/10 text-yellow-600 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">{feat.icon}</div>
                                <div>
                                    <h4 className="font-bold text-text-primary text-base leading-tight">{feat.title}</h4>
                                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center border-t border-accent/40 pt-8">
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-text-primary tracking-tight">₹{premiumCost.toLocaleString('en-IN')}</span>
                            <span className="text-text-secondary text-sm font-semibold uppercase">/ annual upgrade</span>
                        </div>
                        <button 
                            onClick={handleUpgradeToPremium}
                            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-primary font-black py-4 rounded-2xl shadow-xl shadow-yellow-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all uppercase tracking-widest text-lg"
                        >
                            {walletBalance >= premiumCost ? 'Activate Premium Now' : 'Pay & Activate Premium'}
                        </button>
                    </div>
                </div>
              </>
            ) : (
                <div className="p-8 text-center space-y-6 animate-fadeIn max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-center mb-4">
                         <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                            <QrCodeIcon className="w-20 h-20 text-yellow-600" />
                         </div>
                    </div>
                    <h2 className="text-3xl font-black text-text-primary">Complete Your Upgrade</h2>
                    <p className="text-text-secondary px-8">Scan this code to pay the upgrade fee of <span className="text-yellow-600 font-bold">₹{amountToPayForPremium.toLocaleString('en-IN')}</span> via any UPI app.</p>
                    <div className="p-4 bg-white rounded-2xl inline-block shadow-inner ring-1 ring-accent/10">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(companyName)}&am=${amountToPayForPremium}&cu=INR`}
                            alt="Premium Payment QR"
                            className="w-48 h-48 rounded-md"
                        />
                    </div>

                    {bankDetails && (
                        <div className="mt-6 p-6 bg-primary rounded-2xl border border-accent/20 text-left">
                            <h3 className="text-xs font-black uppercase tracking-widest text-yellow-600 mb-3">Or Pay via Bank Transfer</h3>
                            <div className="text-sm font-mono whitespace-pre-wrap text-text-primary">
                                {bankDetails}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 space-y-3">
                         <button onClick={handleConfirmPremiumPayment} className="w-full bg-brand text-primary font-black py-4 rounded-xl shadow-lg shadow-brand/20 transition-all hover:opacity-90 active:scale-95">I Have Paid ₹{amountToPayForPremium.toLocaleString('en-IN')}</button>
                         <button onClick={() => setPremiumPaymentView(false)} className="w-full text-text-secondary font-bold text-sm hover:text-brand transition-colors">Go Back</button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}

      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={handleLogout} 
        companyProfile={companyProfile}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        navOrder={navOrder}
        iconSet={iconSet}
        t={t}
        isPremium={isPremium}
      />
      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'ml-16' : 'ml-16 sm:ml-64'} transition-all duration-300 print:ml-0`}>
          <header className="flex-shrink-0 bg-primary h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-accent print:hidden">
              <div className="flex items-center gap-4">
                {isPremium ? (
                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-yellow-500/20">
                        <span className="text-sm">✨</span> PREMIUM MEMBER
                    </div>
                ) : isTrialActive ? (
                    <div className="flex items-center gap-2 bg-brand/10 border border-brand/30 text-brand px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <span className="animate-pulse">⚡</span> 24HR FULL TRIAL ACTIVE
                    </div>
                ) : (
                    <button 
                        onClick={() => { setShowPremiumModal(true); setPremiumPaymentView(false); }}
                        className="group flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-yellow-500/30 active:scale-95 hover:scale-105"
                    >
                        <span>Upgrade to Premium</span>
                    </button>
                )}
              </div>
              <div className="flex items-center gap-3 bg-secondary/80 backdrop-blur-md p-2 px-4 rounded-2xl border border-accent/20 shadow-lg shadow-black/5 group relative">
                  <div className="p-2 bg-brand/10 rounded-full text-brand group-hover:bg-brand group-hover:text-primary transition-all cursor-pointer" onClick={() => setShowRechargeModal(true)}>
                    <WalletIcon />
                  </div>
                  <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Wallet Balance</div>
                      <div className="font-black text-text-primary text-xl leading-tight">₹{walletBalance.toLocaleString('en-IN')}</div>
                  </div>
                  {walletBalance === 0 && !isTrialActive && !isPremium && (
                    <div className="absolute -bottom-12 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg animate-bounce shadow-lg whitespace-nowrap z-50">
                      Balance Zero! Recharge Now
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-red-500"></div>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowRechargeModal(true)}
                    className="ml-2 bg-brand/10 hover:bg-brand text-brand hover:text-primary p-1.5 rounded-lg transition-all border border-brand/20"
                    title="Recharge Wallet"
                  >
                    <span className="text-xs font-black">+</span>
                  </button>
              </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-secondary print:p-0 print:bg-white print:overflow-visible">
            <div className="print:hidden">
              {renderContent()}
            </div>
            <MarketingBrochure price={subscriptionCost} hiddenOnScreen={true} />
          </main>
      </div>
      <RechargeModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)} 
        onRecharge={handleRecharge} 
        currentBalance={walletBalance} 
        companyProfile={companyProfile}
      />
    </div>
  );
};

export default App;
