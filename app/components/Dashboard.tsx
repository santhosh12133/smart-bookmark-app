"use client"

import { useState, useEffect } from "react"

type Bookmark = { id: string; title: string; url: string; category?: string; created_at?: string; is_favorite?: boolean }
interface DashboardProps { bookmarks: Bookmark[] }

const icons = [
  <svg key="book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"/><path d="M5 5.5A2.5 2.5 0 0 1 7.5 8H19"/></svg>,
  <svg key="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>,
  <svg key="grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>,
]

export default function Dashboard({ bookmarks }: DashboardProps) {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => setIsVisible(true), [])

  const stats = [
    ["Total bookmarks", bookmarks.length, "Saved links", icons[0]],
    ["Favorites", bookmarks.filter((b) => b.is_favorite).length, "Starred links", icons[1]],
    ["Categories", new Set(bookmarks.map((b) => b.category ?? "General")).size, "Used in library", icons[2]],
    ["Latest bookmark", bookmarks[0]?.title ?? "None yet", "Most recently saved", icons[3]],
  ]

  return (
    <div aria-labelledby="overview-title" className="rounded-3xl border border-slate-200/80 bg-transparent p-0">
      <div className="mb-4 flex items-end justify-between px-1">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">Overview</p><h2 id="overview-title" className="mt-1 text-xl font-black tracking-tight text-slate-900">Library at a glance</h2></div>
        <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:block">Live</span>
      </div>
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        {stats.map(([label, value, helper, icon], index) => (
          <div key={String(label)} className={`group relative overflow-hidden rounded-3xl border p-5 transition duration-300 hover:-translate-y-1 ${index === 3 ? "bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-200/50 border-transparent sm:col-span-2" : "border-slate-200 bg-white shadow-sm hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40"}`}>
            <div className="flex items-start justify-between gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 1 ? "bg-amber-50 text-amber-600" : index === 3 ? "bg-white/15 text-white" : "bg-indigo-50 text-indigo-600"}`}>{icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wide ${index === 3 ? "text-white/65" : "text-slate-400"}`}>{helper}</span>
            </div>
            <p className={`mt-5 text-xs font-bold uppercase tracking-wide ${index === 3 ? "text-white/70" : "text-slate-400"}`}>{label}</p>
            <p className={`mt-1 truncate text-2xl font-black tracking-tight ${index === 3 ? "text-white" : "text-slate-900"}`}>{String(value)}</p>
            {index === 0 && <div aria-hidden="true" className="absolute -bottom-8 -right-5 h-24 w-24 rotate-12 rounded-3xl bg-indigo-50/80" />}
          </div>
        ))}
      </div>
    </div>
  )
}
