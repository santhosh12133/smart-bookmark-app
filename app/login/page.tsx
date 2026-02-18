"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

/**
 * LOGIN PAGE
 * 
 * This page handles user authentication using Supabase OAuth with Google.
 * 
 * Authentication Flow:
 * 1. User clicks "Sign in with Google" button
 * 2. Browser redirects to Google's OAuth consent screen
 * 3. User grants app permission to access their email
 * 4. Google redirects back to /auth/callback with OAuth code
 * 5. Supabase client automatically exchanges code for session
 * 6. User is logged in and redirected to main app
 * 
 * Why we don't handle the callback here:
 * - Supabase automatically handles OAuth callback at /auth/callback
 * - After successful auth, user is redirected to main dashboard
 * - This page is just the entry point for unauthenticated users
 */
export default function Login() {
  const [loading, setLoading] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * PAGE ANIMATION
   * 
   * Triggers entrance animation after page mount.
   * Separating from other logic prevents animation on initial render.
   */
  useEffect(() => {
    setAnimated(true)
  }, [])

  /**
   * HANDLE LOGIN
   * 
   * Initiates OAuth sign-in flow with Google provider.
   * The redirectTo parameter ensures user is sent back to the app after auth.
   * 
   * Why use OAuth instead of password?
   * - More secure: no password stored on our servers
   * - Better UX: users keep their Google password
   * - Reduces liability: we don't handle sensitive credentials
   * - Easier to implement: Supabase handles OAuth complexity
   * 
   * Environment Variables:
   * - Uses Supabase URL from .env.local (configured in project setup)
   * - Uses Supabase anon key (public, client-safe)
   * - Google OAuth credentials configured in Supabase dashboard
   */
  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use appropriate redirect URL based on environment
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : "http://localhost:3000/auth/callback"

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          // Google OAuth configuration
          // Client ID configured in Supabase dashboard
          // Scopes: email, profile (read-only)
        },
      })

      if (signInError) {
        console.error("[OAuth] Sign in error:", signInError.message)
        setError("Failed to sign in. Please check your connection and try again.")
        setLoading(false)
        return
      }

      // If we reach here, OAuth flow has been initiated
      // Browser will redirect to Google's consent screen
    } catch (error) {
      console.error("[OAuth] Unexpected error:", error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md text-center transition-all duration-500 ease-out ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Smart Bookmark App
        </h1>
        <p className="text-sm text-white/70 mb-8">
          Organize your links smartly
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-red-200">
            {error}
          </div>
        )}

        {/* OAuth Sign In Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign in with Google"
          )}
        </button>

        {/* Info Text */}
        <p className="text-xs text-white/50 mt-6">
          We use Google OAuth for secure, password-free authentication
        </p>
      </div>
    </main>
  )
}
