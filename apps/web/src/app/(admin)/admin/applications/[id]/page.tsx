'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  ShieldCheck,
  User,
  Briefcase,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { formatPaise } from '@/lib/mock-data';

interface ChecklistItem {
  id: string;
  key: string;
  label: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  notes: string | null;
}

interface ApplicationData {
  id: string;
  status: string;
  fullName: string;
  displayName: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  tier: string;
  bio: string;
  specialties: string[];
  languages: string[];
  requestedRate: number;
  yearsExperience: number;
  aadhaarNumber: string | null;
  panNumber: string | null;
  highestDegree: string | null;
  university: string | null;
  graduationYear: number | null;
  degreeCertNumber: string | null;
  rciRegistrationNo: string | null;
  nmcRegistrationNo: string | null;
  hasIndemnityInsurance: boolean;
  insurancePolicyNumber: string | null;
  codeOfEthicsAgreed: boolean;
  dpdpConsentAgreed: boolean;
  termsAgreed: boolean;
  backgroundCheckStatus: string;
  reviewNotes: string | null;
  rejectionReason: string | null;
  createdAt: string;
  checklistItems: ChecklistItem[];
  user: { name: string | null; phone: string | null; email: string | null; createdAt: string };
}

const TIER_LABEL: Record<string, string> = {
  LISTENER: 'Peer Listener',
  COUNSELOR: 'Counselor',
  PSYCHOLOGIST: 'Clinical Psychologist',
  PSYCHIATRIST: 'Psychiatrist',
};

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-accent/10 text-accent',
  UNDER_REVIEW: 'bg-primary/10 text-primary',
  APPROVED: 'bg-secondary/10 text-secondary',
  REJECTED: 'bg-error/10 text-error',
};

