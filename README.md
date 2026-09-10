# AureVeil

AureVeil is a production-minded art discovery, portfolio, commissions, and marketplace foundation built from the supplied product specification. The UI is deliberately art-first rather than SaaS-dashboard-first.

## Current implementation

Implemented in this repository: responsive logged-out discovery experience, masonry artwork browsing, artwork detail pages, natural-language search/explore routing, account-level search-history persistence, personalized For You ranking from searches/views/likes/saves/follows and other recommendation events, email/password signup and login wiring through Supabase, creator upload UI, wallet deposit UI, secure Stripe Checkout session creation, verified Stripe webhook wallet ledger crediting, Creator Studio empty/real-data-ready states, core marketplace/commission/messaging database schema, Supabase RLS policies, vector-search storage architecture, and Vercel-compatible project configuration.

Features that require third-party configuration do not fake success. With no Supabase/Stripe keys, auth and deposits report that configuration is missing. Visual Search returns 501 until a real embedding provider is configured.

## Requirements

- Node.js 22+
- npm
- Supabase project
- Stripe account (test mode is fine)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_core.sql` in the SQL editor or migration CLI.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local`.
4. Add `SUPABASE_SERVICE_ROLE_KEY` only to secure server environments. Never expose it to the browser.
5. Create a public/private artwork storage bucket strategy. Store original artwork privately when protection is desired and create optimized delivery variants for feed usage.
6. Configure Google OAuth in Supabase if desired; the schema does not depend on Google login.

## Stripe setup

Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.

For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the resulting signing secret into `STRIPE_WEBHOOK_SECRET`.

The wallet deposit path is:

1. Authenticated user requests a deposit.
2. Server validates the amount and creates a Stripe Checkout Session.
3. The browser goes to Stripe.
4. Browser return to `/wallet` does **not** credit funds.
5. Stripe sends a signed `checkout.session.completed` webhook.
6. The webhook verifies the signature and payment status.
7. A service-role insert creates one immutable `wallet_transactions` ledger row using Stripe event ID as an idempotency key.
8. Balance is derived using `wallet_balance(user_id)`.

Do not add direct authenticated insert/update policies to `wallet_transactions`.

## Personalized discovery

Signed-in discovery activity is stored against the Supabase user account rather than only in browser state. `search_history` stores descriptive searches and `recommendation_events` records taste signals such as artwork views, likes, saves, follows, Find Similar usage, purchases and commission requests. `lib/recommendations.ts` applies weighted + time-decayed scoring to those signals and onboarding interests to order the For You feed.

Users can clear their discovery/search history from Settings without deleting their actual collections, purchases or followed artists. `user_preferences.personalization_enabled` is included so a full personalization on/off control can be exposed without redesigning the schema.

The main search field accepts normal keywords or full descriptions such as “dark surreal castle under a red moon.” The current local/demo dataset uses honest metadata-based semantic fallback. A production embedding provider can be connected for true vector semantic retrieval without changing the user-facing search experience.

## Visual Search

`visual_embeddings` includes a pgvector column. `/api/visual-search` intentionally does not manufacture similarity scores. Replace the current 501 service boundary with CLIP/OpenCLIP or another image embedding provider and store normalized vectors in `visual_embeddings`. The default no-provider behavior should fall back to metadata/tag retrieval in the product layer, clearly marked internally as a fallback.

## Production work still required

The supplied product specification is larger than a single MVP. The repository establishes the real application architecture and secure critical paths, but several surfaces still need full data-backed implementation before a public launch: optimized artwork storage transforms, shopping-cart actions and payment checkout, Stripe Connect seller payout onboarding, commission transaction funding, Supabase Realtime chat subscriptions, notification producers, admin moderation UI, search typeahead/indexing, recommendation scoring jobs, embedding worker/service, promotion checkout/metrics, detailed creator analytics queries, report review workflow, transactional emails, rate limiting, image moderation, tests, and legal/policy copy.

These are intentionally not represented as "fully operational" when they are not.

## Vercel

Push the project to GitHub, import it into Vercel, and add the environment variables from `.env.example`. Set the Stripe production webhook endpoint to:

`https://YOUR_DOMAIN/api/webhooks/stripe`

Use Node 22+ in Vercel project settings. Run the Supabase migration before accepting production signups.

## Brand configuration

Rename the temporary AureVeil identity in `lib/config.ts`. The logo text/header derives from this central configuration.
