'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock registration — will be replaced with NextAuth
    setTimeout(() => {
      if (phone && password) {
        router.push('/dashboard');
      } else {
        setError('Please fill in the required fields.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-text-light">
        Start your mental health journey — it takes 30 seconds
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Display name <span className="text-text-light">(optional)</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Phone number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-light">
              +91
            </span>
            <Phone className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-14 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Preferred language
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 bg-background text-text-light hover:border-gray-300'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                language === 'hi'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 bg-background text-text-light hover:border-gray-300'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-text-light">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>

      <div className="mt-4 text-center text-sm text-text-light">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
