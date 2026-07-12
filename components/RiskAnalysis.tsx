
import React, { useState, useCallback, useEffect } from 'react';
import { generateAiResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { translations } from '../translations';
import { ShieldCheckIcon, AlertTriangleIcon, BackArrowIcon } from './icons';
import { Page } from '../types';

interface RiskAnalysisProps {
    t: (key: keyof typeof translations.en) => string;
    setActivePage: (page: Page) => void;
}

const verificationChecklist = [
    {
        id: 'website',
        title: 'Website & Online Presence',
        description: 'Do they have a professional website and social media presence (e.g., LinkedIn)? Check for a proper domain name (not @gmail.com), consistent branding, and up-to-date information. A weak or non-existent online presence is a major warning sign.'
    },
    {
        id: 'registration',
        title: 'Company Registration',
        description: 'Ask for their official company registration number. Use online government or business registries in their country to verify that the company is legally registered and active. This confirms they are a legitimate entity.'
    },
    {
        id: 'address',
        title: 'Physical Address Verification',
        description: 'Use Google Maps and Street View to check their listed address. Is it a legitimate commercial building, warehouse, or office? Or is it a residential address, a vacant lot, or a mail forwarding service?'
    },
    {
        id: 'tradeReferences',
        title: 'Trade References',
        description: 'Ask for references from other suppliers (preferably from India) they have worked with. Contact these references to confirm their relationship, payment timeliness, and overall experience with the buyer.'
    },
    {
        id: 'bankReferences',
        title: 'Bank References',
        description: 'For large deals, it is acceptable to ask for a reference from their bank. Your bank can help facilitate this communication to verify their financial standing and legitimacy.'
    },
    {
        id: 'communication',
        title: 'Communication Professionalism',
        description: 'Are their emails well-written, with proper grammar and a professional tone? Vague answers, constant excuses, or pressure tactics are red flags. Professional buyers communicate clearly and respectfully.'
    },
    {
        id: 'startSmall',
        title: 'Propose a Trial Order',
        description: 'Suggest a smaller trial order with secure payment terms (e.g., 30-50% advance). A genuine buyer interested in a long-term relationship will often agree to this to test your product and service. Hesitation or refusal is a major concern.'
    }
];

const redFlags = [
    'Unwillingness to provide company registration documents or trade references.',
    'Intense pressure for unsecured credit terms (e.g., 100% against documents) from the very first deal.',
    'Vague, inconsistent, or unprofessional communication (e.g., using personal email addresses).',
    'Listed address appears to be a residential or non-commercial location on Google Maps.',
    'No verifiable online presence or a very new, low-quality website.',
    'Refusal to agree to a smaller, paid trial order to establish trust.'
];


const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ t, setActivePage }) => {
    const [pitfallsResponse, setPitfallsResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'verification' | 'pitfalls'>('verification');
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleCheckboxChange = (id: string) => {
        setCheckedItems(prev => ({...prev, [id]: !prev[id]}));
    };

    const getCommonPitfalls = useCallback(async () => {
        if (pitfallsResponse) return; // Don't re-fetch if we already have the data
        setIsLoading(true);
        const prompt = `Based on the "Reasons for Failure" section of the knowledge base, create a detailed guide on the most common pitfalls for new exporters and, for each pitfall, provide the specific avoidance strategy mentioned in the text. Format the response with clear headings for each pitfall.`;
        const aiResponse = await generateAiResponse(prompt);
        setPitfallsResponse(aiResponse);
        setIsLoading(false);
    }, [pitfallsResponse]);

    const handleTabClick = (tab: 'verification' | 'pitfalls') => {
        setActiveTab(tab);
        if (tab === 'pitfalls') {
            getCommonPitfalls();
        }
    }

    return (
        <div>
            <header className="mb-6">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                  <BackArrowIcon />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">Risk Analysis & Best Practices</h1>
                <p className="text-md text-text-secondary">Learn to protect your business and avoid common mistakes.</p>
            </header>

            <div className="flex border-b border-accent mb-6">
                <button onClick={() => handleTabClick('verification')} className={`px-4 py-2 font-semibold ${activeTab === 'verification' ? 'border-b-2 border-brand text-brand' : 'text-text-secondary'}`}>
                    Buyer Verification Checklist
                </button>
                <button onClick={() => handleTabClick('pitfalls')} className={`px-4 py-2 font-semibold ${activeTab === 'pitfalls' ? 'border-b-2 border-brand text-brand' : 'text-text-secondary'}`}>
                    Common Pitfalls Analysis
                </button>
            </div>
            
            <div className="bg-primary p-6 rounded-lg shadow-lg">
                {activeTab === 'verification' && (
                    <div className="space-y-4">
                        {verificationChecklist.map(item => (
                            <div key={item.id} className="bg-secondary p-4 rounded-lg flex items-start gap-4 transition-all duration-300">
                                <input 
                                    type="checkbox" 
                                    id={item.id} 
                                    checked={!!checkedItems[item.id]}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="mt-1 h-5 w-5 rounded bg-accent border-highlight text-brand focus:ring-brand cursor-pointer flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <label htmlFor={item.id} className={`font-semibold text-lg cursor-pointer ${checkedItems[item.id] ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                        {item.title}
                                    </label>
                                    <p className={`text-sm mt-1 ${checkedItems[item.id] ? 'text-gray-500' : 'text-text-secondary'}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="mt-12 pt-8 border-t-2 border-red-500/20">
                             <div className="flex items-center gap-3 mb-8">
                                <div className="bg-red-600 text-white p-3 rounded-2xl shadow-xl shadow-red-600/20 animate-pulse">
                                    <AlertTriangleIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-red-500 uppercase tracking-tighter italic leading-none">
                                        CRITICAL RED FLAGS
                                    </h3>
                                    <p className="text-xs text-red-600/70 font-bold uppercase tracking-[0.2em] mt-1">High-Risk Behavior Patterns</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {redFlags.map((flag, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 bg-red-600/[0.03] rounded-3xl border border-red-600/20 hover:border-red-600/40 hover:bg-red-600/[0.07] transition-all duration-300 group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-text-primary font-bold leading-relaxed tracking-tight group-hover:text-red-500 transition-colors">
                                            {flag}
                                        </p>
                                    </div>
                                ))}
                             </div>
                             <div className="mt-10 p-6 bg-gradient-to-r from-red-600/10 to-transparent rounded-2xl border-l-4 border-red-600">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <p className="text-sm text-red-400 font-black uppercase tracking-widest leading-relaxed">
                                        Action Protocol: If a potential partner exhibits 2 or more of these signs, escalate verification or cease communication immediately.
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
                {activeTab === 'pitfalls' && (
                     <>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full min-h-[300px]">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div 
                              className="prose prose-invert max-w-none text-text-secondary whitespace-pre-wrap" 
                              dangerouslySetInnerHTML={{ __html: pitfallsResponse.replace(/\n/g, '<br />') }}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RiskAnalysis;
