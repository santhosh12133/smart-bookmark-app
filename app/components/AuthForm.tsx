'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export default function AuthForm() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Error signing in:', error.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (session) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {session.user.email}</h2>
        <button
          onClick={handleSignOut}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        Sign in with Google
      </button>
    </div>
  );
}
