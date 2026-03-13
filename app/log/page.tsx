'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect /log to /progress
export default function LogPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/progress');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
}
