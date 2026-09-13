# Smart Bookmark

> A production-oriented, full-stack bookmark workspace for saving, organizing, discovering, and managing links.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel)](https://vercel.com/)

## Overview

Smart Bookmark is a modern bookmark management application built with **Next.js 16, React 19, TypeScript, Tailwind CSS, and Supabase**. It combines authenticated user workspaces, PostgreSQL persistence, Row Level Security, responsive Bento Grid UI, and optimistic interactions in a focused product experience.

The project is intentionally structured as a portfolio-quality production application: authentication, authorization, UI state, deployment configuration, accessibility, and operational documentation are treated as first-class concerns.

## Live Application

**Production:** https://smart-bookmark-app-silk-kappa.vercel.app

**Repository:** https://github.com/santhosh12133/smart-bookmark-app

## Product Capabilities

| Area | Capability |
| --- | --- |
| Authentication | Google OAuth through Supabase Auth |
| Workspace | Protected authenticated dashboard |
| Bookmarks | Create, read, update, delete |
| Organization | Categories and favorites |
| Discovery | Search, filtering, sorting |
| Insights | Bookmark, favorite, category, and latest-activity metrics |
| Interaction | Optimistic UI with server reconciliation |
| Security | PostgreSQL Row Level Security |
| UX | Responsive Bento Grid system |
| Accessibility | Keyboard focus, semantic controls, reduced motion, async state feedback |
| Deployment | GitHub → Vercel → Supabase |

## Design System

The dashboard uses a **Bento Grid** composition instead of a conventional single-column admin layout.

```text
┌───────────────────────────┬──────────────────────┐
│ Product / Welcome         │ Analytics             │
├───────────────────────────┴──────────────────────┤
│ Add bookmark / primary workflow                  │
├───────────────────────────┬──────────────────────┤
│ Search / filters          │ Library controls      │
├───────────────────────────┴──────────────────────┤
│ Responsive bookmark collection                   │
└──────────────────────────────────────────────────┘
```

Design principles:

- Strong visual hierarchy around the primary bookmark workflow.
- Reusable surface, border, radius, spacing, and typography tokens.
- Restrained brand accents rather than excessive gradients.
- Clear hover, active, disabled, and keyboard-focus states.
- Responsive behavior across desktop, tablet, and mobile.
- Reduced-motion support for users who prefer minimal animation.

## Architecture

```text
                           ┌──────────────────┐
                           │      Google      │
                           │      OAuth       │
                           └────────┬─────────┘
                                    │
                                    ▼
┌──────────────┐      ┌─────────────────────────┐
│   Browser    │ ───▶ │     Next.js App Router  │
│  React UI    │      │                         │
└──────────────┘      │ Login / Dashboard /     │
                      │ OAuth callback          │
                      └───────────┬─────────────┘
                                  │
                         ┌────────▼────────┐
                         │  Supabase Auth  │
                         └────────┬────────┘
                                  │ session
                         ┌────────▼────────┐
                         │ PostgreSQL + RLS│
                         │   bookmarks     │
                         └─────────────────┘
                                  │
                                  ▼
                               Vercel
```

For deeper system details, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Technology Stack

### Application

- **Next.js 16** — App Router and production React framework.
- **React 19** — component-driven UI.
- **TypeScript 5** — static typing and safer refactoring.
- **Tailwind CSS 4** — utility-based styling and responsive design.

### Platform

- **Supabase Auth** — authentication and Google OAuth.
- **Supabase PostgreSQL** — persistent bookmark storage.
- **PostgreSQL RLS** — database-level authorization.
- **Vercel** — production hosting and deployment.
- **GitHub** — source control and deployment integration.

## Security Model

The database is the authorization boundary. Every bookmark row is associated with an authenticated user and protected through RLS.

Core ownership rule:

```sql
auth.uid() = user_id
```

Expected policies cover `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations. Client-side filtering such as `.eq("user_id", userId)` improves query scoping but **does not replace RLS**.

Security requirements:

- Never expose a Supabase service-role key in browser code.
- Keep deployment-specific configuration in environment variables.
- Register only approved OAuth redirect URLs.
- Never commit `.env.local` or private credentials.
- Rotate credentials immediately if they are accidentally exposed.

See [`SECURITY.md`](SECURITY.md) for the security policy.

## Authentication Flow

```text
/login
   │
   │ signInWithOAuth()
   ▼
Supabase Auth
   │
   ▼
Google
   │
   ▼
/auth/callback
   │
   ▼
Authenticated session
   │
   ▼
Dashboard
```

The application constructs the callback URL from the active application origin, allowing the same code path to work across local and deployed environments. The corresponding production URL must still be configured in Supabase and Google OAuth settings.

## Data Flow

```text
User interaction
      │
      ▼
React component
      │
      ├── immediate UI feedback
      │
      ▼
Supabase client
      │
      ▼
PostgreSQL
      │
      ├── RLS authorization
      │
      ▼
Database result
      │
      ▼
UI reconciliation
```

Optimistic interactions are used where they improve responsiveness, while the persisted database state remains authoritative.

## Repository Structure

```text
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/              # OAuth callback route
│   ├── components/
│   │   ├── AuthForm.tsx           # Auth UI
│   │   ├── BookmarkCard.tsx       # Bookmark presentation
│   │   ├── BookmarkForm.tsx       # Create/edit form
│   │   ├── BookmarkList.tsx       # Collection rendering
│   │   └── Dashboard.tsx           # Main workspace
│   ├── login/
│   │   └── page.tsx               # Login experience
│   ├── globals.css                # Global design system
│   ├── layout.tsx                 # Root layout + metadata
│   └── page.tsx                   # Application entry point
├── docs/
│   ├── ARCHITECTURE.md            # System architecture
│   └── RELEASE_CHECKLIST.md       # Production verification
├── lib/
│   └── supabaseClient.ts          # Supabase client
├── public/                        # Static assets
├── CONTRIBUTING.md                # Contribution workflow
├── SECURITY.md                    # Security policy
├── package.json                   # Scripts and dependencies
└── README.md
```

## Prerequisites

- Node.js compatible with the installed Next.js release.
- npm.
- A Supabase project.
- Google OAuth credentials configured through Supabase Auth.

## Environment Configuration

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, configure the same public variables in Vercel with the production site URL.

> Do not commit `.env.local`. Public browser configuration is not a substitute for keeping privileged credentials server-side.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production verification

```bash
npm run lint
npm run build
npm run start
```

Running the production build locally is recommended before deploying significant changes.

## Supabase Configuration

### Database

Create the `bookmarks` table with a `user_id` column referencing the authenticated owner and enable RLS.

The application expects policies equivalent to:

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

### OAuth

In Supabase Auth URL Configuration:

- Set the production Site URL to the deployed application URL.
- Add the production callback route:

```text
https://your-production-domain/auth/callback
```

Configure the corresponding authorized redirect URI in the Google OAuth configuration.

## Deployment

The intended deployment model is **GitHub → Vercel → Supabase**.

1. Push the validated change to `main`.
2. Vercel builds the Next.js application.
3. Vercel injects production environment variables.
4. The application communicates with Supabase Auth and PostgreSQL.
5. Smoke-test authentication and bookmark CRUD after deployment.

### Release criteria

A release should not be considered production-ready until:

- The production build succeeds.
- OAuth login and callback succeed.
- RLS prevents cross-user data access.
- Create/edit/delete/favorite flows work.
- Search/filter/sort work.
- Responsive layouts remain usable.
- No secrets are exposed.

See [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).

## Accessibility

Accessibility is part of the product implementation rather than an optional enhancement.

Current considerations include:

- Semantic interactive elements.
- Visible `focus-visible` states.
- Accessible labels and status messaging.
- `aria-busy` for asynchronous authentication actions.
- `role="alert"` for authentication errors.
- Decorative visuals excluded from assistive technology where appropriate.
- Reduced-motion support.
- Responsive, touch-friendly controls.

## Engineering Practices

This repository demonstrates:

- App Router architecture.
- Type-safe component development.
- OAuth integration and callback handling.
- Database-level authorization with RLS.
- Optimistic UI and server reconciliation.
- Reusable design-system tokens.
- Responsive Bento Grid composition.
- Accessibility-aware interaction design.
- Environment-based deployment configuration.
- Production debugging and release verification.
- Security and contribution documentation.

## Documentation Map

| Document | Purpose |
| --- | --- |
| `README.md` | Product, setup, architecture, deployment, and engineering overview |
| `docs/ARCHITECTURE.md` | Detailed application and data architecture |
| `docs/RELEASE_CHECKLIST.md` | Production release and smoke-test checklist |
| `SECURITY.md` | Vulnerability reporting and security baseline |
| `CONTRIBUTING.md` | Development and contribution workflow |

## Roadmap

Potential future capabilities:

- Tags, collections, and saved views.
- Pagination or virtualized loading for large libraries.
- Automatic link metadata extraction.
- Duplicate-link detection.
- Keyboard shortcuts.
- Realtime synchronization.
- Import/export workflows.
- Usage analytics.
- Custom domains.
- Automated end-to-end testing and CI quality gates.

## License

This project is currently maintained as a portfolio and learning project. Add an explicit open-source license before accepting external contributions or redistributing the code under open-source terms.

## Maintainer

**Santhosh Kumar**

GitHub: https://github.com/santhosh12133
