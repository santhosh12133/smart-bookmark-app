"use client"

type Bookmark = {
  id: string
  title: string
  url: string
  category?: string
  created_at?: string
  is_favorite?: boolean
}

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

export default function BookmarkCard({
  bookmark: b,
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
}: BookmarkCardProps) {
  if (editingId === b.id) {
    return (
      <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-6">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            placeholder="Website title"
          />

          <input
            type="text"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
            placeholder="https://example.com"
          />

          <div className="flex gap-2">
            <button
              onClick={updateBookmark}
              disabled={updating || !editTitle || !editUrl}
              className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-xl font-medium shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => {
                setEditingId(null)
                setEditTitle("")
                setEditUrl("")
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl font-medium shadow-md transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl p-6 flex justify-between items-center ${b.is_favorite ? 'bg-yellow-50' : 'bg-white'}`}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs">
            {b.category ?? 'General'}
          </span>

          <a
            href={b.url}
            target="_blank"
            className="text-blue-600 font-medium hover:underline transition-all duration-200"
          >
            {b.title}
          </a>
        </div>
        <p className="text-gray-400 text-sm truncate max-w-xs">
          {b.url}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleFavorite(b.id, b.is_favorite ?? false)}
          aria-label={b.is_favorite ? 'Unfavorite' : 'Favorite'}
          className="p-2 rounded-full transition-transform duration-200 hover:scale-110"
        >
          {b.is_favorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.385 2.46c-.784.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.612 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118L12 17.347l-3.385 2.46c-.784.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118L3.612 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => {
            setEditingId(b.id)
            setEditTitle(b.title)
            setEditUrl(b.url)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200"
        >
          Edit
        </button>

        <button
          onClick={() => deleteBookmark(b.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}