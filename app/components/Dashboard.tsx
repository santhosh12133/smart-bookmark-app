"use client"

import { useState, useEffect } from 'react'

type Bookmark = {
  id: string
  title: string
  url: string
  category?: string
  created_at?: string
  is_favorite?: boolean
}

interface DashboardProps {
  bookmarks: Bookmark[]
}

export default function Dashboard({ bookmarks }: DashboardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const totalBookmarks = bookmarks.length
  const totalFavorites = bookmarks.filter((b) => b.is_favorite).length
  const totalCategoriesUsed = new Set(bookmarks.map((b) => b.category ?? "General")).size
  const latestBookmarkTitle = bookmarks[0]?.title ?? "-"

  return (
    <div>
      <div className="bg-gray-50 rounded-3xl p-8">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-t-2xl absolute top-0 left-0 right-0"></div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Total Bookmarks</div>
            <div className="text-3xl font-bold text-gray-800 mt-4">{totalBookmarks}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-t-2xl absolute top-0 left-0 right-0"></div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Total Favorites</div>
            <div className="text-3xl font-bold text-gray-800 mt-4">{totalFavorites}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-t-2xl absolute top-0 left-0 right-0"></div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Categories Used</div>
            <div className="text-3xl font-bold text-gray-800 mt-4">{totalCategoriesUsed}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-t-2xl absolute top-0 left-0 right-0"></div>
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Latest Bookmark</div>
            <div className="text-3xl font-bold text-gray-800 mt-4 truncate max-w-full">{latestBookmarkTitle}</div>
          </div>
        </div>
      </div>
    </div>
  )
}