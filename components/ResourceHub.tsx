
import React, { useState, useEffect } from 'react';
import { generateCreativeAiResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { Supplier, LogisticsProvider, Embassy, PortInfo, ComplianceInfo, HSCodeResult, Page } from '../types';
import { translations } from '../translations';
import { CertificateIcon, TagIcon, GavelIcon, DownloadIcon, GmailIcon, BackArrowIcon, WalletIcon } from './icons';

type ResourceType = 'supplier' | 'logistics' | 'embassy' | 'port' | 'compliance' | 'hsCode';

const SEARCH_CHARGE = 0.20; // 20 Paisa

// Common input style
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
    />
);

interface ResourceHubProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
    isPremium: boolean;
    walletBalance: number;
    onDeductWallet: (amount: number) => boolean;
    onRechargeClick: () => void;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ t, setActivePage, isPremium, walletBalance, onDeductWallet, onRechargeClick }) => {
    const [activeTab, setActiveTab] = useState<ResourceType>('supplier');
    const [isLoading, setIsLoading] = useState(false);
    const [isFindingMore, setIsFindingMore] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [query, setQuery] = useState({ 
        supplier: 'Turmeric Powder', 
        supplierLocation: '',
        logistics: 'Mumbai', 
        embassy: 'USA', 
        port: 'Jebel Ali',
        complianceProduct: 'Spices',
        complianceCountry: 'USA',
        hsCodeProduct: 'Basmati Rice 1121 Sella',
    });
    const [error, setError] = useState<string | null>(null);
    const [hsCodeHistory, setHsCodeHistory] = useState<string[]>([]);
    const [dailySearchCount, setDailySearchCount] = useState(0);

    useEffect(() => {
        const savedHistory = localStorage.getItem('hsCodeSearchHistory');
        if (savedHistory) {
            setHsCodeHistory(JSON.parse(savedHistory));
        }

        // Initialize daily search count from localStorage
        const today = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem('expo_ops_search_date');
        if (lastDate === today) {
            setDailySearchCount(Number(localStorage.getItem('expo_ops_search_count') || '0'));
        } else {
            localStorage.setItem('expo_ops_search_date', today);
            localStorage.setItem('expo_ops_search_count', '0');
            setDailySearchCount(0);
        }
    }, []);
    
    useEffect(() => {
        // Reset results when tab changes
        setResults([]);
        setError(null);
        setSelectedItems([]);
    }, [activeTab]);

    const handleQueryChange = (field: keyof typeof query, value: string) => {
        setQuery(prev => ({ ...prev, [field]: value }));
    };

    const checkAndCharge = () => {
        if (isPremium) return true; // Premium is totally free
        if (dailySearchCount === 0) return true; // First search of the day is free for everyone

        // Charge 20 paisa
        return onDeductWallet(SEARCH_CHARGE);
    };

    const updateSearchCount = () => {
        if (isPremium) return;
        const newCount = dailySearchCount + 1;
        setDailySearchCount(newCount);
        localStorage.setItem('expo_ops_search_count', String(newCount));
    };

    const searchResource = async (isInitialSearch: boolean, overrideQuery?: string) => {
        if (isInitialSearch) {
            setError(null);
            if (!checkAndCharge()) return;
            
            setIsLoading(true);
            setResults([]);
            setSelectedItems([]);
        } else {
            setIsFindingMore(true);
        }

        let searchQuery: string | undefined;
        if (overrideQuery !== undefined) {
            searchQuery = overrideQuery;
        } else {
            switch (activeTab) {
                case 'supplier': searchQuery = query.supplier; break;
                case 'logistics': searchQuery = query.logistics; break;
                case 'embassy': searchQuery = query.embassy; break;
                case 'port': searchQuery = query.port; break;
                case 'hsCode': searchQuery = query.hsCodeProduct; break;
                case 'compliance': searchQuery = query.complianceProduct; break;
                default: searchQuery = undefined;
            }
        }
        
        if (!searchQuery || (activeTab === 'compliance' && !query.complianceCountry)) {
            setIsLoading(false);
            setIsFindingMore(false);
            return;
        }
        
        let prompt = '';
        let existingNames = '';

        switch(activeTab) {
            case 'supplier':
                const locationQuery = query.supplierLocation ? ` in or near "${query.supplierLocation}"` : 'in India';
                existingNames = isInitialSearch ? '' : `I have already found these suppliers: ${results.map(r => r.supplierName).join(', ')}. Please find 10 *new and different* suppliers not on this list.`;
                prompt = `You are a trade data analyst. Find exactly 10 potential suppliers${locationQuery} for "${searchQuery}". Return a JSON array of objects with keys: "supplierName", "location" (full address), "specialization", "contactEmail", "contactPhone", "reliabilityScore" (0-100). Do not exceed 10 results. ${existingNames}`;
                break;
            case 'logistics':
                existingNames = isInitialSearch ? '' : `I have already found these providers: ${results.map(r => r.companyName).join(', ')}. Please find 10 *new and different* providers not on this list.`;
                prompt = `You are a logistics database. Find exactly 10 Freight Forwarders and CHAs in "${searchQuery}", India. Return a JSON array of objects with keys: "companyName", "type" ('Freight Forwarder' or 'CHA'), "location" (full address), "specializesIn", "email", "phone". Do not exceed 10 results. ${existingNames}`;
                break;
            case 'embassy':
                existingNames = isInitialSearch ? '' : `I have already found embassies for these countries: ${results.map(r => r.country).join(', ')}. Please find results for exactly 10 new and different countries.`;
                prompt = `You are a diplomatic directory. Provide contact details for the Commercial Wing of the Indian Embassy in major trading countries related to "${searchQuery}". If the query is a specific country, focus on that. Return exactly 10 different embassies. Return a JSON array of objects with keys: "country", "city", "email", "phone". Do not include any text outside the JSON array. ${existingNames}`;
                break;
            case 'port':
                 existingNames = isInitialSearch ? '' : `I have already found these ports: ${results.map(r => r.portName).join(', ')}. Please find exactly 10 new and different ports.`;
                prompt = `You are a global ports database. Provide key information for exactly 10 major ports related to "${searchQuery}". Return a JSON array of objects with keys: "portName", "country", "keyInfo", "majorExports". Do not include any text outside the JSON array. ${existingNames}`;
                break;
            case 'compliance':
                prompt = `You are a global trade compliance expert AI. For exporting "${query.complianceProduct}" from India to "${query.complianceCountry}", provide a detailed breakdown of exactly 10 key compliance requirements or regulatory points. Your response MUST be a JSON array of objects representing different regulations, each with keys: "title", "details", "authority". Do not include any text outside the JSON array.`;
                break;
            case 'hsCode':
                 if (isInitialSearch) {
                    const newHistory = [
                        searchQuery,
                        ...hsCodeHistory.filter(item => item.toLowerCase() !== searchQuery!.toLowerCase())
                    ].slice(0, 5);
                    setHsCodeHistory(newHistory);
                    localStorage.setItem('hsCodeSearchHistory', JSON.stringify(newHistory));
                 }
                 existingNames = isInitialSearch ? '' : `I have already found these codes: ${results.map(r => r.hsCode).join(', ')}. Please find up to 10 new and different codes.`;
                 prompt = `You are an expert customs agent specializing in HS codes. Find exactly 10 possible 6 or 8-digit HS codes for "${searchQuery}". Return a JSON array of objects with keys: "hsCode", "description", "chapter", "confidenceScore" (0-100), "notes". Do not include any text outside the JSON array. ${existingNames}`;
                break;
        }

        try {
            const response = await generateCreativeAiResponse(prompt);
            const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanedResponse);
            const newResults = Array.isArray(parsed) ? parsed : [parsed];

            if (isInitialSearch) {
                setResults(newResults);
                updateSearchCount();
            } else {
                 setResults(prev => [...prev, ...newResults]);
            }
        } catch (err) {
            console.error("Failed to get AI response:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Search failed. ${errorMessage}`);
            if(isInitialSearch) setResults([]);
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
    
    const handleHistorySearch = (searchTerm: string) => {
        handleQueryChange('hsCodeProduct', searchTerm);
        searchResource(true, searchTerm);
    };

    const removeHistoryItem = (itemToRemove: string) => {
        const newHistory = hsCodeHistory.filter(item => item !== itemToRemove);
        setHsCodeHistory(newHistory);
        localStorage.setItem('hsCodeSearchHistory', JSON.stringify(newHistory));
    };

    const getItemKey = (item: any): string => {
        switch (activeTab) {
            case 'supplier': return item.supplierName + item.contactEmail;
            case 'logistics': return item.companyName + item.phone;
            case 'embassy': return item.country;
            case 'port': return item.portName;
            case 'hsCode': return item.hsCode;
            case 'compliance': return item.title;
            default: return JSON.stringify(item);
        }
    };
    
    const handleSelectItem = (id: string) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(results.map(getItemKey));
        } else {
            setSelectedItems([]);
        }
    };

    const handleDownloadCSV = () => {
        const selectedData = selectedItems.length > 0 
            ? results.filter(item => selectedItems.includes(getItemKey(item)))
            : results;

        if (selectedData.length === 0) return;

        let headers: string[] = [];
        let rows: any[][] = [];

        switch(activeTab) {
            case 'supplier':
                headers = ["Name", "Address", "Phone", "Email", "Specialization", "Reliability Score"];
                rows = selectedData.map(r => [r.supplierName, r.location, r.contactPhone, r.contactEmail, r.specialization, r.reliabilityScore]);
                break;
            case 'logistics':
                headers = ["Name", "Address", "Phone", "Email", "Type", "Specialization"];
                rows = selectedData.map(r => [r.companyName, r.location, r.phone, r.email, r.type, r.specializesIn]);
                break;
            case 'embassy':
                headers = ["Country", "City", "Phone", "Email"];
                rows = selectedData.map(r => [r.country, r.city, r.phone, r.email]);
                break;
            case 'port':
                headers = ["Name", "Country", "Info", "Exports"];
                rows = selectedData.map(r => [r.portName, r.country, r.keyInfo, r.majorExports]);
                break;
            case 'hsCode':
                headers = ["HS Code", "Chapter", "Description", "Confidence", "Notes"];
                rows = selectedData.map(r => [r.hsCode, r.chapter, r.description, r.confidenceScore, r.notes]);
                break;
            case 'compliance':
                headers = ["Regulation", "Details", "Authority"];
                rows = selectedData.map(r => [r.title, r.details, r.authority]);
                break;
        }

        const csvRows = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell || 'N/A').replace(/"/g, '""')}"`).join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeTab}_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCommunicate = () => {
        const selectedData = results.filter(item => selectedItems.includes(getItemKey(item)));
        let emails: string[] = [];

        switch(activeTab) {
            case 'supplier':
                emails = selectedData.map(item => item.contactEmail).filter(Boolean);
                break;
            case 'logistics':
                emails = selectedData.map(item => item.email).filter(Boolean);
                break;
            case 'embassy':
                emails = selectedData.map(item => item.email).filter(Boolean);
                break;
        }

        if (emails.length > 0) {
            const bcc = emails.join(',');
            const mailtoLink = `mailto:?bcc=${bcc}&subject=Business Inquiry`;
            window.location.href = mailtoLink;
        } else {
            alert('No email addresses found for the selected items.');
        }
    };


    const renderForm = () => {
        switch(activeTab) {
            case 'supplier': return (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input value={query.supplier} onChange={e => handleQueryChange('supplier', e.target.value)} placeholder="Enter product name..."/>
                    <Input value={query.supplierLocation} onChange={e => handleQueryChange('supplierLocation', e.target.value)} placeholder="Enter city/state (optional)..."/>
                </div>
            );
            case 'logistics': return <Input value={query.logistics} onChange={e => handleQueryChange('logistics', e.target.value)} placeholder="Enter city in India..."/>;
            case 'embassy': return <Input value={query.embassy} onChange={e => handleQueryChange('embassy', e.target.value)} placeholder="Enter country..."/>;
            case 'port': return <Input value={query.port} onChange={e => handleQueryChange('port', e.target.value)} placeholder="Enter port name..."/>;
            case 'compliance': return (
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input value={query.complianceProduct} onChange={e => handleQueryChange('complianceProduct', e.target.value)} placeholder="Enter product..."/>
                    <Input value={query.complianceCountry} onChange={e => handleQueryChange('complianceCountry', e.target.value)} placeholder="Enter country..."/>
                </div>
            );
            case 'hsCode': return (
                <div>
                    <Input value={query.hsCodeProduct} onChange={e => handleQueryChange('hsCodeProduct', e.target.value)} placeholder="Enter detailed product description..."/>
                    {hsCodeHistory.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                            <span className="text-xs text-text-secondary self-center mr-1">Recent:</span>
                            {hsCodeHistory.map((item, index) => (
                                <div key={index} className="flex items-center gap-1 bg-accent rounded-full text-xs transition-colors hover:bg-highlight">
                                    <button 
                                        onClick={() => handleHistorySearch(item)}
                                        className="text-text-primary pl-2.5 pr-1.5 py-1 hover:text-brand"
                                    >
                                        {item}
                                    </button>
                                    <button 
                                        onClick={() => removeHistoryItem(item)}
                                        className="text-text-secondary hover:text-red-400 pr-2 font-bold"
                                        title={`Remove "${item}"`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    };

     const renderResults = () => {
        if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
        if (error && results.length === 0) return <div className="text-center p-8"><p className="text-red-400 mb-4">{error}</p><button onClick={onRechargeClick} className="text-brand hover:underline font-bold">Recharge Wallet Now</button></div>;
        if (!isLoading && results.length === 0) return <p className="text-center text-text-secondary p-8">No results to display. Please perform a search.</p>;

        const canSelectItems = ['supplier', 'logistics', 'embassy', 'port', 'hsCode', 'compliance'].includes(activeTab);

        const resultsContent = () => {
             switch(activeTab) {
                case 'supplier': return (results as Supplier[]).map((item, i) => {
                    const key = getItemKey(item);
                    const isSelected = selectedItems.includes(key);
                    return (
                        <div key={i} className={`bg-secondary p-4 rounded-md flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                            <div>
                                <h4 className="font-bold text-brand">{item.supplierName}</h4>
                                <p className="text-sm">{item.location} - Specializes in: {item.specialization}</p>
                                <p className="text-sm">Email: {item.contactEmail} | Phone: {item.contactPhone}</p>
                                <p className="text-sm">Reliability: {item.reliabilityScore}/100</p>
                            </div>
                        </div>
                    )
                });
                case 'logistics': return (results as LogisticsProvider[]).map((item, i) => {
                    const key = getItemKey(item);
                    const isSelected = selectedItems.includes(key);
                    return (
                        <div key={i} className={`bg-secondary p-4 rounded-md flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                             <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                             <div>
                                <h4 className="font-bold text-brand">{item.companyName} ({item.type})</h4>
                                <p className="text-sm">{item.location} - Specializes in: {item.specializesIn}</p>
                                <p className="text-sm">Contact: {item.phone} | {item.email}</p>
                            </div>
                        </div>
                    );
                });
                case 'embassy': return (results as Embassy[]).map((item, i) => {
                    const key = getItemKey(item);
                    const isSelected = selectedItems.includes(key);
                    return (
                        <div key={i} className={`bg-secondary p-4 rounded-md flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                            <div>
                                <h4 className="font-bold text-brand">Indian Embassy, {item.country}</h4>
                                <p className="text-sm">City: {item.city}</p>
                                <p className="text-sm">Email: <a href={`mailto:${item.email}`} className="text-brand hover:underline">{item.email}</a></p>
                                <p className="text-sm">Phone: {item.phone}</p>
                            </div>
                        </div>
                    );
                });
                case 'port': return (results as PortInfo[]).map((item, i) => {
                    const key = getItemKey(item);
                    const isSelected = selectedItems.includes(key);
                    return (
                        <div key={i} className={`bg-secondary p-4 rounded-md flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                            <div>
                                <h4 className="font-bold text-brand">{item.portName}, {item.country}</h4>
                                <p className="text-sm">{item.keyInfo}</p>
                                <p className="text-sm font-semibold">Major Exports: {item.majorExports}</p>
                            </div>
                        </div>
                    );
                });
                case 'compliance': return results.map((item: any, i) => {
                     const key = getItemKey(item);
                     const isSelected = selectedItems.includes(key);
                     return (
                        <div key={i} className={`bg-secondary p-4 rounded-md flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                             <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                            <div>
                                <h4 className="font-bold text-brand">{item.title}</h4>
                                <p className="text-sm text-text-primary mt-1">{item.details}</p>
                                <p className="text-xs text-text-secondary mt-2">Authority: {item.authority}</p>
                            </div>
                        </div>
                    );
                });
                case 'hsCode': return results.map((item: HSCodeResult, i) => {
                    const key = getItemKey(item);
                    const isSelected = selectedItems.includes(key);
                    const score = item.confidenceScore;
                    const scoreColor = score >= 85 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
                    return (
                        <div key={i} className={`bg-secondary p-6 rounded-lg border-l-4 border-brand flex items-start gap-4 transition-all ${isSelected ? 'ring-2 ring-brand' : ''}`}>
                             <input type="checkbox" checked={isSelected} onChange={() => handleSelectItem(key)} className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"/>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div><p className="text-sm text-text-secondary">HS Code</p><h3 className="text-4xl font-bold text-brand font-mono tracking-wider">{item.hsCode}</h3></div>
                                    <div className="text-right"><p className="text-sm text-text-secondary">Confidence</p><p className={`text-2xl font-bold ${scoreColor}`}>{score}%</p></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-accent space-y-3">
                                    <div><h4 className="font-semibold text-text-primary text-sm">Official Description</h4><p className="text-text-secondary text-sm">{item.description}</p></div>
                                    <div><h4 className="font-semibold text-text-primary text-sm">Chapter</h4><p className="text-text-secondary text-sm">{item.chapter}</p></div>
                                    <div><h4 className="font-semibold text-text-primary text-sm">AI Notes</h4><p className="text-text-secondary text-xs italic">{item.notes}</p></div>
                                </div>
                            </div>
                        </div>
                    );
                });
            }
        };
        return (
            <>
                {results.length > 0 && canSelectItems && (
                    <div className="flex items-center mb-4 p-2 bg-secondary rounded-md sticky top-0 z-10">
                        <input
                            type="checkbox"
                            id="select-all"
                            className="h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer"
                            checked={results.length > 0 && selectedItems.length === results.length}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="select-all" className="ml-3 font-semibold text-text-primary cursor-pointer">Select All ({selectedItems.length} / {results.length})</label>
                    </div>
                )}
                <div className="space-y-4 mt-4">
                    {resultsContent()}
                </div>
                {!isLoading && results.length > 0 && ['supplier', 'logistics', 'embassy', 'port', 'hsCode', 'compliance'].includes(activeTab) && (
                    <div className="mt-6 flex justify-center">
                        <button onClick={() => searchResource(false)} disabled={isFindingMore || isOnCooldown} className="w-full sm:w-auto bg-highlight text-text-primary font-bold py-2 px-8 rounded-lg hover:bg-brand hover:text-primary transition disabled:bg-gray-500 disabled:cursor-wait h-10">
                            {isFindingMore ? <LoadingSpinner /> : isOnCooldown ? 'Please wait...' : isPremium ? 'Search More (Premium Free)' : `Search More (₹${SEARCH_CHARGE})`}
                        </button>
                    </div>
                )}
            </>
        )
    }
    
    const tabs = [
        { id: 'supplier', label: 'Supplier Finder' },
        { id: 'logistics', label: 'Logistics Finder' },
        { id: 'embassy', label: 'Embassy Directory' },
        { id: 'port', label: 'Port Data' },
        { id: 'compliance', label: 'Compliance Check' },
        { id: 'hsCode', label: 'HS Code Finder' },
    ];
    
    const canSelectItems = ['supplier', 'logistics', 'embassy', 'port', 'hsCode', 'compliance'].includes(activeTab);
    const canCommunicate = ['supplier', 'logistics', 'embassy'].includes(activeTab);

    const isNextSearchCharged = !isPremium && dailySearchCount > 0;

    return (
        <div className="relative pb-24">
            <header className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                            <BackArrowIcon />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-3xl font-bold text-text-primary">{t('resourceHub')}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 ${isNextSearchCharged ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                           <WalletIcon className="w-4 h-4" />
                           {isPremium ? 'Premium: Unlimited' : isNextSearchCharged ? `Next Search: ₹${SEARCH_CHARGE}` : 'Next Search: FREE'}
                        </div>
                    </div>
                </div>
                <p className="text-md text-text-secondary">Find essential contacts, data, and compliance info for your export operations. Only 10 results per search.</p>
            </header>

            <div className="flex border-b border-accent mb-6 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as ResourceType)} className={`px-4 py-2 font-semibold ${activeTab === tab.id ? 'border-b-2 border-brand text-brand' : 'text-text-secondary'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-primary p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                    <div className="flex-grow w-full sm:w-auto">
                        {renderForm()}
                    </div>
                    <button onClick={() => searchResource(true)} disabled={isLoading} className="bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition disabled:bg-gray-500 h-10 w-full sm:w-32 flex-shrink-0">
                        {isLoading ? <LoadingSpinner /> : isNextSearchCharged ? `Search (₹${SEARCH_CHARGE})` : 'Search (Free)'}
                    </button>
                </div>
                
                {renderResults()}
            </div>

            {selectedItems.length > 0 && canSelectItems && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-primary p-3 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-brand/30 animate-fadeInUp backdrop-blur-md">
                        <p className="text-text-primary font-bold px-2">{selectedItems.length} Selected</p>
                        <button onClick={handleDownloadCSV} className="flex items-center gap-2 bg-brand text-primary font-bold py-2 px-6 rounded-xl hover:bg-opacity-80 transition shadow-lg shadow-brand/20 uppercase tracking-widest text-xs">
                            <DownloadIcon className="w-4 h-4" /> Download Report
                        </button>
                        {canCommunicate && (
                            <button onClick={handleCommunicate} className="flex items-center gap-2 bg-highlight text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-brand hover:text-primary transition">
                                <GmailIcon /> Communicate
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceHub;
