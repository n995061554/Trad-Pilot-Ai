import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { 
    ConsignmentIcon, 
    MarketIcon, 
    RiskIcon, 
    BuyerFinderIcon, 
    SupplierFinderIcon, 
    OEMFinderIcon, 
    StudyGuideIcon, 
    ResourceHubIcon, 
    CampaignManagerIcon, 
    MapExtractorIcon, 
    GoalPlannerIcon, 
    CalculatorIcon, 
    CertificateIcon 
} from './icons';
import { translations } from '../translations';

interface DashboardProps {
    setActivePage: (page: Page) => void;
    t: (key: keyof typeof translations.en) => string;
    walletBalance: number;
    onRechargeClick: () => void;
}

interface BookedShipment {
    id: number;
    date: string;
    productName: string;
    buyerName: string;
    buyerCountry: string;
    quantityMT: number;
    sellingPricePerMT: number;
    purchasePricePerMT: number;
    status: string;
}

interface ComplianceTask {
    id: number;
    task: string;
    status: 'Pending' | 'Completed';
    product: string;
    country: string;
}

interface CampaignContact {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    type: 'Buyer' | 'Supplier' | 'OEM';
    product?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage, t, walletBalance, onRechargeClick }) => {
    const [shipments, setShipments] = useState<BookedShipment[]>([]);
    const [leads, setLeads] = useState<CampaignContact[]>([]);
    const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>([]);
    const [activeDetailTab, setActiveDetailTab] = useState<'none' | 'shipments' | 'leads' | 'compliance'>('none');

    // Quick add state for compliance task
    const [newComplianceText, setNewComplianceText] = useState('');
    const [newComplianceProduct, setNewComplianceProduct] = useState('Spices');

    useEffect(() => {
        // 1. Initialize Booked Shipments from localStorage (or defaults)
        const savedShipments = localStorage.getItem('bookedConsignments');
        let initialShipments: BookedShipment[] = [];
        if (savedShipments) {
            initialShipments = JSON.parse(savedShipments);
        } else {
            initialShipments = [
                { id: 1, date: '2026-06-15', productName: 'Basmati Rice', buyerName: 'Gulf Food Traders', buyerCountry: 'UAE', quantityMT: 20, sellingPricePerMT: 120000, purchasePricePerMT: 95000, status: 'In Transit' },
                { id: 2, date: '2026-07-01', productName: 'Turmeric Powder', buyerName: 'SpiceHub Ltd', buyerCountry: 'USA', quantityMT: 15, sellingPricePerMT: 135000, purchasePricePerMT: 105000, status: 'Departed Port' },
                { id: 3, date: '2026-07-10', productName: 'Dehydrated Onion Powder', buyerName: 'EuroFoods Import', buyerCountry: 'Germany', quantityMT: 10, sellingPricePerMT: 150000, purchasePricePerMT: 115000, status: 'Customs Cleared' },
            ];
            localStorage.setItem('bookedConsignments', JSON.stringify(initialShipments));
        }
        setShipments(initialShipments);

        // 2. Initialize Active Leads from localStorage (or defaults)
        const savedLeads = localStorage.getItem('campaignContactList');
        let initialLeads: CampaignContact[] = [];
        if (savedLeads) {
            initialLeads = JSON.parse(savedLeads);
        } else {
            initialLeads = [
                { id: 1, companyName: 'Global Foods Inc.', contactPerson: 'John Doe', email: 'john.d@globalfoods.com', phone: '+12025550174', country: 'USA', type: 'Buyer', product: 'Basmati Rice' },
                { id: 2, companyName: 'Euro Spices Co.', contactPerson: 'Jane Smith', email: 'jane.s@eurospices.co.uk', phone: '+442079460958', country: 'UK', type: 'Buyer', product: 'Turmeric Powder' },
                { id: 3, companyName: 'Al-Farooq Trading', contactPerson: 'Ahmad Al-Subai', email: 'ahmad@alfarooq.ae', phone: '+97145550123', country: 'UAE', type: 'Buyer', product: 'Basmati Rice' },
                { id: 4, companyName: 'Spice Route Exporters', contactPerson: 'Ramesh Kumar', email: 'ramesh@spiceroute.in', phone: '+919876543210', country: 'India', type: 'Supplier', product: 'Turmeric Powder' },
                { id: 5, companyName: 'Agro Organics India', contactPerson: 'Sanjay Patel', email: 'sanjay@agroorganics.com', phone: '+919988776655', country: 'India', type: 'OEM', product: 'Onion Powder' }
            ];
            localStorage.setItem('campaignContactList', JSON.stringify(initialLeads));
        }
        setLeads(initialLeads);

        // 3. Initialize Pending Compliance Tasks from localStorage (or defaults)
        const savedCompliance = localStorage.getItem('pendingComplianceTasks');
        let initialCompliance: ComplianceTask[] = [];
        if (savedCompliance) {
            initialCompliance = JSON.parse(savedCompliance);
        } else {
            initialCompliance = [
                { id: 1, task: 'APEDA Registration for Basmati Rice (UAE)', status: 'Pending', product: 'Basmati Rice', country: 'UAE' },
                { id: 2, task: 'FSSAI Export License Approval (USA Spices)', status: 'Pending', product: 'Turmeric Powder', country: 'USA' },
                { id: 3, task: 'Phytosanitary Inspection Certificate (Onion Germany)', status: 'Completed', product: 'Onion Powder', country: 'Germany' },
                { id: 4, task: 'Customs Duty Verification Check (Germany)', status: 'Pending', product: 'Onion Powder', country: 'Germany' },
                { id: 5, task: 'Shipping Bill Filing with Customs (UAE)', status: 'Completed', product: 'Basmati Rice', country: 'UAE' },
            ];
            localStorage.setItem('pendingComplianceTasks', JSON.stringify(initialCompliance));
        }
        setComplianceTasks(initialCompliance);
    }, []);

    const toggleComplianceTask = (taskId: number) => {
        const updated = complianceTasks.map(t => {
            if (t.id === taskId) {
                return { ...t, status: (t.status === 'Pending' ? 'Completed' : 'Pending') as 'Pending' | 'Completed' };
            }
            return t;
        });
        setComplianceTasks(updated);
        localStorage.setItem('pendingComplianceTasks', JSON.stringify(updated));
    };

    const handleAddComplianceTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComplianceText.trim()) return;

        const newTask: ComplianceTask = {
            id: Date.now(),
            task: newComplianceText.trim(),
            status: 'Pending',
            product: newComplianceProduct,
            country: 'Global'
        };
        const updated = [newTask, ...complianceTasks];
        setComplianceTasks(updated);
        localStorage.setItem('pendingComplianceTasks', JSON.stringify(updated));
        setNewComplianceText('');
    };

    const pendingComplianceCount = complianceTasks.filter(t => t.status === 'Pending').length;

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
            {/* Header Section */}
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

            {/* Interactive Summary Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="dashboard-statistics">
                {/* Stat 1: Total Shipments */}
                <button 
                    onClick={() => setActiveDetailTab(activeDetailTab === 'shipments' ? 'none' : 'shipments')}
                    className={`bg-primary p-6 rounded-xl shadow-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex items-center justify-between ${
                        activeDetailTab === 'shipments' ? 'border-brand ring-2 ring-brand/20' : 'border-accent/10 hover:border-brand/40'
                    }`}
                >
                    <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider font-extrabold mb-1">Total Shipments</p>
                        <h3 className="text-4xl font-black text-text-primary tracking-tight">{shipments.length}</h3>
                        <p className="text-xs text-brand/80 mt-2 font-medium">Click to view active bookings</p>
                    </div>
                    <div className="text-brand opacity-80 bg-brand/10 p-4 rounded-xl">
                        <ConsignmentIcon className="w-8 h-8" />
                    </div>
                </button>

                {/* Stat 2: Active Leads */}
                <button 
                    onClick={() => setActiveDetailTab(activeDetailTab === 'leads' ? 'none' : 'leads')}
                    className={`bg-primary p-6 rounded-xl shadow-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex items-center justify-between ${
                        activeDetailTab === 'leads' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-accent/10 hover:border-emerald-500/40'
                    }`}
                >
                    <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider font-extrabold mb-1">Active Leads</p>
                        <h3 className="text-4xl font-black text-text-primary tracking-tight">{leads.length}</h3>
                        <p className="text-xs text-emerald-500/80 mt-2 font-medium">Click to view outreach targets</p>
                    </div>
                    <div className="text-emerald-500 opacity-80 bg-emerald-500/10 p-4 rounded-xl">
                        <BuyerFinderIcon className="w-8 h-8" />
                    </div>
                </button>

                {/* Stat 3: Pending Compliance */}
                <button 
                    onClick={() => setActiveDetailTab(activeDetailTab === 'compliance' ? 'none' : 'compliance')}
                    className={`bg-primary p-6 rounded-xl shadow-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden flex items-center justify-between ${
                        activeDetailTab === 'compliance' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-accent/10 hover:border-orange-500/40'
                    }`}
                >
                    <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider font-extrabold mb-1">Pending Compliance</p>
                        <h3 className="text-4xl font-black text-text-primary tracking-tight">{pendingComplianceCount}</h3>
                        <p className="text-xs text-orange-500/80 mt-2 font-medium">Click to complete checklists</p>
                    </div>
                    <div className="text-orange-500 opacity-80 bg-orange-500/10 p-4 rounded-xl">
                        <CertificateIcon className="w-8 h-8" />
                    </div>
                </button>
            </div>

            {/* Interactive Stats Details Viewer */}
            {activeDetailTab !== 'none' && (
                <div className="bg-primary p-6 rounded-xl shadow-xl border border-accent/20 mb-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-4 border-b border-accent/20 pb-4">
                        <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                            {activeDetailTab === 'shipments' && (
                                <>
                                    <span className="w-3 h-3 rounded-full bg-brand"></span>
                                    Registered Shipments & Bookings
                                </>
                            )}
                            {activeDetailTab === 'leads' && (
                                <>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    Consolidated Leads Directory
                                </>
                            )}
                            {activeDetailTab === 'compliance' && (
                                <>
                                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                                    Interactive Export Compliance Board
                                </>
                            )}
                        </h3>
                        <button 
                            onClick={() => setActiveDetailTab('none')}
                            className="text-xs text-text-secondary hover:text-text-primary bg-accent/20 px-3 py-1.5 rounded-lg transition"
                        >
                            Close Drawer
                        </button>
                    </div>

                    {/* Shipments Detail Content */}
                    {activeDetailTab === 'shipments' && (
                        <div className="overflow-x-auto">
                            {shipments.length === 0 ? (
                                <p className="text-sm text-text-secondary py-4">No shipments booked yet. Go to Ship-Experience to start planning.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-accent/10">
                                    <thead>
                                        <tr className="text-left text-xs font-bold text-text-secondary uppercase">
                                            <th className="py-2">Date</th>
                                            <th className="py-2">Product</th>
                                            <th className="py-2">Buyer</th>
                                            <th className="py-2">Country</th>
                                            <th className="py-2 text-right">Volume</th>
                                            <th className="py-2 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-accent/5 text-sm">
                                        {shipments.map(s => (
                                            <tr key={s.id} className="hover:bg-accent/5">
                                                <td className="py-3 font-mono text-xs">{s.date}</td>
                                                <td className="py-3 font-semibold text-text-primary">{s.productName}</td>
                                                <td className="py-3 text-text-secondary">{s.buyerName}</td>
                                                <td className="py-3">{s.buyerCountry}</td>
                                                <td className="py-3 text-right font-mono">{s.quantityMT} MT</td>
                                                <td className="py-3 text-center">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand">
                                                        {s.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => setActivePage('shipment-experience')}
                                    className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-85 transition text-xs uppercase tracking-wider"
                                >
                                    Book New Shipment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Leads Detail Content */}
                    {activeDetailTab === 'leads' && (
                        <div className="overflow-x-auto">
                            {leads.length === 0 ? (
                                <p className="text-sm text-text-secondary py-4">No leads saved in directory. Use Buyer Finder or Supplier Finder to retrieve leads.</p>
                            ) : (
                                <table className="min-w-full divide-y divide-accent/10">
                                    <thead>
                                        <tr className="text-left text-xs font-bold text-text-secondary uppercase">
                                            <th className="py-2">Company</th>
                                            <th className="py-2">Contact Person</th>
                                            <th className="py-2">Product/Category</th>
                                            <th className="py-2">Country</th>
                                            <th className="py-2 text-center">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-accent/5 text-sm">
                                        {leads.map(l => (
                                            <tr key={l.id} className="hover:bg-accent/5">
                                                <td className="py-3 font-semibold text-text-primary">{l.companyName}</td>
                                                <td className="py-3 text-text-secondary">{l.contactPerson}</td>
                                                <td className="py-3 text-xs">{l.product || 'General'}</td>
                                                <td className="py-3">{l.country}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                                                        l.type === 'Buyer' ? 'bg-blue-500/10 text-blue-400' :
                                                        l.type === 'Supplier' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-purple-500/10 text-purple-400'
                                                    }`}>
                                                        {l.type}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => setActivePage('campaign-manager')}
                                    className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-500 transition text-xs uppercase tracking-wider"
                                >
                                    Launch Outreach Campaign
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Compliance Detail Content */}
                    {activeDetailTab === 'compliance' && (
                        <div>
                            {/* Fast Add Compliance Task Form */}
                            <form onSubmit={handleAddComplianceTask} className="flex flex-col sm:flex-row gap-4 mb-6 bg-accent/20 p-4 rounded-xl border border-accent/30">
                                <div className="flex-grow">
                                    <label className="block text-xs font-extrabold uppercase text-text-secondary mb-1">New Compliance Requirement</label>
                                    <input 
                                        type="text" 
                                        value={newComplianceText}
                                        onChange={(e) => setNewComplianceText(e.target.value)}
                                        placeholder="e.g., File Phytosanitary application with regional officer"
                                        className="w-full bg-primary border border-accent/40 rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="block text-xs font-extrabold uppercase text-text-secondary mb-1">Related Product</label>
                                    <select 
                                        value={newComplianceProduct}
                                        onChange={(e) => setNewComplianceProduct(e.target.value)}
                                        className="w-full bg-primary border border-accent/40 rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        <option value="Basmati Rice">Basmati Rice</option>
                                        <option value="Turmeric Powder">Turmeric Powder</option>
                                        <option value="Onion Powder">Onion Powder</option>
                                        <option value="General Spices">General Spices</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button 
                                        type="submit"
                                        className="w-full sm:w-auto bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-500 transition text-xs uppercase tracking-wider"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-3">
                                {complianceTasks.map(t => (
                                    <div 
                                        key={t.id} 
                                        className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                                            t.status === 'Completed' ? 'bg-accent/10 border-accent/10 opacity-70' : 'bg-secondary border-orange-500/10 hover:border-orange-500/20'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input 
                                                type="checkbox" 
                                                checked={t.status === 'Completed'}
                                                onChange={() => toggleComplianceTask(t.id)}
                                                className="mt-1 h-5 w-5 rounded bg-primary border-accent/40 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                            />
                                            <div>
                                                <p className={`font-semibold text-sm ${t.status === 'Completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                                    {t.task}
                                                </p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] font-bold bg-accent/30 text-text-secondary px-2 py-0.5 rounded">
                                                        Product: {t.product}
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-accent/30 text-text-secondary px-2 py-0.5 rounded">
                                                        Country: {t.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                            t.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Navigation Links */}
            <h2 className="text-2xl font-bold text-text-primary mb-4">Export Tools Workspace</h2>
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

            {/* Roadmap */}
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
