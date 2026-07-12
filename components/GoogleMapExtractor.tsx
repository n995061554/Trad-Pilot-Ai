
import React, { useState, useEffect } from 'react';
import { MapLead, Page } from '../types';
import { generateMapResponse, generateCreativeAiResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { GenerateContentResponse } from '@google/genai';
import { BackArrowIcon, WalletIcon, DownloadIcon } from './icons';

const SEARCH_CHARGE = 0.20;
const FREE_LIMIT = 10;

interface GoogleMapExtractorProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
    isPremium: boolean;
    walletBalance: number;
    onDeductWallet: (amount: number) => boolean;
    onRechargeClick: () => void;
}

const GoogleMapExtractor: React.FC<GoogleMapExtractorProps> = ({ t, setActivePage, isPremium, walletBalance, onDeductWallet, onRechargeClick }) => {
    const [query, setQuery] = useState('Spice Importers');
    const [location, setLocation] = useState('Dubai');
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);
    const [structuredParties, setStructuredParties] = useState<any[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [dailySearchCount, setDailySearchCount] = useState(0);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = localStorage.getItem('map_search_date');
        if (lastDate === today) {
            setDailySearchCount(Number(localStorage.getItem('map_search_count') || '0'));
        } else {
            localStorage.setItem('map_search_date', today);
            localStorage.setItem('map_search_count', '0');
            setDailySearchCount(0);
        }

        navigator.geolocation.getCurrentPosition(
            (position) => setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            (err) => {
                console.warn("Geolocation denied. Fallback used.", err);
                setUserLocation({ latitude: 20.5937, longitude: 78.9629 });
            }
        );
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
        localStorage.setItem('map_search_count', String(newCount));
    };

    const findLeads = async () => {
        if (!userLocation) {
            setError("User location is not available.");
            return;
        }
        setError(null);
        if (!checkAndCharge()) return;

        setIsLoading(true);
        setResponse(null);
        setStructuredParties([]);
        setSelectedLeads([]);

        const prompt = `Find exactly 10 business listings for "${query}" in "${location}". 
        Provide a detailed market analysis summary of the sector in this region.
        THEN, provide a JSON array of exactly 10 objects representing the parties found. 
        Each object MUST have: "name", "address", "phone", "email" (if available), "rating", "website".
        Format: Return the summary text first, then the JSON block.`;

        try {
            const result = await generateMapResponse(prompt, userLocation);
            setResponse(result);
            
            const text = result.text || "";
            const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
            if (jsonMatch) {
                try {
                    const parsed = JSON.parse(jsonMatch[0]);
                    setStructuredParties(parsed);
                } catch (e) {
                    console.error("Failed to parse party JSON", e);
                }
            }
            
            updateSearchCount();
        } catch (e) {
            console.error("Failed to get map response:", e);
            setError("The search failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectLead = (index: number) => {
        setSelectedLeads(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLeads(structuredParties.map((_, i) => i));
        } else {
            setSelectedLeads([]);
        }
    };

    const handleDownloadCSV = () => {
        const dataToExport = selectedLeads.length > 0 
            ? structuredParties.filter((_, i) => selectedLeads.includes(i))
            : structuredParties;

        if (dataToExport.length === 0) return;

        const headers = ["Name", "Address", "Phone Number", "Email Address", "Website", "Rating"];
        const csvRows = [
            headers.join(','),
            ...dataToExport.map(party => [
                `"${party.name || 'N/A'}"`,
                `"${party.address || 'N/A'}"`,
                `"${party.phone || 'N/A'}"`,
                `"${party.email || 'N/A'}"`,
                `"${party.website || 'N/A'}"`,
                party.rating || 'N/A'
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Map_Leads_Report_${Date.now()}.csv`);
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
                        <h1 className="text-3xl font-bold text-text-primary">Map Extractor</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 ${isNextSearchCharged ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                           <WalletIcon className="w-4 h-4" />
                           {isPremium ? 'Premium: Unlimited' : isNextSearchCharged ? `Next Search: ₹${SEARCH_CHARGE}` : `Next Search: FREE (${FREE_LIMIT - dailySearchCount}/${FREE_LIMIT})`}
                        </div>
                    </div>
                </div>
                <p className="text-md text-text-secondary">Extract leads with location intelligence. Only 10 results per search.</p>
            </header>

            <div className="bg-primary p-6 rounded-lg shadow-lg mb-6">
                <form onSubmit={(e) => { e.preventDefault(); findLeads(); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Search Query</label>
                        <input value={query} onChange={(e) => setQuery(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="e.g., Rice Wholesalers" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Location</label>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="e.g., New York" required />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || !userLocation || isSearchLocked} 
                        className={`w-full font-bold py-2 px-4 rounded-lg transition h-10 text-sm ${isSearchLocked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-brand text-primary hover:bg-opacity-80'}`}
                    >
                        {isLoading ? <LoadingSpinner /> : isSearchLocked ? `Locked (Recharge ₹${SEARCH_CHARGE})` : isNextSearchCharged ? `Search (₹${SEARCH_CHARGE})` : `Search (Free Search ${dailySearchCount + 1}/${FREE_LIMIT})`}
                    </button>
                </form>
            </div>

            {isLoading && <div className="text-center py-10"><LoadingSpinner /></div>}
            {error && <div className="text-center p-8"><p className="text-red-400 mb-4">{error}</p><button onClick={onRechargeClick} className="text-brand hover:underline font-bold">Recharge Wallet Now</button></div>}

            {!isLoading && response && (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-primary p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Market Analysis</h2>
                            <div className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: response.text?.split(/\[\s*\{/)[0]?.replace(/\n/g, '<br />') || '' }} />
                        </div>
                        <div className="bg-primary p-6 rounded-lg shadow-lg">
                             <h2 className="text-xl font-semibold text-text-primary mb-4">Location Data Sources</h2>
                             <div className="space-y-3">
                                {response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk, index) => (
                                    <div key={index} className="bg-secondary p-3 rounded-md">
                                        <a href={chunk.maps?.uri} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">{index + 1}. {chunk.maps?.title}</a>
                                        {chunk.maps?.placeAnswerSources?.[0]?.address && <p className="text-sm text-text-secondary mt-1">{chunk.maps.placeAnswerSources[0].address}</p>}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                    
                    {structuredParties.length > 0 && (
                        <div className="bg-primary p-6 rounded-lg shadow-lg border border-brand/20">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text-primary">Business Contacts Found</h2>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="sel-all-map"
                                        className="h-5 w-5 rounded bg-accent border-highlight text-brand"
                                        checked={selectedLeads.length === structuredParties.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="sel-all-map" className="text-xs font-bold text-text-secondary">Select All</label>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-accent">
                                            <th className="p-3 w-10"></th>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Phone</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Website</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {structuredParties.map((party, i) => (
                                            <tr key={i} className={`border-b border-accent/50 hover:bg-accent/20 ${selectedLeads.includes(i) ? 'bg-brand/10' : ''}`}>
                                                <td className="p-3">
                                                    <input type="checkbox" checked={selectedLeads.includes(i)} onChange={() => handleSelectLead(i)} className="h-4 w-4 rounded bg-accent border-highlight text-brand" />
                                                </td>
                                                <td className="p-3 font-semibold text-brand">{party.name}</td>
                                                <td className="p-3 text-text-secondary">{party.phone || 'N/A'}</td>
                                                <td className="p-3 text-text-secondary">{party.email || 'N/A'}</td>
                                                <td className="p-3"><a href={party.website} target="_blank" className="text-blue-400 hover:underline truncate inline-block max-w-[150px]">{party.website || 'N/A'}</a></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {structuredParties.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-primary p-3 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-brand/30 animate-fadeInUp backdrop-blur-md">
                         <p className="text-text-primary font-bold px-2">{selectedLeads.length} Leads Selected</p>
                         <button
                            onClick={handleDownloadCSV}
                            className="flex items-center gap-2 bg-brand text-primary font-black py-2 px-8 rounded-xl hover:bg-opacity-80 transition shadow-lg shadow-brand/20 uppercase tracking-widest text-xs"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            Download Selected Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoogleMapExtractor;
