'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Star, Clock, ArrowRight } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface SessionData {
  id: string;
  type: string;
  status: string;
  durationSeconds: number;
  totalCharged: number;
  isFreeTrial: boolean;
  moodBefore: number | null;
  moodAfter: number | null;
  createdAt: string;
  provider: { displayName: string };
  rating: { score: number } | null;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) return <div className="mx-auto max-w-2xl py-16 text-center text-text-light">Loading...</div>;

  if (sessions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">No sessions yet</h2>
        <p className="mt-2 text-text-light">You haven&apos;t had any sessions yet. Find a provider to get started.</p>
        <Link href="/providers" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark">
          Find a Provider <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Session History</h1>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {session.type === 'CHAT' ? <MessageCircle className="h-5 w-5 text-primary" /> : <Phone className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold">{session.provider.displayName}</h3>
                  <p className="text-xs text-text-light">
                    {new Date(session.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{session.type === 'CHAT' ? 'Text Chat' : 'Audio Call'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold">{session.isFreeTrial ? 'Free' : formatPaise(session.totalCharged)}</span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-text-light">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDuration(session.durationSeconds)}</span>
              {session.rating && (
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{session.rating.score}/5</span>
              )}
              {session.moodBefore !== null && session.moodAfter !== null && (
                <span>Mood: {session.moodBefore} → {session.moodAfter} {session.moodAfter > session.moodBefore ? '↑' : ''}</span>
              )}
              <span className={`rounded-full px-2 py-0.5 text-xs ${session.status === 'COMPLETED' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-text-light'}`}>
                {session.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
