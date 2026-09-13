"use client"

type Bookmark = { id: string; title: string; url: string; category?: string; created_at?: string; is_favorite?: boolean }
interface BookmarkCardProps {
  bookmark: Bookmark
  editingId: string | null
  setEditingId: (id: string | null) => void
  editTitle: string
  setEditTitle: (title: string) => void
  editUrl: string
  setEditUrl: (url: string) => void
  updateBookmark: () => void
  updating: boolean
  toggleFavorite: (id: string, current: boolean) => void
  deleteBookmark: (id: string) => void
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
      <article className="rounded-3xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">Edit tile</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Update bookmark</h3>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm">✎</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">Title</span><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Website title" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100" /></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">URL</span><input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://example.com" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100" /></label>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button onClick={() => { setEditingId(null); setEditTitle(""); setEditUrl("") }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>
          <button onClick={updateBookmark} disabled={updating || !editTitle || !editUrl} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-45">{updating ? "Saving…" : "Save changes"}</button>
        </div>
      </article>
    )
  }

  const domain = (() => { try { return new URL(b.url).hostname.replace(/^www\./, "") } catch { return b.url } })()
  const category = b.category ?? "General"
  const initial = domain.charAt(0).toUpperCase() || "?"

  return (
    <article className={`group flex flex-col rounded-3xl border p-5 transition-all duration-200 sm:p-6 ${b.is_favorite ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg font-black text-slate-600 uppercase shadow-inner">{initial}</div>
        <button onClick={() => toggleFavorite(b.id, b.is_favorite ?? false)} aria-label={b.is_favorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={b.is_favorite ?? false} className={`grid h-10 w-10 place-items-center rounded-xl text-xl transition ${b.is_favorite ? "bg-amber-100 text-amber-500" : "bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-500"}`}>{b.is_favorite ? "★" : "☆"}</button>
      </div>

      <div className="mt-5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${categoryStyles[category] ?? categoryStyles.General}`}>{category}</span>
          {b.is_favorite && <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">Favorite</span>}
        </div>
        <a href={b.url} target="_blank" rel="noopener noreferrer" className="mt-3 block line-clamp-2 text-lg font-bold leading-6 tracking-tight text-slate-900 transition hover:text-indigo-600" title={b.title}>{b.title}</a>
        <p className="mt-2 truncate text-xs font-medium text-slate-400">{domain}</p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <a href={b.url} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-slate-950 px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-indigo-700">Open link ↗</a>
          <button onClick={() => { setEditingId(b.id); setEditTitle(b.title); setEditUrl(b.url) }} aria-label={`Edit ${b.title}`} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">Edit</button>
          <button onClick={() => { if (window.confirm(`Delete \"${b.title}\"? This cannot be undone.`)) deleteBookmark(b.id) }} aria-label={`Delete ${b.title}`} className="rounded-xl border border-rose-100 bg-white px-3.5 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50">Delete</button>
        </div>
      </div>
    </article>
  )
}
