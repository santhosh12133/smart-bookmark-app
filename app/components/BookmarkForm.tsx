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
    <section aria-labelledby="add-bookmark-title" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">Quick capture</p>
          <h2 id="add-bookmark-title" className="mt-1 text-2xl font-black tracking-tight text-slate-900">Add a bookmark</h2>
          <p className="mt-1 text-sm text-slate-500">Save a useful link in seconds.</p>
        </div>
        <div aria-hidden="true" className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 sm:grid">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H19v18H8.5A2.5 2.5 0 0 0 6 22V4.5Z"/><path d="M6 4.5A2.5 2.5 0 0 1 8.5 7H19"/><path d="M12 11v6m-3-3h6"/></svg>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block xl:col-span-2">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Title</span>
          <input type="text" placeholder="e.g. GitHub" value={title} onChange={(e) => { setTitle(e.target.value); if (formError) setFormError("") }} className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${formError && !title ? "border-rose-400" : "border-slate-200"}`} />
        </label>

        <label className="block sm:col-span-2 xl:col-span-2">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">URL</span>
          <input type="url" placeholder="https://example.com" value={url} onChange={(e) => { setUrl(e.target.value); if (formError) setFormError("") }} className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${formError && !/^(https?:\/\/)/i.test(url) ? "border-rose-400" : "border-slate-200"}`} />
        </label>

        <label className="block xl:col-span-1">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
          <select value={category} onChange={(e) => { setCategory(e.target.value); if (formError) setFormError("") }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100">
            <option>Work</option><option>Study</option><option>Personal</option><option>General</option>
          </select>
        </label>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 xl:col-span-3">
          <div className="flex h-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 px-1"><p className="text-xs font-bold text-slate-700">Ready to save?</p><p className="mt-0.5 text-xs text-slate-400">Your bookmark stays private to your account.</p></div>
            <button onClick={addBookmark} disabled={!title || !url || updating || adding} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45">
              {adding ? <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Saving…</> : <>Save bookmark <span aria-hidden="true">↗</span></>}
            </button>
          </div>
        </div>
      </div>

      {formError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">{formError}</p>}
    </section>
  )
}
