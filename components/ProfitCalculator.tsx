
import React, { useState, useMemo } from 'react';
import { translations, Currency } from '../translations';
import { Page } from '../types';
import { BackArrowIcon } from './icons';

interface CalcState {
  productName: string;
  buyerCountry: string;
  quantityMT: number;
  sellingPricePerMT: number;
  purchasePricePerMT: number;
  inlandTransport: number;
  freight: number;
  documentation: number;
  packaging: number;
  bankCharges: number;
  miscellaneous: number;
}

const initialState: CalcState = {
  productName: 'Onion Powder',
  buyerCountry: 'UAE',
  quantityMT: 10,
  sellingPricePerMT: 120000,
  purchasePricePerMT: 95000,
  inlandTransport: 15000,
  freight: 40000,
  documentation: 5000,
  packaging: 10000,
  bankCharges: 8000,
  miscellaneous: 7000,
};

interface ProfitCalculatorProps {
    t: (key: keyof typeof translations.en) => string;
    currency: Currency;
    setActivePage: (page: Page) => void;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ t, currency, setActivePage }) => {
    const [data, setData] = useState<CalcState>(initialState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const formatCurrency = (value: number) => `${currency.symbol}${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const calculations = useMemo(() => {
        const totalSellingValue = data.quantityMT * data.sellingPricePerMT;
        const totalPurchaseCost = data.quantityMT * data.purchasePricePerMT;
        const totalOtherCosts = 
            data.inlandTransport +
            data.freight +
            data.documentation +
            data.packaging +
            data.bankCharges +
            data.miscellaneous;
        const totalCostOfShipment = totalPurchaseCost + totalOtherCosts;
        const netProfit = totalSellingValue - totalCostOfShipment;
        const profitMargin = totalSellingValue > 0 ? (netProfit / totalSellingValue) * 100 : 0;
        
        return { totalSellingValue, totalCostOfShipment, netProfit, profitMargin };
    }, [data]);
    
    const marginColor = useMemo(() => {
        if (calculations.profitMargin >= 15) return 'text-green-400';
        if (calculations.profitMargin >= 10) return 'text-yellow-400';
        return 'text-red-400';
    }, [calculations.profitMargin]);
    
    const InputField = ({ labelKey, name, type = 'text' }: { labelKey: keyof typeof translations.en, name: keyof CalcState, type?: string }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{t(labelKey)}</label>
            <input
                type={type}
                name={name}
                id={name}
                value={data[name]}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
            />
        </div>
    );
    
     const CurrencyInputField = ({ labelKey, name }: { labelKey: keyof typeof translations.en, name: keyof CalcState }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{t(labelKey)} ({currency.symbol})</label>
             <input
                type="number"
                name={name}
                id={name}
                value={data[name]}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-sm"
            />
        </div>
    );

    return (
        <div>
            <header className="mb-8">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                    <BackArrowIcon />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('profitCalculator')}</h1>
                <p className="text-md text-text-secondary">{t('profitCalculatorSubheading')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Inputs Column */}
                <div className="lg:col-span-3 bg-primary p-6 rounded-lg shadow-lg space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-4">{t('shipmentDetails')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField labelKey="productName" name="productName" />
                            <InputField labelKey="buyerCountry" name="buyerCountry" />
                            <InputField labelKey="quantityMT" name="quantityMT" type="number" />
                        </div>
                    </div>
                     <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-4">{t('pricingDetails')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <CurrencyInputField labelKey="sellingPricePerMT" name="sellingPricePerMT" />
                           <CurrencyInputField labelKey="purchasePricePerMT" name="purchasePricePerMT" />
                        </div>
                    </div>
                     <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-4">{t('costBreakdown')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           <CurrencyInputField labelKey="inlandTransport" name="inlandTransport" />
                           <CurrencyInputField labelKey="freight" name="freight" />
                           <CurrencyInputField labelKey="documentation" name="documentation" />
                           <CurrencyInputField labelKey="packaging" name="packaging" />
                           <CurrencyInputField labelKey="bankCharges" name="bankCharges" />
                           <CurrencyInputField labelKey="miscellaneous" name="miscellaneous" />
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2">
                     <div className="bg-primary p-6 rounded-lg shadow-lg self-start sticky top-8">
                        <h2 className="text-xl font-semibold mb-4 text-text-primary">{t('calculationResults')}</h2>
                        <div className="bg-secondary p-4 rounded-lg space-y-3">
                            <div className="flex justify-between items-center text-md">
                                <span className="text-text-secondary">{t('totalSellingValue')}:</span>
                                <span className="font-bold text-text-primary">{formatCurrency(calculations.totalSellingValue)}</span>
                            </div>
                             <div className="flex justify-between items-center text-md">
                                <span className="text-text-secondary">{t('totalCostOfShipment')}:</span>
                                <span className="font-bold text-text-primary">{formatCurrency(calculations.totalCostOfShipment)}</span>
                            </div>
                            <hr className="border-accent my-2"/>
                            <div className="flex justify-between items-center text-2xl">
                                <span className="text-text-primary font-semibold">{t('netProfit')}:</span>
                                <span className={`font-bold ${calculations.netProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(calculations.netProfit)}
                                </span>
                            </div>
                             <div className="flex justify-between items-center text-2xl">
                                <span className="text-text-primary font-semibold">{t('profitMargin')}:</span>
                                <span className={`font-bold ${marginColor}`}>
                                    {calculations.profitMargin.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm p-2 bg-accent rounded-md">
                            <p className="font-semibold text-text-primary">{t('targetMarginIndicator')}</p>
                            <div className="w-full bg-primary rounded-full h-2.5 mt-2">
                                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2.5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitCalculator;
