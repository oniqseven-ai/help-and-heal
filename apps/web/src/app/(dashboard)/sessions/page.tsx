'use client';

import Link from 'next/link';
import { Phone, MessageCircle, Star, Clock, ArrowRight } from 'lucide-react';
import { MOCK_SESSIONS, formatPaise, formatDuration } from '@/lib/mock-data';

export default function SessionsPage() {
  if (MOCK_SESSIONS.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">No sessions yet</h2>
        <p className="mt-2 text-text-light">
          You haven&apos;t had any sessions yet. Find a provider to get started.
        </p>
        <Link
          href="/providers"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
        >
          Find a Provider <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Session History</h1>

      <div className="space-y-3">
        {MOCK_SESSIONS.map((session) => (
          <div
            key={session.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {session.type === 'CHAT' ? (
                    <MessageCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Phone className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{session.providerName}</h3>
                  <p className="text-xs text-text-light">
                    {new Date(session.startedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' · '}
                    {session.type === 'CHAT' ? 'Text Chat' : 'Audio Call'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold">{formatPaise(session.totalCharged)}</span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-text-light">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(session.durationSeconds)}
              </span>
              {session.ratingScore && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  {session.ratingScore}/5
                </span>
              )}
              {session.moodBefore !== null && session.moodAfter !== null && (
                <span className="flex items-center gap-1">
                  Mood: {session.moodBefore} → {session.moodAfter}
                  {session.moodAfter > session.moodBefore && ' ↑'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
