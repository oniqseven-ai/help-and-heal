'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface ProviderData {
  id: string;
  displayName: string;
  tier: string;
  specialties: string[];
  languages: string[];
  ratePerMinute: number;
  isOnline: boolean;
  isVerified: boolean;
  ratingAvg: number;
  totalSessions: number;
  user: { phone: string | null; email: string | null };
}

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Listener',
  COUNSELOR: 'Counselor',
  PSYCHOLOGIST: 'Psychologist',
  PSYCHIATRIST: 'Psychiatrist',
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/providers')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProviders(d.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Approved Providers</h1>
      <p className="mt-1 text-text-light">{providers.length} active providers</p>

      {loading ? (
        <div className="mt-8 text-center text-text-light">Loading...</div>
      ) : providers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-12 text-center text-text-light">
          No approved providers yet
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {providers.map((p) => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {p.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.displayName}</p>
                <p className="text-xs text-text-light">
                  {TIER_LABEL[p.tier]} · {p.languages.join(', ')} · {formatPaise(p.ratePerMinute)}/min
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-sm text-text-light">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {p.ratingAvg}
                </span>
                <span>{p.totalSessions} sessions</span>
                <span className={`h-2.5 w-2.5 rounded-full ${p.isOnline ? 'bg-secondary' : 'bg-gray-300'}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
