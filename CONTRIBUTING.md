# Contributing

Thank you for contributing to Smart Bookmark.

## Development Workflow

1. Create a focused branch for your change.
2. Keep changes small and related to one concern.
3. Run the local development server and verify the affected flow.
4. Run the production build before submitting a change.
5. Update documentation when behavior, configuration, or architecture changes.
6. Use a clear commit message that describes the change.

## Local Setup

```bash
npm install
npm run dev
```

The application requires the Supabase environment variables documented in the project README.

## Quality Checklist

Before submitting a change, verify:

- `npm run lint` passes.
- `npm run build` passes.
- Authentication still works in the intended environment.
- Bookmark CRUD behavior remains correct.
- RLS ownership is not weakened.
- Loading, empty, and error states remain understandable.
- Keyboard navigation and focus states remain usable.
- Responsive layouts work on desktop and mobile.
- No secrets or local environment files are committed.

## UI Changes

For UI changes, preserve the existing Bento Grid design language and shared visual tokens. Prefer reusable component styles over page-specific overrides.

Accessibility expectations include semantic controls, visible focus states, meaningful labels, appropriate status/error messaging, and reduced-motion support where animation is used.

## Security-Sensitive Changes

Do not bypass RLS to simplify application logic. Authentication and authorization changes should be reviewed carefully and documented.

If you discover a security vulnerability, follow the reporting guidance in `SECURITY.md` rather than opening a public issue.
