"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Dashboard from "./components/Dashboard"
import BookmarkForm from "./components/BookmarkForm"
import BookmarkList from "./components/BookmarkList"

/**
 * Bookmark type definition
 * Extends the base bookmark structure with optional fields for timestamps and favorites
 */
type Bookmark = {
  id: string
  title: string
  url: string
  category?: string
  created_at?: string
  is_favorite?: boolean
}

export default function Home() {
  const router = useRouter()

  // ==================== Authentication State ====================
  // userId: User's unique identifier from Supabase Auth
  // email: User's email address (used for display in header)
  // loading: Loading state while checking authentication session
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  // ==================== Bookmark Management State ====================
  // Bookmarks list from database
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  // Form state for adding new bookmarks
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("General")
  const [formError, setFormError] = useState("")
  const [adding, setAdding] = useState(false)

  // Edit state for updating existing bookmarks
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [updating, setUpdating] = useState(false)

  // ==================== UI State ====================
  // Filter and sort options for displaying bookmarks
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [sortOption, setSortOption] = useState("newest")
  const [favoritesFilter, setFavoritesFilter] = useState("all")

  // Page entrance animation state
  const [isVisible, setIsVisible] = useState(false)

  /**
   * AUTHENTICATION FLOW
   * 
   * This effect handles the initial authentication check when the page loads.
   * It retrieves the user's session from Supabase using the OAuth token stored in the browser.
   * 
   * Why useEffect?
   * - Runs once on component mount to check if user is authenticated
   * - If session exists, extract user ID and email
   * - If no session, redirect to login page (Supabase middleware)
   * 
   * Why userId is essential?
   * - Supabase Row Level Security (RLS) policies use user_id to protect data
   * - All bookmark queries use .eq("user_id", userId) filter
   * - Ensures users can only see their own bookmarks
   */
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("[Auth] Session retrieval error:", error.message)
          router.push("/login")
          return
        }

        if (!data.session) {
          // No session means user is not authenticated
          // Redirect to login page for OAuth flow
          router.push("/login")
        } else {
          // Session exists, user is authenticated
          // Extract user ID and email for use throughout the app
          setUserId(data.session.user.id)
          setEmail(data.session.user.email ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error("[Auth] Unexpected error during session check:", error)
        router.push("/login")
      }
    }

    checkUser()
  }, [router])

  /**
   * FETCH BOOKMARKS
   * 
   * This effect fetches bookmarks from the database whenever userId changes.
   * It only runs after authentication is complete (userId is set).
   * 
   * Why .eq("user_id", userId)?
   * - Supabase RLS policy checks this condition server-side
   * - Database never returns bookmarks from other users
   * - Even if someone modifies the client code, RLS blocks unauthorized access
   * 
   * Why order by created_at descending?
   * - Shows newest bookmarks first for better UX
   * - Users see recently added items at the top
   */
  useEffect(() => {
    if (!userId) return

    const fetchBookmarks = async () => {
      try {
        const { data, error } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[Bookmarks] Fetch error:", error.message)
          return
        }

        setBookmarks(data || [])
      } catch (error) {
        console.error("[Bookmarks] Unexpected fetch error:", error)
      }
    }

    fetchBookmarks()
  }, [userId])

  /**
   * PAGE ANIMATION
   * 
   * This effect triggers the entrance animation after the page mounts.
   * Separating this from auth check prevents animation on initial render
   * during the loading state.
   */
  useEffect(() => {
    setIsVisible(true)
  }, [])

  /**
   * ADD BOOKMARK
   * 
   * Creates a new bookmark in the database with client-side validation.
   * 
   * Validation steps:
   * 1. Check title and URL are not empty
   * 2. Validate URL format starts with http:// or https://
   * 3. Ensure user is authenticated (userId exists)
   * 
   * Why user_id is required?
   * - RLS policy requires all insert rows to have matching user_id
   * - The policy: (auth.uid() = user_id) ensures users only insert their own data
   * - Database enforces this even if client code is modified
   * 
   * Why insert returns the created row?
   * - We immediately add it to local state without waiting for refetch
   * - This is optimistic UI update - feels instantaneous to user
   * - If database operation fails, error is logged but UI already updated
   */
  const addBookmark = async () => {
    // Client-side validation
    if (!title || !url) {
      setFormError("Title and URL are required.")
      return
    }

    const isValidUrl = /^(https?:\/\/)/i.test(url)
    if (!isValidUrl) {
      setFormError("URL must start with http:// or https://")
      return
    }

    if (!userId) {
      setFormError("Authentication required. Please log in.")
      return
    }

    setFormError("")
    setAdding(true)

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([{ title, url, category, user_id: userId }])
        .select()

      if (error) {
        console.error("[AddBookmark] Insert error:", error.message)
        setFormError("Failed to add bookmark. Please try again.")
        return
      }

      // Optimistic UI update: add bookmark to local state immediately
      // This gives instant feedback without waiting for full database response
      if (data && data.length > 0) {
        setBookmarks([data[0], ...bookmarks])
        setTitle("")
        setUrl("")
        setFormError("")
      }
    } catch (error) {
      console.error("[AddBookmark] Unexpected error:", error)
      setFormError("An unexpected error occurred. Please try again.")
    } finally {
      setAdding(false)
    }
  }

  /**
   * UPDATE BOOKMARK
   * 
   * Updates an existing bookmark's title and URL.
   * After update, refetches all bookmarks to ensure consistency.
   * 
   * Why refetch all bookmarks?
   * - Ensures UI reflects the exact server state
   * - Prevents stale data or sync issues
   * - More reliable than trying to update local state manually
   */
  const updateBookmark = async () => {
    if (!editingId || !editTitle || !editUrl || !userId) {
      console.error("[UpdateBookmark] Missing required data for update")
      return
    }

    setUpdating(true)

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .update({ title: editTitle, url: editUrl })
        .eq("id", editingId)
        .select()

      if (error) {
        console.error("[UpdateBookmark] Update error:", error.message)
        return
      }

      if (data && data.length > 0) {
        // Clear editing state
        setEditingId(null)
        setEditTitle("")
        setEditUrl("")

        // Refetch bookmarks to ensure consistency
        const { data: bookmarksData, error: fetchError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (fetchError) {
          console.error("[UpdateBookmark] Refetch error:", fetchError.message)
          return
        }

        if (bookmarksData) {
          setBookmarks(bookmarksData)
        }
      }
    } catch (error) {
      console.error("[UpdateBookmark] Unexpected error:", error)
    } finally {
      setUpdating(false)
    }
  }

  /**
   * TOGGLE FAVORITE
   * 
   * Updates a bookmark's favorite status using optimistic UI pattern.
   * 
   * Optimistic Update Pattern:
   * 1. Update local state immediately (user sees change instantly)
   * 2. Send update to database asynchronously
   * 3. If database fails, revert local state
   * 
   * Benefits:
   * - Instant UI feedback (user perceives app as responsive)
   * - Reduces perceived latency
   * - Provides fallback if network fails
   * 
   * Why this pattern works?
   * - Toggle is idempotent (retrying doesn't cause issues)
   * - User expects immediate visual feedback
   * - Failures are rare with modern networks
   */
  const toggleFavorite = async (id: string, current: boolean) => {
    // Optimistic update: change UI immediately
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_favorite: !current } : b))
    )

    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ is_favorite: !current })
        .eq("id", id)

      if (error) {
        console.error("[ToggleFavorite] Update error:", error.message)
        // Revert optimistic update on error
        setBookmarks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, is_favorite: current } : b))
        )
      }
    } catch (error) {
      console.error("[ToggleFavorite] Unexpected error:", error)
      // Revert optimistic update on error
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_favorite: current } : b))
      )
    }
  }

  /**
   * DELETE BOOKMARK
   * 
   * Removes a bookmark from the database and local state.
   * Deletion is permanent - no undo available.
   */
  const deleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("[DeleteBookmark] Delete error:", error.message)
        return
      }

      // Remove from local state after successful deletion
      setBookmarks(bookmarks.filter((b) => b.id !== id))
    } catch (error) {
      console.error("[DeleteBookmark] Unexpected error:", error)
    }
  }

  /**
   * LOADING STATE
   * 
   * Shows skeleton loaders while checking authentication and fetching bookmarks.
   * This improves UX by showing page structure immediately instead of blank screen.
   * 
   * Skeleton loaders:
   * - Match the exact dimensions of real content
   * - Animate with pulse effect to indicate loading
   * - Prevent layout shift when content loads
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton Loader */}
          <div className="bg-white shadow-lg rounded-2xl p-8 flex justify-between items-center transition-all duration-200">
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-20"></div>
          </div>

          {/* Form Skeleton Loader */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-32"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Dashboard Skeleton Loader */}
          <div>
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-24 animate-pulse shadow-sm"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Bookmarks List Skeleton Loader */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
            <div className="flex gap-3 mb-6">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-40"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-40"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-44"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-32"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-20 animate-pulse shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  /**
   * MAIN APPLICATION LAYOUT
   * 
   * Component Structure:
   * 1. Header: User info and logout button
   * 2. Add New Bookmark Form: Input form with validation
   * 3. Dashboard: Analytics cards (total bookmarks, favorites, categories, latest)
   * 4. Bookmark List: Searchable, filterable list of user's bookmarks
   * 5. Empty State: Shows when no bookmarks exist
   * 
   * All components receive necessary props and callbacks for CRUD operations.
   */

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 px-6 lg:px-8 py-8">
      <div className={`max-w-7xl mx-auto space-y-8 opacity-0 translate-y-6 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : ''}`}>

        {/* ==================== HEADER SECTION ==================== */}
        <div className="bg-white shadow-lg rounded-2xl p-8 flex justify-between items-center transition-all duration-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Smart Bookmark
            </h1>
            <p className="text-gray-500 text-sm">{email}</p>
          </div>

          {/* Logout Button with disabled state while processing */}
          <button
            onClick={async () => {
              try {
                const { error } = await supabase.auth.signOut()
                if (error) {
                  console.error("[Logout] Sign out error:", error.message)
                  return
                }
                router.push("/login")
              } catch (error) {
                console.error("[Logout] Unexpected error:", error)
              }
            }}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-200 disabled:cursor-not-allowed"
          >
            Logout
          </button>
        </div>

        {/* ==================== ADD BOOKMARK FORM ==================== */}
        <BookmarkForm
          title={title}
          setTitle={setTitle}
          url={url}
          setUrl={setUrl}
          category={category}
          setCategory={setCategory}
          formError={formError}
          setFormError={setFormError}
          addBookmark={addBookmark}
          adding={adding}
          updating={updating}
        />

        {/* ==================== DASHBOARD ANALYTICS ==================== */}
        <Dashboard bookmarks={bookmarks} />

        {/* ==================== BOOKMARK LIST ==================== */}
        <BookmarkList
          bookmarks={bookmarks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
          favoritesFilter={favoritesFilter}
          setFavoritesFilter={setFavoritesFilter}
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

      </div>
    </main>
  )
}
