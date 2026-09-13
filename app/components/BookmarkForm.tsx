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

export default function BookmarkForm({ title, setTitle, url, setUrl, category, setCategory, formError, setFormError, addBookmark, adding, updating }: BookmarkFormProps) {
  return (
    <section aria-labelledby="add-bookmark-title" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60 sm:p-8">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Library</p>
          <h2 id="add-bookmark-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Add a bookmark</h2>
          <p className="mt-1 text-sm text-slate-500">Keep useful links organized and easy to revisit.</p>
        </div>
        <span className="hidden rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 sm:inline-flex">Quick add</span>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr_180px] md:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
          <input type="text" placeholder="e.g. GitHub" value={title} onChange={(e) => { setTitle(e.target.value); if (formError) setFormError("") }} className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${formError && !title ? "border-rose-400" : "border-slate-200"}`} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">URL</span>
          <input type="url" placeholder="https://example.com" value={url} onChange={(e) => { setUrl(e.target.value); if (formError) setFormError("") }} className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${formError && !/^(https?:\/\/)/i.test(url) ? "border-rose-400" : "border-slate-200"}`} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
          <select value={category} onChange={(e) => { setCategory(e.target.value); if (formError) setFormError("") }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100">
            <option>Work</option><option>Study</option><option>Personal</option><option>General</option>
          </select>
        </label>
      </div>

      {formError && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{formError}</p>}

      <button onClick={addBookmark} disabled={!title || !url || updating || adding} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 md:w-auto">
        {adding ? <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Adding…</> : <>+ Add bookmark</>}
      </button>
    </section>
  )
}
