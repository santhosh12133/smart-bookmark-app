# Production Release Checklist

Use this checklist before promoting a release to production.

## Application

- [ ] Production build completes successfully.
- [ ] Lint checks pass.
- [ ] Login page renders correctly.
- [ ] Google OAuth completes successfully.
- [ ] OAuth callback returns to the intended application origin.
- [ ] Logout works.
- [ ] Dashboard loads for an authenticated user.

## Bookmark Operations

- [ ] Create bookmark.
- [ ] Edit bookmark.
- [ ] Delete bookmark.
- [ ] Toggle favorite.
- [ ] Search bookmarks.
- [ ] Filter bookmarks.
- [ ] Sort bookmarks.
- [ ] Empty state is correct when no bookmarks exist.
- [ ] Error states are understandable and recoverable.

## Security

- [ ] Supabase RLS is enabled for the bookmarks table.
- [ ] Select policy enforces ownership.
- [ ] Insert policy enforces ownership.
- [ ] Update policy enforces ownership.
- [ ] Delete policy enforces ownership.
- [ ] No service-role key is exposed to the browser.
- [ ] No secrets are committed to Git.
- [ ] Production OAuth redirect URLs are registered.
- [ ] Production environment variables reference the intended services.

## Accessibility

- [ ] Keyboard navigation works through primary actions.
- [ ] Focus indicators are visible.
- [ ] Form controls have accessible labels.
- [ ] Authentication errors are announced appropriately.
- [ ] Async actions expose meaningful loading state.
- [ ] Reduced-motion preference is respected.

## Responsive UI

- [ ] Desktop layout verified.
- [ ] Tablet layout verified.
- [ ] Mobile layout verified.
- [ ] Long titles and URLs do not break the layout.
- [ ] Touch targets remain usable on small screens.

## Deployment

- [ ] Vercel deployment succeeds.
- [ ] Production URL responds successfully.
- [ ] Production authentication has been smoke-tested.
- [ ] Production CRUD has been smoke-tested.
- [ ] No unexpected runtime errors are present after deployment.

## Documentation

- [ ] README reflects current features and setup.
- [ ] Architecture documentation reflects the current system.
- [ ] Security guidance is current.
- [ ] Roadmap is current.
- [ ] Release notes are prepared when the change is user-visible.
