"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

function LoginContent() {
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
    } catch (loginError) {
      console.error("[OAuth] Unexpected error:", loginError)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="bento-login min-h-screen bg-[#070b16] flex items-center justify-center p-5 sm:p-8 relative overflow-hidden">
      <div aria-hidden="true" className="login-orb login-orb-one" />
      <div aria-hidden="true" className="login-orb login-orb-two" />
      <div aria-hidden="true" className="login-grid" />

      <section
        aria-labelledby="login-title"
        className={`login-shell relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-5 sm:p-8 lg:p-10 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-500 ease-out ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        <div className="login-bento-grid">
          <div className="login-brand-tile rounded-[26px] border border-white/10 bg-white/[0.05] p-7 sm:p-8">
            <div aria-hidden="true" className="login-logo flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 via-violet-500 to-cyan-400 shadow-xl shadow-indigo-950/40">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white">
                <path d="M7 7.5A2.5 2.5 0 0 1 9.5 5h8A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 7 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 8.5v8A2.5 2.5 0 0 0 6.5 19H15" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Personal link workspace</p>
              <h1 id="login-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Smart Bookmark</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">A calmer place to save, organize, and rediscover the links that matter.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-lg font-semibold text-white">10K+</p>
                <p className="mt-1 text-xs text-slate-400">links searchable</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-lg font-semibold text-white">RLS</p>
                <p className="mt-1 text-xs text-slate-400">data isolation</p>
              </div>
            </div>
          </div>

          <div className="login-action-tile rounded-[26px] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
            <p className="text-sm font-medium text-slate-300">Welcome back</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Sign in to your workspace</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Use your Google account to continue securely. Your bookmarks stay private to your account.</p>

            {error && (
              <div role="alert" className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>
            )}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              aria-busy={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-4 font-semibold text-slate-950 shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />Signing in…</>
              ) : (
                <><span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-white text-base font-bold">G</span>Continue with Google</>
              )}
            </button>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-xs leading-5 text-slate-400">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 5 6v5c0 4.6 3 8.5 7 10 4-1.5 7-5.4 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-3.5"/></svg>
              <span>Secure OAuth authentication powered by Google and Supabase.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="bento-login min-h-screen bg-[#070b16] flex items-center justify-center p-5 sm:p-8">
          <section className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.06] p-5 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="login-bento-grid">
              <div className="h-72 animate-pulse rounded-[26px] bg-white/[0.05]" />
              <div className="h-72 animate-pulse rounded-[26px] bg-white/[0.04]" />
            </div>
          </section>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
