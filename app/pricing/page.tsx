'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const features = [
  { label: 'AI Skin Transformation', icon: '🪄' },
  { label: 'AI Ingredient Conflict Checker', icon: '🧪' },
  { label: '"What to Add Next" AI Recommendations', icon: '✨' },
  { label: 'Monthly AI Skin Analysis Report', icon: '📋' },
  { label: 'Unlimited Loadouts', icon: '📦' },
  { label: 'Advanced Analytics', icon: '📊' },
  { label: 'Ad-free Experience', icon: '🚫' },
];

const lifetimeFeatures = [
  'Everything in Pro',
  'Never pay again',
  'Founding member badge',
  'Priority feature requests',
  'Lock in before price increase',
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8">
      <Suspense fallback={<div className="max-w-lg mx-auto text-center py-20 text-slate-400">Loading...</div>}>
        <PricingContent />
      </Suspense>
    </main>
  );
}

function PricingContent() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  const price = annual ? '$7.99' : '$9.99';
  const period = annual ? '/mo (billed annually)' : '/month';
  const savings = annual ? '2 months free!' : null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const priceId = annual
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/pricing?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Success / Cancel Banners */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
          >
            <p className="text-green-700 font-semibold">You&apos;re now Pro!</p>
            <p className="text-green-600 text-sm mt-1">Welcome to SkinBase Pro. Enjoy all premium features.</p>
          </motion.div>
        )}
        {isCanceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center"
          >
            <p className="text-slate-700 font-medium">No worries, you can upgrade anytime</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Upgrade to Pro</h1>
        <p className="text-slate-500 text-sm mt-1">Unlock the full SkinBase experience</p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className={`text-sm font-medium ${!annual ? 'text-slate-800' : 'text-slate-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative w-12 h-6 rounded-full transition-colors"
          style={{ background: annual ? 'linear-gradient(135deg, #1B2B4B, #111C30)' : '#E7DFD5' }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ left: annual ? '26px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-slate-800' : 'text-slate-400'}`}>
          Annual
        </span>
        {savings && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            {savings}
          </span>
        )}
      </div>

      {/* Pro Pricing card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl overflow-hidden mb-4"
        style={{ border: '1px solid #E7DFD5', boxShadow: '0 20px 40px rgba(45,80,22,0.1)' }}
      >
        {/* Card header */}
        <div className="px-6 py-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}>
          <p className="text-sm font-medium opacity-90">Pro Plan</p>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-sm opacity-80">{period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-sm text-slate-700 font-medium">{feature.label}</span>
              <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <motion.button
            onClick={handleCheckout}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="block w-full py-3.5 text-white rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to Stripe...
              </span>
            ) : (
              `Unlock Pro ${annual ? 'Annual' : 'Monthly'}`
            )}
          </motion.button>
          <p className="text-xs text-slate-400 text-center mt-3">
            Cancel anytime. Secure payments via Stripe.
          </p>
        </div>
      </motion.div>

      {/* Lifetime / Founding Member card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6 mb-6 relative"
        style={{
          background: 'linear-gradient(135deg, #1B2B4B, #111C30)',
          border: '2px solid #E8856A',
        }}
      >
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: '#E8856A' }}
        >
          ⭐ FOUNDING MEMBER
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Lifetime</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black text-white">$99</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', fontSize: 18 }}>$149</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 16 }}>
          One-time payment · Forever access · First 200 users only
        </p>
        <ul className="space-y-2 mb-6">
          {lifetimeFeatures.map(f => (
            <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ color: '#E8856A' }}>✓</span> {f}
            </li>
          ))}
        </ul>
        <a
          href="mailto:hello@skinbase.app?subject=Founding Member"
          className="block w-full text-center py-3 rounded-xl font-bold text-sm"
          style={{ background: '#E8856A', color: '#FFFFFF' }}
        >
          Claim Founding Member Spot
        </a>
        <p className="text-center text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Price rises to $149 after founding cohort fills
        </p>
      </motion.div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Link href="/" className="text-sm transition-colors" style={{ color: '#A8A29E' }}>
          Maybe later
        </Link>
      </div>
    </div>
  );
}
