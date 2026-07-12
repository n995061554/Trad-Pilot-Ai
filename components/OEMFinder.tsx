
import React, { useState, useEffect } from 'react';
import { OEMLead, CampaignContact, Page } from '../types';
import { generateCreativeAiResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { BackArrowIcon, WalletIcon, DownloadIcon } from './icons';

const SEARCH_CHARGE = 0.20;
const FREE_LIMIT = 10;

interface OEMFinderProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
    isPremium: boolean;
    walletBalance: number;
    onDeductWallet: (amount: number) => boolean;
    onRechargeClick: () => void;
}

const OEMFinder: React.FC<OEMFinderProps> = ({ t, setActivePage, isPremium, walletBalance, onDeductWallet, onRechargeClick }) => {
    const [productCategory, setProductCategory] = useState('Apparel');
    const [specificProduct, setSpecificProduct] = useState('Denim Jeans');
    const [city, setCity] = useState('Ahmedabad');
    const [state, setState] = useState('Gujarat');
    const [country, setCountry] = useState('India');
    
    const [leads, setLeads] = useState<OEMLead[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFindingMore, setIsFindingMore] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dailySearchCount, setDailySearchCount] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem('oem_search_date');
        if (lastDate === today) {
            setDailySearchCount(Number(localStorage.getItem('oem_search_count') || '0'));
        } else {
            localStorage.setItem('oem_search_date', today);
            localStorage.setItem('oem_search_count', '0');
            setDailySearchCount(0);
        }
    }, []);

    const checkAndCharge = () => {
        if (isPremium) return true;
        if (dailySearchCount < FREE_LIMIT) return true;
        return onDeductWallet(SEARCH_CHARGE);
    };

    const updateSearchCount = () => {
        if (isPremium) return;
        const newCount = dailySearchCount + 1;
        setDailySearchCount(newCount);
        localStorage.setItem('oem_search_count', String(newCount));
    };
    
    const getOEMs = async (isInitialSearch: boolean) => {
        setError(null);
        if (!checkAndCharge()) return;

        if (isInitialSearch) {
            setIsLoading(true);
            setLeads([]);
            setSelectedLeads([]);
        } else {
            setIsFindingMore(true);
        }

        const existingNames = isInitialSearch ? '' : `I have already found the following manufacturers: ${leads.map(l => l.manufacturerName).join(', ')}. Please find 10 *new and different* manufacturers that are not on this list.`;

        const prompt = `
        You are a B2B sourcing expert AI. Find exactly 10 Original Equipment Manufacturers (OEMs) for "${specificProduct}" in "${city}, ${state}, ${country}".
        ${existingNames}
        Your response MUST be a JSON array of exactly 10 objects. Keys: "manufacturerName", "city", "state", "country", "specialization", "minOrderQuantity", "certifications", "contactPerson", "email", "phone", "privateLabelExperience".
        Do not include markdown or text outside the JSON.
        `;

        try {
            const response = await generateCreativeAiResponse(prompt);
            const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedLeads: OEMLead[] = JSON.parse(cleanedResponse);
            updateSearchCount();
            if (isInitialSearch) {
                setLeads(parsedLeads);
            } else {
                setLeads(prevLeads => [...prevLeads, ...parsedLeads]);
            }
        } catch (e) {
            console.error("Failed to get AI response:", e);
            setError(`There was a problem finding manufacturers. ${e instanceof Error ? e.message : ''}`);
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

    const handleAddToCampaign = () => {
        const leadsToAdd = leads.filter(lead => selectedLeads.includes(lead.email));
        const newContacts: CampaignContact[] = leadsToAdd.map(lead => ({
            id: Date.now() + Math.random(),
            companyName: lead.manufacturerName,
            contactPerson: lead.contactPerson,
            email: lead.email,
            phone: lead.phone,
            country: lead.country,
            type: 'OEM',
            product: specificProduct,
        }));
        const existingContacts = JSON.parse(localStorage.getItem('campaignContactList') || '[]');
        localStorage.setItem('campaignContactList', JSON.stringify([...existingContacts, ...newContacts]));
        alert(`${newContacts.length} manufacturers added to campaign.`);
        setSelectedLeads([]);
    };

    const handleDownloadCSV = () => {
        const dataToExport = selectedLeads.length > 0 
            ? leads.filter(lead => selectedLeads.includes(lead.email))
            : leads;

        if (dataToExport.length === 0) return;

        const headers = ["Name", "Address", "Phone Number", "Email Address", "Contact Person", "MOQ", "Experience"];
        const csvRows = [
            headers.join(','),
            ...dataToExport.map(lead => [
                `"${lead.manufacturerName}"`,
                `"${lead.city}, ${lead.state}, ${lead.country}"`,
                `"${lead.phone || 'N/A'}"`,
                `"${lead.email || 'N/A'}"`,
                `"${lead.contactPerson}"`,
                `"${lead.minOrderQuantity}"`,
                `"${lead.privateLabelExperience.replace(/"/g, '""')}"`
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `OEM_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isNextSearchCharged = !isPremium && dailySearchCount >= FREE_LIMIT;
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
                        <h1 className="text-3xl font-bold text-text-primary">OEM Finder</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 ${isNextSearchCharged ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                           <WalletIcon className="w-4 h-4" />
                           {isPremium ? 'Premium: Unlimited' : isNextSearchCharged ? `Next Search: ₹${SEARCH_CHARGE}` : `Next Search: FREE (${FREE_LIMIT - dailySearchCount}/${FREE_LIMIT})`}
                        </div>
                    </div>
                </div>
                <p className="text-md text-text-secondary">Discover manufacturers for private labeling. Only 10 results per search.</p>
            </header>

            <div className="bg-primary p-6 rounded-lg shadow-lg mb-6">
                <form onSubmit={(e) => { e.preventDefault(); getOEMs(true); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Product Category</label>
                            <input value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Specific Product</label>
                            <input value={specificProduct} onChange={(e) => setSpecificProduct(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" required />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || isSearchLocked} 
                        className={`w-full font-bold py-2 px-4 rounded-lg transition h-10 text-sm ${isSearchLocked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-brand text-primary hover:bg-opacity-80'}`}
                    >
                        {isLoading ? <LoadingSpinner /> : isSearchLocked ? `Locked (Recharge ₹${SEARCH_CHARGE})` : isNextSearchCharged ? `Find OEMs (₹${SEARCH_CHARGE})` : `Find OEMs (Free Search ${dailySearchCount + 1}/${FREE_LIMIT})`}
                    </button>
                </form>
            </div>

            {isLoading && <div className="text-center py-10"><LoadingSpinner /><p className="mt-4 text-text-secondary">Searching manufacturers...</p></div>}
            {error && <div className="text-center p-8"><p className="text-red-400 mb-4">{error}</p><button onClick={onRechargeClick} className="text-brand hover:underline font-bold">Recharge Wallet Now</button></div>}

            {!isLoading && leads.length > 0 && (
                <>
                    <div className="flex items-center mb-4 p-2 bg-secondary rounded-md">
                        <input
                            type="checkbox"
                            id="select-all-oems"
                            className="h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer"
                            checked={leads.length > 0 && selectedLeads.length === leads.length}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all-oems" className="ml-3 font-semibold text-text-primary cursor-pointer">Select All ({selectedLeads.length} / {leads.length})</label>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {leads.map((lead, index) => {
                            const isSelected = selectedLeads.includes(lead.email);
                            return (
                            <div key={index} className={`bg-primary p-5 rounded-lg shadow-lg border-t-4 border-brand flex flex-col relative transition-all duration-200 ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                                <input type="checkbox" checked={isSelected} onChange={() => handleSelectLead(lead.email)} className="absolute top-4 right-4 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer" />
                                <div className="mb-3">
                                    <h3 className="text-xl font-bold text-text-primary">{lead.manufacturerName}</h3>
                                    <p className="text-sm text-text-secondary">{`${lead.city}, ${lead.state}`}</p>
                                </div>
                                <div className="space-y-3 text-sm flex-grow mb-4">
                                    <p><strong className="text-text-secondary">MOQ:</strong> <span className="text-brand">{lead.minOrderQuantity}</span></p>
                                    <p><strong className="text-text-secondary">Email:</strong> <a href={`mailto:${lead.email}`} className="text-brand hover:underline">{lead.email}</a></p>
                                    <p><strong className="text-text-secondary">Phone:</strong> {lead.phone}</p>
                                </div>
                                <div className="p-3 bg-accent/50 rounded-md text-sm"><p>{lead.privateLabelExperience}</p></div>
                            </div>
                        )})}
                    </div>
                    <div className="mt-8 flex flex-col items-center gap-4">
                        {isSearchLocked && (
                            <p className="text-orange-400 text-sm font-bold animate-pulse">
                                Free limit reached. Please recharge your wallet to find more manufacturers.
                            </p>
                        )}
                        <button 
                            onClick={() => getOEMs(false)} 
                            disabled={isFindingMore || isOnCooldown || isSearchLocked} 
                            className={`w-full sm:w-auto font-bold py-2 px-8 rounded-lg transition h-10 ${isSearchLocked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-highlight text-text-primary hover:bg-brand hover:text-primary'}`}
                        >
                            {isFindingMore ? <LoadingSpinner /> : isOnCooldown ? 'Please wait...' : isSearchLocked ? `Locked (₹${SEARCH_CHARGE})` : `Find More Manufacturers (₹${SEARCH_CHARGE})`}
                        </button>
                    </div>
                </>
            )}
            
            {leads.length > 0 && (
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default OEMFinder;
