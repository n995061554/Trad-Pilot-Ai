
import React from 'react';
import { useState, useMemo } from 'react';
import { translations, Currency } from '../translations';
import { Page } from '../types';
import { BackArrowIcon } from './icons';

interface GoalPlannerProps {
    t: (key: keyof typeof translations.en) => string;
    currency: Currency;
    setActivePage: (page: Page) => void;
}

const GoalPlanner: React.FC<GoalPlannerProps> = ({ t, currency, setActivePage }) => {
    const [annualGoal, setAnnualGoal] = useState(10000000);
    const [avgConsignmentValue, setAvgConsignmentValue] = useState(1666667);
    const [profitPerConsignment, setProfitPerConsignment] = useState(250000);

    const formatCurrency = (value: number) => `${currency.symbol}${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const profitMarginPercent = useMemo(() => {
        if (avgConsignmentValue === 0) return 0;
        return (profitPerConsignment / avgConsignmentValue) * 100;
    }, [profitPerConsignment, avgConsignmentValue]);

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMargin = Number(e.target.value);
        const newProfit = (avgConsignmentValue * newMargin) / 100;
        setProfitPerConsignment(Math.round(newProfit));
    };
    
    const handleAvgConsignmentValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setAvgConsignmentValue(newValue);
        const newProfit = (newValue * profitMarginPercent) / 100;
        setProfitPerConsignment(Math.round(newProfit));
    }

    const calculations = useMemo(() => {
        const consignmentsPerYear = profitPerConsignment > 0 ? annualGoal / profitPerConsignment : 0;
        const consignmentsPerMonth = consignmentsPerYear / 12;
        const requiredMonthlyProfit = annualGoal / 12;
        
        return {
            consignmentsPerYear,
            consignmentsPerMonth,
            requiredMonthlyProfit,
        };
    }, [annualGoal, profitPerConsignment]);

    const ResultCard: React.FC<{ title: string; value: string;}> = ({ title, value }) => (
        <div className="bg-secondary p-4 rounded-lg text-center">
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-brand">{value}</p>
        </div>
    );

    return (
        <div>
            <header className="mb-8">
                <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand mb-4 transition-colors">
                    <BackArrowIcon />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="text-3xl font-bold text-text-primary">{t('goalPlanner')}</h1>
                <p className="text-md text-text-secondary">{t('goalPlannerSubheading')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-primary p-6 rounded-lg shadow-lg space-y-6 self-start">
                    <h2 className="text-xl font-semibold text-text-primary">{t('yourInputs')}</h2>
                    <div>
                        <label htmlFor="annualGoal" className="block text-sm font-medium text-text-secondary">{t('annualProfitGoal')} ({currency.symbol})</label>
                        <input
                            id="annualGoal"
                            type="number"
                            step="100000"
                            value={annualGoal}
                            onChange={(e) => setAnnualGoal(Number(e.target.value))}
                            className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-lg"
                        />
                         <p className="text-right text-brand font-bold mt-1">{formatCurrency(annualGoal)}</p>
                    </div>

                    <div className="bg-secondary p-4 rounded-lg space-y-4">
                         <div>
                            <label htmlFor="avgConsignmentValue" className="block text-sm font-medium text-text-secondary">{t('avgConsignmentValue')} ({currency.symbol})</label>
                            <input
                                id="avgConsignmentValue"
                                type="number"
                                step="10000"
                                value={avgConsignmentValue}
                                onChange={handleAvgConsignmentValueChange}
                                className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-lg"
                            />
                            <p className="text-right text-brand font-bold mt-1">{formatCurrency(avgConsignmentValue)}</p>
                        </div>

                        <div>
                            <label htmlFor="profitMargin" className="block text-sm font-medium text-text-secondary">{t('desiredProfitMargin')} (%)</label>
                            <input
                                id="profitMargin"
                                type="range"
                                min="1"
                                max="200"
                                step="0.1"
                                value={profitMarginPercent}
                                onChange={handleMarginChange}
                                className="mt-1 w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-right text-brand font-bold mt-1">{profitMarginPercent.toFixed(2)}%</p>
                        </div>

                         <div>
                            <label htmlFor="profitPerConsignment" className="block text-sm font-medium text-text-secondary">{t('profitPerConsignment')} ({currency.symbol})</label>
                            <input
                                id="profitPerConsignment"
                                type="number"
                                step="1000"
                                value={profitPerConsignment}
                                onChange={(e) => setProfitPerConsignment(Number(e.target.value))}
                                className="mt-1 block w-full bg-accent border-highlight rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-brand focus:border-brand sm:text-lg"
                            />
                            <p className="text-right text-brand font-bold mt-1">{formatCurrency(profitPerConsignment)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary p-6 rounded-lg shadow-lg space-y-4">
                     <h2 className="text-xl font-semibold text-text-primary">{t('yourShipmentTargets')}</h2>
                     
                     <ResultCard title={t('consignmentsPerYear')} value={calculations.consignmentsPerYear.toFixed(1)} />
                     <ResultCard title={t('consignmentsPerMonth')} value={calculations.consignmentsPerMonth.toFixed(1)} />
                     <ResultCard title={t('monthlyProfitTarget')} value={formatCurrency(calculations.requiredMonthlyProfit)} />

                     <div className="pt-4 text-center text-text-secondary text-sm italic">
                        <p>{t('goalPlannerHint')}</p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default GoalPlanner;
