'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import PremiumGate from '@/components/ui/PremiumGate';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import SkinReport, { type SkinAnalysis } from '@/components/ui/SkinReport';
import { useRouter } from 'next/navigation';

type Tab = 'analyze' | 'transform';
type Timeframe = '4weeks' | '8weeks' | '12weeks';
type TransformStep = 'upload' | 'timeframe' | 'generating' | 'result';
type AnalyzeStep = 'upload' | 'preview' | 'analyzing' | 'result';

const timeframeOptions: { value: Timeframe; label: string }[] = [
  { value: '4weeks', label: '4 Weeks' },
  { value: '8weeks', label: '8 Weeks' },
  { value: '12weeks', label: '12 Weeks' },
];

const transformLoadingMessages = [
  'Analyzing your skin...',
  'Applying your routine...',
  'Enhancing your glow...',
  'Almost there...',
];

const analyzeLoadingMessages = [
  'Scanning your skin...',
  'Detecting concerns...',
  'Building your skin report...',
  'Almost ready...',
];

// ─── Privacy Info (simplified single line) ──────────────────────
function PrivacyLine() {
  return (
    <p className="text-xs text-slate-400 flex items-center gap-1 justify-center mb-4">
      <span>🔒</span> Your photo is analyzed privately and never stored
    </p>
  );
}

// ─── Photo Tips (simplified single line) ──────────────────────────
function PhotoTips() {
  return (
    <p className="text-sm mb-4 text-center" style={{ color: '#1B2B4B' }}>
      💡 Bare face · Natural light · Look straight at camera
    </p>
  );
}

