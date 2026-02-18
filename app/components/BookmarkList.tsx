"use client"

import BookmarkCard from "./BookmarkCard"

type Bookmark = {
  id: string
  title: string
  url: string
  category?: string
  created_at?: string
  is_favorite?: boolean
}

interface BookmarkListProps {
  bookmarks: Bookmark[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterCategory: string
  setFilterCategory: (category: string) => void
  sortOption: string
  setSortOption: (option: string) => void
  favoritesFilter: string
  setFavoritesFilter: (filter: string) => void
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

export default function BookmarkList({
  bookmarks,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortOption,
  setSortOption,
  favoritesFilter,
  setFavoritesFilter,
  editingId,
  setEditingId,
  editTitle,
  setEditTitle,
  editUrl,
  setEditUrl,
  updateBookmark,
  updating,
  toggleFavorite,
  deleteBookmark
}: BookmarkListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-gray-800 mb-6 leading-tight">
        Your Bookmarks
      </h2>

      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center opacity-0 animate-fade-in">
          <div className="mx-auto mb-6 w-16 h-16 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500">Start by adding your first bookmark.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            >
              <option>All</option>
              <option>Work</option>
              <option>Study</option>
              <option>Personal</option>
              <option>General</option>
            </select>

            <select
              value={favoritesFilter}
              onChange={(e) => setFavoritesFilter(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            >
              <option value="all">All</option>
              <option value="favorites">Favorites Only</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Title A–Z</option>
              <option value="za">Title Z–A</option>
            </select>
          </div>

          {/** Client-side filtering by search term and category */}
          {(() => {
            const q = searchTerm.trim().toLowerCase()
            const searched = q
              ? bookmarks.filter((bk) =>
                  bk.title.toLowerCase().includes(q) || bk.url.toLowerCase().includes(q)
                )
              : bookmarks

            const filtered = filterCategory === "All"
              ? searched
              : searched.filter((bk) => (bk.category ?? "General") === filterCategory)

            // Apply favorites filter
            const favFiltered = favoritesFilter === 'all'
              ? filtered
              : filtered.filter((bk) => bk.is_favorite)

            // Apply sorting on the client-side after filtering
            const sorted = favFiltered.slice().sort((a, b) => {
              if (sortOption === "newest") {
                const ta = new Date(b.created_at ?? 0).getTime()
                const tb = new Date(a.created_at ?? 0).getTime()
                return ta - tb
              }
              if (sortOption === "oldest") {
                const ta = new Date(a.created_at ?? 0).getTime()
                const tb = new Date(b.created_at ?? 0).getTime()
                return ta - tb
              }
              if (sortOption === "az") {
                return a.title.localeCompare(b.title)
              }
              if (sortOption === "za") {
                return b.title.localeCompare(a.title)
              }
              return 0
            })

            if (sorted.length === 0) {
              return (
                <div className="bg-white rounded-2xl shadow-md p-10 text-center opacity-0 animate-fade-in">
                  <div className="mx-auto mb-6 w-16 h-16 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
              )
            }

            return (
              <div className="grid gap-4">
                {sorted.map((b) => (
                  <BookmarkCard
                    key={b.id}
                    bookmark={b}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editUrl={editUrl}
                    setEditUrl={setEditUrl}
                    updateBookmark={updateBookmark}
                    updating={updating}
                    toggleFavorite={toggleFavorite}
                    deleteBookmark={deleteBookmark}
                  />
                ))}
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}