
import React from 'react';
import { Page } from '../types';
import { ConsignmentIcon, MarketIcon, RiskIcon, BuyerFinderIcon, SupplierFinderIcon, OEMFinderIcon, StudyGuideIcon, ResourceHubIcon, CampaignManagerIcon, MapExtractorIcon, GoalPlannerIcon, CalculatorIcon, DownloadIcon, WalletIcon } from './icons';
import { translations } from '../translations';

interface DashboardProps {
    setActivePage: (page: Page) => void;
    t: (key: keyof typeof translations.en) => string;
    walletBalance: number;
    onRechargeClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage, t, walletBalance, onRechargeClick }) => {
    const quickLinks = [
        { page: 'study-guide', icon: <StudyGuideIcon />, title: 'Foundation Study Guide', description: 'Learn the step-by-step export blueprint.' },
        { page: 'market-intel', icon: <MarketIcon />, title: 'Market Intelligence', description: 'Find high-margin products and target countries.' },
        { page: 'resource-hub', icon: <ResourceHubIcon />, title: 'Expo-Operations', description: 'Find suppliers, logistics, compliance info, and embassy contacts.' },
        { page: 'buyer-finder', icon: <BuyerFinderIcon />, title: 'Buyer Finder', description: 'Search for genuine international buyer leads.' },
        { page: 'supplier-finder', icon: <SupplierFinderIcon />, title: 'Supplier Finder', description: 'Search for reliable domestic suppliers and manufacturers.' },
        { page: 'oem-finder', icon: <OEMFinderIcon />, title: 'OEM Finder', description: 'Find manufacturers for private labeling your products.' },
        { page: 'map-extractor', icon: <MapExtractorIcon />, title: 'Google Map Extractor', description: 'Extract business leads with address, phone, and website from any location.' },
        { page: 'campaign-manager', icon: <CampaignManagerIcon />, title: 'Com-Party', description: 'Manage contacts and generate outreach messages.' },
        { page: 'goal-planner', icon: <GoalPlannerIcon />, title: 'Financial Goal Planner', description: 'Set your annual profit goal and see the required revenue and shipments.' },
        { page: 'profit-calculator', icon: <CalculatorIcon />, title: 'Profit Calculator', description: 'Calculate the exact profit for a shipment before you commit.' },
        { page: 'shipment-experience', icon: <ConsignmentIcon />, title: 'Ship-Experience', description: 'Plan a full export shipment from start to finish with live profit calculation.' },
        { page: 'risk', icon: <RiskIcon />, title: 'Risk Analysis', description: 'Verify buyers and avoid common pitfalls.' },
    ] as const;

    return (
        <div className="animate-fadeIn">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        <span className="text-text-primary">Welcome to </span>
                        <span className="text-brand">Trade</span>{' '}
                        <span className="text-orange-500">X</span>{' '}
                        <span className="text-brand">Cloud</span>
                    </h1>
                    <p className="text-lg text-text-secondary font-medium">Your AI-powered guide to building a successful export business.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {quickLinks.map(link => (
                    <button 
                        key={link.page} 
                        onClick={() => setActivePage(link.page)}
                        className="bg-primary p-6 rounded-lg shadow-lg hover:shadow-brand/20 hover:-translate-y-1 transition-all duration-300 text-left border border-accent/10"
                    >
                        <div className="text-brand mb-3">{link.icon}</div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">{link.title}</h3>
                        <p className="text-text-secondary text-sm">{link.description}</p>
                    </button>
                ))}
            </div>

            <div className="bg-primary p-6 rounded-lg shadow-lg border border-accent/10">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Your 90-Day Export Launch Roadmap</h2>
                <div className="relative">
                    <div className="absolute left-4 sm:left-1/2 top-4 bottom-0 w-0.5 bg-accent"></div>
                    <div className="relative mb-8 flex flex-col sm:flex-row items-center">
                        <div className="z-10 bg-brand text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                        <div className="sm:ml-8 mt-4 sm:mt-0 p-4 bg-accent rounded-lg sm:w-2/5">
                            <h3 className="font-bold text-text-primary">Phase 1 (Days 1-30): Foundation</h3>
                            <p className="text-sm text-text-secondary">Get IEC, open bank account, join EPC, finalize products and suppliers.</p>
                        </div>
                    </div>
                    <div className="relative mb-8 flex flex-col sm:flex-row-reverse items-center text-left sm:text-right">
                         <div className="z-10 bg-brand text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                        <div className="sm:mr-8 mt-4 sm:mt-0 p-4 bg-accent rounded-lg sm:w-2/5">
                            <h3 className="font-bold text-text-primary">Phase 2 (Days 31-60): Buyer Acquisition</h3>
                            <p className="text-sm text-text-secondary">Find 100+ buyers, send emails and samples, start negotiations.</p>
                        </div>
                    </div>
                    <div className="relative flex flex-col sm:flex-row items-center">
                        <div className="z-10 bg-brand text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                        <div className="sm:ml-8 mt-4 sm:mt-0 p-4 bg-accent rounded-lg sm:w-2/5">
                            <h3 className="font-bold text-text-primary">Phase 3 (Days 61-90): Closing The Deal</h3>
                            <p className="text-sm text-text-secondary">Finalize terms, book freight, dispatch first shipment, and aim for repeat orders.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
