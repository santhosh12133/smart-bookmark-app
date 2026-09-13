"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Login() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAnimated(true)

    const authError = searchParams.get("error")
    if (authError === "oauth_callback_failed") {
      setError("Google sign-in could not be completed. Please try again.")
    } else if (authError === "missing_code") {
      setError("The sign-in request was incomplete. Please try again.")
    }
  }, [searchParams])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const requestedPath = searchParams.get("redirectTo")
      const safePath =
        requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/"

      const redirectUrl = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(safePath)}`

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      })

      if (signInError) {
        console.error("[OAuth] Sign in error:", signInError.message)
        setError("Unable to start Google sign-in. Please try again.")
        setLoading(false)
      }
    } catch (error) {
      console.error("[OAuth] Unexpected error:", error)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <section
        aria-labelledby="login-title"
        className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md text-center transition-all duration-500 ease-out ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <h1 id="login-title" className="text-3xl font-bold text-white mb-2">
          Smart Bookmark App
        </h1>
        <p className="text-sm text-white/70 mb-8">
          Organize your links smartly
        </p>

        {error && (
          <div
            role="alert"
            className="mb-6 p-3 bg-red-500/20 border border-red-500/60 rounded-lg text-sm text-red-100"
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          aria-busy={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:bg-blue-500 transition-all duration-300 active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              Signing in…
            </span>
          ) : (
            "Continue with Google"
          )}
        </button>

        <p className="text-xs text-white/50 mt-6">
          Secure authentication powered by Google and Supabase.
        </p>
      </section>
    </main>
  )
}