// ─── Analyze Tab Content ────────────────────────────────────────
function AnalyzeContent({ onSwitchToTransform, sharedPhoto }: { onSwitchToTransform: (photo?: string) => void; sharedPhoto?: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState<AnalyzeStep>(sharedPhoto ? 'preview' : 'upload');
  const [photo, setPhoto] = useState<string | null>(sharedPhoto || null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'analyzing') return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % analyzeLoadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target?.result as string);
      setStep('preview');
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    if (!photo) return;
    setStep('analyzing');
    setLoadingMsgIdx(0);
    setError(null);

    try {
      const res = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setAnalysis(data.analysis);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('preview');
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setAnalysis(null);
    setError(null);
    setStep('upload');
  };

  const handleShopProducts = () => {
    // Navigate to products with concerns pre-filtered
    const concerns = analysis?.concerns.map(c => c.name).join(',') || '';
    router.push(`/products${concerns ? `?concerns=${encodeURIComponent(concerns)}` : ''}`);
  };

  const handleSeeTransform = () => {
    onSwitchToTransform(photo || undefined);
  };

  return (
    <div className="space-y-4">
      {step === 'upload' && <PrivacyLine />}

      <AnimatePresence mode="wait">
        {/* Upload Step */}
        {step === 'upload' && (
          <motion.div
            key="analyze-upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PhotoTips />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
              style={{ background: '#FBE9E4', border: '1px solid #E7DFD5' }}
            >
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center pulse"
                style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}
              >
                <span className="text-4xl">📷</span>
              </div>
              <p className="text-slate-700 font-medium">Upload your bare face photo</p>
              <p className="text-slate-400 text-sm mt-1">Drag & drop or tap to upload</p>
              <p className="text-slate-400 text-xs mt-3">Clear, front-facing photo with no makeup</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <motion.div
            key="analyze-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {photo && (
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg" style={{ boxShadow: '0 0 0 4px #FBE9E4' }}>
                  <img src={photo} alt="Your photo" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full py-3.5 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
            >
              Analyze My Skin
            </motion.button>

            <button
              onClick={handleReset}
              className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Choose a different photo
            </button>
          </motion.div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#FBE9E4' }} />
              <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: '#1B2B4B' }} />
              <div className="absolute inset-3 rounded-full overflow-hidden">
                {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsgIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-600 font-medium"
              >
                {analyzeLoadingMessages[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>

            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#253860' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Result Step */}
        {step === 'result' && analysis && (
          <motion.div
            key="analyze-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SkinReport
              analysis={analysis}
              onRetake={handleReset}
              onShopProducts={handleShopProducts}
              onSeeTransform={handleSeeTransform}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Transform Tab Content ──────────────────────────────────────
function TransformContent({ preloadedPhoto }: { preloadedPhoto?: string | null }) {
  const [step, setStep] = useState<TransformStep>(preloadedPhoto ? 'timeframe' : 'upload');
  const [selfie, setSelfie] = useState<string | null>(preloadedPhoto || null);
  const [timeframe, setTimeframe] = useState<Timeframe>('8weeks');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'generating') return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % transformLoadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelfie(e.target?.result as string);
      setStep('timeframe');
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleGenerate = async () => {
    if (!selfie) return;
    setStep('generating');
    setLoadingMsgIdx(0);
    setError(null);

    try {
      const res = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selfie, timeframe }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transform failed');

      setResultUrl(data.outputUrl);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('timeframe');
    }
  };

  const handleReset = () => {
    setSelfie(null);
    setResultUrl(null);
    setError(null);
    setStep('upload');
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skinbase-transform-${timeframe}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, '_blank');
    }
  };

  const handleShare = async () => {
    if (!resultUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SkinBase Transformation',
          text: `Check out my ${timeframe.replace('weeks', '-week')} skin transformation preview!`,
          url: resultUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(resultUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PrivacyLine />
            <PhotoTips />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
              style={{ background: '#FBE9E4', border: '1px solid #E7DFD5' }}
            >
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center pulse"
                style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}
              >
                <span className="text-4xl">📷</span>
              </div>
              <p className="text-slate-700 font-medium">Upload a selfie</p>
              <p className="text-slate-400 text-sm mt-1">Drag & drop or tap to upload</p>
              <p className="text-slate-400 text-xs mt-3">For best results, use a clear, front-facing face photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          </motion.div>
        )}

        {step === 'timeframe' && (
          <motion.div
            key="timeframe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {selfie && (
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 4px #FBE9E4' }}>
                  <img src={selfie} alt="Your selfie" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-slate-600 mb-3 text-center">Select timeframe</p>
              <div className="flex gap-3 justify-center">
                {timeframeOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      timeframe === opt.value
                        ? 'text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    style={timeframe === opt.value ? { background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' } : { background: '#F5F0EA' }}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              className="w-full py-3.5 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
            >
              See Your Future Skin
            </motion.button>

            <button
              onClick={handleReset}
              className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Choose a different photo
            </button>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 space-y-6"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#FBE9E4' }} />
              <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: '#1B2B4B' }} />
              <div className="absolute inset-3 rounded-full overflow-hidden">
                {selfie && <img src={selfie} alt="" className="w-full h-full object-cover" />}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsgIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-600 font-medium"
              >
                {transformLoadingMessages[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>

            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#253860' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && selfie && resultUrl && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <BeforeAfterSlider beforeSrc={selfie} afterSrc={resultUrl} />

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex-1 py-2.5 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </motion.button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
        <p className="text-xs text-amber-700">
          This is an AI visualization for motivation only. Individual results vary. Not a medical prediction.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page with Tabs ────────────────────────────────────────
function PageContent() {
  const [activeTab, setActiveTab] = useState<Tab>('analyze');
  const [sharedPhoto, setSharedPhoto] = useState<string | null>(null);
  const isPro = useSkinBaseStore((s) => s.isPro);

  const handleSwitchToTransform = (photo?: string) => {
    if (photo) setSharedPhoto(photo);
    setActiveTab('transform');
  };

  const tabs: { value: Tab; label: string; badge?: string }[] = [
    { value: 'analyze', label: 'Analyze' },
    { value: 'transform', label: 'Transform', badge: 'PRO' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">AI Skin Studio</h1>
        <p className="text-slate-500 text-sm mt-1">Analyze your skin or preview your future glow</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.value
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={activeTab === tab.value ? { background: '#FBE9E4', color: '#1B2B4B' } : { background: '#F5F0EA', color: '#78716C' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'analyze' && (
          <motion.div
            key="tab-analyze"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AnalyzeContent onSwitchToTransform={handleSwitchToTransform} />
          </motion.div>
        )}

        {activeTab === 'transform' && (
          <motion.div
            key="tab-transform"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {isPro ? (
              <TransformContent preloadedPhoto={sharedPhoto} />
            ) : (
              <PremiumGate>
                <TransformContent preloadedPhoto={sharedPhoto} />
              </PremiumGate>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TransformPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <PageContent />
      </div>
    </main>
  );
}
