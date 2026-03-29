'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, PhoneOff } from 'lucide-react';

interface Message {
  id: string;
  senderType: string;
  content: string;
  createdAt: string;
}

export default function ProviderSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [sessionStatus, setSessionStatus] = useState('');
  const lastMsgTime = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (sessionStatus !== 'ACTIVE') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [sessionStatus]);

  // Fetch session info
  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSessionStatus(d.data.status);
          if (d.data.startedAt) {
            const elapsed = Math.round((Date.now() - new Date(d.data.startedAt).getTime()) / 1000);
            setSeconds(Math.max(0, elapsed));
          }
        }
      });
  }, [sessionId]);

  // Poll messages
  useEffect(() => {
    if (sessionStatus !== 'ACTIVE') return;
    const fetchMsgs = async () => {
      const url = lastMsgTime.current
        ? `/api/sessions/${sessionId}/messages?after=${encodeURIComponent(lastMsgTime.current)}`
        : `/api/sessions/${sessionId}/messages`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setMessages((prev) => [...prev, ...data.data]);
        lastMsgTime.current = data.data[data.data.length - 1].createdAt;
      }
    };
    fetchMsgs();
    const poll = setInterval(fetchMsgs, 2000);
    return () => clearInterval(poll);
  }, [sessionId, sessionStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    await fetch(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, senderType: 'PROVIDER' }),
    });
  };

  const handleEnd = async () => {
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    router.push('/provider');
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (sessionStatus === 'COMPLETED') {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h2 className="text-xl font-bold">Session Ended</h2>
        <p className="mt-2 text-text-light">This session has been completed.</p>
        <button onClick={() => router.push('/provider')} className="mt-6 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-dark">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ height: 'calc(100vh - 220px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl border border-gray-100 bg-white p-4">
        <div>
          <h3 className="font-semibold">Active Session</h3>
          <p className="text-xs text-text-light">{formatDuration(seconds)} · Free session</p>
        </div>
        <button onClick={handleEnd} className="flex items-center gap-2 rounded-lg bg-error/10 px-4 py-2 text-xs font-semibold text-error hover:bg-error/20">
          <PhoneOff className="h-4 w-4" /> End Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border-x border-gray-100 bg-background p-4 space-y-3">
        {messages.filter((m) => m.senderType !== 'SYSTEM').map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'PROVIDER' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.senderType === 'PROVIDER' ? 'bg-secondary text-white rounded-br-md' : 'bg-white border border-gray-100 text-text rounded-bl-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 rounded-b-2xl border border-gray-100 bg-white p-3">
        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your response..." className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none placeholder:text-gray-400" />
        <button onClick={handleSend} disabled={!chatInput.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white hover:bg-secondary-dark disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
