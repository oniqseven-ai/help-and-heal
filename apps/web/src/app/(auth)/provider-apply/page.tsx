'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
} from 'lucide-react';
import { TIER_RATE_RANGES } from '@/lib/compliance';

const SPECIALTIES = [
  'anxiety', 'depression', 'stress', 'relationships', 'loneliness',
  'grief', 'self-esteem', 'anger management', 'trauma', 'OCD',
  'addiction', 'work stress', 'family issues', 'academic pressure',
  'sleep issues', 'life transitions',
];

const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Malayalam'];

type Tier = 'LISTENER' | 'COUNSELOR' | 'PSYCHOLOGIST' | 'PSYCHIATRIST';

export default function ProviderApplyPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === 'authenticated';

  // Steps change based on login status
  const STEPS = isLoggedIn
    ? [
        { label: 'Personal', icon: User },
        { label: 'Professional', icon: Briefcase },
        { label: 'Documents', icon: FileText },
        { label: 'Agreements', icon: ShieldCheck },
      ]
    : [
        { label: 'Account', icon: Phone },
        { label: 'Personal', icon: User },
        { label: 'Professional', icon: Briefcase },
        { label: 'Documents', icon: FileText },
        { label: 'Agreements', icon: ShieldCheck },
      ];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Account fields (for non-logged-in users)
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s],
    }));
  };
  const toggleLanguage = (l: string) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(l) ? f.languages.filter((x) => x !== l) : [...f.languages, l],
    }));
  };

  // Get the actual step content based on whether user is logged in
  const getStepType = () => {
    if (isLoggedIn) {
      return ['personal', 'professional', 'documents', 'agreements'][step];
    }
    return ['account', 'personal', 'professional', 'documents', 'agreements'][step];
  };

  const stepType = getStepType();
  const totalSteps = STEPS.length;
  const isLastStep = step === totalSteps - 1;

  const validateStep = (): string | null => {
    if (stepType === 'account') {
      if (!regPhone || regPhone.length !== 10) return 'Please enter a valid 10-digit phone number.';
      if (!regPassword || regPassword.length < 6) return 'Password must be at least 6 characters.';
    }
    if (stepType === 'personal') {
      if (!form.fullName) return 'Full name is required.';
      if (!form.displayName) return 'Display name is required.';
    }
    if (stepType === 'professional') {
      if (!form.tier) return 'Please select a provider tier.';
      if (!form.bio) return 'Please write a bio.';
      if (form.specialties.length === 0) return 'Please select at least one specialty.';
      if (form.languages.length === 0) return 'Please select at least one language.';
      if (form.requestedRate <= 0) return 'Please enter a valid rate per minute.';
    }
    if (stepType === 'documents' && form.tier !== 'LISTENER') {
      if (!form.highestDegree) return 'Highest degree is required.';
      if (!form.university) return 'University is required.';
      if (form.tier === 'PSYCHOLOGIST' && !form.rciRegistrationNo) return 'RCI registration number is required.';
      if (form.tier === 'PSYCHIATRIST' && !form.nmcRegistrationNo) return 'NMC registration number is required.';
    }
    return null;
  };

  const handleNext = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    // If on account step, register + login first
    if (stepType === 'account') {
      setLoading(true);
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.fullName || 'Provider', phone: regPhone, password: regPassword }),
      });
      const regData = await regRes.json();
      if (!regData.success) {
        setError(regData.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto-login
      const loginResult = await signIn('credentials', { phone: regPhone, password: regPassword, redirect: false });
      if (loginResult?.error) {
        setError('Account created but login failed. Please try logging in manually.');
        setLoading(false);
        return;
      }

      // Set phone in form
      update('phone', regPhone);
      setLoading(false);
    }

    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!form.codeOfEthicsAgreed || !form.dpdpConsentAgreed || !form.termsAgreed) {
      setError('Please agree to all terms before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    const submitForm = { ...form, phone: form.phone || regPhone };

    const res = await fetch('/api/provider-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitForm),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess(true);
    } else {
      setError(data.error || 'Submission failed');
    }
    setLoading(false);
  };

  const tierInfo = form.tier ? TIER_RATE_RANGES[form.tier] : null;

  if (authStatus === 'loading') {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-text-light">Loading...</p>
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
        <p className="mt-2 text-sm text-text-light">
          Please log out and log back in to access your provider dashboard.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Log Out & Sign In Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50"
          >
            Stay on Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 sm:p-6">
        <h1 className="text-xl font-bold">Become a Provider</h1>
        <p className="mt-1 text-sm text-text-light">Join our team of mental health professionals</p>

        {/* Steps */}
        <div className="mt-4 flex gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium ${
              i === step ? 'bg-primary/10 text-primary' : i < step ? 'bg-secondary/10 text-secondary' : 'bg-gray-50 text-text-light'
            }`}>
              <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="mx-4 mt-4 rounded-lg bg-error/10 p-3 text-sm text-error sm:mx-6">{error}</div>}

      <div className="p-4 sm:p-6">
        {/* Account Step (only for non-logged-in users) */}
        {stepType === 'account' && (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">Create your account first</p>
              <p className="mt-1 text-xs text-text-light">We&apos;ll create your Help&Heal account, then you&apos;ll fill in your provider details.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Your name</label>
              <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Full name"
                className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone number *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-light">+91</span>
                <Phone className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} placeholder="10-digit phone number"
                  className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-14 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Create password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-text-light">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-primary hover:underline">Log in first</a>, then come back here.
            </p>
          </div>
        )}

        {/* Personal Step */}
        {stepType === 'personal' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full name *</label>
                <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Display name *</label>
                <input value={form.displayName} onChange={(e) => update('displayName', e.target.value)} placeholder="Name shown to users"
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Gender</label>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Date of birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        )}

        {/* Professional Step */}
        {stepType === 'professional' && (
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
              <textarea value={form.bio} onChange={(e) => update('bio', e.target.value)} rows={4} placeholder="Tell users about yourself, your approach, and experience..."
                className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Specialties *</label>
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
                  Rate per minute (₹) * {tierInfo && <span className="text-text-light font-normal text-xs">Range: {tierInfo.label}</span>}
                </label>
                <input type="number" value={form.requestedRate / 100 || ''} onChange={(e) => update('requestedRate', parseInt(e.target.value || '0') * 100)} placeholder="e.g. 10"
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Years of experience</label>
                <input type="number" value={form.yearsExperience || ''} onChange={(e) => update('yearsExperience', parseInt(e.target.value || '0'))}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        )}

        {/* Documents Step */}
        {stepType === 'documents' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Identity Verification</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Aadhaar number</label>
                <input value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, ''))} maxLength={12} placeholder="12-digit Aadhaar"
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">PAN number</label>
                <input value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase())} maxLength={10} placeholder="ABCDE1234F"
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            {form.tier !== 'LISTENER' && (
              <>
                <h3 className="font-semibold mt-6">Educational Qualifications</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Highest degree *</label>
                    <input value={form.highestDegree} onChange={(e) => update('highestDegree', e.target.value)} placeholder="e.g. M.A. Psychology"
                      className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">University/Institution *</label>
                    <input value={form.university} onChange={(e) => update('university', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Graduation year</label>
                    <input type="number" value={form.graduationYear} onChange={(e) => update('graduationYear', e.target.value)} placeholder="e.g. 2018"
                      className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Degree certificate number</label>
                    <input value={form.degreeCertNumber} onChange={(e) => update('degreeCertNumber', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </>
            )}

            {form.tier === 'PSYCHOLOGIST' && (
              <div className="mt-4">
                <h3 className="font-semibold">RCI Registration</h3>
                <label className="mt-2 mb-1.5 block text-sm font-medium">RCI registration number *</label>
                <input value={form.rciRegistrationNo} onChange={(e) => update('rciRegistrationNo', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            )}

            {form.tier === 'PSYCHIATRIST' && (
              <div className="mt-4">
                <h3 className="font-semibold">NMC Registration</h3>
                <label className="mt-2 mb-1.5 block text-sm font-medium">NMC registration number *</label>
                <input value={form.nmcRegistrationNo} onChange={(e) => update('nmcRegistrationNo', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            )}

            {(form.tier === 'PSYCHOLOGIST' || form.tier === 'PSYCHIATRIST') && (
              <div className="mt-4">
                <h3 className="font-semibold">Professional Indemnity Insurance</h3>
                <label className="mt-2 flex items-center gap-3">
                  <input type="checkbox" checked={form.hasIndemnityInsurance} onChange={(e) => update('hasIndemnityInsurance', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-primary" />
                  <span className="text-sm">I have professional indemnity insurance</span>
                </label>
                {form.hasIndemnityInsurance && (
                  <input value={form.insurancePolicyNumber} onChange={(e) => update('insurancePolicyNumber', e.target.value)} placeholder="Policy number"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Agreements Step */}
        {stepType === 'agreements' && (
          <div className="space-y-4">
            <p className="text-sm text-text-light">Please review and agree to the following before submitting.</p>

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
                <div className="text-xs text-text-light mt-0.5">I consent to the processing of my personal data in accordance with the Digital Personal Data Protection Act, 2023.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={form.termsAgreed} onChange={(e) => update('termsAgreed', e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary" />
              <div>
                <div className="text-sm font-medium">Terms & Conditions *</div>
                <div className="text-xs text-text-light mt-0.5">I agree to the Help & Heal provider terms including the 70/30 revenue split, weekly payouts, and session conduct guidelines.</div>
              </div>
            </label>

            <div className="rounded-xl bg-primary/5 p-4">
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
      <div className="flex items-center justify-between border-t border-gray-100 p-4 sm:p-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.back()}
          className="flex items-center gap-2 text-sm text-text-light hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" /> {step > 0 ? 'Back' : 'Cancel'}
        </button>

        {!isLastStep ? (
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Next'} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !form.codeOfEthicsAgreed || !form.dpdpConsentAgreed || !form.termsAgreed}
            className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'} <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
