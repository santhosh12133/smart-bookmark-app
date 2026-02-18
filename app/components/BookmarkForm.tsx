"use client"

interface BookmarkFormProps {
  title: string
  setTitle: (title: string) => void
  url: string
  setUrl: (url: string) => void
  category: string
  setCategory: (category: string) => void
  formError: string
  setFormError: (error: string) => void
  addBookmark: () => void
  adding: boolean
  updating: boolean
}

export default function BookmarkForm({
  title,
  setTitle,
  url,
  setUrl,
  category,
  setCategory,
  formError,
  setFormError,
  addBookmark,
  adding,
  updating
}: BookmarkFormProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-200">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-800 mb-6 leading-tight">
        Add New Bookmark
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Website title (e.g. GitHub)"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (formError) setFormError("")
          }}
          className={`w-full bg-white text-gray-800 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${formError && !title ? 'border-red-500' : 'border-gray-300'}`}
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (formError) setFormError("")
          }}
          className={`w-full bg-white text-gray-800 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${formError && !/^(https?:\/\/)/i.test(url) ? 'border-red-500' : 'border-gray-300'}`}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            if (formError) setFormError("")
          }}
          className="w-full bg-white text-gray-800 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200"
        >
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
          <option>General</option>
        </select>
        {formError && (
          <p className="text-red-500 text-sm mt-2">{formError}</p>
        )}

        <button
          onClick={addBookmark}
          disabled={!title || !url || updating || adding}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </div>
  )
}