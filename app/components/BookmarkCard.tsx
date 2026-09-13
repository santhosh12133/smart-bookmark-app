"use client"

type Bookmark = { id: string; title: string; url: string; category?: string; created_at?: string; is_favorite?: boolean }
interface BookmarkCardProps {
  bookmark: Bookmark; editingId: string | null; setEditingId: (id: string | null) => void; editTitle: string; setEditTitle: (title: string) => void; editUrl: string; setEditUrl: (url: string) => void; updateBookmark: () => void; updating: boolean; toggleFavorite: (id: string, current: boolean) => void; deleteBookmark: (id: string) => void
}

const categoryStyles: Record<string, string> = {
  Work: "bg-violet-50 text-violet-700 ring-violet-200",
  Study: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Personal: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  General: "bg-slate-100 text-slate-600 ring-slate-200",
}

export default function BookmarkCard({ bookmark: b, editingId, setEditingId, editTitle, setEditTitle, editUrl, setEditUrl, updateBookmark, updating, toggleFavorite, deleteBookmark }: BookmarkCardProps) {
  if (editingId === b.id) {
    return (
      <article className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-600">Editing bookmark</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label><span className="sr-only">Website title</span><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Website title" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100" /></label>
          <label><span className="sr-only">Website URL</span><input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://example.com" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100" /></label>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button onClick={() => { setEditingId(null); setEditTitle(""); setEditUrl("") }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
          <button onClick={updateBookmark} disabled={updating || !editTitle || !editUrl} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-45">{updating ? "Saving…" : "Save changes"}</button>
        </div>
      </article>
    )
  }

  const domain = (() => { try { return new URL(b.url).hostname.replace(/^www\./, "") } catch { return b.url } })()
  const category = b.category ?? "General"

  return (
    <article className={`group rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 ${b.is_favorite ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600 uppercase">{domain.charAt(0) || "?"}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${categoryStyles[category] ?? categoryStyles.General}`}>{category}</span>
                {b.is_favorite && <span className="text-[11px] font-semibold text-amber-600">★ Favorite</span>}
              </div>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="mt-2 block truncate text-base font-bold text-slate-900 hover:text-indigo-600" title={b.title}>{b.title}</a>
              <p className="mt-1 truncate text-sm text-slate-400">{domain}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
          <button onClick={() => toggleFavorite(b.id, b.is_favorite ?? false)} aria-label={b.is_favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={b.is_favorite ?? false} className="grid h-10 w-10 place-items-center rounded-xl text-lg transition hover:bg-amber-50 hover:text-amber-500">{b.is_favorite ? "★" : "☆"}</button>
          <button onClick={() => { setEditingId(b.id); setEditTitle(b.title); setEditUrl(b.url) }} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Edit</button>
          <button onClick={() => { if (window.confirm(`Delete \"${b.title}\"? This cannot be undone.`)) deleteBookmark(b.id) }} className="rounded-xl border border-rose-100 bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">Delete</button>
        </div>
      </div>
    </article>
  )
}
