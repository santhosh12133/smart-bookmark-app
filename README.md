# 🚀 Smart Bookmark App

A production-ready full-stack bookmark management application built using **Next.js 16 (App Router), Supabase, and Tailwind CSS**.

The application enables users to securely authenticate using Google OAuth and manage their personal bookmarks with full CRUD functionality, dashboard analytics, filtering, sorting, and optimized user experience.

---

## 🌍 Live Demo

🔗 https://smart-bookmark-app-silk-kappa.vercel.app

---

## 📌 Project Objective

The objective of this project was to design and deploy a secure, scalable SaaS-style bookmark management system that demonstrates:

- OAuth-based authentication
- User-level data isolation
- Full CRUD operations
- Optimistic UI updates
- Analytics dashboard
- Production deployment workflow

This project reflects real-world full-stack architecture and deployment practices.

---

## 🏗️ System Architecture

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks
- Component-based modular architecture

### Backend
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)
- Row Level Security (RLS)

### Deployment
- Vercel (Production hosting)
- Environment-based configuration

---

## 🔐 Authentication Architecture

- Google OAuth handled via Supabase
- Secure session management using `supabase.auth.getSession()`
- Dedicated OAuth callback handler at `/auth/callback`
- Automatic redirect for unauthenticated users
- No password storage (OAuth-based authentication)

### 🔒 Security Design

All database operations are protected by Supabase Row Level Security:

```sql
auth.uid() = user_id
```

Client-side filtering ensures additional safety:

```ts
.eq("user_id", userId)
```

This guarantees strict user-level data isolation.

---

## 📦 Core Features Implemented

### 1️⃣ Authentication
- Google Sign-in
- OAuth callback processing
- Protected routes
- Secure logout handling

### 2️⃣ Bookmark CRUD Operations
- Add bookmark with validation
- Edit bookmark
- Delete bookmark
- Optimistic UI updates
- Server-side consistency via refetch

### 3️⃣ Advanced UI Features
- Search functionality
- Category filtering
- Sorting (Newest / Oldest)
- Favorites toggle
- Analytics dashboard
- Loading skeleton screens
- Smooth page transitions
- Professional UI hierarchy

### 4️⃣ Dashboard Analytics
Displays dynamic metrics:
- Total bookmarks
- Total favorites
- Unique categories
- Latest added bookmark

---

## 🧠 Design Patterns Used

- Optimistic UI pattern
- Controlled form state
- Separation of concerns
- Modular component structure
- Secure environment variable management
- Production-safe OAuth redirect handling

---

## 📂 Project Structure

```
app/
 ├── page.tsx                  → Main dashboard (protected)
 ├── login/page.tsx            → Login page
 ├── auth/callback/page.tsx    → OAuth callback handler

components/
 ├── Dashboard.tsx
 ├── BookmarkForm.tsx
 ├── BookmarkList.tsx

lib/
 ├── supabaseClient.ts         → Supabase configuration
```

---

## ⚙️ Environment Configuration

### Local Development (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

---

## 🛡 Security Implementation

- Row Level Security enabled on `bookmarks` table
- User-based data isolation
- OAuth redirect URL validation
- Environment variable isolation
- No service role key exposed

---

## 🚀 Deployment Process

1. Version controlled using Git
2. Hosted on GitHub
3. Connected to Vercel
4. Production environment variables configured
5. Supabase redirect URLs configured
6. Google OAuth credentials configured

---

## 🎯 What This Project Demonstrates

- Full-stack SaaS architecture
- OAuth integration with Supabase
- Secure multi-user application design
- Production deployment pipeline
- Clean component architecture
- Performance-conscious UI development

---

## 📈 Future Enhancements

- AI-powered link title extraction
- Tag-based organization
- Pagination for scalability
- Custom domain setup
- Realtime updates
- Usage analytics integration

---

## 👨‍💻 Author

Santhosh Kumar  
MCA | Full-Stack Developer  
GitHub: https://github.com/santhosh12133

---

## 📄 License

This project is built for educational and portfolio purposes.

