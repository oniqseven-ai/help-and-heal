'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  PhoneOff,
  Star,
  Send,
  Loader2,
} from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

type Stage = 'pre-session' | 'connecting' | 'active' | 'post-session';

interface Message {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
}

interface ProviderInfo {
  id: string;
  displayName: string;
  tier: string;
  ratePerMinute: number;
  bio: string;
  specialties: string[];
  languages: string[];
  isOnline: boolean;
}

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: providerId } = use(params);
  const router = useRouter();

  const [provider, setProvider] = useState<ProviderInfo | null>(null);
  const [stage, setStage] = useState<Stage>('pre-session');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [postMood, setPostMood] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const lastMsgTime = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch provider info
  useEffect(() => {
    fetch(`/api/providers/${providerId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProvider(d.data); });
  }, [providerId]);

  // Timer
  useEffect(() => {
    if (stage !== 'active') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  // Poll messages
  useEffect(() => {
    if (stage !== 'active' || !sessionId) return;
    const poll = setInterval(async () => {
      const url = lastMsgTime.current
        ? `/api/sessions/${sessionId}/messages?after=${encodeURIComponent(lastMsgTime.current)}`
        : `/api/sessions/${sessionId}/messages`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setMessages((prev) => [...prev, ...data.data]);
        lastMsgTime.current = data.data[data.data.length - 1].createdAt;
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [stage, sessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnect = async () => {
    setStage('connecting');

    // Create session
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId,
        type: 'CHAT',
        moodBefore: mood,
        topic,
      }),
    });
    const data = await res.json();

    if (!data.success) {
      alert(data.error || 'Failed to create session');
      setStage('pre-session');
      return;
    }

    setSessionId(data.data.id);

    // Start session (set to ACTIVE)
    await fetch(`/api/sessions/${data.data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });

    // Load any existing messages
    const msgRes = await fetch(`/api/sessions/${data.data.id}/messages`);
    const msgData = await msgRes.json();
    if (msgData.success) {
      setMessages(msgData.data);
      if (msgData.data.length > 0) {
        lastMsgTime.current = msgData.data[msgData.data.length - 1].createdAt;
      }
    }

    setStage('active');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !sessionId) return;
    const text = chatInput.trim();
    setChatInput('');

    await fetch(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, senderType: 'USER' }),
    });
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    setStage('post-session');
  };

  const handleSubmitRating = async () => {
    if (!sessionId || !rating) return;

    await fetch(`/api/sessions/${sessionId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: rating, feedback }),
    });

    if (postMood !== null) {
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodAfter: postMood }),
      });
    }

    setRatingSubmitted(true);
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!provider) return <div className="flex min-h-[60vh] items-center justify-center text-text-light">Loading...</div>;

  const initials = provider.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2);

  /* ─── Pre-session ─── */
  if (stage === 'pre-session') {
    return (
      <div className="mx-auto max-w-lg">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{initials}</div>
            <div>
              <h2 className="font-semibold">{provider.displayName}</h2>
              <p className="text-xs text-text-light">{provider.tier === 'LISTENER' ? 'Peer Listener' : provider.tier === 'COUNSELOR' ? 'Counselor' : 'Psychologist'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium">How are you feeling? <span className="text-text-light">(1-10)</span></h3>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button key={n} onClick={() => setMood(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${mood === n ? 'bg-primary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium">What would you like to talk about? <span className="text-text-light">(optional)</span></h3>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={3} placeholder="Feeling anxious, work stress, relationship issues..."
              className="mt-2 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="mt-4 rounded-xl bg-secondary/10 p-4">
            <p className="text-sm font-semibold text-secondary">Free during beta!</p>
            <p className="mt-0.5 text-xs text-text-light">This session is completely free. No wallet balance needed.</p>
          </div>

          <button onClick={handleConnect}
            className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark">
            Start Chat Session
          </button>
        </div>
      </div>
    );
  }

  /* ─── Connecting ─── */
  if (stage === 'connecting') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">{initials}</div>
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        </div>
        <h2 className="mt-6 text-xl font-bold">Connecting...</h2>
        <p className="mt-2 text-text-light">Setting up your session with {provider.displayName}</p>
        <Loader2 className="mt-4 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  /* ─── Active Chat ─── */
  if (stage === 'active') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="flex items-center justify-between rounded-t-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{initials}</div>
            <div>
              <h3 className="font-semibold">{provider.displayName}</h3>
              <p className="text-xs text-text-light">{formatDuration(seconds)} · Free session</p>
            </div>
          </div>
          <button onClick={handleEndSession} className="rounded-lg bg-error/10 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/20">
            End Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border-x border-gray-100 bg-background p-4 space-y-3">
          {messages.filter((m) => m.senderType !== 'SYSTEM').map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.senderType === 'USER' ? 'bg-primary text-white rounded-br-md' : 'bg-white border border-gray-100 text-text rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 rounded-b-2xl border border-gray-100 bg-white p-3">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..." className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none placeholder:text-gray-400" />
          <button onClick={handleSendMessage} disabled={!chatInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── Post-session ─── */
  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <Star className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold">Session Complete</h1>
        <p className="mt-1 text-text-light">{formatDuration(seconds)} with {provider.displayName}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div><p className="text-xs text-text-light">Duration</p><p className="mt-1 font-bold">{formatDuration(seconds)}</p></div>
          <div><p className="text-xs text-text-light">Cost</p><p className="mt-1 font-bold text-secondary">Free (Beta)</p></div>
        </div>
      </div>

      {!ratingSubmitted ? (
        <>
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">Rate your experience</h2>
            <div className="mt-3 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-10 w-10 transition-colors ${n <= rating ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback (optional)..." rows={3}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary" />
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold">How do you feel now? <span className="text-text-light text-sm font-normal">(1-10)</span></h2>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button key={n} onClick={() => setPostMood(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${postMood === n ? 'bg-secondary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSubmitRating} disabled={!rating}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark disabled:opacity-50">
            Submit & Go Home
          </button>
        </>
      ) : (
        <div className="mt-6 text-center">
          <p className="text-secondary font-semibold">Thank you for your feedback!</p>
          <button onClick={() => router.push('/dashboard')}
            className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
