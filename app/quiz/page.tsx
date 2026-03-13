'use client';

import { useRouter } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import QuizFlow from '@/components/quiz/QuizFlow';
import { useEffect } from 'react';

export default function QuizPage() {
  const router = useRouter();
  const { resetQuiz, quizResults } = useSkinBaseStore();

  // Allow ?reset=true to force a fresh quiz (for demos / sharing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reset') === 'true') {
        resetQuiz();
      }
    }
  }, [resetQuiz]);

  // If quiz already completed, offer to retake
  const handleRetake = () => {
    resetQuiz();
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      {quizResults.completed ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Already Completed!</h2>
          <p className="text-slate-500 mb-6">
            Your skin profile: <strong className="capitalize">{quizResults.skinType}</strong> skin,{' '}
            <strong className="capitalize">{quizResults.experience}</strong> level
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 text-white rounded-xl font-medium transition-colors"
              style={{ background: '#1B2B4B' }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleRetake}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        <QuizFlow onComplete={() => router.push('/routine/active?time=am&first=true')} />
      )}
    </div>
  );
}
