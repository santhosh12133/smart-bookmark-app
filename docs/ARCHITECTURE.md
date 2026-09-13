# Architecture

## 1. Overview

Smart Bookmark is a full-stack bookmark management application built around a small, explicit architecture:

```text
┌───────────────────────────────┐
│           Browser             │
│  Responsive Bento UI / React  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Next.js App Router      │
│                               │
│  Login → OAuth → Callback     │
│  Dashboard → Components       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        Supabase Auth          │
│         Google OAuth          │
└───────────────┬───────────────┘
                │ authenticated session
                ▼
┌───────────────────────────────┐
│      Supabase PostgreSQL      │
│          bookmarks            │
│      Row Level Security       │
└───────────────────────────────┘
                │
                ▼
             Vercel
```

The architecture deliberately keeps authentication, UI state, and database authorization separate. Supabase provides identity and persistence; Next.js owns the application experience; Vercel provides production hosting.

## 2. Application Layers

### Presentation layer

Located primarily under `app/components/`.

Responsibilities:

- Render the dashboard and authentication UI.
- Capture user interactions.
- Provide loading, empty, error, and editing states.
- Keep visual behavior consistent with the Bento design system.
- Provide accessible controls and keyboard focus behavior.

### Application layer

The App Router coordinates routes and client-side interactions.

Key routes:

- `/` — authenticated application entry point.
- `/login` — authentication entry point.
- `/auth/callback` — OAuth callback handling.

### Data layer

Supabase is used for:

- Authentication sessions.
- PostgreSQL persistence.
- Authorization through Row Level Security.

The effective ownership boundary is:

```sql
auth.uid() = user_id
```

Client-side filtering is treated as query optimization and UX behavior, not as a security boundary.

## 3. Authentication Flow

```text
User
 │
 ▼
/login
 │
 │ signInWithOAuth()
 ▼
Supabase Auth
 │
 │ Google OAuth
 ▼
Google
 │
 │ authorization response
 ▼
/auth/callback
 │
 │ exchange / establish session
 ▼
Application
 │
 ▼
Dashboard
```

The callback URL is derived from the current application origin so local and deployed environments can share the same application code. Production still requires the deployed callback URL to be registered with the authentication provider.

## 4. Bookmark Data Flow

```text
User action
    │
    ▼
React component
    │
    ├── optimistic UI update
    │
    ▼
Supabase client
    │
    ▼
PostgreSQL
    │
    ├── RLS evaluates auth.uid()
    │
    ▼
Authorized row mutation
    │
    ▼
UI reconciliation / refresh
```

For mutations, the UI can respond immediately where appropriate, while the database remains the source of truth.

## 5. Security Model

### Authentication

- Google OAuth is handled by Supabase Auth.
- The browser uses public Supabase configuration only.
- Service-role credentials must never be shipped to the client.

### Authorization

Every CRUD operation must be protected by RLS. A user must only be able to read or mutate rows belonging to that authenticated user.

### Environment configuration

Public browser configuration uses `NEXT_PUBLIC_*` variables. Secrets, when introduced, must remain server-side and must not be committed to source control.

## 6. UI Architecture

The dashboard follows a 12-column Bento Grid on larger screens and collapses progressively for smaller viewports.

Primary visual regions:

1. Product identity / navigation.
2. Bookmark creation workspace.
3. Analytics and summary metrics.
4. Search, filter, and sorting controls.
5. Bookmark collection.
6. Empty, loading, and editing states.

The global visual language is implemented in `app/globals.css` through reusable tokens and component-oriented selectors rather than one-off page styling.

## 7. Repository Structure

```text
app/
├── auth/callback/       OAuth callback route
├── components/          Reusable product components
├── login/               Login experience
├── globals.css          Global design system
├── layout.tsx           Application shell and metadata
└── page.tsx             Application entry point

lib/
└── supabaseClient.ts    Supabase browser client

docs/
└── ARCHITECTURE.md      System architecture

public/                  Static assets
```

## 8. Deployment Topology

The intended delivery pipeline is:

```text
Developer
   │
   ▼
GitHub main
   │
   ▼
Vercel build
   │
   ├── Next.js production build
   └── environment configuration
   │
   ▼
Production application
   │
   └── Supabase services
```

A deployment is considered production-ready only after the build succeeds and authentication, CRUD operations, and RLS behavior have been verified against the production configuration.

## 9. Operational Principles

- Database authorization is mandatory even when UI controls hide unauthorized actions.
- Production configuration is environment-specific.
- User-facing errors should be actionable without exposing secrets or internal implementation details.
- UI state should communicate loading and failure clearly.
- Accessibility is treated as a product requirement, not a post-processing step.
- Changes should preserve the separation between presentation, authentication, and persistence.
