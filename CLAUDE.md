# Help and Heal — India's On-Demand Mental Health Platform

## What We're Building
An "Astrotalk for mental health" — an instant, per-minute, on-demand human connection platform for emotional support and counseling. Users can connect with trained listeners, counselors, and licensed psychologists within 90 seconds via audio call, chat, or video. The platform uses a wallet-based per-minute billing model (like Astrotalk) instead of subscriptions.

## The Core User Promise
"Feeling overwhelmed? Talk to a real human who cares — instantly, affordably, and privately."

---

## Tech Stack

### Mobile App (Priority 1)
- **Framework:** React Native with Expo (managed workflow)
- **Target:** Android first (95% of India's market), then iOS
- **State Management:** Zustand (lightweight, simple)
- **Navigation:** React Navigation v7
- **UI Library:** NativeWind (Tailwind CSS for React Native)
- **Animations:** React Native Reanimated

### Web App (Priority 2)
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Purpose:** Landing page + waitlist + PWA fallback for users with low phone storage

### Backend
- **Runtime:** Node.js 20+
- **Framework:** NestJS (TypeScript)
- **API Style:** REST for CRUD, WebSocket for real-time
- **Authentication:** Phone OTP via MSG91 (no email/social login — privacy first)
- **Session Management:** JWT with refresh tokens stored in secure storage

### Database
- **Primary:** PostgreSQL 16 (via Prisma ORM)
- **Cache/Queue:** Redis (session state, matching queue, real-time presence)
- **Chat Storage:** MongoDB (for flexible message schema)

### Real-Time Communication
- **Audio/Video Calls:** 100ms SDK (Indian company, Mumbai CDN, competitive pricing)
- **Text Chat:** Socket.io with Redis adapter for horizontal scaling
- **Protocol:** WebRTC under the hood via 100ms

### Payments
- **Gateway:** Razorpay (wallet recharge, UPI, cards, wallets)
- **Provider Payouts:** RazorpayX (weekly bank transfers to providers)
- **Model:** Prepaid wallet — user recharges balance, per-minute deduction during sessions

### AI/ML Layer
- **LLM:** Claude API (Sonnet model) for triage chatbot, session summaries
- **NLP:** Python FastAPI microservice for crisis keyword detection + sentiment analysis
- **Matching:** Custom algorithm (issue type + language + rating + availability + price preference)

### Cloud Infrastructure
- **Provider:** AWS Mumbai region (ap-south-1) — DPDP Act data residency compliance
- **Compute:** ECS Fargate (containerized, auto-scaling)
- **Storage:** S3 (encrypted at rest with AES-256)
- **CDN:** CloudFront
- **Monitoring:** CloudWatch + Sentry (error tracking)

### DevOps
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Environment Management:** .env files (never commit secrets)

---

## Project Structure

```
help-and-heal/
├── apps/
│   ├── mobile/              # React Native Expo app (user-facing)
│   │   ├── src/
│   │   │   ├── screens/     # All app screens
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── services/    # API calls, auth, storage
│   │   │   ├── store/       # Zustand stores
│   │   │   ├── utils/       # Helpers, constants, types
│   │   │   └── navigation/  # React Navigation setup
│   │   └── app.json         # Expo config
│   │
│   ├── provider/            # Provider/listener app (separate app)
│   │   ├── src/
│   │   │   ├── screens/     # Provider dashboard screens
│   │   │   ├── components/
│   │   │   └── services/
│   │   └── app.json
│   │
│   └── web/                 # Next.js web app (landing + PWA)
│       ├── app/             # App router pages
│       ├── components/
│       └── public/
│
├── packages/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/        # OTP login, JWT
│   │   │   │   ├── users/       # User profiles
│   │   │   │   ├── providers/   # Provider profiles, vetting
│   │   │   │   ├── sessions/    # Call/chat session management
│   │   │   │   ├── wallet/      # Wallet, billing, transactions
│   │   │   │   ├── matching/    # Smart matching engine
│   │   │   │   ├── chat/        # Real-time messaging
│   │   │   │   ├── ratings/     # Post-session ratings
│   │   │   │   ├── safety/      # Crisis detection, escalation
│   │   │   │   └── admin/       # Admin dashboard APIs
│   │   │   ├── common/          # Guards, interceptors, filters
│   │   │   └── config/          # Environment config
│   │   └── prisma/
│   │       └── schema.prisma    # Database schema
│   │
│   ├── ai-service/          # Python FastAPI microservice
│   │   ├── triage/          # AI triage chatbot logic
│   │   ├── safety/          # Crisis keyword NLP detection
│   │   └── summarizer/      # Session summary generator
│   │
│   └── shared/              # Shared types, constants, utils
│       └── src/
│           ├── types/
│           └── constants/
│
├── admin/                   # Admin dashboard (React + Next.js)
│   ├── app/
│   └── components/
│
├── CLAUDE.md                # This file
├── package.json             # Monorepo root (npm workspaces)
├── docker-compose.yml       # Local dev environment
└── .github/
    └── workflows/           # CI/CD pipelines
```

---

## Database Schema (Key Tables)

```
users
  - id (UUID, PK)
  - phone (string, unique, encrypted)
  - name (string, optional)
  - language_preference (enum: hi, en, ta, te, bn, mr, kn, ml)
  - created_at, updated_at

providers
  - id (UUID, PK)
  - user_id (FK → users)
  - tier (enum: LISTENER, COUNSELOR, CLINICAL_PSYCHOLOGIST, PSYCHIATRIST)
  - display_name (string)
  - bio (text)
  - specialties (string[]) — e.g., ['anxiety', 'loneliness', 'relationships', 'stress', 'grief']
  - languages (string[])
  - rate_per_minute (integer, in paise — 1000 = ₹10/min)
  - is_online (boolean)
  - is_verified (boolean)
  - rating_avg (decimal)
  - total_sessions (integer)
  - total_minutes (integer)

wallets
  - id (UUID, PK)
  - user_id (FK → users, unique)
  - balance (integer, in paise)
  - updated_at

wallet_transactions
  - id (UUID, PK)
  - wallet_id (FK → wallets)
  - type (enum: RECHARGE, SESSION_DEBIT, REFUND, BONUS)
  - amount (integer, in paise)
  - razorpay_payment_id (string, nullable)
  - session_id (FK → sessions, nullable)
  - created_at

sessions
  - id (UUID, PK)
  - user_id (FK → users)
  - provider_id (FK → providers)
  - type (enum: AUDIO, CHAT, VIDEO)
  - status (enum: WAITING, ACTIVE, COMPLETED, CANCELLED, ESCALATED)
  - started_at (timestamp)
  - ended_at (timestamp)
  - duration_seconds (integer)
  - rate_per_minute (integer, in paise — snapshot at session start)
  - total_charged (integer, in paise)
  - is_free_trial (boolean, default false)
  - mood_before (integer, 1-10, nullable)
  - mood_after (integer, 1-10, nullable)

ratings
  - id (UUID, PK)
  - session_id (FK → sessions, unique)
  - user_id (FK → users)
  - provider_id (FK → providers)
  - score (integer, 1-5)
  - feedback (text, nullable)
  - created_at

chat_messages (MongoDB)
  - _id
  - session_id
  - sender_type (enum: USER, PROVIDER, SYSTEM)
  - content (string, encrypted)
  - timestamp

safety_alerts
  - id (UUID, PK)
  - session_id (FK → sessions)
  - alert_type (enum: CRISIS_KEYWORD, SUICIDAL_IDEATION, SELF_HARM, ABUSE)
  - detected_text (string, encrypted)
  - action_taken (enum: SUPERVISOR_NOTIFIED, SESSION_ESCALATED, HELPLINE_REFERRED)
  - created_at
```

---

## Core User Flow (Screen by Screen)

### Screen 1: Splash → Onboarding (first time only)
- 3 slides: "Talk to real humans", "Affordable per-minute pricing", "100% private and anonymous"
- Skip button on each slide

### Screen 2: Login
- Phone number input with Indian flag prefix (+91)
- "Send OTP" button → 6-digit OTP input → auto-verify
- No name or email required at signup — privacy first
- After OTP: ask language preference (Hindi/English) and optional display name

### Screen 3: Home (The main screen)
- Top: Wallet balance pill (e.g., "₹ 247") — tap to recharge
- Hero: Large "Talk Now" button with pulsing animation
- Below hero: "How are you feeling?" — 5 mood options
- Provider list: Scrollable cards showing available (online) providers with photo, name, specialty tags, languages, rating, rate, and online status
- Filters: Language, specialty, price range, tier
- Bottom nav: Home | Self-Help | History | Profile

### Screen 4: Provider Profile
- Full profile with photo, name, bio, specialties, languages, experience
- Stats: total sessions, total hours, rating
- Reviews from other users (anonymous)
- "Talk Now" button (large, prominent)

### Screen 5: Pre-Session
- Brief mood check
- Optional "What would you like to talk about?" text/tags
- Wallet balance check — if insufficient, prompt recharge
- Free trial badge if first session (5 min free)
- "Connect" button → matching → connecting screen with calming animation

### Screen 6: Active Session (Audio Call)
- Provider name and photo at top
- Timer counting up (MM:SS)
- Rate and running cost display
- Wallet balance remaining with low-balance warning
- Mute/unmute, speaker toggle
- End call button and emergency escalation button

### Screen 7: Post-Session
- 1-5 star rating with optional text feedback
- "How do you feel now?" mood check (before/after comparison)
- Session summary: duration, cost, provider name

### Screen 8: Wallet
- Current balance, recharge packs (₹99/199/499/999/1999)
- Bonus callouts, custom amount, transaction history
- Razorpay payment integration (UPI, cards, wallets)

### Screen 9: Self-Help (AI + Content)
- Claude-powered AI chatbot for immediate coping
- Guided exercises: breathing, grounding, body scan
- Articles/resources by topic, mood tracker history

### Screen 10: Session History
- List of past sessions with date, provider, duration, cost

### Screen 11: Profile
- Display name, masked phone, language preference
- Notification settings, help, privacy policy, logout

---

## Key Business Rules

### Pricing & Billing
- All money stored in PAISE (1 rupee = 100 paise) to avoid floating point issues
- Billing happens every 60 seconds during an active session
- If wallet balance drops below one minute's cost, show warning
- If wallet hits zero, end session gracefully (30-second warning first)
- First session for every new user: 5 minutes free (no wallet needed)
- Platform commission: 30% of per-minute rate (provider gets 70%)

### Provider Tiers
- Tier 1 — Trained Peer Listener: 40-hour platform training, no degree required, ₹5-20/min
- Tier 2 — Certified Counselor: M.A./M.Sc. Psychology, ₹20-50/min
- Tier 3 — Clinical Psychologist: RCI-registered, ₹50-150/min
- Tier 4 — Psychiatrist: MBBS + MD Psychiatry, NMC-registered, ₹100-250/min

### Matching Algorithm Priority
1. Language match (must match)
2. Issue/specialty match
3. Provider tier appropriate to user's severity
4. Provider rating (weighted)
5. Wait time (prefer shortest)
6. Price preference (if user filtered)

### Safety & Crisis Protocol
- Real-time NLP scans all text chat for crisis keywords
- Crisis keywords trigger immediate supervisor notification
- Emergency resources: Tele-MANAS (14416), Vandrevala Foundation (1860-2662-345), iCall (9152987821)

### Data Privacy
- All health data encrypted at rest (AES-256) and in transit (TLS 1.3)
- Phone numbers stored encrypted, never in plain text
- Session recordings NEVER stored without explicit consent
- Comply with DPDP Act 2023
- Users can delete all their data via "Delete Account"

---

## Design Guidelines

### Visual Identity
- Primary Color: #4A90D9 (calming blue)
- Secondary Color: #7BC67E (supportive green)
- Accent: #F5A623 (warm amber for CTAs and wallet)
- Background: #F8FAFB (near-white, calming)
- Text: #1A2B3C (dark navy)
- Error/Alert: #E24B4A

### Design Principles
- Calming, not clinical — safe space, not hospital
- Audio-first — default to audio calls, video is opt-in
- Privacy-forward — minimal data collection, anonymous by default
- Simple — 3 taps max from opening app to talking to someone
- Inclusive — support Hindi/English, large text option, screen reader compatible

### Typography
- Headings: Inter (bold/semibold)
- Body: Inter (regular)
- Hindi text: Noto Sans Devanagari

---

## Commands

### Development
```bash
docker-compose up -d                       # Start databases locally
cd packages/api && npm run dev             # Backend on port 3000
cd apps/mobile && npx expo start           # Mobile app
cd apps/web && npm run dev                 # Web app on port 3001
```

### Database
```bash
cd packages/api && npx prisma migrate dev  # Run migrations
cd packages/api && npx prisma studio       # Visual DB browser
```

---

## Coding Conventions

- Language: TypeScript everywhere (strict mode)
- Formatting: Prettier with 2-space indentation, single quotes, trailing commas
- Naming: camelCase for variables/functions, PascalCase for components/classes, SCREAMING_SNAKE for constants
- API Responses: Always wrap in { success: boolean, data: T, error?: string }
- Error Handling: Never swallow errors. Log with context. Return user-friendly messages.
- Git Commits: Conventional commits: feat:, fix:, docs:, refactor:, test:
- No hardcoded strings: All user-facing text in i18n files for Hindi/English
- All money values stored in paise (integer), never rupees (float)
- All sensitive data encrypted before storage

---

## Current Phase: MVP (Month 1-3)

### MVP Scope (Build first)
1. Landing page with waitlist
2. User app: Login → Home → Provider list → Audio call → Rating → Wallet
3. Provider app: Online toggle → Accept call → Session → Earnings
4. Backend: Auth, providers, sessions, wallet, matching, ratings
5. Admin: Basic dashboard with session monitoring
6. AI: Triage chatbot, crisis keyword detection

### NOT in MVP (Build later)
- Video calls (audio only for MVP)
- Subscription plans (wallet only for MVP)
- Languages beyond Hindi + English
- iOS app (Android first)
- B2B/corporate features
- Wearable integration
- Group sessions

---

## Important Notes for Claude Code

- Always ask before deleting files or making destructive changes
- Commit working code frequently with descriptive messages
- All user-facing text must support Hindi and English (use i18n keys)
- Never store sensitive data in plain text — always encrypt
- Test on a real Android device via Expo Go after each major feature
- When in doubt about a design decision, ask — don't assume
- Keep the UI simple and calming — this is a mental health app
- Performance matters: the app should feel instant, especially the "Talk Now" flow
