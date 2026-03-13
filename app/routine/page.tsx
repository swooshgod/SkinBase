'use client';

import Link from 'next/link';
import { useSkinBaseStore } from '@/lib/store';
import RoutineGuide from '@/components/routine/RoutineGuide';

export default function RoutinePage() {
  const { quizResults } = useSkinBaseStore();

  if (!quizResults.completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🧪</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>Take the Quiz First</h2>
          <p className="mb-6" style={{ color: '#64748b' }}>
            We need to know your skin type to build your routine
          </p>
          <Link href="/quiz">
            <button
              className="w-full py-3 text-white rounded-xl font-medium"
              style={{ background: '#1B2B4B' }}
            >
              Start Skin Quiz
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pt-4 pb-24">
      <div className="mb-4">
        <Link href="/" className="text-sm transition-colors" style={{ color: '#94a3b8' }}>
          ← Back to Dashboard
        </Link>
      </div>
      <RoutineGuide />
    </div>
  );
}
