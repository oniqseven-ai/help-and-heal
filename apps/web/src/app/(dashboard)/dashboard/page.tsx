'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Phone,
  Wallet,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Star,
} from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface ProviderData {
  id: string;
  displayName: string;
  tier: string;
  specialties: string[];
  languages: string[];
  ratePerMinute: number;
  isOnline: boolean;
  ratingAvg: number;
}

const TIER_COLOR: Record<string, string> = {
  LISTENER: 'bg-secondary/10 text-secondary-dark',
  COUNSELOR: 'bg-primary/10 text-primary-dark',
  PSYCHOLOGIST: 'bg-purple-100 text-purple-700',
};

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Peer Listener',
  COUNSELOR: 'Counselor',
  PSYCHOLOGIST: 'Psychologist',
};

const MOODS = [
  { emoji: '😊', label: 'Great', value: 9 },
  { emoji: '🙂', label: 'Good', value: 7 },
  { emoji: '😐', label: 'Okay', value: 5 },
  { emoji: '😔', label: 'Low', value: 3 },
  { emoji: '😢', label: 'Struggling', value: 1 },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    fetch('/api/providers')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProviders(d.data); });
    fetch('/api/wallet')
      .then((r) => r.json())
      .then((d) => { if (d.success) setWalletBalance(d.data.balance); });
  }, []);

  const onlineProviders = providers.filter((p) => p.isOnline);
  const userName = session?.user?.name || 'there';

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {userName} 👋
        </h1>
        <p className="mt-1 text-text-light">
          How are you feeling today? We&apos;re here for you.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/wallet"
          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Wallet className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-light">Wallet Balance</p>
            <p className="text-xl font-bold">{formatPaise(walletBalance)}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-text-light">Providers Available</p>
            <p className="text-xl font-bold">{providers.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-light">Online Now</p>
            <p className="text-xl font-bold">{onlineProviders.length}</p>
          </div>
        </div>
      </div>

      {/* Mood check */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold">How are you feeling right now?</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-4 py-3 transition-all ${
                selectedMood === mood.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-text-light">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Talk Now CTA */}
      <Link
        href="/providers"
        className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl"
      >
        <div>
          <h2 className="text-xl font-bold md:text-2xl">Talk Now</h2>
          <p className="mt-1 text-sm text-white/80">
            Connect with someone who cares within 90 seconds
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:scale-110">
          <Phone className="h-7 w-7" />
        </div>
      </Link>

      {/* Available providers */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Available Now</h2>
          <Link
            href="/providers"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {onlineProviders.length === 0 ? (
          <p className="text-sm text-text-light">Loading providers...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {onlineProviders.slice(0, 6).map((provider) => (
              <Link
                key={provider.id}
                href={`/providers/${provider.id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {provider.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight">{provider.displayName}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TIER_COLOR[provider.tier] || ''}`}>
                        {TIER_LABEL[provider.tier] || provider.tier}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-text-light">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {provider.ratingAvg}
                      </span>
                    </div>
                  </div>
                  <span className="relative h-3 w-3">
                    <span className="absolute inset-0 rounded-full bg-secondary" />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {provider.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-background px-2 py-0.5 text-xs text-text-light">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {formatPaise(provider.ratePerMinute)}/min
                  </span>
                  <span className="text-xs text-text-light">
                    {provider.languages.join(', ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
