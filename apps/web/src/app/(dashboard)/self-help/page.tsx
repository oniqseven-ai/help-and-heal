'use client';

import Link from 'next/link';
import {
  MessageCircle,
  Wind,
  Hand,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const EXERCISES = [
  {
    title: 'AI Chat Support',
    description: 'Talk to our AI assistant for immediate coping strategies and emotional support.',
    icon: Sparkles,
    href: '/self-help/breathing',
    color: 'bg-primary/10 text-primary',
    badge: 'AI Powered',
  },
  {
    title: 'Breathing Exercise',
    description: 'Calm your mind with guided box breathing. Takes just 3 minutes.',
    icon: Wind,
    href: '/self-help/breathing',
    color: 'bg-secondary/10 text-secondary',
    badge: null,
  },
  {
    title: '5-4-3-2-1 Grounding',
    description: 'A sensory grounding technique to bring you back to the present moment.',
    icon: Hand,
    href: '/self-help/grounding',
    color: 'bg-accent/10 text-accent',
    badge: null,
  },
];

const ARTICLES = [
  { title: 'Understanding Anxiety: A Beginner\'s Guide', topic: 'Anxiety', readTime: '5 min' },
  { title: 'How to Deal with Loneliness', topic: 'Loneliness', readTime: '4 min' },
  { title: '10 Daily Habits for Better Mental Health', topic: 'Wellness', readTime: '6 min' },
  { title: 'Managing Work Stress: Practical Tips', topic: 'Stress', readTime: '5 min' },
];

export default function SelfHelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Self-Help</h1>
      <p className="mt-1 text-text-light">
        Tools and resources to support your mental health journey
      </p>

      {/* Exercises */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-bold">Guided Exercises</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXERCISES.map((exercise) => (
            <Link
              key={exercise.title}
              href={exercise.href}
              className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${exercise.color}`}>
                  <exercise.icon className="h-5 w-5" />
                </div>
                {exercise.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {exercise.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold">{exercise.title}</h3>
              <p className="mt-1 text-sm text-text-light">{exercise.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Mood tracker teaser */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold">Mood Tracker</h2>
        </div>
        <p className="mt-2 text-sm text-text-light">
          Track how your mood changes over time. Log your mood on the dashboard after each session to see your progress.
        </p>
        <Link
          href="/dashboard"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Log your mood <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Articles */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Articles & Resources</h2>
        <div className="space-y-3">
          {ARTICLES.map((article) => (
            <div
              key={article.title}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <BookOpen className="h-5 w-5 text-text-light" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{article.title}</h3>
                <p className="text-xs text-text-light">
                  {article.topic} · {article.readTime} read
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-text-light" />
            </div>
          ))}
        </div>
      </div>

      {/* Talk to human CTA */}
      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 text-lg font-bold">Need to talk to someone?</h3>
        <p className="mt-1 text-sm text-text-light">
          Self-help is great, but sometimes you need a real human. Our providers are here for you.
        </p>
        <Link
          href="/providers"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
        >
          Find a Provider
        </Link>
      </div>
    </div>
  );
}
