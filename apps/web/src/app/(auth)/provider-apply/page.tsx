'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Briefcase,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { TIER_RATE_RANGES } from '@/lib/compliance';

const SPECIALTIES = [
  'anxiety', 'depression', 'stress', 'relationships', 'loneliness',
  'grief', 'self-esteem', 'anger management', 'trauma', 'OCD',
  'addiction', 'work stress', 'family issues', 'academic pressure',
  'sleep issues', 'life transitions',
];

const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Malayalam'];

const STEPS = [
  { label: 'Personal', icon: User },
  { label: 'Professional', icon: Briefcase },
  { label: 'Documents', icon: FileText },
  { label: 'Agreements', icon: ShieldCheck },
];

type Tier = 'LISTENER' | 'COUNSELOR' | 'PSYCHOLOGIST' | 'PSYCHIATRIST';

export default function ProviderApplyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: session?.user?.name || '',
    displayName: '',
    phone: (session?.user as { phone?: string })?.phone || '',
    email: '',
    dateOfBirth: '',
    gender: '',
    tier: '' as Tier | '',
    bio: '',
    specialties: [] as string[],
    languages: [] as string[],
    requestedRate: 0,
    yearsExperience: 0,
    governmentIdType: 'AADHAAR',
    governmentIdNumber: '',
    aadhaarNumber: '',
    panNumber: '',
    highestDegree: '',
    university: '',
    graduationYear: '',
    degreeCertNumber: '',
    rciRegistrationNo: '',
    nmcRegistrationNo: '',
    hasIndemnityInsurance: false,
    insurancePolicyNumber: '',
    codeOfEthicsAgreed: false,
    dpdpConsentAgreed: false,
    termsAgreed: false,
  });

  const update = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }));
  const toggleSpecialty = (s: string) => {
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter((x) => x !== s)
        : [...f.specialties, s],
    }));
  };
  const toggleLanguage = (l: string) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(l)
        ? f.languages.filter((x) => x !== l)
        : [...f.languages, l],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/provider-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess(true);
    } else {
      setError(data.error || 'Submission failed');
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Become a Provider</h1>
        <p className="mt-2 text-text-light">Please log in or create an account first to apply.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a href="/login" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Log In</a>
          <a href="/register" className="rounded-xl border border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5">Register</a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <Check className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold">Application Submitted!</h1>
        <p className="mt-2 text-text-light">
          Thank you for applying. Our team will review your application and get back to you within 2-3 business days.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const tierInfo = form.tier ? TIER_RATE_RANGES[form.tier] : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <h1 className="text-xl font-bold">Become a Provider</h1>
        <p className="mt-1 text-sm text-text-light">Join our team of mental health professionals</p>

        {/* Steps */}
        <div className="mt-4 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
              i === step ? 'bg-primary/10 text-primary' : i < step ? 'bg-secondary/10 text-secondary' : 'bg-gray-50 text-text-light'
            }`}>
              <s.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="mx-6 mt-4 rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}

      <div className="p-6">
        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full name *</label>
                <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Display name *</label>
                <input value={form.displayName} onChange={(e) => update('displayName', e.target.value)} placeholder="Name shown to users" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone *</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))} maxLength={10} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Date of birth</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Gender</label>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Professional */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Provider tier *</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['LISTENER', 'COUNSELOR', 'PSYCHOLOGIST', 'PSYCHIATRIST'] as Tier[]).map((t) => (
                  <button key={t} type="button" onClick={() => update('tier', t)}
                    className={`rounded-xl border p-4 text-left transition-all ${form.tier === t ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="font-semibold text-sm">{t === 'LISTENER' ? 'Peer Listener' : t === 'COUNSELOR' ? 'Counselor' : t === 'PSYCHOLOGIST' ? 'Clinical Psychologist' : 'Psychiatrist'}</div>
                    <div className="text-xs text-text-light mt-0.5">{TIER_RATE_RANGES[t].label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Bio *</label>
              <textarea value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={4} placeholder="Tell users about yourself, your approach, and experience..." className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Specialties * (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${form.specialties.includes(s) ? 'bg-primary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Languages *</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button key={l} type="button" onClick={() => toggleLanguage(l)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${form.languages.includes(l) ? 'bg-primary text-white' : 'bg-background text-text-light hover:bg-gray-100'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Rate per minute (₹) * {tierInfo && <span className="text-text-light font-normal">Range: {tierInfo.label}</span>}
                </label>
                <input type="number" value={form.requestedRate / 100 || ''} onChange={(e) => update('requestedRate', parseInt(e.target.value || '0') * 100)} placeholder="e.g. 10" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Years of experience</label>
                <input type="number" value={form.yearsExperience || ''} onChange={(e) => update('yearsExperience', parseInt(e.target.value || '0'))} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Identity Verification</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Aadhaar number</label>
                <input value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, ''))} maxLength={12} placeholder="12-digit Aadhaar" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">PAN number</label>
                <input value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase())} maxLength={10} placeholder="ABCDE1234F" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {form.tier !== 'LISTENER' && (
              <>
                <h3 className="font-semibold mt-6">Educational Qualifications</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Highest degree *</label>
                    <input value={form.highestDegree} onChange={(e) => update('highestDegree', e.target.value)} placeholder="e.g. M.A. Psychology" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">University/Institution *</label>
                    <input value={form.university} onChange={(e) => update('university', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Graduation year</label>
                    <input type="number" value={form.graduationYear} onChange={(e) => update('graduationYear', e.target.value)} placeholder="e.g. 2018" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Degree certificate number</label>
                    <input value={form.degreeCertNumber} onChange={(e) => update('degreeCertNumber', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </>
            )}

            {form.tier === 'PSYCHOLOGIST' && (
              <div>
                <h3 className="font-semibold mt-6">RCI Registration</h3>
                <div className="mt-2">
                  <label className="mb-1.5 block text-sm font-medium">RCI registration number *</label>
                  <input value={form.rciRegistrationNo} onChange={(e) => update('rciRegistrationNo', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            {form.tier === 'PSYCHIATRIST' && (
              <div>
                <h3 className="font-semibold mt-6">NMC Registration</h3>
                <div className="mt-2">
                  <label className="mb-1.5 block text-sm font-medium">NMC registration number *</label>
                  <input value={form.nmcRegistrationNo} onChange={(e) => update('nmcRegistrationNo', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            )}

            {(form.tier === 'PSYCHOLOGIST' || form.tier === 'PSYCHIATRIST') && (
              <div className="mt-4">
                <h3 className="font-semibold">Professional Indemnity Insurance</h3>
                <label className="mt-2 flex items-center gap-3">
                  <input type="checkbox" checked={form.hasIndemnityInsurance} onChange={(e) => update('hasIndemnityInsurance', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary" />
                  <span className="text-sm">I have professional indemnity insurance</span>
                </label>
                {form.hasIndemnityInsurance && (
                  <div className="mt-2">
                    <input value={form.insurancePolicyNumber} onChange={(e) => update('insurancePolicyNumber', e.target.value)} placeholder="Policy number" className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Agreements */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-sm text-text-light">
              Please review and agree to the following before submitting your application.
            </p>

            <label className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={form.codeOfEthicsAgreed} onChange={(e) => update('codeOfEthicsAgreed', e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary" />
              <div>
                <div className="text-sm font-medium">Code of Ethics *</div>
                <div className="text-xs text-text-light mt-0.5">I agree to abide by the Help & Heal provider code of ethics, including maintaining confidentiality, practicing within my scope of competence, and prioritizing client safety.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={form.dpdpConsentAgreed} onChange={(e) => update('dpdpConsentAgreed', e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary" />
              <div>
                <div className="text-sm font-medium">DPDP Act 2023 Consent *</div>
                <div className="text-xs text-text-light mt-0.5">I consent to the processing of my personal data in accordance with the Digital Personal Data Protection Act, 2023. I understand my data will be stored securely in India.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={form.termsAgreed} onChange={(e) => update('termsAgreed', e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary" />
              <div>
                <div className="text-sm font-medium">Terms & Conditions *</div>
                <div className="text-xs text-text-light mt-0.5">I agree to the Help & Heal provider terms and conditions, including the 70/30 revenue split, weekly payouts via RazorpayX, and session conduct guidelines.</div>
              </div>
            </label>

            <div className="mt-4 rounded-xl bg-primary/5 p-4">
              <h3 className="text-sm font-semibold">What happens next?</h3>
              <ol className="mt-2 space-y-1 text-xs text-text-light list-decimal list-inside">
                <li>Our team reviews your application (2-3 business days)</li>
                <li>We verify your credentials and documents</li>
                <li>You complete the 40-hour platform training</li>
                <li>Background verification is conducted</li>
                <li>Once approved, your profile goes live!</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-100 p-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.back()}
          className="flex items-center gap-2 text-sm text-text-light hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" /> {step > 0 ? 'Back' : 'Cancel'}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !form.codeOfEthicsAgreed || !form.dpdpConsentAgreed || !form.termsAgreed}
            className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
