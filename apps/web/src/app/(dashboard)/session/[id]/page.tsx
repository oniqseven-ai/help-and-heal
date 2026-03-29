'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  AlertTriangle,
  Star,
  Send,
  MessageCircle,
} from 'lucide-react';
import { MOCK_PROVIDERS, MOCK_WALLET_BALANCE, formatPaise, formatDuration, tierLabel } from '@/lib/mock-data';

type Stage = 'pre-session' | 'connecting' | 'active' | 'post-session';

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const provider = MOCK_PROVIDERS.find((p) => p.id === id);

  const [stage, setStage] = useState<Stage>('pre-session');
  const [mood, setMood] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [postMood, setPostMood] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Session type from URL
  const [sessionType, setSessionType] = useState<'audio' | 'chat'>('audio');

  // Chat messages
  const [messages, setMessages] = useState<{ sender: 'user' | 'provider'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('type') === 'chat') setSessionType('chat');
    }
  }, []);

  // Timer for active session
  useEffect(() => {
    if (stage !== 'active') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  if (!provider) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-text-light">Provider not found</p>
        <button onClick={() => router.push('/providers')} className="mt-4 text-sm text-primary hover:underline">
          Back to providers
        </button>
      </div>
    );
  }

  const costSoFar = Math.floor(seconds / 60) * provider.ratePerMinute;
  const balanceRemaining = MOCK_WALLET_BALANCE - costSoFar;
  const minutesLeft = Math.floor(balanceRemaining / provider.ratePerMinute);

  const handleConnect = () => {
    setStage('connecting');
    setTimeout(() => {
      setStage('active');
      if (sessionType === 'chat') {
        setMessages([{ sender: 'provider', text: `Hi! I'm ${provider.displayName}. I'm glad you reached out. How can I help you today?` }]);
      }
    }, 2000);
  };

  const handleEndSession = () => {
    setStage('post-session');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    // Simulate provider response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'provider', text: 'I hear you, and I want you to know that what you\'re feeling is completely valid. Can you tell me more about that?' },
      ]);
    }, 1500);
  };

  /* ─── Pre-session ─── */
  if (stage === 'pre-session') {
    return (
      <div className="mx-auto max-w-lg">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: provider.color }}>
              {provider.initials}
            </div>
            <div>
              <h2 className="font-semibold">{provider.displayName}</h2>
              <p className="text-xs text-text-light">{tierLabel(provider.tier)} · {formatPaise(provider.ratePerMinute)}/min</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium">How are you feeling? <span className="text-text-light">(1-10)</span></h3>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setMood(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    mood === n ? 'bg-primary text-white' : 'bg-background text-text-light hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium">What would you like to talk about? <span className="text-text-light">(optional)</span></h3>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Feeling anxious, work stress, relationship issues..."
              rows={3}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-4 rounded-xl bg-accent/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet Balance</span>
              <span className="font-semibold text-accent">{formatPaise(MOCK_WALLET_BALANCE)}</span>
            </div>
            <p className="mt-1 text-xs text-text-light">
              This covers ~{Math.floor(MOCK_WALLET_BALANCE / provider.ratePerMinute)} minutes at {formatPaise(provider.ratePerMinute)}/min
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => { setSessionType('audio'); handleConnect(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
            >
              <Phone className="h-4 w-4" /> Audio Call
            </button>
            <button
              onClick={() => { setSessionType('chat'); handleConnect(); }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary py-3.5 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              <MessageCircle className="h-4 w-4" /> Text Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Connecting ─── */
  if (stage === 'connecting') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: provider.color }}>
            {provider.initials}
          </div>
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        </div>
        <h2 className="mt-6 text-xl font-bold">Connecting...</h2>
        <p className="mt-2 text-text-light">Connecting you with {provider.displayName}</p>
      </div>
    );
  }

  /* ─── Active session (Audio) ─── */
  if (stage === 'active' && sessionType === 'audio') {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: provider.color }}>
          {provider.initials}
        </div>
        <h2 className="mt-4 text-xl font-bold">{provider.displayName}</h2>
        <p className="text-sm text-text-light">{tierLabel(provider.tier)}</p>

        {/* Timer and cost */}
        <div className="mt-6 text-center">
          <div className="text-4xl font-bold tracking-wider text-text">{formatDuration(seconds)}</div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-text-light">{formatPaise(provider.ratePerMinute)}/min</span>
            <span className="font-semibold">Cost: {formatPaise(costSoFar)}</span>
          </div>
        </div>

        {/* Balance warning */}
        <div className={`mt-4 rounded-xl px-4 py-2 text-sm ${minutesLeft <= 2 ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'}`}>
          Balance: {formatPaise(balanceRemaining)} (~{minutesLeft} min left)
          {minutesLeft <= 2 && <AlertTriangle className="ml-1 inline h-4 w-4" />}
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={() => setMuted(!muted)}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              muted ? 'bg-error/10 text-error' : 'bg-gray-100 text-text-light'
            }`}
          >
            {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          <button
            onClick={handleEndSession}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-error text-white shadow-lg shadow-error/25"
          >
            <PhoneOff className="h-7 w-7" />
          </button>
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-text-light">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── Active session (Chat) ─── */
  if (stage === 'active' && sessionType === 'chat') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: provider.color }}>
              {provider.initials}
            </div>
            <div>
              <h3 className="font-semibold">{provider.displayName}</h3>
              <p className="text-xs text-text-light">{formatDuration(seconds)} · {formatPaise(costSoFar)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${minutesLeft <= 2 ? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'}`}>
              {formatPaise(balanceRemaining)} left
            </span>
            <button
              onClick={handleEndSession}
              className="rounded-lg bg-error/10 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/20"
            >
              End
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto border-x border-gray-100 bg-background p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white border border-gray-100 text-text rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 rounded-b-2xl border border-gray-100 bg-white p-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
          >
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
        <p className="mt-1 text-text-light">
          {formatDuration(seconds)} with {provider.displayName}
        </p>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-text-light">Duration</p>
            <p className="mt-1 font-bold">{formatDuration(seconds)}</p>
          </div>
          <div>
            <p className="text-xs text-text-light">Rate</p>
            <p className="mt-1 font-bold">{formatPaise(provider.ratePerMinute)}/min</p>
          </div>
          <div>
            <p className="text-xs text-text-light">Total Cost</p>
            <p className="mt-1 font-bold text-primary">{formatPaise(costSoFar)}</p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold">Rate your experience</h2>
        <div className="mt-3 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <Star
                className={`h-10 w-10 transition-colors ${
                  n <= rating ? 'fill-accent text-accent' : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback (optional)..."
          rows={3}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary"
        />
      </div>

      {/* Post-session mood */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold">How do you feel now? <span className="text-text-light text-sm font-normal">(1-10)</span></h2>
        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setPostMood(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                postMood === n ? 'bg-secondary text-white' : 'bg-background text-text-light hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {mood !== null && postMood !== null && (
          <p className="mt-3 text-sm text-text-light">
            Mood change: {mood} → {postMood}
            {postMood > mood ? ' 📈 Improvement!' : postMood === mood ? ' — Same' : ''}
          </p>
        )}
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
      >
        Back to Home
      </button>
    </div>
  );
}
