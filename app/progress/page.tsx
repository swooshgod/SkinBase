'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSkinBaseStore } from '@/lib/store';
import { getDaysToNextLevel } from '@/lib/streak';
import { products as allProducts } from '@/lib/products';
import PhotoPicker from '@/components/ui/PhotoPicker';

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getDateStr(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function ProgressPage() {
  const { calculateStreak, getTodayStatus, routineLogs, getDaysLoggedTotal, getLevel, amSlots, pmSlots, progressPhotos, addProgressPhoto, removeProgressPhoto } = useSkinBaseStore();
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const streak = mounted ? calculateStreak() : 0;
  const todayStatus = mounted ? getTodayStatus() : { amDone: false, pmDone: false };
  const daysLogged = mounted ? getDaysLoggedTotal() : 0;
  const level = mounted ? getLevel() : 1;
  const daysToNext = getDaysToNextLevel(daysLogged);

  const levelProgress = level === 4 ? 100
    : level === 1 ? (daysLogged / 14) * 100
    : level === 2 ? ((daysLogged - 14) / 16) * 100
    : ((daysLogged - 30) / 30) * 100;

  // Generate last 30 days
  const last30Days = useMemo(() => {
    const days: { date: string; amDone: boolean; pmDone: boolean; dayOfWeek: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getDateStr(d);
      const log = routineLogs.find((l) => l.date === dateStr);
      days.push({ date: dateStr, amDone: log?.amDone ?? false, pmDone: log?.pmDone ?? false, dayOfWeek: d.getDay() });
    }
    return days;
  }, [routineLogs]);

  // Get products for a day's detail
  const getDayProducts = (dateStr: string) => {
    const log = routineLogs.find(l => l.date === dateStr);
    if (!log) return { am: [], pm: [] };
    const getProduct = (id: string | null) => id ? allProducts.find(p => p.id === id) : null;
    const amProducts = Object.values(amSlots).map(id => getProduct(id as string)).filter(Boolean);
    const pmProducts = Object.values(pmSlots).map(id => getProduct(id as string)).filter(Boolean);
    return {
      am: log.amDone ? amProducts : [],
      pm: log.pmDone ? pmProducts : [],
      log,
    };
  };

  const selectedDayData = selectedDay ? getDayProducts(selectedDay) : null;
  const selectedDayLog = selectedDay ? routineLogs.find(l => l.date === selectedDay) : null;

  return (
    <div className="min-h-screen px-4 py-6 pb-24 max-w-lg mx-auto" style={{ background: '#FDFAF7' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Progress</h1>
            <p className="text-sm" style={{ color: '#A8A29E' }}>Your skincare journey</p>
          </div>
          {/* Compact streak pill */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: streak > 0 ? 'linear-gradient(135deg, #1B2B4B, #111C30)' : '#F5F0EA' }}
          >
            <span>🔥</span>
            <span className="font-black text-lg" style={{ color: streak > 0 ? '#FFFFFF' : '#A8A29E' }}>{streak}</span>
            <span className="text-xs font-medium" style={{ color: streak > 0 ? 'rgba(255,255,255,0.75)' : '#A8A29E' }}>days</span>
          </div>
        </div>

        {/* TODAY STATUS — compact inline */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A8A29E' }}>Today</span>
          <div className="flex gap-2 ml-auto">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: todayStatus.amDone ? '#FBE9E4' : '#F5F0EA', color: todayStatus.amDone ? '#1B2B4B' : '#A8A29E' }}
            >
              ☀️ AM {todayStatus.amDone ? '✓' : '–'}
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: todayStatus.pmDone ? '#FBE9E4' : '#F5F0EA', color: todayStatus.pmDone ? '#1B2B4B' : '#A8A29E' }}
            >
              🌙 PM {todayStatus.pmDone ? '✓' : '–'}
            </div>
          </div>
        </div>

        {/* LEVEL PROGRESS — at the top */}
        <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: '#78716C' }}>Level Progress</span>
            <span className="text-sm font-bold" style={{ color: '#1B2B4B' }}>Level {level}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: '#F5F0EA' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelProgress, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #E8856A, #F5A98A)' }}
            />
          </div>
          <p className="text-xs" style={{ color: '#A8A29E' }}>
            {level < 4 ? `${daysToNext} more days to unlock Level ${level + 1}` : '🏆 Max level — you\'re a skincare pro!'}
          </p>
        </div>

        {/* 30-DAY CALENDAR — right under level bar, days clickable */}
        <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#78716C' }}>Last 30 Days</h2>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: '#A8A29E' }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#F5F0EA' }} />None
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#FBE9E4' }} />Half
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#1B2B4B' }} />Both
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayLabels.map((l, i) => (
              <div key={i} className="text-center text-[9px] font-bold uppercase" style={{ color: '#A8A29E' }}>{l}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: last30Days[0]?.dayOfWeek || 0 }).map((_, i) => (
              <div key={`e-${i}`} className="w-full aspect-square" />
            ))}
            {last30Days.map((day, i) => {
              const dayNum = new Date(day.date + 'T12:00:00').getDate();
              const isToday = day.date === getDateStr();
              const both = day.amDone && day.pmDone;
              const partial = (day.amDone || day.pmDone) && !both;
              const isSelected = selectedDay === day.date;
              return (
                <motion.button
                  key={day.date}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.008 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setSelectedDay(isSelected ? null : day.date)}
                  className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all"
                  style={{
                    background: isSelected
                      ? '#E8856A'
                      : both
                      ? 'linear-gradient(135deg, #1B2B4B, #111C30)'
                      : partial
                      ? '#FBE9E4'
                      : '#F5F0EA',
                    color: isSelected ? '#FFFFFF'
                      : both ? '#FFFFFF'
                      : partial ? '#1B2B4B'
                      : isToday ? '#1C1917'
                      : '#A8A29E',
                    border: isToday && !both && !isSelected ? '2px solid #E8856A' : 'none',
                    boxShadow: both ? '0 2px 6px rgba(27,43,75,0.2)' : 'none',
                  }}
                >
                  {dayNum}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* DAY DETAIL — appears when a day is tapped */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="rounded-2xl p-4"
              style={{ background: '#FFFFFF', border: '1px solid #E8856A' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{formatDisplayDate(selectedDay)}</p>
                <button onClick={() => setSelectedDay(null)} className="text-xs" style={{ color: '#A8A29E' }}>✕ Close</button>
              </div>

              {!selectedDayLog || (!selectedDayLog.amDone && !selectedDayLog.pmDone) ? (
                <p className="text-sm text-center py-4" style={{ color: '#A8A29E' }}>No routine logged this day</p>
              ) : (
                <div className="space-y-3">
                  {/* Status chips */}
                  <div className="flex gap-2">
                    {selectedDayLog?.amDone && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>☀️ AM Done</span>
                    )}
                    {selectedDayLog?.pmDone && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>🌙 PM Done</span>
                    )}
                  </div>

                  {/* Products used */}
                  {selectedDayData && [...(selectedDayData.am || []), ...(selectedDayData.pm || [])].length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#A8A29E' }}>Products Used</p>
                      <div className="space-y-2">
                        {([...(selectedDayData.am || []), ...(selectedDayData.pm || [])].filter((p, i, arr) => p && arr.findIndex(x => x?.id === p?.id) === i) as NonNullable<typeof selectedDayData.am[0]>[]).slice(0, 4).map((product) => (
                          <div key={product.id} className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden"
                              style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' }}
                            >
                              {product.amazonImageUrl && (
                                <img src={product.amazonImageUrl} alt={product.name} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>{product.name}</p>
                              <p className="text-[10px]" style={{ color: '#A8A29E' }}>{product.brand}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo placeholder */}
                  <div
                    className="w-full rounded-xl flex items-center justify-center"
                    style={{ height: 80, background: '#F5F0EA', border: '1.5px dashed #E7DFD5' }}
                  >
                    <span className="text-xs" style={{ color: '#A8A29E' }}>📷 No photo logged this day</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Photos */}
        <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#78716C' }}>Progress Photos</h2>
            <PhotoPicker onPhoto={addProgressPhoto} facingMode="user">
              <span className="text-xs font-medium" style={{ color: '#E8856A' }}>+ Add Photo</span>
            </PhotoPicker>
          </div>

          {!mounted || progressPhotos.length === 0 ? (
            <PhotoPicker onPhoto={addProgressPhoto} facingMode="user">
              <div className="flex flex-col items-center justify-center rounded-xl py-8"
                style={{ background: '#F5F0EA', border: '2px dashed #E7DFD5' }}>
                <span className="text-3xl mb-2">📷</span>
                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>Tap to add your first photo</p>
                <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>Track your skin journey over time</p>
              </div>
            </PhotoPicker>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {progressPhotos.slice().reverse().map((photo) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden"
                  style={{ background: '#F5F0EA' }}>
                  <img src={photo.dataUrl} alt="Progress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5"
                    style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <p className="text-[9px] text-white">{photo.date}</p>
                  </div>
                  <button
                    onClick={() => removeProgressPhoto(photo.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    ✕
                  </button>
                </div>
              ))}
              {/* Add more button */}
              <PhotoPicker onPhoto={addProgressPhoto} facingMode="user">
                <div className="aspect-square rounded-xl flex flex-col items-center justify-center"
                  style={{ background: '#F5F0EA', border: '2px dashed #E7DFD5' }}>
                  <span className="text-xl" style={{ color: '#A8A29E' }}>+</span>
                  <p className="text-[9px]" style={{ color: '#A8A29E' }}>Add</p>
                </div>
              </PhotoPicker>
            </div>
          )}
          <p className="text-[10px] text-center mt-2" style={{ color: '#A8A29E' }}>Photos stored on your device</p>
        </div>

        {/* Empty state */}
        {routineLogs.length === 0 && (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-semibold mb-1" style={{ color: '#1C1917' }}>Start Your Journey</h3>
            <p className="text-sm mb-4" style={{ color: '#A8A29E' }}>Complete your first routine to see progress here</p>
            <Link href="/">
              <button className="px-6 py-2.5 text-white rounded-xl text-sm font-medium"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 4px 16px rgba(27,43,75,0.25)' }}>
                Start Routine
              </button>
            </Link>
          </div>
        )}

      </motion.div>
    </div>
  );
}
