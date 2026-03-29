'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import {
  MOCK_PROVIDERS,
  formatPaise,
  tierLabel,
  tierColor,
} from '@/lib/mock-data';

const MOCK_REVIEWS = [
  { id: 'r1', score: 5, feedback: 'Very empathetic and understanding. Made me feel truly heard.', date: '2 days ago' },
  { id: 'r2', score: 5, feedback: 'Excellent session. Helped me work through my anxiety with practical techniques.', date: '5 days ago' },
  { id: 'r3', score: 4, feedback: 'Great listener, very patient and non-judgmental.', date: '1 week ago' },
  { id: 'r4', score: 5, feedback: 'I felt so much better after our conversation. Highly recommended!', date: '2 weeks ago' },
];

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const provider = MOCK_PROVIDERS.find((p) => p.id === id);

  if (!provider) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-text-light">Provider not found</p>
        <Link href="/providers" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to providers
        </Link>
      </div>
    );
  }

  const totalHours = Math.round(provider.totalMinutes / 60);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Profile header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{ backgroundColor: provider.color }}
          >
            {provider.initials}
          </div>
          <div className="mt-4 sm:ml-6 sm:mt-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold">{provider.displayName}</h1>
              {provider.isVerified && (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${tierColor(provider.tier)}`}>
                {tierLabel(provider.tier)}
              </span>
              {provider.isOnline ? (
                <span className="flex items-center gap-1.5 text-sm text-secondary">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  Online
                </span>
              ) : (
                <span className="text-sm text-text-light">Offline</span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-light">
              {provider.bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              <Star className="h-5 w-5 fill-accent text-accent" />
              {provider.ratingAvg}
            </div>
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

        {/* Details */}
        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {provider.specialties.map((s) => (
                <span key={s} className="rounded-full bg-background px-3 py-1 text-sm text-text-light">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-text-light" />
            <span className="text-sm">{provider.languages.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-light" />
            <span className="text-sm font-semibold text-primary">
              {formatPaise(provider.ratePerMinute)}/min
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="mt-6 flex gap-3">
          <Link
            href={provider.isOnline ? `/session/${provider.id}` : '#'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors ${
              provider.isOnline
                ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark'
                : 'bg-gray-100 text-text-light cursor-default'
            }`}
          >
            <Phone className="h-4 w-4" />
            {provider.isOnline ? 'Talk Now' : 'Currently Offline'}
          </Link>
          <Link
            href={provider.isOnline ? `/session/${provider.id}?type=chat` : '#'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold transition-colors ${
              provider.isOnline
                ? 'border-primary text-primary hover:bg-primary/5'
                : 'border-gray-200 text-text-light cursor-default'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            {provider.isOnline ? 'Chat Now' : 'Unavailable'}
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
        <h2 className="text-lg font-bold">Reviews</h2>
        <div className="mt-4 space-y-4">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.score ? 'fill-accent text-accent' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-light">{review.date}</span>
              </div>
              <p className="mt-2 text-sm text-text-light">{review.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
