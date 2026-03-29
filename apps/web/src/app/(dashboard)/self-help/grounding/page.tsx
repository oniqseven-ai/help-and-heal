'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const STEPS = [
  { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see right now', emoji: '👀', color: 'bg-primary' },
  { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can physically feel', emoji: '✋', color: 'bg-secondary' },
  { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear', emoji: '👂', color: 'bg-accent' },
  { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell', emoji: '👃', color: 'bg-purple-500' },
  { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste', emoji: '👅', color: 'bg-pink-500' },
];

export default function GroundingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <Check className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold">Well done!</h1>
        <p className="mt-2 text-text-light">
          You&apos;ve completed the grounding exercise. You should feel more present and connected to the moment.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { setCurrentStep(0); setCompleted(false); }}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-text-light hover:bg-gray-50"
          >
            Do it again
          </button>
          <button
            onClick={() => router.push('/self-help')}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Back to Self-Help
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-center text-2xl font-bold">5-4-3-2-1 Grounding</h1>
      <p className="mt-2 text-center text-sm text-text-light">
        Use your senses to bring yourself back to the present moment
      </p>

      {/* Progress */}
      <div className="mt-8 flex justify-center gap-2">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`h-2 w-12 rounded-full transition-colors ${
              i <= currentStep ? 'bg-primary' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="mt-10 text-center">
        <div className="text-6xl">{step.emoji}</div>
        <div className={`mt-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${step.color} text-3xl font-extrabold text-white`}>
          {step.count}
        </div>
        <h2 className="mt-4 text-xl font-bold">{step.sense}</h2>
        <p className="mt-2 text-lg text-text-light">{step.prompt}</p>
      </div>

      <p className="mt-6 text-center text-sm text-text-light">
        Take your time. There&apos;s no rush. When you&apos;re ready, tap next.
      </p>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-primary px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
        >
          {currentStep < STEPS.length - 1 ? 'Next' : 'Finish'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
