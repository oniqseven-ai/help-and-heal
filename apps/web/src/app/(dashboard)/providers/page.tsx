'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Star, Filter, X } from 'lucide-react';
import {
  MOCK_PROVIDERS,
  SPECIALTIES,
  formatPaise,
  tierLabel,
  tierColor,
  type ProviderTier,
} from '@/lib/mock-data';

export default function ProvidersPage() {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<ProviderTier | ''>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    MOCK_PROVIDERS.forEach((p) => p.languages.forEach((l) => langs.add(l)));
    return Array.from(langs).sort();
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PROVIDERS
      .filter((p) => {
        if (search && !p.displayName.toLowerCase().includes(search.toLowerCase()) &&
            !p.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))) {
          return false;
        }
        if (selectedTier && p.tier !== selectedTier) return false;
        if (selectedSpecialty && !p.specialties.includes(selectedSpecialty)) return false;
        if (selectedLanguage && !p.languages.includes(selectedLanguage)) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        return b.ratingAvg - a.ratingAvg;
      });
  }, [search, selectedTier, selectedSpecialty, selectedLanguage]);

  const hasFilters = selectedTier || selectedSpecialty || selectedLanguage;

  const clearFilters = () => {
    setSelectedTier('');
    setSelectedSpecialty('');
    setSelectedLanguage('');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find a Provider</h1>
        <p className="mt-1 text-text-light">
          {MOCK_PROVIDERS.filter((p) => p.isOnline).length} providers online now
        </p>
      </div>

      {/* Search & filter bar */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
            showFilters || hasFilters
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 bg-white text-text-light hover:border-gray-300'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-light">Provider Type</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as ProviderTier | '')}
                className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">All types</option>
                <option value="LISTENER">Peer Listener</option>
                <option value="COUNSELOR">Counselor</option>
                <option value="PSYCHOLOGIST">Psychologist</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-light">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">All specialties</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-light">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">All languages</option>
                {allLanguages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-text-light">No providers found</p>
          <p className="mt-1 text-sm text-text-light">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.id}`}
              className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.initials}
                  </div>
                  {provider.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-secondary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-tight">{provider.displayName}</h3>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tierColor(provider.tier)}`}>
                    {tierLabel(provider.tier)}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="text-sm font-medium">{provider.ratingAvg}</span>
                    <span className="text-xs text-text-light">({provider.totalSessions} sessions)</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-text-light">{provider.bio}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {provider.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-background px-2 py-0.5 text-xs text-text-light">
                    {s}
                  </span>
                ))}
                {provider.specialties.length > 3 && (
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs text-text-light">
                    +{provider.specialties.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-sm text-text-light">
                  {provider.languages.join(' · ')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatPaise(provider.ratePerMinute)}/min
                </span>
              </div>

              <button
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  provider.isOnline
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-text-light cursor-default'
                }`}
              >
                {provider.isOnline ? 'Talk Now' : 'Currently Offline'}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
