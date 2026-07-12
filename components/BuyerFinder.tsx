
import React, { useState, useEffect } from 'react';
import { BuyerLead, CampaignContact, Page } from '../types';
import { generateCreativeAiResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { GlobeIcon, CertificateIcon, HistoryIcon, BackArrowIcon, WalletIcon, DownloadIcon, BuyerFinderIcon } from './icons';

const SEARCH_CHARGE = 0.20;
const FREE_LIMIT = 10;

interface BuyerFinderProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
    isPremium: boolean;
    isTrialActive: boolean;
    walletBalance: number;
    onDeductWallet: (amount: number) => boolean;
    onRechargeClick: () => void;
}

const BuyerFinder: React.FC<BuyerFinderProps> = ({ t, setActivePage, isPremium, isTrialActive, walletBalance, onDeductWallet, onRechargeClick }) => {
    const [productCategory, setProductCategory] = useState('Spices');
    const [specificProduct, setSpecificProduct] = useState('Turmeric Powder');
    const [country, setCountry] = useState('UAE');
    const [buyerType, setBuyerType] = useState('Wholesaler');
    const [minVolume, setMinVolume] = useState('2 containers/month');
    
    const [leads, setLeads] = useState<BuyerLead[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFindingMore, setIsFindingMore] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dailySearchCount, setDailySearchCount] = useState(0);
    const [savedEmails, setSavedEmails] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'finder' | 'activity'>('finder');
    const [searchActivity, setSearchActivity] = useState<any[]>([]);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem('buyer_search_date');
        if (lastDate === today) {
            setDailySearchCount(Number(localStorage.getItem('buyer_search_count') || '0'));
        } else {
            localStorage.setItem('buyer_search_date', today);
            localStorage.setItem('buyer_search_count', '0');
            setDailySearchCount(0);
        }

        const existingContacts = JSON.parse(localStorage.getItem('campaignContactList') || '[]');
        const emails = existingContacts.map((c: any) => c.email).filter(Boolean);
        setSavedEmails(emails);

        const savedActivity = JSON.parse(localStorage.getItem('buyer_search_activity') || '[]');
        setSearchActivity(savedActivity);
    }, []);

    const checkAndCharge = () => {
        if (isPremium || isTrialActive) return true;
        if (dailySearchCount < FREE_LIMIT) return true;
        return onDeductWallet(SEARCH_CHARGE);
    };

    const updateSearchCount = () => {
        if (isPremium || isTrialActive) return;
        const newCount = dailySearchCount + 1;
        setDailySearchCount(newCount);
        localStorage.setItem('buyer_search_count', String(newCount));
    };

    const getBuyers = async (isInitialSearch: boolean) => {
        setError(null);
        if (!checkAndCharge()) return;

        if (isInitialSearch) {
            setIsLoading(true);
            setLeads([]);
            setSelectedLeads([]);
        } else {
            setIsFindingMore(true);
        }

        const existingNames = isInitialSearch ? '' : `I have already found these companies: ${leads.map(l => l.companyName).join(', ')}. Please find 10 *new and different* companies that are not on this list.`;

        const prompt = `
        You are a trade data analyst AI. Find exactly 10 genuine international buyer leads based on:
        - Product: "${specificProduct}"
        - Target Country: "${country}"
        - Target Buyer Type: "${buyerType}"
        ${existingNames}
        Your response MUST be a JSON array of exactly 10 objects. Keys: "companyName", "contactPerson", "email", "phone", "city", "state", "country", "estimatedVolume", "riskScore" (0-100), "riskJustification", "riskBreakdown" (keys: website, registration, tradeHistory).
        Do not include markdown or text outside the JSON.
        `;

        try {
            const response = await generateCreativeAiResponse(prompt);
            const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedLeads: BuyerLead[] = JSON.parse(cleanedResponse);
            updateSearchCount();
            if (isInitialSearch) {
                setLeads(parsedLeads);
                const newActivityItem = {
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleString(),
                    product: specificProduct,
                    country: country,
                    buyerType: buyerType,
                    leadsCount: parsedLeads.length,
                    leads: parsedLeads
                };
                const existingActivity = JSON.parse(localStorage.getItem('buyer_search_activity') || '[]');
                const updatedActivity = [newActivityItem, ...existingActivity].slice(0, 15);
                localStorage.setItem('buyer_search_activity', JSON.stringify(updatedActivity));
                setSearchActivity(updatedActivity);
            } else {
                setLeads(prevLeads => {
                    const next = [...prevLeads, ...parsedLeads];
                    const existingActivity = JSON.parse(localStorage.getItem('buyer_search_activity') || '[]');
                    if (existingActivity.length > 0) {
                        existingActivity[0].leads = next;
                        existingActivity[0].leadsCount = next.length;
                        localStorage.setItem('buyer_search_activity', JSON.stringify(existingActivity));
                        setSearchActivity(existingActivity);
                    }
                    return next;
                });
            }
        } catch (e) {
            console.error("Failed to get AI response:", e);
            setError(`There was a problem finding buyers. ${e instanceof Error ? e.message : ''}`);
            if (isInitialSearch) setLeads([]);
        } finally {
             if (isInitialSearch) {
                setIsLoading(false);
            } else {
                setIsFindingMore(false);
                setIsOnCooldown(true);
                setTimeout(() => setIsOnCooldown(false), 3000);
            }
        }
    };
    
    const getRiskInfo = (score: number): { borderColor: string; bgColor: string; label: string; } => {
        if (score <= 30) return { borderColor: 'border-green-500', bgColor: 'bg-green-500', label: 'Low Risk' };
        if (score <= 70) return { borderColor: 'border-yellow-500', bgColor: 'bg-yellow-500', label: 'Medium Risk' };
        return { borderColor: 'border-red-500', bgColor: 'bg-red-500', label: 'High Risk' };
    };
    
    const handleSelectLead = (email: string) => {
        setSelectedLeads(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLeads(leads.map(l => l.email));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleToggleSaveContact = (lead: BuyerLead) => {
        const existingContacts: CampaignContact[] = JSON.parse(localStorage.getItem('campaignContactList') || '[]');
        const isAlreadySaved = existingContacts.some(c => c.email === lead.email);
        let updatedContacts: CampaignContact[];
        
        if (isAlreadySaved) {
            updatedContacts = existingContacts.filter(c => c.email !== lead.email);
            alert(`Removed ${lead.companyName} from your contact list.`);
        } else {
            const newContact: CampaignContact = {
                id: Date.now() + Math.random(),
                companyName: lead.companyName,
                contactPerson: lead.contactPerson,
                email: lead.email,
                phone: lead.phone,
                country: lead.country,
                type: 'Buyer',
                product: specificProduct,
            };
            updatedContacts = [...existingContacts, newContact];
            alert(`Successfully saved ${lead.companyName} for next communication!`);
        }
        
        localStorage.setItem('campaignContactList', JSON.stringify(updatedContacts));
        setSavedEmails(updatedContacts.map(c => c.email).filter(Boolean));
    };

    const handleAddToCampaign = () => {
        const leadsToAdd = leads.filter(lead => selectedLeads.includes(lead.email));
        const newContacts: CampaignContact[] = leadsToAdd.map(lead => ({
            id: Date.now() + Math.random(),
            companyName: lead.companyName,
            contactPerson: lead.contactPerson,
            email: lead.email,
            phone: lead.phone,
            country: lead.country,
            type: 'Buyer',
            product: specificProduct,
        }));
        
        const existingContacts: CampaignContact[] = JSON.parse(localStorage.getItem('campaignContactList') || '[]');
        const uniqueNewContacts = newContacts.filter(
            newContact => !existingContacts.some(existing => existing.email === newContact.email)
        );

        if (uniqueNewContacts.length === 0) {
            alert(`All ${selectedLeads.length} selected buyer(s) are already in your campaign list.`);
        } else {
            const updatedContacts = [...existingContacts, ...uniqueNewContacts];
            localStorage.setItem('campaignContactList', JSON.stringify(updatedContacts));
            setSavedEmails(updatedContacts.map(c => c.email).filter(Boolean));
            alert(`${uniqueNewContacts.length} new buyer(s) saved for next communication.`);
        }
        setSelectedLeads([]);
    };

    const handleDownloadCSV = () => {
        const dataToExport = selectedLeads.length > 0 
            ? leads.filter(lead => selectedLeads.includes(lead.email))
            : leads;

        if (dataToExport.length === 0) return;

        const headers = ["Name", "Address", "Phone Number", "Email Address", "Contact Person", "Volume", "Risk Score"];
        const csvRows = [
            headers.join(','),
            ...dataToExport.map(lead => [
                `"${lead.companyName}"`,
                `"${lead.city}, ${lead.state}, ${lead.country}"`,
                `"${lead.phone || 'N/A'}"`,
                `"${lead.email || 'N/A'}"`,
                `"${lead.contactPerson}"`,
                `"${lead.estimatedVolume}"`,
                lead.riskScore
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Buyer_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRestoreSearch = (activity: any) => {
        setSpecificProduct(activity.product);
        setCountry(activity.country);
        setBuyerType(activity.buyerType);
        setLeads(activity.leads || []);
        setSelectedLeads([]);
        setActiveTab('finder');
    };

    const handleDeleteActivity = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = searchActivity.filter(item => item.id !== id);
        localStorage.setItem('buyer_search_activity', JSON.stringify(updated));
        setSearchActivity(updated);
    };

    const isNextSearchCharged = !isPremium && !isTrialActive && dailySearchCount >= FREE_LIMIT;
    const isSearchLocked = isNextSearchCharged && walletBalance < SEARCH_CHARGE;

    return (
        <div className="relative pb-24">
            <header className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                            <BackArrowIcon />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-3xl font-bold text-text-primary">Buyer Finder</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 ${isNextSearchCharged ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                           <WalletIcon className="w-4 h-4" />
                           {isPremium ? 'Premium: Unlimited' : isTrialActive ? 'Trial: Unlimited' : isNextSearchCharged ? `Next Search: ₹${SEARCH_CHARGE}` : `Next Search: FREE (${FREE_LIMIT - dailySearchCount}/${FREE_LIMIT})`}
                        </div>
                    </div>
                </div>
                <p className="text-md text-text-secondary">Find genuine international buyer leads. Only 10 results per search.</p>
            </header>

            <div className="flex border-b border-highlight mb-6">
                <button
                    onClick={() => setActiveTab('finder')}
                    className={`pb-3 px-6 text-sm font-semibold transition-all duration-200 border-b-2 ${activeTab === 'finder' ? 'border-brand text-brand font-bold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    Find New Buyers
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`pb-3 px-6 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${activeTab === 'activity' ? 'border-brand text-brand font-bold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                >
                    <HistoryIcon className="w-4 h-4" />
                    <span>Buyers Finding Activity ({searchActivity.length})</span>
                </button>
            </div>

            {activeTab === 'finder' ? (
                <>
                    <div className="bg-primary p-6 rounded-lg shadow-lg mb-6">
                        <form onSubmit={(e) => { e.preventDefault(); getBuyers(true); }} className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Specific Product</label>
                                    <input value={specificProduct} onChange={(e) => setSpecificProduct(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Target Country</label>
                                    <input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" required />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-text-secondary">Buyer Type</label>
                                    <select value={buyerType} onChange={(e) => setBuyerType(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm">
                                        <option>Wholesaler</option><option>Distributor</option><option>Retail Chain</option><option>Importer</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading || isSearchLocked} 
                                className={`w-full font-bold py-2 px-4 rounded-lg transition h-10 text-sm ${isSearchLocked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-brand text-primary hover:bg-opacity-80'}`}
                            >
                                {isLoading ? <LoadingSpinner /> : isSearchLocked ? `Locked (Recharge ₹${SEARCH_CHARGE})` : isPremium || isTrialActive ? 'Find Buyers (Unlimited)' : isNextSearchCharged ? `Find Buyers (₹${SEARCH_CHARGE})` : `Find Buyers (Free Search ${dailySearchCount + 1}/${FREE_LIMIT})`}
                            </button>
                        </form>
                    </div>

                    {isLoading && <div className="text-center py-10"><LoadingSpinner /><p className="mt-4 text-text-secondary">Analyzing trade data...</p></div>}
                    {error && <div className="text-center p-8"><p className="text-red-400 mb-4">{error}</p><button onClick={onRechargeClick} className="text-brand hover:underline font-bold">Recharge Wallet Now</button></div>}

                    {!isLoading && leads.length > 0 && (
                        <>
                            <div className="flex items-center mb-4 p-2 bg-secondary rounded-md">
                                <input
                                    type="checkbox"
                                    id="select-all-buyers"
                                    className="h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer"
                                    checked={leads.length > 0 && selectedLeads.length === leads.length}
                                    onChange={handleSelectAll}
                                />
                                <label htmlFor="select-all-buyers" className="ml-3 font-semibold text-text-primary cursor-pointer">Select All ({selectedLeads.length} / {leads.length})</label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {leads.map((lead, index) => {
                                    const risk = getRiskInfo(lead.riskScore);
                                    const isSelected = selectedLeads.includes(lead.email);
                                    return (
                                        <div key={index} className={`bg-primary p-5 rounded-lg shadow-lg border-t-4 ${risk.borderColor} flex flex-col relative transition-all duration-200 ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectLead(lead.email)} className="absolute top-4 right-4 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer" />
                                            <div className="flex justify-between items-start mb-3 pr-6">
                                                <div><h3 className="text-xl font-bold text-text-primary">{lead.companyName}</h3><p className="text-sm text-text-secondary">{`${lead.city}, ${lead.country}`}</p></div>
                                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${risk.bgColor} text-primary whitespace-nowrap`}>{risk.label}</div>
                                            </div>
                                            <div className="flex-grow space-y-3 text-sm mb-4">
                                                <p><strong className="text-text-secondary">Email:</strong> <a href={`mailto:${lead.email}`} className="text-brand hover:underline">{lead.email}</a></p>
                                                <p><strong className="text-text-secondary">Phone:</strong> {lead.phone}</p>
                                            </div>
                                            <div className="p-3 bg-accent/50 rounded-md text-sm mb-4"><p><strong className="text-text-secondary">Summary:</strong> {lead.riskJustification}</p></div>
                                            <button
                                                onClick={() => handleToggleSaveContact(lead)}
                                                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                                    savedEmails.includes(lead.email)
                                                        ? 'bg-green-600/10 text-green-400 border border-green-500/30 hover:bg-green-600/20'
                                                        : 'bg-highlight text-text-primary hover:bg-brand hover:text-primary'
                                                }`}
                                            >
                                                {savedEmails.includes(lead.email) ? (
                                                    <>
                                                        <span>Saved to Campaign</span>
                                                        <span className="text-green-400 font-extrabold">✓</span>
                                                    </>
                                                ) : (
                                                    <span>Store Buyer Data</span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-8 flex flex-col items-center gap-4">
                                {isSearchLocked && (
                                    <p className="text-orange-400 text-sm font-bold animate-pulse">
                                        Free limit reached. Please recharge your wallet to find more buyers.
                                    </p>
                                )}
                                <button 
                                    onClick={() => getBuyers(false)} 
                                    disabled={isFindingMore || isOnCooldown || isSearchLocked} 
                                    className={`w-full sm:w-auto font-bold py-2 px-8 rounded-lg transition h-10 ${isSearchLocked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-highlight text-text-primary hover:bg-brand hover:text-primary'}`}
                                >
                                    {isFindingMore ? <LoadingSpinner /> : isOnCooldown ? 'Please wait...' : isSearchLocked ? `Locked (₹${SEARCH_CHARGE})` : `Find More Buyers (₹${SEARCH_CHARGE})`}
                                </button>
                            </div>
                        </>
                    )}

                    {!isLoading && leads.length === 0 && (
                        <div className="bg-primary p-12 rounded-lg text-center border border-highlight">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <BuyerFinderIcon className="w-8 h-8 text-text-secondary" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">No Buyers Extracted</h3>
                            <p className="text-text-secondary max-w-md mx-auto text-sm">
                                Enter your target product parameters above to run a fresh AI market data extraction search. Or visit the <button onClick={() => setActiveTab('activity')} className="text-brand underline hover:text-opacity-85 font-semibold">Finding Activity</button> tab to restore a past search!
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-primary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5 text-brand" />
                        <span>Buyers Finding Activity Log</span>
                    </h2>
                    <p className="text-sm text-text-secondary mb-6">
                        Review, restore, or manage your historical trade data queries and extracted buyer prospects. Restoring a search recovers all leads instantly without taking any coins.
                    </p>

                    {searchActivity.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-highlight rounded-lg">
                            <HistoryIcon className="w-12 h-12 text-text-secondary/40 mx-auto mb-3" />
                            <p className="text-text-secondary text-sm">No historical search records found.</p>
                            <button
                                onClick={() => setActiveTab('finder')}
                                className="mt-4 text-xs font-bold bg-brand text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                            >
                                Start First Search
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {searchActivity.map((activity) => (
                                <div
                                    key={activity.id}
                                    onClick={() => handleRestoreSearch(activity)}
                                    className="p-5 bg-secondary hover:bg-accent border border-highlight hover:border-brand/30 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-md font-bold text-text-primary group-hover:text-brand transition-colors">
                                                {activity.product}
                                            </h4>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                                                {activity.buyerType}
                                            </span>
                                        </div>
                                        <div className="text-xs text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
                                            <span><strong>Target Country:</strong> {activity.country}</span>
                                            <span><strong>Found:</strong> {activity.leadsCount} lead(s)</span>
                                            <span><strong>Searched On:</strong> {activity.timestamp}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRestoreSearch(activity); }}
                                            className="text-xs font-bold bg-highlight text-text-primary group-hover:bg-brand group-hover:text-primary py-1.5 px-4 rounded-lg transition"
                                        >
                                            Restore Leads
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteActivity(activity.id, e)}
                                            className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                                            title="Delete Entry"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {leads.length > 0 && activeTab === 'finder' && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-primary p-3 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-brand/30 animate-fadeInUp backdrop-blur-md">
                         <p className="text-text-primary font-bold px-2">{selectedLeads.length} Selected</p>
                         <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 bg-secondary border border-accent text-text-primary font-bold py-2 px-6 rounded-xl hover:border-brand transition"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            Download CSV
                        </button>
                         <button onClick={handleAddToCampaign} disabled={selectedLeads.length === 0} className="bg-brand text-primary font-black py-2 px-6 rounded-xl hover:bg-opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs">Add to Campaign</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerFinder;
