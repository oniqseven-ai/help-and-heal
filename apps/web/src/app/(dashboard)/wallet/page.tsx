'use client';

import { useEffect, useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Gift, RotateCcw } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallet')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setBalance(d.data.balance);
          setTransactions(d.data.transactions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const txIcon = (type: string) => {
    switch (type) {
      case 'RECHARGE': return <ArrowDownLeft className="h-4 w-4 text-secondary" />;
      case 'SESSION_DEBIT': return <ArrowUpRight className="h-4 w-4 text-error" />;
      case 'REFUND': return <RotateCcw className="h-4 w-4 text-primary" />;
      case 'BONUS': return <Gift className="h-4 w-4 text-accent" />;
      default: return null;
    }
  };

  if (loading) return <div className="mx-auto max-w-2xl py-16 text-center text-text-light">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/25 md:p-8">
        <div className="flex items-center gap-2 text-white/70">
          <Wallet className="h-5 w-5" />
          <span className="text-sm font-medium">Wallet Balance</span>
        </div>
        <div className="mt-2 text-3xl font-extrabold sm:text-4xl md:text-5xl">
          {formatPaise(balance)}
        </div>
        <div className="mt-4 rounded-xl bg-white/20 px-4 py-2.5 text-sm backdrop-blur-sm">
          <span className="font-semibold">Free during beta!</span> All sessions are currently free. Wallet recharge coming soon.
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Transaction History</h2>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-text-light">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                  {txIcon(tx.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-text-light">
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-secondary' : 'text-error'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatPaise(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
