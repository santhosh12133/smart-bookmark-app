# Smart Bookmark App

A production-oriented full-stack bookmark management application built with **Next.js 16, TypeScript, Supabase, and Tailwind CSS**.

Smart Bookmark lets authenticated users save, organize, search, filter, favorite, edit, and delete links from a responsive dashboard with a modern **Bento Grid** interface.

## 🌍 Live Demo

https://smart-bookmark-app-silk-kappa.vercel.app

## ✨ Product Highlights

- Google OAuth authentication through Supabase Auth
- Protected authenticated experience
- User-isolated bookmark data with PostgreSQL Row Level Security
- Full bookmark CRUD
- Search, category filtering, favorites, and sorting
- Dashboard metrics for bookmarks, favorites, categories, and latest activity
- Optimistic UI updates with server consistency checks
- Responsive Bento Grid design for desktop, tablet, and mobile
- Accessible keyboard focus states and reduced-motion support
- Production-safe OAuth callback handling
- Vercel deployment with environment-based configuration

## 🎨 UI / UX Architecture

The latest release introduces a reusable visual system rather than page-specific styling.

### Bento Grid layout

The dashboard is structured into independent visual tiles:

1. Product/header tile
2. Bookmark creation workspace
3. Analytics/stat tiles
4. Search and filter control strip
5. Responsive bookmark gallery
6. Empty and editing states

The layout uses a 12-column desktop grid, adapts to tablet widths, and collapses into a single-column mobile experience.

### Visual system

- Neutral application background with indigo/cyan brand accents
- Consistent surface, border, radius, and shadow tokens
- Layered cards instead of heavy gradients
- Clear primary-action hierarchy
- Hover and focus feedback
- Responsive spacing and typography
- Accessible `focus-visible` treatment
- Reduced-motion support for users who prefer less animation

### Authentication experience

The login screen follows the same product language with a premium dark Bento-inspired surface, clear Google sign-in CTA, explicit error messaging, loading feedback, and secure-authentication context.

## 🏗️ Architecture

```text
Browser
  │
  ▼
Next.js App Router
  │
  ├── Protected Dashboard
  ├── Login / OAuth initiation
  └── /auth/callback
          │
          ▼
      Supabase Auth
          │
          ▼
   PostgreSQL + RLS
          │
          ▼
       bookmarks
```

### Frontend

- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS
- Modular client components

### Backend / data

- Supabase PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

### Hosting

- Vercel
- GitHub-based deployment workflow

## 🔐 Authentication & Security

Google OAuth is initiated through Supabase Auth. The application uses a dedicated `/auth/callback` route and builds the callback URL from the current application origin so the same flow works in local and deployed environments.

Database access is protected by RLS. The fundamental ownership rule is:

```sql
auth.uid() = user_id
```

The client also scopes bookmark queries to the authenticated user:

```ts
.eq("user_id", userId)
```

The client never exposes a Supabase service-role key.

### Required RLS policies

```sql
create policy "Users can view own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
on bookmarks for update
using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);
```

## 📦 Core Features

### Authentication

- Google sign-in
- OAuth callback processing
- Protected application experience
- Logout
- Loading and error states

### Bookmark management

- Add bookmarks
- Validate bookmark input
- Edit existing bookmarks
- Delete bookmarks
- Mark/unmark favorites
- Optimistic interactions
- Server-side consistency through refetching

### Discovery

- Text search
- Category filtering
- Newest/oldest sorting
- Favorites filtering

### Analytics

- Total bookmarks
- Total favorites
- Unique categories
- Latest bookmark

## 📁 Project Structure

```text
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   ├── BookmarkCard.tsx
│   │   ├── BookmarkForm.tsx
│   │   ├── BookmarkList.tsx
│   │   └── Dashboard.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   └── supabaseClient.ts
├── public/
├── package.json
└── README.md
```

## ⚙️ Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, configure the same variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-production-domain
```

Never commit `.env.local` or secret credentials.

## 🚀 Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

## ☁️ Production Deployment

The application is designed for GitHub → Vercel deployment.

1. Push changes to the `main` branch.
2. Vercel builds the Next.js application.
3. Production environment variables are injected by Vercel.
4. Supabase handles authentication and PostgreSQL access.
5. The deployed application is served through Vercel's production infrastructure.

### OAuth production configuration

In Supabase Auth URL Configuration:

- Set the production Site URL to the deployed application URL.
- Add the production callback URL:

```text
https://your-production-domain/auth/callback
```

Google OAuth credentials must also contain the appropriate production redirect configuration.

## 🧩 Production Hardening Notes

Several real-world deployment issues were addressed during development:

### OAuth redirect mismatch

Production OAuth previously attempted to return to localhost. The callback is now constructed from `window.location.origin`, while the deployment must still have the production URL registered in Supabase and Google OAuth settings.

### Missing production environment variables

Local `.env.local` values do not automatically exist in Vercel. Production and preview environments must have the required public Supabase variables configured.

### RLS authorization

CRUD operations require explicit RLS policies. Application-level filtering is useful for query scoping but does not replace database authorization.

### Production build compatibility

The login page uses `useSearchParams()` inside a Suspense boundary so the route remains compatible with Next.js production builds.

## ♿ Accessibility

- Semantic controls and labels
- Visible keyboard focus indicators
- `aria-busy` on asynchronous sign-in action
- `role="alert"` for authentication errors
- Decorative graphics marked as hidden from assistive technology
- Reduced-motion support
- Responsive touch-friendly controls

## 🧠 Engineering Practices Demonstrated

- Component-based architecture
- Type-safe React development
- OAuth integration
- Database authorization with RLS
- Optimistic UI patterns
- Responsive design systems
- Accessibility-aware interaction design
- Environment-based configuration
- Production deployment and debugging
- Separation of UI, authentication, and data concerns

## 🔮 Roadmap

Potential next production features:

- Tags and collections
- Pagination / infinite loading for large libraries
- Link metadata extraction
- Duplicate-link detection
- Keyboard shortcuts
- Realtime synchronization
- Import/export
- Usage analytics
- Custom domains

## 👨‍💻 Author

**Santhosh Kumar**  
MCA | Full-Stack Developer

GitHub: https://github.com/santhosh12133

## 📄 License

This project is built for educational and portfolio purposes.
