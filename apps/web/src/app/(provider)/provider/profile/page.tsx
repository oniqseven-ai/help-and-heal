'use client';

import { useEffect, useState } from 'react';
import { Save, ShieldCheck, Star } from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

const SPECIALTIES = [
  'anxiety', 'depression', 'stress', 'relationships', 'loneliness',
  'grief', 'self-esteem', 'anger management', 'trauma', 'OCD',
  'addiction', 'work stress', 'family issues', 'academic pressure',
  'sleep issues', 'life transitions',
];
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Malayalam'];

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Peer Listener', COUNSELOR: 'Counselor', PSYCHOLOGIST: 'Clinical Psychologist', PSYCHIATRIST: 'Psychiatrist',
};

interface ProfileData {
  id: string;
  displayName: string;
  bio: string;
  tier: string;
  specialties: string[];
  languages: string[];
  ratePerMinute: number;
  isVerified: boolean;
  ratingAvg: number;
  totalSessions: number;
  totalMinutes: number;
  rateRange: { min: number; max: number; label: string };
}

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/provider/profile')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProfile(d.data); });
  }, []);

  const update = (field: string, value: unknown) => setProfile((p) => p ? { ...p, [field]: value } : p);
  const toggleItem = (field: 'specialties' | 'languages', item: string) => {
    if (!profile) return;
    const list = profile[field];
    update(field, list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    await fetch('/api/provider/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: profile.displayName,
        bio: profile.bio,
        specialties: profile.specialties,
        languages: profile.languages,
        ratePerMinute: profile.ratePerMinute,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!profile) return <div className="text-text-light">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="mt-1 text-text-light">Manage how users see you</p>

      {/* Read-only stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white border border-gray-100 p-4 text-center">
          <p className="text-xs text-text-light">Tier</p>
          <p className="mt-1 font-semibold text-sm">{TIER_LABEL[profile.tier]}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-4 text-center">
          <p className="text-xs text-text-light">Verified</p>
          <p className="mt-1 font-semibold text-sm">{profile.isVerified ? <ShieldCheck className="mx-auto h-5 w-5 text-primary" /> : 'No'}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-4 text-center">
          <p className="text-xs text-text-light">Rating</p>
          <p className="mt-1 flex items-center justify-center gap-1 font-semibold text-sm"><Star className="h-4 w-4 fill-accent text-accent" />{profile.ratingAvg}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-4 text-center">
          <p className="text-xs text-text-light">Sessions</p>
          <p className="mt-1 font-semibold text-sm">{profile.totalSessions}</p>
        </div>
      </div>

      {/* Editable fields */}
      <div className="mt-6 space-y-4 rounded-2xl border border-gray-100 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Display Name</label>
          <input value={profile.displayName} onChange={(e) => update('displayName', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Bio</label>
          <textarea value={profile.bio} onChange={(e) => update('bio', e.target.value)} rows={4}
            className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Rate per minute (₹) <span className="font-normal text-text-light">Range: {profile.rateRange.label}</span>
          </label>
          <input type="number" value={profile.ratePerMinute / 100} onChange={(e) => update('ratePerMinute', parseInt(e.target.value || '0') * 100)}
            className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => (
              <button key={s} type="button" onClick={() => toggleItem('specialties', s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${profile.specialties.includes(s) ? 'bg-secondary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Languages</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button key={l} type="button" onClick={() => toggleItem('languages', l)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${profile.languages.includes(l) ? 'bg-secondary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
