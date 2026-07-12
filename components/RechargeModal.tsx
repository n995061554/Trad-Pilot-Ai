
import React, { useState } from 'react';
import { QrCodeIcon, WalletIcon, BankIcon } from './icons';
import { CompanyDetails } from '../types';
import { MASTER_PAYMENT_DETAILS } from '../constants';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecharge: (amount: number) => void;
    currentBalance: number;
    companyProfile: CompanyDetails | null;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, onRecharge, currentBalance, companyProfile }) => {
    const [amount, setAmount] = useState(500);
    const [showQR, setShowQR] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);

    if (!isOpen) return null;

    const upiId = MASTER_PAYMENT_DETAILS.upiId;
    const companyName = MASTER_PAYMENT_DETAILS.companyName;
    const bankDetails = MASTER_PAYMENT_DETAILS.bankDetails;

    const handleConfirmPayment = () => {
        onRecharge(amount);
        setShowQR(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-secondary max-w-md w-full rounded-2xl shadow-2xl border border-accent/20 overflow-hidden animate-zoomIn">
                {!showQR && !showBankDetails ? (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-text-primary flex items-center gap-2">
                                <WalletIcon className="text-brand" />
                                Recharge Wallet
                            </h2>
                            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">&times;</button>
                        </div>

                        <div className="bg-primary p-4 rounded-xl mb-6 border border-accent/10">
                            <div className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Current Balance</div>
                            <div className="text-3xl font-black text-brand">₹{currentBalance.toLocaleString('en-IN')}</div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Select or Enter Amount</label>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {[500, 1000, 2000].map(val => (
                                        <button 
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`py-2 rounded-lg font-bold transition-all ${amount === val ? 'bg-brand text-primary' : 'bg-accent text-text-primary hover:bg-brand/20'}`}
                                        >
                                            ₹{val}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">₹</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value) || 0)}
                                        className="w-full bg-accent border border-accent/20 rounded-xl py-3 pl-8 pr-4 text-text-primary font-bold focus:ring-2 focus:ring-brand outline-none"
                                        placeholder="Enter custom amount"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => setShowQR(true)}
                                    disabled={amount <= 0}
                                    className="w-full bg-brand text-primary font-black py-4 rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <QrCodeIcon className="w-5 h-5" />
                                    Generate Payment QR
                                </button>
                                
                                {bankDetails && (
                                    <button 
                                        onClick={() => setShowBankDetails(true)}
                                        disabled={amount <= 0}
                                        className="w-full bg-secondary text-text-primary border-2 border-brand/30 font-black py-4 rounded-xl hover:bg-brand/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <BankIcon className="w-5 h-5" />
                                        Pay via Bank Transfer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : showQR ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="flex justify-center mb-2">
                             <div className="p-4 bg-brand/10 rounded-full border border-brand/20">
                                <QrCodeIcon className="w-16 h-16 text-brand" />
                             </div>
                        </div>
                        <h2 className="text-2xl font-black text-text-primary">Scan to Pay ₹{amount.toLocaleString('en-IN')}</h2>
                        <p className="text-text-secondary text-sm">Use any UPI app (PhonePe, Google Pay, Paytm) to scan and complete the payment.</p>
                        
                        <div className="p-4 bg-white rounded-2xl inline-block shadow-inner ring-1 ring-accent/10">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(companyName)}&am=${amount}&cu=INR`}
                                alt="Payment QR"
                                className="w-48 h-48 rounded-md"
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                             <button 
                                onClick={handleConfirmPayment}
                                className="w-full bg-brand text-primary font-black py-4 rounded-xl shadow-lg shadow-brand/20 transition-all hover:opacity-90 active:scale-95 uppercase tracking-widest"
                             >
                                I Have Paid ₹{amount.toLocaleString('en-IN')}
                             </button>
                             <button 
                                onClick={() => setShowQR(false)}
                                className="w-full text-text-secondary font-bold text-sm hover:text-brand transition-colors"
                             >
                                Change Method / Amount
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 space-y-6">
                        <div className="flex justify-center mb-2">
                             <div className="p-4 bg-brand/10 rounded-full border border-brand/20">
                                <BankIcon className="w-16 h-16 text-brand" />
                             </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-text-primary">Bank Transfer Details</h2>
                            <p className="text-text-secondary text-sm mt-2">Transfer ₹{amount.toLocaleString('en-IN')} to the following account:</p>
                        </div>

                        <div className="bg-primary p-6 rounded-2xl border border-accent/20 font-mono text-sm whitespace-pre-wrap text-text-primary">
                            {bankDetails}
                        </div>

                        <div className="pt-4 space-y-3">
                             <button 
                                onClick={handleConfirmPayment}
                                className="w-full bg-brand text-primary font-black py-4 rounded-xl shadow-lg shadow-brand/20 transition-all hover:opacity-90 active:scale-95 uppercase tracking-widest"
                             >
                                I Have Transferred ₹{amount.toLocaleString('en-IN')}
                             </button>
                             <button 
                                onClick={() => setShowBankDetails(false)}
                                className="w-full text-text-secondary font-bold text-sm hover:text-brand transition-colors"
                             >
                                Change Method / Amount
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RechargeModal;
