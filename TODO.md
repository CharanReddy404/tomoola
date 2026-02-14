# ToMoola — Implementation Tracker

> **Goal:** Marketplace to connect folk artists with event organizers.
> **Note:** Payments handled offline. Price negotiated directly between client & artist.

---

## FRONTEND (Next.js) — 23 pages

### Pages — Public

| # | Task | Status |
|---|---|---|
| 1 | Landing page (hero, search, how-it-works, art forms, CTA) | ✅ Done |
| 2 | Folk Dances catalog page (all 9 art forms grid + filter) | ✅ Done |
| 3 | About page (mission, vision, stats, contact) | ✅ Done |
| 4 | Login/Register page (phone OTP + role select) | ✅ Done |
| 5 | Individual Art Form page (`/folk-dances/[slug]`) | ✅ Done |
| 6 | Artist Profile page (`/artists/[id]`) | ✅ Done |
| 7 | Booking form page (`/book`) | ✅ Done |
| 8 | Booking confirmation page | ✅ (inline in /book) |

### Pages — Client Dashboard

| # | Task | Status |
|---|---|---|
| 9 | Client dashboard layout (`/dashboard`) | ✅ Done |
| 10 | My Bookings — list with status filters | ✅ Done |
| 11 | Booking detail — track status, leave review | ✅ Done |
| 12 | Saved/Favorite artists | ✅ Done |

### Pages — Artist Dashboard

| # | Task | Status |
|---|---|---|
| 13 | Artist dashboard layout (`/artist`) — sidebar nav | ✅ Done |
| 14 | Artist overview — bookings, stats | ✅ Done |
| 15 | Incoming booking requests — accept/decline | ✅ Done |
| 16 | Availability calendar — block/unblock dates | ✅ Done |
| 17 | Edit profile — name, description, pricing, service areas | ✅ Done |
| 18 | Media manager — upload photos, add YouTube links | ✅ Done |
| 19 | Booking history | ✅ Done |
| 20 | Reviews received | ✅ Done |

### Pages — Admin Dashboard

| # | Task | Status |
|---|---|---|
| 21 | Admin layout (`/admin`) — sidebar nav | ✅ Done |
| 22 | Admin overview — bookings, artist stats | ✅ Done |
| 23 | Artist approvals — approve/reject | ✅ Done |
| 24 | All bookings — view, filter | ✅ Done |
| 25 | Art form management — add/edit/delete | ✅ Done |
| 26 | Content moderation — flag/remove media & reviews | ✅ Done |
| 27 | Admin login page (`/admin/login`) | ✅ Done |

---

## BACKEND (NestJS) — 10 modules

### Auth Module

| # | Task | Status |
|---|---|---|
| 28 | Phone OTP send endpoint | ✅ Done |
| 29 | OTP verify + JWT token issue | ✅ Done |
| 30 | JWT auth guard | ✅ Done |
| 31 | Role-based access guard | ✅ Done |
| 32 | Get current user endpoint | ✅ Done |
| 33 | Admin role protection (prevent self-assignment) | ✅ Done |
| 34 | Global ValidationPipe (whitelist + transform) | ✅ Done |
| 35 | DTO validation decorators on all DTOs | ✅ Done |

### Artists Module

| # | Task | Status |
|---|---|---|
| 36 | Create artist profile | ✅ Done (fixed userId bug) |
| 37 | Update artist profile | ✅ Done |
| 38 | Get all artists with filters | ✅ Done |
| 39 | Get single artist | ✅ Done |
| 40 | Get artists by art form slug | ✅ Done |

### Media Module

| # | Task | Status |
|---|---|---|
| 41 | Add media (photo URL / video link) | ✅ Done |
| 42 | Delete media | ✅ Done |
| 43 | Get media by artist | ✅ Done |
| 44 | Reorder media | ✅ Done |
| 45 | Cloudflare R2 presigned upload URL endpoint | ✅ Done (needs R2 config) |

### Content Moderation

| # | Task | Status |
|---|---|---|
| 46 | Flag/unflag media (admin) | ✅ Done |
| 47 | Remove media — soft delete (admin) | ✅ Done |
| 48 | Flag/unflag reviews (admin) | ✅ Done |
| 49 | Remove reviews — soft delete (admin) | ✅ Done |
| 50 | Public queries exclude removed content | ✅ Done |

### Availability Module

| # | Task | Status |
|---|---|---|
| 51 | Block dates | ✅ Done |
| 52 | Get availability by month | ✅ Done |
| 53 | Unblock dates | ✅ Done |

### Bookings Module

| # | Task | Status |
|---|---|---|
| 54 | Create booking request | ✅ Done |
| 55 | Get booking by ID | ✅ Done |
| 56 | List bookings for client | ✅ Done |
| 57 | List bookings for artist | ✅ Done |
| 58 | Accept booking | ✅ Done |
| 59 | Decline booking | ✅ Done |
| 60 | Mark as completed | ✅ Done |
| 61 | Cancel booking | ✅ Done |

### Reviews Module

| # | Task | Status |
|---|---|---|
| 62 | Create review | ✅ Done |
| 63 | Get reviews for artist | ✅ Done |

### Notifications Module

