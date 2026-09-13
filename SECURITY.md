# Security Policy

## Supported Versions

Security fixes are applied to the current `main` branch.

## Reporting a Vulnerability

Please do not publish sensitive security findings in a public issue.

When reporting a suspected vulnerability, include:

- A concise description of the issue.
- The affected route, component, or configuration.
- Reproduction steps where safe to provide.
- The potential security impact.
- Any suggested mitigation.

Avoid including passwords, OAuth tokens, service-role keys, session cookies, or other secrets in reports.

## Security Baseline

Smart Bookmark is designed around the following controls:

- Supabase Auth for identity and OAuth.
- PostgreSQL Row Level Security for per-user authorization.
- `auth.uid() = user_id` ownership enforcement.
- Public Supabase client configuration only in browser code.
- No service-role key in client-side code.
- Environment variables for deployment-specific configuration.
- Production callback URLs explicitly registered with the OAuth provider.

## Secret Handling

Never commit `.env.local`, service-role keys, private OAuth credentials, database passwords, or other secrets to Git.

If a secret is accidentally committed, rotate it immediately. Removing the value from the latest commit does not invalidate a credential that has already been exposed.

## Authorization Expectations

Client-side filtering is not an authorization mechanism. Any database operation involving user-owned data must remain protected by Supabase RLS.

Before production release, verify:

1. An authenticated user can access only their own bookmarks.
2. A user cannot read another user's rows by changing an ID in a request.
3. Insert, update, and delete policies enforce ownership.
4. Production environment variables point to the intended Supabase project.
5. OAuth redirects use approved production origins.
