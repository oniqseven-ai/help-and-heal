'use client';

import { useState } from 'react';

/* ───────────────────────── Navbar ───────────────────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="text-2xl font-bold text-primary">
          Help<span className="text-secondary">&</span>Heal
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#safety" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
            Safety
          </a>
          <a href="/provider-apply" className="text-sm font-medium text-text-light hover:text-primary transition-colors">
            Become a Provider
          </a>
          <a
            href="/login"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-text transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-text transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-text transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-light">How it Works</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-light">Pricing</a>
            <a href="#safety" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-light">Safety</a>
            <a href="/provider-apply" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-text-light">Become a Provider</a>
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="waitlist" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
          Launching Soon in India
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
          Talk to someone who cares.{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Anytime. Anywhere.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-light md:text-xl">
          Feeling overwhelmed? Connect with trained listeners, counselors, and
          psychologists within 90 seconds — affordable, private, and on your
          terms.
        </p>

        {/* Waitlist form */}
        <div className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <div className="rounded-2xl bg-secondary/10 p-6 text-center">
              <div className="mb-2 text-3xl">&#10003;</div>
              <p className="font-semibold text-secondary-dark">
                You&apos;re on the list!
              </p>
              <p className="mt-1 text-sm text-text-light">
                We&apos;ll notify you as soon as we launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-colors"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>

        {/* Social proof */}
        <p className="mt-6 text-sm text-text-light">
          Join <span className="font-semibold text-text">2,400+</span> people
          waiting for early access
        </p>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 sm:mt-16 sm:gap-8">
          {[
            { value: '90s', label: 'Avg. connect time' },
            { value: '₹5/min', label: 'Starting from' },
            { value: '100%', label: 'Private & secure' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-primary sm:text-3xl md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-text-light">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── How it Works ───────────────────────── */

function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Choose a listener',
      description:
        'Browse trained peer listeners, certified counselors, or licensed psychologists. Filter by language, specialty, and budget.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Connect instantly',
      description:
        'Start an audio call or text chat within 90 seconds. No appointments, no waiting rooms. Pay per minute from your wallet.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Feel better',
      description:
        'Talk for as long as you need. Rate your experience, track your mood over time, and come back whenever you need support.',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-light">
            From feeling overwhelmed to feeling heard — in three simple steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="group relative rounded-2xl border border-gray-100 bg-background p-8 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {s.icon}
              </div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                Step {s.step}
              </div>
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-text-light">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Pricing ───────────────────────── */

function Pricing() {
  const tiers = [
    {
      name: 'Peer Listener',
      price: '₹5–20',
      unit: '/min',
      description: 'Trained empathetic listeners who provide a safe space to talk about anything on your mind.',
      qualification: '40-hour platform training',
      features: [
        'Audio call & text chat',
        'Available 24/7',
        'Great for everyday stress',
        'No appointment needed',
        'First 5 min free',
      ],
      color: 'secondary' as const,
      popular: false,
    },
    {
      name: 'Counselor',
      price: '₹20–50',
      unit: '/min',
      description: 'Certified counselors with psychology degrees for deeper emotional support and guidance.',
      qualification: 'M.A./M.Sc. Psychology',
      features: [
        'Everything in Peer Listener',
        'Evidence-based techniques',
        'Relationship & family issues',
        'Grief & life transitions',
        'Session notes & progress',
      ],
      color: 'primary' as const,
      popular: true,
    },
    {
      name: 'Psychologist',
      price: '₹50–150',
      unit: '/min',
      description: 'RCI-registered clinical psychologists for clinical-level assessment and therapy.',
      qualification: 'RCI-registered',
      features: [
        'Everything in Counselor',
        'Clinical assessment',
        'Anxiety & depression',
        'Trauma-informed care',
        'Treatment planning',
      ],
      color: 'primary' as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Affordable <span className="text-primary">care</span> for everyone
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-light">
            Pay only for the time you use. No subscriptions, no commitments.
            Recharge your wallet and talk when you need to.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border bg-white p-8 transition-shadow hover:shadow-xl ${
                tier.popular
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-gray-100'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-sm text-text-light">
                  {tier.qualification}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-text">
                  {tier.price}
                </span>
                <span className="text-text-light">{tier.unit}</span>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-text-light">
                {tier.description}
              </p>

              <ul className="mb-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <svg
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        tier.popular ? 'text-primary' : 'text-secondary'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`block rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-dark'
                    : 'bg-background text-text hover:bg-gray-100'
                }`}
              >
                Get Early Access
              </a>
            </div>
          ))}
        </div>

        {/* Wallet CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center">
          <p className="text-lg font-semibold">
            Wallet-based pricing — recharge with{' '}
            <span className="text-accent font-bold">₹99, ₹199, ₹499, ₹999</span>{' '}
            or more
          </p>
          <p className="mt-2 text-sm text-text-light">
            UPI, cards, and all major wallets accepted via Razorpay. Your first 5 minutes are free!
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Safety & Privacy ───────────────────────── */

function Safety() {
  const features = [
    {
      title: 'End-to-end encryption',
      description: 'All conversations are encrypted with AES-256 at rest and TLS 1.3 in transit. Your sessions are yours alone.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
    },
    {
      title: 'Anonymous by default',
      description: 'No name or email required to sign up. Use just your phone number with OTP — we never share your identity.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
    {
      title: 'Crisis safety net',
      description: 'Real-time AI monitors conversations for crisis signals. Immediate escalation to trained supervisors and helplines.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
    },
    {
      title: 'DPDP Act compliant',
      description: 'All data stored in India (AWS Mumbai). Compliant with the Digital Personal Data Protection Act, 2023.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
    },
    {
      title: 'Verified providers',
      description: 'Every counselor and psychologist is verified against RCI/NMC registrations. Peer listeners complete 40-hour training.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
    },
    {
      title: 'Delete anytime',
      description: 'Your data, your choice. Delete your entire account and all associated data with a single tap.',
      icon: (
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      ),
    },
  ];

  return (
    <section id="safety" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Your <span className="text-primary">safety</span> comes first
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-light">
            We built Help&Heal with privacy and safety at the core — because
            you deserve a space where you can be completely open.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 bg-background p-6 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-light">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Helpline banner */}
        <div className="mt-16 rounded-2xl border border-error/20 bg-error/5 p-6 text-center md:p-8">
          <h3 className="text-lg font-bold text-error">
            In a crisis? Help is available now.
          </h3>
          <p className="mt-2 text-sm text-text-light">
            If you or someone you know is in immediate danger, please reach out:
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <a href="tel:14416" className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition-shadow">
              Tele-MANAS: 14416
            </a>
            <a href="tel:18602662345" className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition-shadow">
              Vandrevala: 1860-2662-345
            </a>
            <a href="tel:9152987821" className="rounded-full bg-white px-5 py-2 shadow-sm hover:shadow-md transition-shadow">
              iCall: 9152987821
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="text-2xl font-bold text-primary">
              Help<span className="text-secondary">&</span>Heal
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-light">
              India&apos;s on-demand mental health platform. Instant, affordable,
              and private access to emotional support — anytime you need it.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-light">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-text-light">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/provider-apply" className="hover:text-primary transition-colors">Become a Listener</a></li>
              <li><a href="/provider-apply" className="hover:text-primary transition-colors">For Counselors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-light">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-text-light">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
          <p className="text-sm text-text-light">
            &copy; 2026 Help&Heal. All rights reserved.
          </p>
          <p className="text-xs text-text-light">
            Made with care in India for India
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Safety />
      </main>
      <Footer />
    </>
  );
}