export default function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [app, setApp] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchApp = () => {
    fetch(`/api/admin/applications/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setApp(d.data);
          setReviewNotes(d.data.reviewNotes || '');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchApp, [id]);

  const toggleChecklist = async (key: string, isCompleted: boolean) => {
    await fetch(`/api/admin/applications/${id}/checklist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, isCompleted }),
    });
    fetchApp();
  };

  const updateStatus = async (status: string, extra?: Record<string, string>) => {
    setActionLoading(true);
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNotes, ...extra }),
    });
    fetchApp();
    setActionLoading(false);
    setShowRejectModal(false);
  };

  if (loading) return <div className="text-text-light">Loading...</div>;
  if (!app) return <div className="text-text-light">Application not found</div>;

  const completedRequired = app.checklistItems.filter((c) => c.isRequired && c.isCompleted).length;
  const totalRequired = app.checklistItems.filter((c) => c.isRequired).length;
  const allRequiredDone = completedRequired === totalRequired;
  const isEditable = app.status !== 'APPROVED' && app.status !== 'REJECTED';

  return (
    <div className="mx-auto max-w-5xl">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Back to Applications
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{app.fullName}</h1>
          <p className="mt-1 text-text-light">
            {TIER_LABEL[app.tier]} · Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${STATUS_COLORS[app.status] || 'bg-gray-100'}`}>
          {app.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Left: Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold"><User className="h-4 w-4 text-primary" /> Personal Info</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <div><span className="text-text-light">Full Name:</span> <span className="font-medium">{app.fullName}</span></div>
              <div><span className="text-text-light">Display Name:</span> <span className="font-medium">{app.displayName}</span></div>
              <div><span className="text-text-light">Phone:</span> <span className="font-medium">{app.phone}</span></div>
              <div><span className="text-text-light">Email:</span> <span className="font-medium">{app.email || '—'}</span></div>
              <div><span className="text-text-light">DOB:</span> <span className="font-medium">{app.dateOfBirth || '—'}</span></div>
              <div><span className="text-text-light">Gender:</span> <span className="font-medium">{app.gender || '—'}</span></div>
            </div>
          </div>

          {/* Professional */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold"><Briefcase className="h-4 w-4 text-primary" /> Professional Info</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-text-light">Tier:</span> <span className="font-medium">{TIER_LABEL[app.tier]}</span></div>
              <div><span className="text-text-light">Rate:</span> <span className="font-medium">{formatPaise(app.requestedRate)}/min</span></div>
              <div><span className="text-text-light">Experience:</span> <span className="font-medium">{app.yearsExperience} years</span></div>
              <div><span className="text-text-light">Specialties:</span> <span className="font-medium">{app.specialties.join(', ')}</span></div>
              <div><span className="text-text-light">Languages:</span> <span className="font-medium">{app.languages.join(', ')}</span></div>
              <div><span className="text-text-light">Bio:</span></div>
              <p className="text-text-light bg-background rounded-lg p-3">{app.bio || '—'}</p>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" /> Documents & Credentials</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <div><span className="text-text-light">Aadhaar:</span> <span className="font-medium">{app.aadhaarNumber || '—'}</span></div>
              <div><span className="text-text-light">PAN:</span> <span className="font-medium">{app.panNumber || '—'}</span></div>
              {app.highestDegree && <div><span className="text-text-light">Degree:</span> <span className="font-medium">{app.highestDegree}</span></div>}
              {app.university && <div><span className="text-text-light">University:</span> <span className="font-medium">{app.university}</span></div>}
              {app.graduationYear && <div><span className="text-text-light">Grad Year:</span> <span className="font-medium">{app.graduationYear}</span></div>}
              {app.degreeCertNumber && <div><span className="text-text-light">Cert No:</span> <span className="font-medium">{app.degreeCertNumber}</span></div>}
              {app.rciRegistrationNo && <div><span className="text-text-light">RCI No:</span> <span className="font-medium">{app.rciRegistrationNo}</span></div>}
              {app.nmcRegistrationNo && <div><span className="text-text-light">NMC No:</span> <span className="font-medium">{app.nmcRegistrationNo}</span></div>}
              <div><span className="text-text-light">Insurance:</span> <span className="font-medium">{app.hasIndemnityInsurance ? `Yes (${app.insurancePolicyNumber})` : 'No'}</span></div>
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${app.codeOfEthicsAgreed ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-text-light'}`}>
                Ethics {app.codeOfEthicsAgreed ? '✓' : '✗'}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${app.dpdpConsentAgreed ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-text-light'}`}>
                DPDP {app.dpdpConsentAgreed ? '✓' : '✗'}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${app.termsAgreed ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-text-light'}`}>
                Terms {app.termsAgreed ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Checklist & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Compliance Checklist */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> Compliance Checklist
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${totalRequired ? (completedRequired / totalRequired) * 100 : 0}%` }} />
              </div>
              <span className="text-xs font-medium text-text-light">{completedRequired}/{totalRequired}</span>
            </div>

            <div className="mt-4 space-y-2">
              {app.checklistItems.map((item) => (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                    item.isCompleted ? 'border-secondary/30 bg-secondary/5' : 'border-gray-100 hover:bg-gray-50'
                  } ${!isEditable ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={(e) => toggleChecklist(item.key, e.target.checked)}
                    disabled={!isEditable}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-secondary"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.isRequired && <span className="ml-1 text-xs text-error">*</span>}
                    {item.completedAt && (
                      <p className="text-xs text-text-light mt-0.5">
                        Verified {new Date(item.completedAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          {isEditable && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="font-semibold text-sm">Internal Notes</h2>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                placeholder="Add internal notes..."
                className="mt-2 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Actions */}
          {isEditable && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-3">
              <h2 className="font-semibold text-sm">Actions</h2>

              {!allRequiredDone && (
                <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-xs text-accent">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  Complete all required checklist items before approving
                </div>
              )}

              <button
                onClick={() => updateStatus('APPROVED')}
                disabled={!allRequiredDone || actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Approve
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-error text-error py-3 text-sm font-semibold hover:bg-error/5"
              >
                <X className="h-4 w-4" /> Reject
              </button>

              {app.status === 'SUBMITTED' && (
                <button
                  onClick={() => updateStatus('UNDER_REVIEW')}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-text-light hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" /> Mark as Under Review
                </button>
              )}
            </div>
          )}

          {/* Rejection info */}
          {app.status === 'REJECTED' && app.rejectionReason && (
            <div className="rounded-2xl border border-error/20 bg-error/5 p-6">
              <h2 className="font-semibold text-sm text-error">Rejection Reason</h2>
              <p className="mt-2 text-sm text-text-light">{app.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-error">Reject Application</h3>
            <p className="mt-1 text-sm text-text-light">Please provide a reason for rejection. This will be shared with the applicant.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Reason for rejection..."
              className="mt-4 w-full rounded-xl border border-gray-200 bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => updateStatus('REJECTED', { rejectionReason })}
                disabled={!rejectionReason || actionLoading}
                className="flex-1 rounded-xl bg-error py-2.5 text-sm font-semibold text-white hover:bg-error/90 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
