# AureVeil implementation status

## Implemented now
- Next.js 16.3.3 / React 19 / TypeScript / Tailwind 4 project structure
- Art-first responsive visual system
- Public landing page and masonry artwork discovery
- Explore/search-result route and Find Similar service boundary
- Natural-language “describe the art you want” search UI
- Persistent per-account search history
- Persistent recommendation-event tracking for views, likes, saves, follows, Find Similar and commerce intent
- Weighted, time-decayed per-account For You ranking using interaction history + onboarding interests
- Discovery-history reset control in Settings
- Artwork detail route
- `/@username` profile route architecture
- Supabase email/password signup and login wiring
- Responsive navigation
- Onboarding interest/goals UI
- Creator upload experience shell with honest disabled publish state until storage is configured
- Creator Studio real-data-ready empty states
- Shop and Tattoo discovery surfaces
- Collections, Cart, Messages, Notifications, Settings, and Commissions surfaces
- Stripe Checkout wallet-deposit endpoint
- Verified Stripe webhook handler
- Immutable wallet transaction ledger design with integer cents and idempotency
- Supabase/Postgres schema for core social, marketplace, commission, messaging, promotion, reporting, recommendation and wallet features
- pgvector visual embedding storage architecture
- Row Level Security policies for core user-owned data
- Central brand, fee and wallet configuration
- `.env.example`
- Supabase migration and seed starter
- Vercel deployment documentation

## Requires project credentials / additional production implementation
- Supabase project URL/key/service role
- Storage bucket + image transformation pipeline
- Google OAuth provider configuration
- Stripe test/live keys and webhook signing secret
- Stripe Connect onboarding/payout workflows
- Complete product/cart marketplace checkout server actions
- Wallet + Stripe split-pay checkout
- Real image embedding provider/worker
- Production-scale recommendation aggregation/model jobs (MVP weighted account personalization is implemented)
- True text/image embedding generation and indexing provider
- Supabase Realtime message subscriptions
- Message attachment upload path
- Notification producer functions/triggers
- Promotion payment + attribution jobs
- Admin/moderation screens and server authorization helpers
- Mature-content image moderation provider
- Full creator analytics SQL/API queries
- Rate limiting and anti-spam provider
- Transactional email templates
- End-to-end automated tests

Nothing in the UI should be interpreted as a completed third-party transaction when its provider is not configured. The wallet webhook is the authoritative deposit-credit path.
