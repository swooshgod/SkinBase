'use client';

import { useEffect } from 'react';
import { useSkinBaseStore } from '@/lib/store';

export default function StoreHydration() {
  useEffect(() => {
    useSkinBaseStore.persist.rehydrate();
  }, []);

  return null;
}
