
import React, { useState, useMemo } from 'react';
import { Consignment, Page } from '../types';
import { generateCreativeAiResponse } from '../services/geminiService';
import { AiIcon, BackArrowIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { translations, Currency } from '../translations';

const initialConsignment: Consignment = {
  productName: 'Basmati Rice',
  buyerName: 'Gulf Food Traders',
  buyerCountry: 'UAE',
  quantityMT: 20,
  sellingPricePerMT: 120000,
  purchasePricePerMT: 95000,
  paymentTerms: '30% Advance, 70% on Docs',
  qualityInspectionCost: 8000,
  packagingCost: 15000,
  inlandTransportCost: 20000,
  freightBookingCost: 55000,
  exportDocumentationCost: 6000,
  customsClearanceCost: 7000,
  bankCharges: 9000,
  miscCost: 5000,
};

const steps = [
  { id: 1, name: 'dealBasics', fields: ['productName', 'buyerName', 'buyerCountry', 'quantityMT'] },
  { id: 2, name: 'pricingOrder', fields: ['sellingPricePerMT', 'purchasePricePerMT', 'paymentTerms'] },
  { id: 3, name: 'domesticPrep', fields: ['qualityInspectionCost', 'packagingCost'] },
  { id: 4, name: 'internationalLogistics', fields: ['inlandTransportCost', 'freightBookingCost', 'exportDocumentationCost', 'customsClearanceCost'] },
  { id: 5, name: 'finalReview', fields: ['bankCharges', 'miscCost'] },
] as const;

const FinancialSummary: React.FC<{ consignment: Consignment, currency: Currency }> = ({ consignment, currency }) => {
    const totals = useMemo(() => {
        const totalSellingValue = consignment.quantityMT * consignment.sellingPricePerMT;
        const totalPurchaseCost = consignment.quantityMT * consignment.purchasePricePerMT;
        const totalAdditionalCosts = 
            consignment.qualityInspectionCost +
            consignment.packagingCost +
            consignment.inlandTransportCost +
            consignment.freightBookingCost +
            consignment.exportDocumentationCost +
            consignment.customsClearanceCost +
            consignment.bankCharges +
            consignment.miscCost;
        const totalCostOfShipment = totalPurchaseCost + totalAdditionalCosts;
        const estimatedProfit = totalSellingValue - totalCostOfShipment;
        const profitMargin = totalSellingValue > 0 ? (estimatedProfit / totalSellingValue) * 100 : 0;
        return { totalSellingValue, totalCostOfShipment, estimatedProfit, profitMargin };
    }, [consignment]);
    
    const formatCurrency = (value: number) => `${currency.symbol}${value.toLocaleString('en-IN')}`;

    return (
        <div className="bg-primary p-6 rounded-lg shadow-lg self-start sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Live Financial Summary</h2>
            <div className="bg-secondary p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Total Selling Value:</span>
                    <span className="font-bold text-text-primary">{formatCurrency(totals.totalSellingValue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">Total Shipment Cost:</span>
                    <span className="font-bold text-text-primary">{formatCurrency(totals.totalCostOfShipment)}</span>
                </div>
                <hr className="border-accent my-2"/>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-text-primary font-semibold">Est. Profit:</span>
                    <span className={`font-bold ${totals.estimatedProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(totals.estimatedProfit)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-text-primary font-semibold">Profit Margin:</span>
                    <span className={`font-bold ${totals.profitMargin > 15 ? 'text-green-400' : totals.profitMargin > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {totals.profitMargin.toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ShipmentExperienceProps {
  t: (key: keyof typeof translations.en) => string;
  currency: Currency;
  setActivePage: (page: Page) => void;
}

const ShipmentExperience: React.FC<ShipmentExperienceProps> = ({ t, currency, setActivePage }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [consignment, setConsignment] = useState<Consignment>(initialConsignment);
    const [isLoadingAi, setIsLoadingAi] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConsignment(prev => ({ ...prev, [name]: (e.target.type === 'number' && value) ? Number(value) : value }));
    };

    const getAiSuggestion = async (field: keyof Consignment, friendlyName: string) => {
        setIsLoadingAi(field);
        const prompt = `Provide a realistic cost in Indian Rupees (INR) for "${friendlyName}" for a ${consignment.quantityMT} MT shipment of "${consignment.productName}" going to "${consignment.buyerCountry}". Respond with a single number.`;
        try {
            const response = await generateCreativeAiResponse(prompt, 'gemini-flash-lite-latest');
            const cost = parseInt(response.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(cost)) {
                setConsignment(prev => ({ ...prev, [field]: cost }));
            }
        } catch (e) {
            console.error("AI suggestion failed", e);
        } finally {
            setIsLoadingAi(null);
        }
    };

    const renderStepContent = () => {
        const InputField = ({ label, name, type = 'text', children }: { label: string, name: keyof Consignment, type?: string, children?: React.ReactNode }) => (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
                {children ? (
                    <select
                        name={name}
                        id={name}
                        value={consignment[name]}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        id={name}
                        value={consignment[name]}
                        onChange={handleInputChange}
                        className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                    />
                )}
            </div>
        );

         const CostInputField = ({ label, name }: { label: string, name: keyof Consignment }) => (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-highlight bg-accent text-text-secondary text-sm">{currency.symbol}</span>
                    <input
                        type="number"
                        name={name}
                        id={name}
                        value={consignment[name]}
                        onChange={handleInputChange}
                        className="block w-full bg-accent border-highlight py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => getAiSuggestion(name, label)}
                        disabled={!!isLoadingAi}
                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-highlight bg-highlight text-text-primary hover:bg-brand text-sm"
                    >
                        {isLoadingAi === name ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <AiIcon />}
                    </button>
                </div>
            </div>
        );

        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Enter Product and Buyer Details</h3>
                        <InputField label="Product Name" name="productName" />
                        <InputField label="Buyer Name" name="buyerName" />
                        <InputField label="Buyer Country" name="buyerCountry" />
                        <InputField label="Quantity (in Metric Tons)" name="quantityMT" type="number" />
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Finalize Pricing and Payment Terms</h3>
                        <InputField label={`Selling Price per MT (${currency.symbol}, FOB)`} name="sellingPricePerMT" type="number" />
                        <InputField label={`Purchase Price per MT (${currency.symbol})`} name="purchasePricePerMT" type="number" />
                        <InputField label="Payment Terms" name="paymentTerms">
                            <option>30% Advance, 70% on Docs</option>
                            <option>50% Advance, 50% on Docs</option>
                            <option>LC</option>
                            <option>100% Advance</option>
                        </InputField>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estimate Domestic Preparation Costs</h3>
                        <CostInputField label={`Quality Inspection Cost (${currency.symbol})`} name="qualityInspectionCost" />
                        <CostInputField label={`Packaging & Labeling Cost (${currency.symbol})`} name="packagingCost" />
                    </div>
                );
            case 4:
                 return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estimate Logistics and Documentation Costs</h3>
                        <CostInputField label={`Inland Transport (Factory to Port, ${currency.symbol})`} name="inlandTransportCost" />
                        <CostInputField label={`Freight Booking Cost (${currency.symbol})`} name="freightBookingCost" />
                        <CostInputField label={`Export Documentation Cost (${currency.symbol})`} name="exportDocumentationCost" />
                        <CostInputField label={`Customs Clearance Cost (${currency.symbol})`} name="customsClearanceCost" />
                    </div>
                );
             case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Final Financials and Review</h3>
                         <CostInputField label={`Bank Charges (${currency.symbol})`} name="bankCharges" />
                         <CostInputField label={`Miscellaneous Costs (${currency.symbol})`} name="miscCost" />
                        <div className="bg-secondary p-4 rounded-lg mt-4">
                            <h4 className="text-xl font-bold text-center text-brand mb-2">Final Consignment Summary</h4>
                            <ul className="text-sm space-y-1">
                                {Object.entries(consignment).map(([key, value]) => (
                                    <li key={key} className="flex justify-between">
                                        <span className="text-text-secondary capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                        <span className="text-text-primary font-semibold">{typeof value === 'number' ? `${currency.symbol}${value.toLocaleString('en-IN')}` : value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div>
            <header className="mb-8">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                    <BackArrowIcon />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('shipmentExperience')}</h1>
                <p className="text-md text-text-secondary">{t('shipmentExperienceSubheading')}</p>
            </header>

            <nav aria-label="Progress" className="mb-8">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {steps.map((step, index) => (
                        <li key={step.name} className="md:flex-1">
                            <div className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${currentStep > index ? 'border-brand' : 'border-accent hover:border-highlight'}`}>
                                <span className="text-sm font-medium transition-colors text-text-secondary group-hover:text-text-primary">{t(step.name)}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-primary p-6 rounded-lg shadow-lg">
                    {renderStepContent()}
                </div>

                <div className="lg:col-span-2">
                    <FinancialSummary consignment={consignment} currency={currency} />
                </div>
            </div>
            
            <div className="mt-8 flex justify-between">
                <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1} className="bg-highlight text-text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition disabled:bg-accent disabled:cursor-not-allowed">
                    {t('previous')}
                </button>
                 {currentStep === steps.length ? (
                    <button onClick={() => alert('Consignment Booked! You can now review the details.')} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition">
                        {t('confirmAndBook')}
                    </button>
                ) : (
                    <button onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))} className="bg-brand text-primary font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition">
                        {t('next')}
                    </button>
                )}
            </div>

        </div>
    );
};

export default ShipmentExperience;
