'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App] Unhandled application error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm text-white/60">
          We could not complete that request. Your bookmarks are safe. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Try again
        </button>
      </section>
    </main>
  )
}
