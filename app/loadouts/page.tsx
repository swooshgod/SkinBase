'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import { products } from '@/lib/products';
import type { Loadout, TimeOfDay } from '@/types';
import { PatchTestBanner } from '@/components/routine/BeginnerBanner';

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function getDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

export default function LoadoutsPage() {
  const { loadouts, addLoadout, removeLoadout, logEntry, progressLog } = useSkinBaseStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<TimeOfDay | 'both'>('am');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [loggedToday, setLoggedToday] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = getDateStr();
    const todayLogs = progressLog.filter((e) => e.date === today);
    setLoggedToday(new Set(todayLogs.map((e) => e.loadoutId).filter(Boolean) as string[]));
  }, [progressLog]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(id)) {
        if (recentlyAdded === id) setRecentlyAdded(null);
        return prev.filter((p) => p !== id);
      }
      const product = products.find((p) => p.id === id);
      if (product) setRecentlyAdded(product.name);
      return [...prev, id];
    });
  };

  const handleCreate = () => {
    if (!newName.trim() || selectedProductIds.length === 0) return;
    const loadout: Loadout = {
      id: generateId(),
      name: newName.trim(),
      timeOfDay: newTimeOfDay,
      productIds: selectedProductIds,
      createdAt: new Date().toISOString(),
    };
    addLoadout(loadout);
    setNewName('');
    setSelectedProductIds([]);
    setShowCreate(false);
  };

  const handleQuickLog = (loadout: Loadout) => {
    const today = getDateStr();
    logEntry({
      id: generateId(),
      date: today,
      loadoutId: loadout.id,
      loadoutName: loadout.name,
      timeOfDay: loadout.timeOfDay === 'both' ? 'am' : loadout.timeOfDay,
      createdAt: new Date().toISOString(),
    });
    setLoggedToday((prev) => new Set(Array.from(prev).concat(loadout.id)));
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const getLoadoutProducts = (loadout: Loadout) =>
    loadout.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Your Loadouts
            </h1>
            <p className="text-sm text-slate-400">
              Save product bundles for quick logging
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-lg"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
          >
            {showCreate ? 'Cancel' : '+ New'}
          </motion.button>
        </div>

        {/* Create Loadout Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Create Loadout
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., My Morning Routine"
                    className="w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: '#E7DFD5', outlineColor: 'rgba(27,43,75,0.25)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Time of Day
                  </label>
                  <div className="flex gap-2">
                    {(['am', 'pm', 'both'] as const).map((time) => (
                      <button
                        key={time}
                        onClick={() => setNewTimeOfDay(time)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          newTimeOfDay === time
                            ? 'text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                        style={newTimeOfDay === time ? { background: '#1B2B4B' } : { background: '#F5F0EA' }}
                      >
                        {time === 'am' ? '🌅 AM' : time === 'pm' ? '🌙 PM' : '☀️ Both'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Select Products ({selectedProductIds.length} selected)
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2.5 rounded-xl border text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent text-sm mb-3"
                    style={{ borderColor: '#E7DFD5' }}
                  />
                  <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                    {filteredProducts.slice(0, 30).map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => toggleProduct(product.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all text-sm ${
                            isSelected
                              ? 'border'
                              : 'bg-slate-50 border border-transparent hover:bg-slate-100'
                          }`}
                          style={isSelected ? { background: '#FBE9E4', borderColor: '#253860' } : {}}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                              isSelected
                                ? ''
                                : 'border-slate-300'
                            }`}
                            style={isSelected ? { background: '#1B2B4B', borderColor: '#1B2B4B' } : {}}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-700 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product.brand} · {product.category}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {recentlyAdded && <PatchTestBanner productName={recentlyAdded} />}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCreate}
                  disabled={!newName.trim() || selectedProductIds.length === 0}
                  className="w-full py-3 text-white rounded-xl font-semibold shadow-lg disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
                >
                  Create Loadout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loadout List */}
        {loadouts.length === 0 && !showCreate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-lg font-semibold text-slate-700 mb-1">
              No loadouts yet
            </h2>
            <p className="text-sm text-slate-400">
              Create a loadout to save your product bundles
            </p>
          </motion.div>
        )}

        <div className="space-y-3">
          {loadouts.map((loadout, index) => {
            const loadoutProducts = getLoadoutProducts(loadout);
            const isLoggedToday = loggedToday.has(loadout.id);
            return (
              <motion.div
                key={loadout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{loadout.name}</h3>
                    <p className="text-xs text-slate-400">
                      {loadout.timeOfDay === 'am'
                        ? '🌅 Morning'
                        : loadout.timeOfDay === 'pm'
                        ? '🌙 Evening'
                        : '☀️ AM & PM'}{' '}
                      · {loadoutProducts.length} products
                    </p>
                  </div>
                  <button
                    onClick={() => removeLoadout(loadout.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Product chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {loadoutProducts.map((product) => (
                    <span
                      key={product!.id}
                      className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-xs"
                    >
                      {product!.name}
                    </span>
                  ))}
                </div>

                {/* Quick Log Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleQuickLog(loadout)}
                  disabled={isLoggedToday}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isLoggedToday
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'text-white shadow-md'
                  }`}
                  style={!isLoggedToday ? { background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' } : {}}
                >
                  {isLoggedToday ? 'Logged today ✓' : 'Quick Log — Done Today'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
