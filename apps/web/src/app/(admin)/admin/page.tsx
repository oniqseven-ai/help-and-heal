'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Users, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Stats {
  statusCounts: Record<string, number>;
  tierCounts: Record<string, number>;
  recentApplications: Array<{
    id: string;
    fullName: string;
    tier: string;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-accent/10 text-accent',
  UNDER_REVIEW: 'bg-primary/10 text-primary',
  APPROVED: 'bg-secondary/10 text-secondary',
  REJECTED: 'bg-error/10 text-error',
  RESUBMISSION_REQUESTED: 'bg-purple-100 text-purple-700',
};

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Listener',
  COUNSELOR: 'Counselor',
  PSYCHOLOGIST: 'Psychologist',
  PSYCHIATRIST: 'Psychiatrist',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); });
  }, []);

  if (!stats) return <div className="text-text-light">Loading...</div>;

  const submitted = stats.statusCounts['SUBMITTED'] || 0;
  const underReview = stats.statusCounts['UNDER_REVIEW'] || 0;
  const approved = stats.statusCounts['APPROVED'] || 0;
  const rejected = stats.statusCounts['REJECTED'] || 0;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-text-light">Provider onboarding overview</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-accent" />
            <span className="text-sm text-text-light">Pending Review</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{submitted + underReview}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm text-text-light">Under Review</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{underReview}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <span className="text-sm text-text-light">Approved</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{approved}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-error" />
            <span className="text-sm text-text-light">Rejected</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{rejected}</p>
        </div>
      </div>

      {/* Providers by tier */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold">Active Providers by Tier</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(TIER_LABEL).map(([key, label]) => (
            <div key={key} className="rounded-xl bg-background p-4 text-center">
              <p className="text-2xl font-bold">{stats.tierCounts[key] || 0}</p>
              <p className="text-xs text-text-light">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent applications */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recent Applications</h2>
          <Link href="/admin/applications" className="flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {stats.recentApplications.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-text-light">
            No applications yet
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentApplications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/applications/${app.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-medium">{app.fullName}</p>
                  <p className="text-xs text-text-light">
                    {TIER_LABEL[app.tier]} · {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-text-light'}`}>
                  {app.status.replace(/_/g, ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
