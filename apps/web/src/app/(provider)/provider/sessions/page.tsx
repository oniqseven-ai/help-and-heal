'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Star, Clock } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface SessionData {
  id: string;
  userAnon: string;
  type: string;
  status: string;
  durationSeconds: number;
  netEarnings: number;
  ratingScore: number | null;
  feedback: string | null;
  createdAt: string;
}

export default function ProviderSessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/provider/sessions')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSessions(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Sessions</h1>
      <p className="mt-1 text-text-light">{sessions.length} total sessions</p>

      {loading ? (
        <div className="mt-8 text-center text-text-light">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-text-light" />
          <p className="mt-3 font-medium text-text-light">No sessions yet</p>
          <p className="mt-1 text-sm text-text-light">Go online to start receiving session requests</p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                    {s.type === 'CHAT' ? <MessageCircle className="h-5 w-5 text-secondary" /> : <Phone className="h-5 w-5 text-secondary" />}
                  </div>
                  <div>
                    <p className="font-medium">{s.userAnon}</p>
                    <p className="text-xs text-text-light">
                      {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {' · '}{s.type === 'CHAT' ? 'Chat' : 'Audio'}{' · '}{formatDuration(s.durationSeconds)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary">{formatPaise(s.netEarnings)}</p>
                  {s.ratingScore && (
                    <p className="mt-0.5 flex items-center justify-end gap-0.5 text-xs text-text-light">
                      <Star className="h-3 w-3 fill-accent text-accent" /> {s.ratingScore}/5
                    </p>
                  )}
                </div>
              </div>
              {s.feedback && (
                <p className="mt-2 rounded-lg bg-background p-2 text-xs text-text-light italic">&ldquo;{s.feedback}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