| # | Task | Status |
|---|---|---|
| 64 | WhatsApp notification — new booking | ✅ Done (needs WhatsApp API config) |
| 65 | WhatsApp notification — booking accepted/declined | ✅ Done (needs WhatsApp API config) |
| 66 | Email fallback notifications | ✅ Done (needs SMTP config) |

### Admin Module

| # | Task | Status |
|---|---|---|
| 67 | Approve artist profile | ✅ Done |
| 68 | Reject artist profile | ✅ Done |
| 69 | Get all bookings | ✅ Done |
| 70 | Get platform stats | ✅ Done |

### Art Forms Module

| # | Task | Status |
|---|---|---|
| 71 | Seed initial 9 art forms | ✅ Done |
| 72 | CRUD art forms (admin only) | ✅ Done |

---

## INFRA / SETUP

| # | Task | Status |
|---|---|---|
| 73 | Docker compose (PostgreSQL + Redis + API) | ✅ Done |
| 74 | Prisma schema + migrations | ✅ Done |
| 75 | PrismaService uses ConfigService for DATABASE_URL | ✅ Done |
| 76 | `.env.local` support for local dev overrides | ✅ Done |
| 77 | Cloudflare R2 bucket for media | ✅ Code ready (needs R2 account + env vars) |
| 78 | WhatsApp Cloud API setup | ✅ Code ready (needs Meta Business account + env vars) |
| 79 | SMTP email setup | ✅ Code ready (needs SMTP credentials) |
| 80 | Deploy frontend to Vercel | ✅ Config ready (vercel.json + standalone output) |
| 81 | Deploy backend to Railway/Render | ✅ Config ready (Dockerfile + railway.json) |

---

## BUG FIXES

| # | Bug | Status |
|---|---|---|
| 82 | PrismaClientValidationError — `userId: undefined` in artist creation (controller used `user.id` instead of `user.userId`) | ✅ Fixed |
| 83 | Admin login — `verifyOtp` didn't accept `ADMIN` role, no dedicated admin login page | ✅ Fixed |
| 84 | Artist creation — null/undefined optional fields sent to Prisma bypassing defaults | ✅ Fixed |
| 85 | Missing DTO validation decorators on `CreateBookingDto` and `CreateReviewDto` — `forbidNonWhitelisted` rejected all properties | ✅ Fixed |
| 86 | Admin self-assignment — anyone could create an ADMIN user via OTP | ✅ Fixed |
| 87 | Docker `api_node_modules` volume — prevented new packages from being available in container | ✅ Fixed |

---

## NEXT STEPS (to connect everything)

| # | Task | Status |
|---|---|---|
| 88 | Connect frontend to backend API (fetch calls) | ✅ Done |
| 89 | Wire login page to auth API | ✅ Done |
| 90 | Wire artist dashboard to real API data | ✅ Done |
| 91 | Wire client dashboard to real API data | ✅ Done |
| 92 | Wire admin dashboard to real API data | ✅ Done |
| 93 | Cloudflare R2 presigned upload for photos | ✅ Done (backend + frontend API) |
| 94 | WhatsApp notifications integration | ✅ Done (wired to bookings) |
| 95 | Deploy to production | ✅ Config ready (see docs/DEPLOYMENT.md) |

---

## VERIFIED WORKING (local testing)

All endpoints tested and passing against live Docker PostgreSQL:

- ✅ Health check
- ✅ Art forms CRUD (9 seeded)
- ✅ Admin login (OTP → JWT with ADMIN role)
- ✅ Client login (OTP → JWT with CLIENT role)
- ✅ Admin stats, approvals, moderation
- ✅ Admin self-assignment blocked
- ✅ Artist profile creation (full + minimal fields, Prisma defaults applied)
- ✅ Artist approval workflow
- ✅ Booking creation, acceptance, client listing
- ✅ Input validation (bad payloads rejected with clear errors)
- ✅ Upload URL endpoint (returns config error when R2 not set up)
- ✅ Full `pnpm build` passes (API + Web)

---

## DEPLOYMENT CONFIGS READY

| File | Purpose |
|---|---|
| `services/api/Dockerfile` | Multi-stage production Docker build (Node 22 Alpine) |
| `railway.json` | Railway deployment config (Dockerfile builder + health check) |
| `vercel.json` | Vercel deployment config for Next.js frontend |
| `.dockerignore` | Excludes node_modules, build artifacts, env files |
| `.env.example` | All environment variables with placeholders |
| `scripts/deploy-migrate.sh` | Run Prisma migrations in production |
| `docs/DEPLOYMENT.md` | Step-by-step deployment guide (Railway + Vercel) |

---

## REMAINING — External Config Only

These items are **code-complete** but need external account setup and env vars:

| Service | What's needed |
|---|---|
| Cloudflare R2 | Create R2 bucket, set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` |
| WhatsApp | Meta Business account, WhatsApp Cloud API setup, set `WHATSAPP_ENABLED=true`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` |
| Email (SMTP) | SMTP provider (e.g., Resend, SendGrid), set `EMAIL_ENABLED=true`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |
| Vercel | Connect repo, set `NEXT_PUBLIC_API_URL` to production API |
| Railway/Render | Deploy NestJS, set `DATABASE_URL`, `JWT_SECRET`, all integration env vars |
