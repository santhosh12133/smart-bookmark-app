"use client"

import BookmarkCard from "./BookmarkCard"

type Bookmark = { id: string; title: string; url: string; category?: string; created_at?: string; is_favorite?: boolean }
interface BookmarkListProps { bookmarks: Bookmark[]; searchTerm: string; setSearchTerm: (term: string) => void; filterCategory: string; setFilterCategory: (category: string) => void; sortOption: string; setSortOption: (option: string) => void; favoritesFilter: string; setFavoritesFilter: (filter: string) => void; editingId: string | null; setEditingId: (id: string | null) => void; editTitle: string; setEditTitle: (title: string) => void; editUrl: string; setEditUrl: (url: string) => void; updateBookmark: () => void; updating: boolean; toggleFavorite: (id: string, current: boolean) => void; deleteBookmark: (id: string) => void }

export default function BookmarkList({ bookmarks, searchTerm, setSearchTerm, filterCategory, setFilterCategory, sortOption, setSortOption, favoritesFilter, setFavoritesFilter, editingId, setEditingId, editTitle, setEditTitle, editUrl, setEditUrl, updateBookmark, updating, toggleFavorite, deleteBookmark }: BookmarkListProps) {
  const q = searchTerm.trim().toLowerCase()
  const searched = q ? bookmarks.filter((b) => b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)) : bookmarks
  const filtered = filterCategory === "All" ? searched : searched.filter((b) => (b.category ?? "General") === filterCategory)
  const favFiltered = favoritesFilter === "all" ? filtered : filtered.filter((b) => b.is_favorite)
  const sorted = favFiltered.slice().sort((a, b) => {
    if (sortOption === "newest") return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    if (sortOption === "oldest") return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
    if (sortOption === "az") return a.title.localeCompare(b.title)
    return b.title.localeCompare(a.title)
  })

  return (
    <div role="region" aria-labelledby="bookmarks-title" className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">Collection</p><h2 id="bookmarks-title" className="mt-1 text-2xl font-black tracking-tight text-slate-900">Your bookmarks</h2></div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">{sorted.length} {sorted.length === 1 ? "result" : "results"}</div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H19v18H8.5A2.5 2.5 0 0 0 6 22V4.5Z"/><path d="M6 4.5A2.5 2.5 0 0 1 8.5 7H19"/></svg></div><h3 className="mt-5 text-lg font-bold text-slate-900">Your library is empty</h3><p className="mt-1 text-sm text-slate-500">Add your first bookmark above to start building your collection.</p></div>
      ) : (
        <>
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_150px_150px_170px]">
            <label className="relative block"><span className="sr-only">Search bookmarks</span><svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" placeholder="Search your library…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" /></label>
            <label><span className="sr-only">Filter by category</span><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100"><option value="All">All categories</option><option>Work</option><option>Study</option><option>Personal</option><option>General</option></select></label>
            <label><span className="sr-only">Filter favorites</span><select value={favoritesFilter} onChange={(e) => setFavoritesFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100"><option value="all">All bookmarks</option><option value="favorites">Favorites</option></select></label>
            <label><span className="sr-only">Sort bookmarks</span><select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="az">Title A–Z</option><option value="za">Title Z–A</option></select></label>
          </div>
          {sorted.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"><h3 className="text-lg font-bold text-slate-900">No matching bookmarks</h3><p className="mt-1 text-sm text-slate-500">Try another search term or adjust your filters.</p></div> : <div className="mt-5 grid gap-3">{sorted.map((b) => <BookmarkCard key={b.id} bookmark={b} editingId={editingId} setEditingId={setEditingId} editTitle={editTitle} setEditTitle={setEditTitle} editUrl={editUrl} setEditUrl={setEditUrl} updateBookmark={updateBookmark} updating={updating} toggleFavorite={toggleFavorite} deleteBookmark={deleteBookmark} />)}</div>}
        </>
      )}
    </div>
  )
}
