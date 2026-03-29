'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PHASES = [
  { label: 'Breathe In', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Breathe Out', duration: 4 },
  { label: 'Hold', duration: 4 },
];

export default function BreathingPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhaseIndex(0);
    setCountdown(PHASES[0].duration);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = (pi + 1) % PHASES.length;
            if (next === 0) setCycles((c) => c + 1);
            return next;
          });
          return PHASES[(phaseIndex + 1) % PHASES.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phaseIndex]);

  const phase = PHASES[phaseIndex];
  const isInhale = phase.label === 'Breathe In';
  const isExhale = phase.label === 'Breathe Out';

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-text-light hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-center text-2xl font-bold">Box Breathing</h1>
      <p className="mt-2 text-center text-sm text-text-light">
        A simple technique to calm your nervous system. Follow the circle.
      </p>

      {/* Breathing circle */}
      <div className="mt-10 flex flex-col items-center">
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Animated circle */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-primary/20 transition-all duration-1000 ${
              isRunning
                ? isInhale
                  ? 'scale-100 bg-primary/10'
                  : isExhale
                  ? 'scale-75 bg-primary/5'
                  : 'bg-primary/8'
                : 'scale-75 bg-primary/5'
            }`}
          />
          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="text-5xl font-bold text-primary">{countdown}</div>
            <div className="mt-2 text-lg font-semibold text-text">
              {isRunning ? phase.label : 'Ready'}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-text-light">
          Cycles completed: {cycles}
        </div>

        {/* Controls */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          {(isRunning || cycles > 0) && (
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-text-light hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-10 rounded-2xl bg-white border border-gray-100 p-6">
        <h2 className="font-semibold">How it works</h2>
        <ol className="mt-3 space-y-2 text-sm text-text-light">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
            <span><strong>Breathe in</strong> slowly through your nose for 4 seconds</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
            <span><strong>Hold</strong> your breath for 4 seconds</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
            <span><strong>Breathe out</strong> slowly through your mouth for 4 seconds</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
            <span><strong>Hold</strong> for 4 seconds, then repeat</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-text-light">
          Try 4-6 cycles for best results. This technique is used by Navy SEALs to stay calm under pressure.
        </p>
      </div>
    </div>
  );
}
