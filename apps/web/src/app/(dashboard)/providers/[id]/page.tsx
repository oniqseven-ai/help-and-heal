'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, MessageCircle, Phone, ShieldCheck, Globe } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface ProviderData {
  id: string;
  displayName: string;
  tier: string;
  bio: string;
  specialties: string[];
  languages: string[];
  ratePerMinute: number;
  isOnline: boolean;
  isVerified: boolean;
  ratingAvg: number;
  totalSessions: number;
  totalMinutes: number;
  ratings: Array<{ score: number; feedback: string | null; createdAt: string }>;
}

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Peer Listener', COUNSELOR: 'Counselor', PSYCHOLOGIST: 'Clinical Psychologist', PSYCHIATRIST: 'Psychiatrist',
};
const TIER_COLOR: Record<string, string> = {
  LISTENER: 'bg-secondary/10 text-secondary-dark', COUNSELOR: 'bg-primary/10 text-primary-dark', PSYCHOLOGIST: 'bg-purple-100 text-purple-700',
};

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/providers/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProvider(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-16 text-center text-text-light">Loading...</div>;
  if (!provider) return (
    <div className="py-16 text-center">
      <p className="text-lg font-medium text-text-light">Provider not found</p>
      <Link href="/providers" className="mt-4 inline-block text-sm text-primary hover:underline">Back to providers</Link>
    </div>
  );

  const initials = provider.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const totalHours = Math.round(provider.totalMinutes / 60);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">{initials}</div>
          <div className="mt-4 sm:ml-6 sm:mt-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold">{provider.displayName}</h1>
              {provider.isVerified && <ShieldCheck className="h-5 w-5 text-primary" />}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${TIER_COLOR[provider.tier] || 'bg-gray-100'}`}>
                {TIER_LABEL[provider.tier] || provider.tier}
              </span>
              {provider.isOnline ? (
                <span className="flex items-center gap-1.5 text-sm text-secondary"><span className="h-2 w-2 rounded-full bg-secondary" />Online</span>
              ) : (
                <span className="text-sm text-text-light">Offline</span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-light">{provider.bio}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold"><Star className="h-5 w-5 fill-accent text-accent" />{provider.ratingAvg}</div>
            <p className="mt-0.5 text-xs text-text-light">Rating</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{provider.totalSessions.toLocaleString()}</div>
            <p className="mt-0.5 text-xs text-text-light">Sessions</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{totalHours.toLocaleString()}h</div>
            <p className="mt-0.5 text-xs text-text-light">Total hours</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {provider.specialties.map((s) => (
                <span key={s} className="rounded-full bg-background px-3 py-1 text-sm text-text-light">{s}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-text-light" /><span className="text-sm">{provider.languages.join(', ')}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-text-light" /><span className="text-sm font-semibold text-primary">{formatPaise(provider.ratePerMinute)}/min</span>
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">Free during beta</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href={provider.isOnline ? `/session/${provider.id}` : '#'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors ${
              provider.isOnline ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark' : 'bg-gray-100 text-text-light cursor-default'
            }`}>
            <MessageCircle className="h-4 w-4" /> {provider.isOnline ? 'Chat Now — Free' : 'Currently Offline'}
          </Link>
        </div>
      </div>

      {/* Reviews */}
      {provider.ratings && provider.ratings.length > 0 && (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8">
          <h2 className="text-lg font-bold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {provider.ratings.map((review, i) => (
              <div key={i} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-4 w-4 ${n <= review.score ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-text-light">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                {review.feedback && <p className="mt-2 text-sm text-text-light">{review.feedback}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
