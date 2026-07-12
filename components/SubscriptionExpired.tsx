
import React, { useState } from 'react';
import { LockIcon, WalletIcon, QrCodeIcon } from './icons';

interface SubscriptionExpiredProps {
    walletBalance: number;
    subscriptionCost: number;
    onRecharge: (amount: number) => void;
    onRenew: () => void;
    onRechargeClick: () => void;
}

const SubscriptionExpired: React.FC<SubscriptionExpiredProps> = ({ walletBalance, subscriptionCost, onRecharge, onRenew, onRechargeClick }) => {
    const [showPayment, setShowPayment] = useState(false);
    const amountNeeded = subscriptionCost - walletBalance;
    const [rechargeAmount, setRechargeAmount] = useState(amountNeeded > 0 ? amountNeeded : 500);
    const canRenew = walletBalance >= subscriptionCost;

    const handlePaymentConfirmation = () => {
        if (rechargeAmount > 0) {
            onRecharge(rechargeAmount);
        }
        setShowPayment(false);
    };

    if (showPayment) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary">
                <div className="w-full max-w-lg p-8 space-y-6 bg-secondary rounded-lg shadow-lg text-center animate-fadeIn">
                    <QrCodeIcon className="w-16 h-16 mx-auto text-brand" />
                    <h1 className="text-2xl font-bold text-text-primary">Recharge with UPI / QR Code</h1>
                    <p className="text-text-secondary">Scan the code below with any UPI app to add ₹{rechargeAmount} to your wallet.</p>
                    
                    <div className="p-4 bg-primary rounded-lg">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=tradesim@example&pn=Trade%20X%20Cloud&am=${rechargeAmount}&cu=INR`}
                            alt="Simulated UPI QR Code"
                            className="mx-auto rounded-md"
                        />
                        <p className="text-xs text-text-secondary mt-3">This is a simulated QR code for demonstration.</p>
                    </div>

                    <p className="text-sm text-yellow-400">Note: A standard payment gateway fee of ~2% may apply. (Simulation)</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setShowPayment(false)}
                            className="w-full bg-highlight text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePaymentConfirmation}
                            className="w-full bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition"
                        >
                            I have paid ₹{rechargeAmount}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-lg p-8 space-y-6 bg-secondary rounded-lg shadow-lg text-center animate-fadeIn">
                <LockIcon className="w-16 h-16 mx-auto text-red-400" />
                <h1 className="text-3xl font-bold text-text-primary">Your Subscription Has Expired</h1>
                <p className="text-text-secondary">Please renew your subscription to continue using <span className="text-brand">Trade</span> <span className="text-orange-500">X</span> <span className="text-brand">Cloud</span>.</p>

                <div className="p-6 bg-primary rounded-lg">
                    <h2 className="text-lg font-semibold text-text-primary flex items-center justify-center gap-2">
                        <WalletIcon />
                        Your Wallet
                    </h2>
                    <p className="text-4xl font-bold text-brand mt-2">₹{walletBalance.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-text-secondary mt-1">Subscription Cost: ₹{subscriptionCost.toLocaleString('en-IN')}</p>
                    
                    <div className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="rechargeAmount" className="block text-sm font-medium text-text-secondary text-left mb-1">
                                Enter amount to recharge
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-text-secondary sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="rechargeAmount"
                                    id="rechargeAmount"
                                    className="focus:ring-brand focus:border-brand block w-full pl-7 pr-4 sm:text-sm border-accent bg-accent rounded-md py-2 text-text-primary"
                                    placeholder="0"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(Number(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                             <button
                                onClick={onRechargeClick}
                                className="w-full bg-highlight text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-brand hover:text-primary transition"
                            >
                                Recharge Wallet
                            </button>
                            <button
                                onClick={onRenew}
                                disabled={!canRenew}
                                className="w-full bg-brand text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition disabled:bg-accent disabled:text-text-secondary disabled:cursor-not-allowed"
                            >
                                Renew Subscription
                            </button>
                        </div>
                    </div>

                    {!canRenew && (
                        <p className="text-xs text-yellow-400 mt-3">
                            You need at least ₹{subscriptionCost.toLocaleString('en-IN')} in your wallet to renew.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionExpired;
