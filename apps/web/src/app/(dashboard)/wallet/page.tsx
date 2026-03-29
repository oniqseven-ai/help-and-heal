'use client';

import { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RotateCcw,
} from 'lucide-react';
import {
  MOCK_WALLET_BALANCE,
  MOCK_TRANSACTIONS,
  RECHARGE_PACKS,
  formatPaise,
} from '@/lib/mock-data';

export default function WalletPage() {
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showRecharge, setShowRecharge] = useState(false);

  const handleRecharge = () => {
    const amount = selectedPack || (parseInt(customAmount) * 100);
    if (amount > 0) {
      alert(`Razorpay integration coming soon! Selected amount: ${formatPaise(amount)}`);
    }
  };

  const txIcon = (type: string) => {
    switch (type) {
      case 'RECHARGE': return <ArrowDownLeft className="h-4 w-4 text-secondary" />;
      case 'SESSION_DEBIT': return <ArrowUpRight className="h-4 w-4 text-error" />;
      case 'REFUND': return <RotateCcw className="h-4 w-4 text-primary" />;
      case 'BONUS': return <Gift className="h-4 w-4 text-accent" />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/25 md:p-8">
        <div className="flex items-center gap-2 text-white/70">
          <Wallet className="h-5 w-5" />
          <span className="text-sm font-medium">Wallet Balance</span>
        </div>
        <div className="mt-2 text-4xl font-extrabold md:text-5xl">
          {formatPaise(MOCK_WALLET_BALANCE)}
        </div>
        <button
          onClick={() => setShowRecharge(!showRecharge)}
          className="mt-4 flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <Plus className="h-4 w-4" />
          Add Money
        </button>
      </div>

      {/* Recharge section */}
      {showRecharge && (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold">Choose a recharge pack</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {RECHARGE_PACKS.map((pack) => (
              <button
                key={pack.amount}
                onClick={() => { setSelectedPack(pack.amount); setCustomAmount(''); }}
                className={`relative rounded-xl border py-4 text-center transition-all ${
                  selectedPack === pack.amount
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                    BEST
                  </span>
                )}
                <div className="text-lg font-bold">{pack.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm text-text-light">Or enter custom amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-light">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPack(null); }}
                placeholder="0"
                min="50"
                className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-8 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            onClick={handleRecharge}
            disabled={!selectedPack && !customAmount}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            Recharge {selectedPack ? formatPaise(selectedPack) : customAmount ? `₹${customAmount}` : ''}
          </button>

          <p className="mt-3 text-center text-xs text-text-light">
            UPI, cards, and all major wallets accepted via Razorpay
          </p>
        </div>
      )}

      {/* Transaction history */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Transaction History</h2>
        <div className="space-y-2">
          {MOCK_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                {txIcon(tx.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-text-light">
                  {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-secondary' : 'text-error'}`}>
                {tx.amount > 0 ? '+' : ''}{formatPaise(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
