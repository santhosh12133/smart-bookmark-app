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
      const safePath = requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/"
      const callbackUrl = new URL("/auth/callback", window.location.origin)
      if (safePath !== "/") callbackUrl.searchParams.set("redirectTo", safePath)

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
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
    <main className="min-h-screen bg-[#0b1020] flex items-center justify-center p-5 sm:p-8 relative overflow-hidden">
      <div aria-hidden="true" className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <section
        aria-labelledby="login-title"
        className={`relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-7 sm:p-10 text-center shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-500 ease-out ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white">
            <path d="M7 7.5A2.5 2.5 0 0 1 9.5 5h8A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 7 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 8.5v8A2.5 2.5 0 0 0 6.5 19H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Your personal link space</p>
        <h1 id="login-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Smart Bookmark
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Save, organize, and find your important links without the clutter.</p>

        {error && (
          <div role="alert" className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          aria-busy={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold text-slate-900 shadow-lg shadow-black/20 transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
              Signing in…
            </>
          ) : (
            <>
              <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold">G</span>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 5 6v5c0 4.6 3 8.5 7 10 4-1.5 7-5.4 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-3.5"/></svg>
          Secure authentication powered by Google and Supabase
        </div>
      </section>
    </main>
  )
}
