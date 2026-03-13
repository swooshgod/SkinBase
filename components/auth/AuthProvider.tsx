'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSkinBaseStore } from '@/lib/store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsPro, syncWithSupabase } = useSkinBaseStore();

  useEffect(() => {
    if (!supabase) return;

    // Restore session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        await fetchAndSyncProfile(user.id);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          await fetchAndSyncProfile(user.id);
          // Sync localStorage data to Supabase on sign-in
          if (event === 'SIGNED_IN') {
            try {
              await syncWithSupabase();
            } catch {
              // non-critical — ignore sync errors
            }
          }
        } else {
          setIsPro(false);
        }
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAndSyncProfile(userId: string) {
    if (!supabase) return;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro, name, skin_type, concerns, experience')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setIsPro(profile.is_pro ?? false);
        // Optionally populate store fields from profile if not already set locally
        const store = useSkinBaseStore.getState();
        if (!store.userName && profile.name) {
          useSkinBaseStore.setState({ userName: profile.name });
        }
      }
    } catch {
      // non-critical
    }
  }

  return <>{children}</>;
}
