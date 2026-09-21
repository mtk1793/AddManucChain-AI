# Vercel Deployment Log

**Project:** AddManucChain-AI  
**Repository:** https://github.com/mtk1793/AddManucChain-AI  
**Deployment Date:** 2026-09-20  
**Deployed By:** OpenCode Agent

---

## Deployment URL

- **Production:** https://addmanuchain-ai.vercel.app
- **Build URL:** https://addmanuchain-ls506sl57-mtk1793s-projects.vercel.app

---

## What Was Done

1. **Cloned the repository** into a fresh local directory:
   ```
   C:\Users\mtk17\AddManucChain-AI-fresh
   ```

2. **Authenticated Vercel CLI** using device login flow.

3. **Linked the local directory** to the existing Vercel project:
   ```
   mtk1793s-projects/addmanuchain-ai
   ```

4. **Configured production environment variables** in Vercel:
   - `NEXTAUTH_SECRET` — generated 64-character random string
   - `NEXTAUTH_URL` — set to `https://addmanuchain-ai.vercel.app`
   - `DATABASE_URL` — set to `file:./db/custom.db`

5. **Deployed to production** using:
   ```bash
   vercel --prod --yes
   ```

6. **Verified deployment** — the login page loads successfully at the production URL.

---

## Build Summary

| Setting | Value |
|---|---|
| Framework | Next.js 16.1.3 |
| Package Manager | Bun |
| Build Command | `bun run build` |
| Install Command | `bun install` |
| Output Directory | `.next` |
| Build Status | ✅ Successful |
| Pages Generated | 66 pages + API routes |

---

## Environment Variables

### Added for Production

| Variable | Value | Purpose |
|---|---|---|
| `NEXTAUTH_SECRET` | `<generated-random-secret>` | NextAuth encryption/signing key |
| `NEXTAUTH_URL` | `https://addmanuchain-ai.vercel.app` | Canonical URL for NextAuth callbacks |
| `DATABASE_URL` | `file:./db/custom.db` | Prisma database connection |

### Already Present in Vercel Project

| Variable | Status |
|---|---|
| `OPENROUTER_API_KEY` | ✅ Set |
| `AI_BASE_URL` | ✅ Set |
| `AI_MODEL` | ✅ Set |

### Not Set (Required for Full AI Features)

| Variable | Why It Matters |
|---|---|
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | Client-side OpenRouter access |
| `NEXT_PUBLIC_ZAI_API_KEY` | Z-AI web dev SDK client access |

---

## Important Notes

1. **SQLite is used for the database.** The repo includes `db/custom.db`, and `DATABASE_URL` points to it. This works for read-only/demo mode, but SQLite file writes do not persist on Vercel serverless functions. For production use with writes, migrate to PostgreSQL (e.g., Vercel Postgres, Neon, Supabase).

2. **Demo credentials from `.env.example` were intentionally NOT added** to production environment variables for security reasons.

3. **No source code changes were made.** This deployment used the existing `main` branch as-is.

4. **The `.vercel` directory is gitignored** and was not pushed to GitHub.

---

## How to Redeploy

With the Git repository connected to Vercel, every push to `main` will automatically trigger a new deployment.

To manually redeploy from the local directory:

```bash
cd C:\Users\mtk17\AddManucChain-AI-fresh
vercel --prod --yes
```

---

## Next Recommended Steps

1. Provision a PostgreSQL database and update `DATABASE_URL` in Vercel project settings.
2. Run `npx prisma db push` and `npx prisma db seed` against the production database.
3. Add `NEXT_PUBLIC_OPENROUTER_API_KEY` and `NEXT_PUBLIC_ZAI_API_KEY` if AI client features are needed.
4. Test login, dashboard, and AI feature flows end-to-end.
