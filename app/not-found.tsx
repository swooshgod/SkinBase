import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-6">🧴</div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-lg text-slate-500 mb-1">Page not found</p>
        <p className="text-sm text-slate-400 mb-8">
          This page doesn&apos;t exist — but your skincare routine should.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
        >
          Back to SkinBase
        </Link>
      </div>
    </div>
  );
}
