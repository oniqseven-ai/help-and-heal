'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Phone,
  Globe,
  Bell,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      {/* User info */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-sm text-text-light">
              +91 ****{(session?.user as { phone?: string })?.phone?.slice(-4) || '****'}
            </p>
          </div>
        </div>

        {/* Edit name */}
        <div className="mt-6">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Display name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-background py-3 pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Language preference */}
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium">
            Preferred language
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 bg-background text-text-light'
              }`}
            >
              <Globe className="h-4 w-4" /> English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                language === 'hi'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 bg-background text-text-light'
              }`}
            >
              <Globe className="h-4 w-4" /> हिन्दी
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-text-light" />
            <span className="text-sm font-medium">Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              notifications ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                notifications ? 'left-5.5 translate-x-0' : 'left-0.5'
              }`}
              style={{ left: notifications ? '22px' : '2px' }}
            />
          </button>
        </div>

        <button className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark">
          Save Changes
        </button>
      </div>

      {/* Links */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white">
        {[
          { icon: HelpCircle, label: 'Help & Support', href: '#' },
          { icon: Shield, label: 'Privacy Policy', href: '#' },
          { icon: FileText, label: 'Terms of Service', href: '#' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center justify-between border-b border-gray-50 px-6 py-4 last:border-0 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-text-light" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-text-light" />
          </a>
        ))}
      </div>

      {/* Danger zone */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-text-light hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-error/20 bg-white py-3 text-sm font-semibold text-error hover:bg-error/5"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-error">Delete Account?</h3>
            <p className="mt-2 text-sm text-text-light">
              This will permanently delete your account and all your data including session history, wallet balance, and personal information. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl bg-error py-2.5 text-sm font-semibold text-white hover:bg-error/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
