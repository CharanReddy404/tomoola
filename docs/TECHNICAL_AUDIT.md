# TOMOOLA — COMPLETE TECHNICAL AUDIT & ARCHITECTURE DOCUMENTATION

**Generated:** 2026-03-06
**Codebase Version:** Production-Ready (All 95 tasks complete)
**Auditor:** Senior Software Architect & Code Auditor

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Database Overview](#5-database-overview)
6. [API Documentation](#6-api-documentation)
7. [Unfinished Work / Incomplete Features](#7-unfinished-work--incomplete-features)
8. [Potential Bugs / Code Smells](#8-potential-bugs--code-smells)
9. [Code Quality Review](#9-code-quality-review)
10. [Missing Best Practices](#10-missing-best-practices)
11. [Architecture Improvements](#11-architecture-improvements)
12. [Summary & Recommendations](#12-summary--recommendations)

---

## 1. PROJECT OVERVIEW

**ToMoola** is a production-ready, full-stack marketplace platform that connects **Indian folk artists** with **event organizers**. The platform enables clients to discover artists by art form, request bookings with negotiated offline payments, while artists manage their profiles, availability, and bookings. An admin panel facilitates artist approval and content moderation.

### Mission

Enable folk artists to connect with clients for cultural event bookings, manage their professional profiles, and receive payments through direct negotiation.

### Key Features

- **Phone-based OTP Authentication** (JWT)
- **Artist Marketplace** with 9 Indian folk art forms
- **Booking Management** with status tracking
- **Availability Calendar** for artists
- **Review System** with moderation
- **Media Portfolio** management
- **Admin Approval** workflow for artists
- **Content Moderation** for media & reviews
- **Notification System** (WhatsApp/Email)

---

## 2. TECHNOLOGY STACK

### Architecture Type

**Monorepo** with clear separation of concerns using Turborepo

| Layer                   | Technology                  | Version   | Purpose                                     |
| ----------------------- | --------------------------- | --------- | ------------------------------------------- |
| **Monorepo Management** | Turborepo + pnpm workspaces | Latest    | Build orchestration & dependency management |
| **Frontend Framework**  | Next.js (App Router)        | 15.3.0    | SSR/SSG React application                   |
| **Frontend Library**    | React                       | 19.1.0    | UI component library                        |
| **Backend Framework**   | NestJS                      | 11.0.0    | Enterprise Node.js framework                |
| **Runtime**             | Node.js                     | ≥22       | JavaScript runtime                          |
| **Language**            | TypeScript                  | 5.8.0     | Type-safe development (strict mode)         |
| **Database**            | PostgreSQL                  | 16 Alpine | Relational database                         |
| **ORM**                 | Prisma                      | 6.5.0     | Type-safe database client                   |
| **Cache/Session**       | Redis                       | 7 Alpine  | In-memory data structure store              |
| **Styling**             | Tailwind CSS                | 4.1.18    | Utility-first CSS framework                 |
| **UI Components**       | Radix UI + shadcn           | Custom    | Accessible component primitives             |
| **Authentication**      | JWT (Passport.js)           | -         | Token-based auth                            |
| **File Storage**        | Cloudflare R2               | Optional  | S3-compatible object storage                |
| **Email**               | nodemailer                  | 8.0.1     | SMTP email delivery                         |
| **Messaging**           | WhatsApp Cloud API          | Optional  | Real-time notifications                     |
| **Package Manager**     | pnpm                        | ≥10.15.0  | Fast, disk-efficient package manager        |

---

## 3. REPOSITORY STRUCTURE

```
tomoola/
├── services/                           # Runtime applications
│   ├── web/                           # Next.js 15 Frontend (Port 3000)
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router pages
│   │   │   │   ├── (public)/        # Public routes
│   │   │   │   │   ├── page.tsx     # Landing page
│   │   │   │   │   ├── folk-dances/ # Art form catalog
│   │   │   │   │   ├── artists/     # Artist browsing
│   │   │   │   │   ├── about/       # About page
│   │   │   │   │   ├── login/       # Phone OTP login
│   │   │   │   │   └── book/        # Booking form
│   │   │   │   ├── dashboard/       # Client dashboard (protected)
│   │   │   │   │   ├── page.tsx     # Overview
│   │   │   │   │   ├── bookings/    # Client bookings
│   │   │   │   │   └── favorites/   # Saved artists
│   │   │   │   ├── artist/          # Artist dashboard (protected)
│   │   │   │   │   ├── overview/    # Stats & upcoming
│   │   │   │   │   ├── bookings/    # Manage bookings
│   │   │   │   │   ├── availability/ # Calendar
│   │   │   │   │   ├── profile/     # Edit profile
│   │   │   │   │   ├── media/       # Portfolio manager
│   │   │   │   │   └── reviews/     # View reviews
│   │   │   │   ├── admin/           # Admin dashboard (protected)
│   │   │   │   │   ├── login/       # Admin-only login
│   │   │   │   │   ├── page.tsx     # Overview
│   │   │   │   │   ├── artists/     # Approve/reject artists
│   │   │   │   │   ├── bookings/    # All bookings
│   │   │   │   │   ├── art-forms/   # CRUD art forms
│   │   │   │   │   └── moderation/  # Flag/remove content
│   │   │   │   └── layout.tsx       # Root layout
│   │   │   ├── components/          # React components
│   │   │   │   ├── ui/             # shadcn components
│   │   │   │   ├── layout/         # Navbar, etc.
│   │   │   │   └── home/           # Landing components
│   │   │   ├── context/            # React context
│   │   │   │   └── auth-context.tsx # Global auth state
│   │   │   └── lib/                # Utilities
│   │   │       ├── api.ts          # Centralized API client
│   │   │       └── utils.ts        # Helper functions
│   │   ├── next.config.ts          # Next.js configuration
│   │   ├── tsconfig.json           # TypeScript config
│   │   ├── tailwind.config.ts      # Tailwind config
│   │   └── package.json
│   │
│   └── api/                           # NestJS 11 Backend (Port 4000)
│       ├── src/
│       │   ├── auth/                 # Authentication module
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts   # OTP generation & JWT
│       │   │   ├── jwt.strategy.ts   # JWT validation
│       │   │   ├── guards/          # Auth & role guards
│       │   │   └── dto/             # Auth DTOs
│       │   ├── artists/              # Artist profile module
│       │   │   ├── artists.controller.ts
│       │   │   ├── artists.service.ts # CRUD operations
│       │   │   └── dto/             # Artist DTOs
│       │   ├── art-forms/            # Art form catalog module
│       │   ├── bookings/             # Booking management module
│       │   │   ├── bookings.controller.ts
│       │   │   └── bookings.service.ts # Status transitions
│       │   ├── availability/         # Artist calendar module
│       │   ├── reviews/              # Review module
│       │   ├── media/                # Media & upload module
│       │   │   ├── media.service.ts
│       │   │   └── upload.service.ts # R2 presigned URLs
│       │   ├── notifications/        # WhatsApp/Email module
│       │   ├── admin/                # Admin operations
│       │   │   ├── admin.service.ts
│       │   │   ├── admin.controller.ts
│       │   │   └── admin-moderation.controller.ts
│       │   ├── prisma/               # Database service
│       │   │   └── prisma.service.ts # Singleton client
│       │   ├── app.module.ts         # Root module
│       │   └── main.ts               # Entry point
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── Dockerfile                # Multi-stage production build
│       └── package.json
│
├── packages/                          # Shared libraries
│   ├── db/                           # Database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Data model (7 models)
│   │   │   ├── migrations/          # Migration history
│   │   │   └── seed.ts              # Data seeding
│   │   ├── src/
│   │   │   └── index.ts             # Export Prisma client
│   │   └── package.json
│   │
│   └── shared/                       # Shared types & constants
│       ├── src/
│       │   ├── types.ts             # TypeScript types
│       │   ├── constants.ts         # App constants
│       │   └── index.ts             # Exports
│       └── package.json
│
├── scripts/                          # Automation scripts
│   ├── quick-setup.sh               # One-time setup
│   └── deploy-migrate.sh            # Production migrations
│
├── docs/
│   └── DEPLOYMENT.md                # Deployment guide
│
├── docker-compose.yml               # Local dev environment
├── pnpm-workspace.yaml              # Monorepo workspace config
├── turbo.json                       # Build pipeline config
├── package.json                     # Root scripts
├── vercel.json                      # Frontend deployment
├── railway.json                     # Backend deployment
├── .env.example                     # Environment template
├── README.md                        # Getting started guide
└── AGENTS.md                        # Development conventions
```

---

## 4. ARCHITECTURE OVERVIEW

### Architecture Pattern

**Clean Architecture** with separation of concerns:

- **Presentation Layer:** Next.js frontend
- **Application Layer:** NestJS controllers & services
- **Domain Layer:** Prisma models & business logic
- **Infrastructure Layer:** Database, storage, notifications

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT DEVICES                        │
│                    (Browser, Mobile Web)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│                    (Port 3000, Vercel)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App Router Pages (SSR/SSG)                            │ │
│  │  - Public: Landing, Art Forms, Artists, Login, Book   │ │
│  │  - Client Dashboard: Bookings, Favorites              │ │
│  │  - Artist Dashboard: Profile, Availability, Media     │ │
│  │  - Admin Dashboard: Approvals, Moderation             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Auth Context (JWT in localStorage)                   │ │
│  │  API Client Library (services/web/src/lib/api.ts)     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/REST API
┌──────────────────────────▼──────────────────────────────────┐
│                   NESTJS BACKEND API                         │
│                   (Port 4000, Railway)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Controllers (REST Endpoints with /api prefix)         │ │
│  │  - AuthController: OTP, JWT                            │ │
│  │  - ArtistsController: Profile CRUD                     │ │
│  │  - BookingsController: Request, Accept, Decline       │ │
│  │  - AvailabilityController: Calendar management        │ │
│  │  - MediaController: Upload, Delete                    │ │
│  │  - ReviewsController: Create, List                    │ │
│  │  - AdminController: Approvals, Stats                  │ │
│  │  - AdminModerationController: Flag, Remove            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services (Business Logic)                             │ │
│  │  - AuthService: OTP store, JWT signing                │ │
│  │  - BookingsService: Status transitions                │ │
│  │  - NotificationsService: WhatsApp/Email               │ │
│  │  - UploadService: R2 presigned URLs                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Guards & Middleware                                   │ │
│  │  - JwtAuthGuard: Token validation                     │ │
│  │  - RolesGuard: Role-based access control              │ │
│  │  - ValidationPipe: DTO validation (global)            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬───────────────┐
        │                  │                  │               │
┌───────▼───────┐  ┌───────▼──────┐  ┌───────▼──────┐  ┌────▼────┐
│  PostgreSQL   │  │ Cloudflare R2│  │   WhatsApp   │  │  SMTP   │
│  (Database)   │  │  (Storage)   │  │  Cloud API   │  │  Email  │
│   Port 5432   │  │              │  │              │  │         │
└───────────────┘  └──────────────┘  └──────────────┘  └─────────┘
```

### Request Flow

#### 1. Public Artist Discovery

```
User → Landing Page → Browse Art Forms → View Artist Profile → Contact Details
```

#### 2. Client Booking Flow

```
Client → Login (OTP) → Browse Artists → Create Booking Request
  → Artist receives notification (WhatsApp/Email)
  → Artist accepts/declines
  → Client receives status update
  → Event completion
  → Client leaves review
```

#### 3. Artist Onboarding Flow

```
Artist → Login (OTP, select ARTIST role) → Create Profile
  → Upload media (photos via R2, video links)
  → Admin reviews profile
  → Admin approves → Profile goes live
  → Manage availability calendar
  → Accept/decline booking requests
```

#### 4. Admin Moderation Flow

```
Admin → Admin Login → View pending artist approvals → Approve/Reject
  → Monitor flagged content → Remove inappropriate media/reviews
  → Manage art form catalog → View platform statistics
```

### Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                         DATA FLOW                             │
└──────────────────────────────────────────────────────────────┘

1. AUTHENTICATION FLOW
   User Input (Phone)
     → AuthController.sendOtp()
     → AuthService (generates 6-digit OTP, stores in Map with 5-min expiry)
     → [Dev: logs OTP to console]

   User Input (Phone + OTP + Role)
     → AuthController.verifyOtp()
     → AuthService (validates OTP, creates/finds user, issues JWT)
     → Returns: { token, user }
     → Frontend stores token in localStorage
     → All subsequent requests include Authorization: Bearer <token>

2. BOOKING FLOW
   Client creates booking
     → BookingsController.create()
     → BookingsService.create() (checks availability)
     → Prisma creates Booking (status: REQUESTED)
     → NotificationsService.notifyArtistNewBooking()
     → WhatsApp/Email sent to artist

   Artist accepts booking
     → BookingsController.accept()
     → BookingsService.accept()
     → Prisma updates Booking (status: ACCEPTED)
     → AvailabilityService.setBlocked() (blocks date)
     → NotificationsService.notifyClientBookingStatus()
     → WhatsApp/Email sent to client

3. MEDIA UPLOAD FLOW
   Artist requests upload URL
     → MediaController.getUploadUrl()
     → UploadService.getUploadUrl()
     → Generates S3 presigned URL (5-min expiry)
     → Returns: { uploadUrl, publicUrl, key }

   Frontend uploads directly to R2
     → PUT request to uploadUrl
     → File stored in R2 bucket

   Artist saves media record
     → MediaController.addMedia()
     → Prisma creates Media record with publicUrl
     → Media appears in artist portfolio

4. REVIEW FLOW
   Client completes booking
     → Booking status: COMPLETED
     → Client submits review
     → ReviewsController.create()
     → Prisma creates Review (linked to Booking)
     → Review appears on artist profile
     → Average rating calculated on-the-fly
```

---

## 5. DATABASE OVERVIEW

### Database Schema (Prisma)

**Provider:** PostgreSQL
**Location:** `packages/db/prisma/schema.prisma`

#### Entity-Relationship Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│    User     │1       1│  ArtistProfile   │1       *│   Booking    │
│─────────────│─────────│──────────────────│─────────│──────────────│
│ id          │         │ id               │         │ id           │
│ phone       │         │ userId           │         │ clientId     │
│ name        │         │ groupName        │         │ artistProfi..│
│ role        │         │ basePrice        │         │ eventDate    │
│ email       │         │ basedIn          │         │ status       │
│ city        │         │ isApproved       │         │ eventType    │
│ createdAt   │         │ isActive         │         └──────┬───────┘
└─────────────┘         │ kycStatus        │                │
                        │ createdAt        │                │1
                        └─────┬────────────┘                │
                              │                             │
                        ┌─────┴────────┬─────────┬────────┬┘
                        │1             │1        │1       │
                        │*             │*        │*       │
                  ┌─────▼──────┐  ┌───▼──┐  ┌──▼───┐  ┌▼──────┐
                  │   Media    │  │Avail.│  │Review│  │Booking│
                  │────────────│  │──────│  │──────│  │       │
                  │ id         │  │id    │  │id    │  └───────┘
                  │ artistProf.│  │artis.│  │artis.│
                  │ type       │  │date  │  │booki.│
                  │ url        │  │isBlo.│  │client│
                  │ sortOrder  │  └──────┘  │rating│
                  │ isFlagged  │            │commen│
                  │ removedAt  │            │remove│
                  └────────────┘            └──────┘

┌──────────────────┐     ┌─────────────────┐     ┌──────────────┐
│    ArtForm       │*   *│ ArtistArtForm   │*   1│ ArtistProfile│
│──────────────────│─────│─────────────────│─────│──────────────│
│ id               │     │ id              │     │ (see above)  │
│ name             │     │ artistProfileId │     └──────────────┘
│ slug             │     │ artFormId       │
│ description      │     │ createdAt       │
│ region           │     └─────────────────┘
│ category         │
│ createdAt        │
└──────────────────┘
```

#### Core Models

**1. User** (Authentication & base entity)

```typescript
{
  id: string (cuid)
  phone: string (unique, indexed)
  name: string
  email?: string
  city?: string
  role: UserRole (CLIENT | ARTIST | ADMIN)
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    artistProfile?: ArtistProfile (1:1)
    clientBookings: Booking[] (1:*)
    reviews: Review[] (1:*)
}
```

**2. ArtistProfile** (Artist marketplace profile)

```typescript
{
  id: string (cuid)
  userId: string (unique)
  groupName: string
  basePrice: number
  priceUnit: string (default: "per event")
  basedIn: string
  description?: string
  groupSize?: number
  serviceAreas: string[] (default: [])
  languages: string[] (default: [])
  experience?: number
  kycStatus: KycStatus (NOT_SUBMITTED | PENDING | VERIFIED | REJECTED)
  isApproved: boolean (default: false)
  isActive: boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    user: User (1:1)
    artForms: ArtistArtForm[] (many-to-many)
    media: Media[] (1:*)
    availability: Availability[] (1:*)
    bookings: Booking[] (1:*)
    reviews: Review[] (1:*)
}
```

**3. ArtForm** (Catalog of 9 Indian folk arts)

```typescript
{
  id: string (cuid)
  name: string (unique)
  slug: string (unique, indexed)
  description?: string
  region?: string
  category?: string
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    artists: ArtistArtForm[] (many-to-many)
}
```

**4. Booking** (Client booking requests)

```typescript
{
  id: string (cuid)
  clientId: string
  artistProfileId: string
  eventDate: DateTime
  eventTime: string
  eventType: string
  eventLocation: string
  venueAddress?: string
  duration?: number
  message?: string
  status: BookingStatus (REQUESTED | ACCEPTED | DECLINED | COMPLETED | CANCELLED)
  completedAt?: DateTime
  cancelledAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    client: User (many:1)
    artistProfile: ArtistProfile (many:1)
    review?: Review (1:1)
}
```

**5. Review** (Client reviews of artists)

```typescript
{
  id: string (cuid)
  bookingId: string (unique)
  clientId: string
  artistProfileId: string
  rating: number (1-5)
  comment?: string
  isFlagged: boolean (default: false)
  flagReason?: string
  removedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    booking: Booking (1:1)
    client: User (many:1)
    artistProfile: ArtistProfile (many:1)
}
```

**6. Media** (Artist portfolio)

```typescript
{
  id: string (cuid)
  artistProfileId: string
  type: MediaType (PHOTO | VIDEO_LINK)
  url: string
  caption?: string
  sortOrder: number (default: 0)
  isFlagged: boolean (default: false)
  flagReason?: string
  removedAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime

  Relations:
    artistProfile: ArtistProfile (many:1)
}
```

**7. Availability** (Artist calendar blocking)

```typescript
{
  id: string (cuid)
  artistProfileId: string
  date: DateTime
  isBlocked: boolean (default: true)
  createdAt: DateTime
  updatedAt: DateTime

  Unique: (artistProfileId, date)

  Relations:
    artistProfile: ArtistProfile (many:1)
}
```

#### Enums

- **UserRole:** CLIENT, ARTIST, ADMIN
- **BookingStatus:** REQUESTED, ACCEPTED, DECLINED, COMPLETED, CANCELLED
- **KycStatus:** NOT_SUBMITTED, PENDING, VERIFIED, REJECTED
- **MediaType:** PHOTO, VIDEO_LINK

#### Seeded Data

- **9 Art Forms:** Dollu Kunitha, Yakshagana, Huli Vesha, Pata Kunitha, Veeragase, Kamsale, Kolata, Theyyam, Ghoomar
- **1 Admin User** (phone varies by setup)

---

## 6. API DOCUMENTATION

**Base URL:** `http://localhost:4000/api` (development)
**Authentication:** JWT Bearer token in `Authorization` header
**Global Validation:** All DTOs validated with `class-validator`

### Authentication Endpoints

| Method | Endpoint           | Auth | Description                  |
| ------ | ------------------ | ---- | ---------------------------- |
| POST   | `/auth/send-otp`   | None | Send OTP to phone number     |
| POST   | `/auth/verify-otp` | None | Verify OTP and get JWT token |
| GET    | `/auth/me`         | JWT  | Get current user profile     |

#### `/auth/send-otp`

```typescript
Request: { phone: string }
Response: { success: boolean, message: string }
```

#### `/auth/verify-otp`

```typescript
Request: {
  phone: string,
  otp: string,
  role?: "CLIENT" | "ARTIST" | "ADMIN"
}
Response: {
  token: string,
  user: { id, phone, name, role, email, city, artistProfile? }
}
Notes:
- ADMIN role cannot be self-assigned (throws UnauthorizedException)
- Creates new user if not exists (CLIENT/ARTIST only)
```

### Artist Endpoints

| Method | Endpoint                  | Auth         | Description                              |
| ------ | ------------------------- | ------------ | ---------------------------------------- |
| GET    | `/artists`                | None         | List all approved artists (with filters) |
| GET    | `/artists/:id`            | None         | Get single artist profile                |
| GET    | `/artists/art-form/:slug` | None         | Get artists by art form slug             |
| POST   | `/artists`                | JWT (ARTIST) | Create artist profile                    |
| PATCH  | `/artists/:id`            | JWT (ARTIST) | Update artist profile                    |

### Booking Endpoints

| Method | Endpoint                 | Auth                      | Description            |
| ------ | ------------------------ | ------------------------- | ---------------------- |
| POST   | `/bookings`              | JWT (CLIENT)              | Create booking request |
| GET    | `/bookings/:id`          | JWT                       | Get booking details    |
| GET    | `/bookings/my`           | JWT (CLIENT)              | Get client's bookings  |
| GET    | `/bookings/artist`       | JWT (ARTIST)              | Get artist's bookings  |
| PATCH  | `/bookings/:id/accept`   | JWT (ARTIST)              | Accept booking         |
| PATCH  | `/bookings/:id/decline`  | JWT (ARTIST)              | Decline booking        |
| PATCH  | `/bookings/:id/complete` | JWT (ARTIST/ADMIN)        | Mark as completed      |
| PATCH  | `/bookings/:id/cancel`   | JWT (CLIENT/ARTIST/ADMIN) | Cancel booking         |

### Availability Endpoints

| Method | Endpoint                                            | Auth         | Description      |
| ------ | --------------------------------------------------- | ------------ | ---------------- |
| POST   | `/availability`                                     | JWT (ARTIST) | Block dates      |
| DELETE | `/availability`                                     | JWT (ARTIST) | Unblock dates    |
| GET    | `/availability/:artistProfileId?year=YYYY&month=MM` | None         | Get availability |

### Review Endpoints

| Method | Endpoint                           | Auth         | Description        |
| ------ | ---------------------------------- | ------------ | ------------------ |
| POST   | `/reviews`                         | JWT (CLIENT) | Create review      |
| GET    | `/reviews/artist/:artistProfileId` | None         | Get artist reviews |

### Media Endpoints

| Method | Endpoint                         | Auth         | Description                 |
| ------ | -------------------------------- | ------------ | --------------------------- |
| POST   | `/media`                         | JWT (ARTIST) | Add media record            |
| POST   | `/media/upload-url`              | JWT (ARTIST) | Get R2 presigned upload URL |
| DELETE | `/media/:id`                     | JWT (ARTIST) | Delete media                |
| GET    | `/media/artist/:artistProfileId` | None         | Get artist media            |
| PATCH  | `/media/reorder`                 | JWT (ARTIST) | Reorder media               |

### Admin Endpoints

| Method | Endpoint                     | Auth        | Description                  |
| ------ | ---------------------------- | ----------- | ---------------------------- |
| GET    | `/admin/stats`               | JWT (ADMIN) | Get platform statistics      |
| GET    | `/admin/artists/pending`     | JWT (ADMIN) | Get pending artist approvals |
| PATCH  | `/admin/artists/:id/approve` | JWT (ADMIN) | Approve artist profile       |
| PATCH  | `/admin/artists/:id/reject`  | JWT (ADMIN) | Reject artist profile        |
| GET    | `/admin/bookings?status=...` | JWT (ADMIN) | Get all bookings (filtered)  |
| GET    | `/admin/art-forms`           | JWT (ADMIN) | Get all art forms            |
| POST   | `/admin/art-forms`           | JWT (ADMIN) | Create art form              |
| PATCH  | `/admin/art-forms/:id`       | JWT (ADMIN) | Update art form              |
| DELETE | `/admin/art-forms/:id`       | JWT (ADMIN) | Delete art form              |

### Moderation Endpoints

| Method | Endpoint                               | Auth        | Description         |
| ------ | -------------------------------------- | ----------- | ------------------- |
| GET    | `/admin/moderation`                    | JWT (ADMIN) | Get flagged content |
| PATCH  | `/admin/moderation/media/:id/flag`     | JWT (ADMIN) | Flag media          |
| PATCH  | `/admin/moderation/media/:id/unflag`   | JWT (ADMIN) | Unflag media        |
| PATCH  | `/admin/moderation/media/:id/remove`   | JWT (ADMIN) | Soft delete media   |
| PATCH  | `/admin/moderation/reviews/:id/flag`   | JWT (ADMIN) | Flag review         |
| PATCH  | `/admin/moderation/reviews/:id/unflag` | JWT (ADMIN) | Unflag review       |
| PATCH  | `/admin/moderation/reviews/:id/remove` | JWT (ADMIN) | Soft delete review  |

### Error Responses

All endpoints return standardized error responses:

```typescript
{
  statusCode: number,
  message: string | string[],
  error: string
}
```

Common status codes:

- **400** Bad Request (validation errors)
- **401** Unauthorized (missing/invalid JWT)
- **403** Forbidden (insufficient permissions)
- **404** Not Found
- **500** Internal Server Error

---

## 7. UNFINISHED WORK / INCOMPLETE FEATURES

### ✅ Good News: No Critical TODOs Found

After scanning the entire codebase for `TODO`, `FIXME`, `HACK`, `TEMP`, `NOT IMPLEMENTED`, and similar markers, **zero unfinished work indicators** were found in the source code.

### External Configuration Required (Code Complete)

The following features are **fully implemented** but require external service configuration:

1. **Cloudflare R2 Storage** (`services/api/src/media/upload.service.ts:40`)
   - Status: Code ready, needs R2 account setup
   - Environment variables needed:
     - `R2_ACCOUNT_ID`
     - `R2_ACCESS_KEY`
     - `R2_SECRET_KEY`
     - `R2_BUCKET`
     - `R2_PUBLIC_URL`
   - Impact: Photo uploads will throw "File upload is not configured" error until configured

2. **WhatsApp Cloud API** (`services/api/src/notifications/notifications.service.ts:138`)
   - Status: Code ready, needs Meta Business account
   - Environment variables needed:
     - `WHATSAPP_ENABLED=true`
     - `WHATSAPP_PHONE_NUMBER_ID`
     - `WHATSAPP_ACCESS_TOKEN`
     - `WHATSAPP_API_VERSION` (optional, defaults to v20.0)
   - Impact: Notifications fall back to email if not configured

3. **SMTP Email Service** (`services/api/src/notifications/notifications.service.ts:142`)
   - Status: Code ready, needs SMTP credentials
   - Environment variables needed:
     - `EMAIL_ENABLED=true`
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASS`
     - `EMAIL_FROM`
   - Impact: Notifications silently fail if neither WhatsApp nor Email is configured

### Implementation Status (historical)

**Frontend:** 27/27 pages ✅ COMPLETE
**Backend:** 10/10 modules ✅ COMPLETE
**Infrastructure:** 9/9 items ✅ COMPLETE

All tracked tasks were marked as "Done" in the historical `TODO.md` tracker (since removed).

---

## 8. POTENTIAL BUGS / CODE SMELLS

### 🔴 HIGH PRIORITY

#### 1. OTP Storage in Memory (Production Risk)

**Location:** `services/api/src/auth/auth.service.ts:14`

```typescript
private readonly otpStore = new Map<string, OtpEntry>();
```

**Issue:** OTPs stored in application memory will be lost on server restart or in multi-instance deployments.

**Impact:**

- Users cannot complete OTP verification if server restarts between send and verify
- Horizontal scaling not possible (each instance has separate Map)

**Suggested Fix:**

```typescript
// Use Redis for distributed OTP storage
private async storeOtp(phone: string, otp: string) {
  await this.redis.setex(`otp:${phone}`, 300, otp); // 5 min TTL
}
```

#### 2. Missing Rate Limiting on OTP Endpoint

**Location:** `services/api/src/auth/auth.controller.ts`

**Issue:** No rate limiting on `/auth/send-otp` allows:

- OTP bombing attacks
- SMS cost abuse
- DoS via OTP generation

**Suggested Fix:**

```typescript
// Add @ThrottlerGuard() decorator
@UseGuards(ThrottlerGuard)
@Throttle(3, 60) // 3 requests per minute per IP
@Post("send-otp")
```

#### 3. Unhandled Promise Rejections in Notifications

**Location:** `services/api/src/bookings/bookings.service.ts:61-69`

```typescript
this.notificationsService.notifyArtistNewBooking({...}); // Fire and forget
```

**Issue:** Notification failures are silent (no await/catch). Critical booking confirmations may fail without alerting developers.

**Suggested Fix:**

```typescript
try {
  await this.notificationsService.notifyArtistNewBooking({...});
} catch (error) {
  this.logger.error(`Failed to notify artist: ${error.message}`);
  // Consider: Store notification failure in DB for retry
}
```

#### 4. SQL Injection Risk in Prisma Filters

**Location:** `services/api/src/artists/artists.service.ts:102,106`

```typescript
where.basedIn = { contains: filters.city, mode: "insensitive" };
where.groupName = { contains: filters.search, mode: "insensitive" };
```

**Issue:** While Prisma parameterizes queries, unvalidated user input in `contains` can cause performance issues with malicious patterns (e.g., `%%%%`).

**Suggested Fix:**

```typescript
// Add DTO validation
@IsString()
@MinLength(2)
@MaxLength(50)
@Matches(/^[a-zA-Z0-9\s]+$/, { message: 'Invalid search pattern' })
search?: string;
```

### 🟡 MEDIUM PRIORITY

#### 5. Weak OTP Generation (Predictability Risk)

**Location:** `services/api/src/auth/auth.service.ts:22`

```typescript
const otp = Math.floor(100000 + Math.random() * 900000).toString();
```

**Issue:** `Math.random()` is not cryptographically secure. OTPs may be predictable with sufficient sampling.

**Suggested Fix:**

```typescript
import { randomInt } from "crypto";
const otp = randomInt(100000, 999999).toString();
```

#### 6. No Pagination on Artist/Booking Lists

**Locations:**

- `services/api/src/artists/artists.service.ts:109` (findMany without limit)
- `services/api/src/bookings/bookings.service.ts:107` (findMany without limit)

**Issue:** Returning all records can cause:

- Memory exhaustion with large datasets
- Slow API responses
- Poor user experience

**Suggested Fix:**

```typescript
async findAll(filters: { page?: number; limit?: number; ... }) {
  const page = filters.page ?? 1;
  const limit = Math.min(filters.limit ?? 20, 100);
  const skip = (page - 1) * limit;

  const [artists, total] = await Promise.all([
    this.prisma.artistProfile.findMany({ where, skip, take: limit }),
    this.prisma.artistProfile.count({ where })
  ]);

  return { artists, total, page, pageCount: Math.ceil(total / limit) };
}
```

#### 7. Missing Input Sanitization for User-Generated Content

**Location:** Review comments, artist descriptions (no HTML sanitization)

**Issue:** XSS attacks possible if content rendered as HTML on frontend.

**Suggested Fix:**

```typescript
import DOMPurify from "isomorphic-dompurify";

comment = DOMPurify.sanitize(comment, { ALLOWED_TAGS: [] }); // Strip all HTML
```

#### 8. JWT Secret Validation Only in Production

**Location:** `services/api/src/auth/auth.module.ts:17`

```typescript
if (process.env.NODE_ENV === "production" && !jwtSecret) {
  throw new Error("JWT_SECRET must be set in production");
}
```

**Issue:** Missing JWT_SECRET in development allows insecure defaults.

**Suggested Fix:**

```typescript
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required in all environments");
}
```

#### 9. No Transaction Rollback on Notification Failure

**Location:** `services/api/src/artists/artists.service.ts:48-51`

**Issue:** If user role update succeeds but transaction fails, user has wrong role.

**Current:**

```typescript
await tx.user.update({ where: { id: userId }, data: { role: "ARTIST" } });
```

**Better:**

```typescript
// Move user update inside same transaction
return tx.artistProfile.create({
  data: {
    ...profileData,
    user: { update: { role: "ARTIST" } },
  },
});
```

### 🟢 LOW PRIORITY (Code Smells)

#### 10. TypeScript `any` Types in Frontend API Client

**Location:** `services/web/src/lib/api.ts`

```typescript
verifyOtp: (phone: string, otp: string, role?: string) =>
  fetchAPI<{ token: string; user: any }>("/auth/verify-otp", { ... }),
```

**Issue:** Loses type safety. Found 15 instances of `any[]` or `any` in API responses.

**Suggested Fix:**

```typescript
// Define interfaces in @tomoola/shared
interface User { id: string; phone: string; name: string; role: UserRole; }
interface Artist { id: string; groupName: string; basePrice: number; }

fetchAPI<{ token: string; user: User }>("/auth/verify-otp", { ... })
```

#### 11. Duplicate Average Rating Calculation

**Location:** `services/api/src/artists/artists.service.ts:120-126`

**Issue:** Average rating calculated in application code for each artist. Should be a database aggregate or computed field.

**Suggested Fix:**

```typescript
// Use Prisma aggregation
const artists = await this.prisma.artistProfile.findMany({
  where,
  include: {
    _count: { select: { reviews: true } },
    reviews: { select: { rating: true }, where: { removedAt: null } },
  },
});
// Or add virtual field to Prisma schema (Prisma 5.x+)
```

#### 12. Missing API Response Caching

**Issue:** Public endpoints (art forms, artist lists) have no HTTP caching headers.

**Suggested Fix:**

```typescript
// In NestJS controller
@CacheInterceptor()
@CacheTTL(300) // 5 minutes
@Get('/artists')
```

#### 13. Hardcoded Placeholder Data in Frontend

**Location:** `services/web/src/app/folk-dances/[slug]/page.tsx:74`

```typescript
const PLACEHOLDER_ARTISTS = [...];
const displayArtists = artists.length > 0 ? artists : PLACEHOLDER_ARTISTS;
```

**Issue:** Placeholder data shown when no artists exist for an art form. Should show "No artists found" message instead.

#### 14. No Logging for Critical Operations

**Issue:** Artist approvals, booking status changes, content moderation lack audit logging.

**Suggested Fix:**

```typescript
this.logger.log(`Artist ${artistProfileId} approved by admin ${adminId}`);
// Or implement AuditLog model in database
```

---

## 9. CODE QUALITY REVIEW

### **Code Quality Score: 7.5/10**

### ✅ STRENGTHS

#### 1. **Type Safety** (9/10)

- Strict TypeScript configuration across monorepo
- Comprehensive DTO validation with `class-validator`
- Prisma provides end-to-end type safety from DB to API
- **Minor deduction:** Frontend uses `any` types in API client (15 instances)

#### 2. **Code Organization** (8/10)

- Clean monorepo structure with clear separation of concerns
- NestJS modules well-organized by domain
- Next.js App Router structure follows conventions
- **Minor deduction:** Some large page components could be broken into smaller components

#### 3. **Separation of Concerns** (8.5/10)

- Business logic isolated in service layer
- Controllers handle only HTTP concerns
- Database access abstracted through Prisma
- Shared types/constants in dedicated package

#### 4. **Error Handling** (7/10)

- NestJS exception filters provide standardized error responses
- HTTP status codes used appropriately
- **Major gap:** Notification failures silently ignored (fire-and-forget)
- **Gap:** No global error boundary in frontend

#### 5. **Security** (6.5/10)

- JWT authentication implemented correctly
- Role-based access control via guards
- Global ValidationPipe prevents injection attacks
- **Major gap:** No rate limiting
- **Gap:** OTP storage in memory (not production-ready)
- **Gap:** Weak OTP generation with `Math.random()`
- **Gap:** No CSRF protection

#### 6. **Naming Consistency** (9/10)

- Clear, descriptive variable/function names
- Consistent naming conventions (camelCase, PascalCase)
- Database models use meaningful names

#### 7. **Modularity** (8/10)

- Backend modules are cohesive and loosely coupled
- Shared packages enable code reuse
- **Minor gap:** Some frontend pages exceed 400 lines

#### 8. **Configuration Management** (8/10)

- Environment variables well-documented in `.env.example`
- ConfigService used throughout NestJS
- **Minor gap:** No runtime config validation (e.g., using `@nestjs/config` with Joi schema)

### ❌ WEAKNESSES

#### 1. **Test Coverage** (0/10)

- **CRITICAL:** Zero test files found in codebase
  - No `*.test.ts`, `*.spec.ts`, or `*.test.tsx` files
  - No unit tests, integration tests, or E2E tests
  - No test configuration (Jest, Vitest)

#### 2. **Logging** (5/10)

- Basic NestJS Logger used inconsistently
- No structured logging (JSON format)
- **One `console.log` found:** `services/api/src/main.ts:25`
- No log levels configured (DEBUG, INFO, WARN, ERROR)
- No request/response logging middleware

#### 3. **Performance** (6/10)

- No pagination on list endpoints (memory risk)
- Average rating calculated in application code (N+1 query risk)
- No database indexes beyond Prisma defaults
- No API response caching

#### 4. **Documentation** (7/10)

- Good README and deployment guide
- **Missing:** API documentation (no Swagger/OpenAPI spec)
- **Missing:** Inline JSDoc comments on complex functions
- **Positive:** AGENTS.md provides development conventions

#### 5. **Observability** (3/10)

- No APM integration (DataDog, New Relic, etc.)
- No health check dashboard
- No metrics endpoint (Prometheus format)
- Basic `/api/health` endpoint exists but provides no details

### BREAKDOWN BY CATEGORY

| Category              | Score  | Notes                                                                  |
| --------------------- | ------ | ---------------------------------------------------------------------- |
| **Type Safety**       | 9/10   | Excellent TypeScript usage                                             |
| **Architecture**      | 8/10   | Clean, scalable structure                                              |
| **Security**          | 6.5/10 | Authentication solid, but missing rate limiting & production-ready OTP |
| **Error Handling**    | 7/10   | Standardized but incomplete                                            |
| **Testing**           | 0/10   | ❌ **Critical gap**                                                    |
| **Logging**           | 5/10   | Basic implementation                                                   |
| **Performance**       | 6/10   | Needs pagination & caching                                             |
| **Documentation**     | 7/10   | Good README, missing API docs                                          |
| **Code Organization** | 8.5/10 | Well-structured monorepo                                               |
| **Observability**     | 3/10   | Minimal monitoring                                                     |

---

## 10. MISSING BEST PRACTICES

### 1. **Testing Infrastructure**

**Missing:**

- Unit tests for services (Jest)
- Integration tests for API endpoints (Supertest)
- E2E tests for frontend (Playwright/Cypress)
- Test coverage reports
- CI/CD test automation

**Impact:** HIGH
**Recommended Action:**

```bash
# Backend
pnpm --filter @tomoola/api add -D jest @nestjs/testing supertest
# Frontend
pnpm --filter @tomoola/web add -D vitest @testing-library/react
```

### 2. **API Documentation**

**Missing:**

- OpenAPI/Swagger specification
- Interactive API explorer
- Request/response examples

**Impact:** MEDIUM
**Recommended Action:**

```typescript
// Install @nestjs/swagger
@ApiTags('artists')
@ApiOperation({ summary: 'Get all artists' })
@ApiResponse({ status: 200, type: [ArtistDto] })
```

### 3. **Rate Limiting**

**Missing:**

- Throttling on auth endpoints
- IP-based rate limits
- DDoS protection

**Impact:** HIGH
**Recommended Action:**

```typescript
// Install @nestjs/throttler
@Module({
  imports: [ThrottlerModule.forRoot({ ttl: 60, limit: 10 })],
})
```

### 4. **Input Validation Depth**

**Gaps:**

- No phone number format validation
- No email format validation
- No price range validation
- No date range validation

**Impact:** MEDIUM
**Recommended Action:**

```typescript
@IsPhoneNumber('IN') // class-validator
phone: string;

@Min(500)
@Max(1000000)
basePrice: number;
```

### 5. **Database Optimization**

**Missing:**

- Custom indexes (only Prisma defaults)
- Query performance monitoring
- Connection pooling configuration

**Impact:** MEDIUM
**Recommended Action:**

```prisma
@@index([isApproved, isActive]) // Composite index for filters
@@index([slug]) // Already exists, but verify usage
```

### 6. **Security Headers**

**Missing:**

- Helmet.js middleware
- CORS configured but could be more restrictive
- No CSRF protection

**Impact:** MEDIUM
**Recommended Action:**

```typescript
app.use(helmet()); // Add to main.ts
```

### 7. **Monitoring & Alerts**

**Missing:**

- Application Performance Monitoring (APM)
- Error tracking (Sentry, Rollbar)
- Uptime monitoring
- Log aggregation (ELK, DataDog)

**Impact:** HIGH
**Recommended Action:**

```typescript
// Install @sentry/nestjs
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### 8. **Caching Layer**

**Missing:**

- Redis cache for public data (art forms, artist lists)
- HTTP cache headers
- CDN integration for static assets

**Impact:** MEDIUM
**Recommended Action:**

```typescript
@CacheInterceptor()
@CacheTTL(300)
@Get('/art-forms')
```

### 9. **Backup & Recovery**

**Missing:**

- Database backup strategy
- Disaster recovery plan
- Data retention policy

**Impact:** HIGH (for production)
**Recommended Action:**

- Enable automated daily backups on Railway/Render
- Document restore procedures

### 10. **CI/CD Pipeline**

**Missing:**

- GitHub Actions workflows
- Automated testing
- Lint checks on PR
- Automated deployments

**Impact:** MEDIUM
**Recommended Action:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
```

---

## 11. ARCHITECTURE IMPROVEMENTS

### 🎯 SHORT-TERM (0-3 months)

#### 1. **Implement Comprehensive Testing Strategy**

**Priority:** CRITICAL

```
Phase 1: Backend Unit Tests (Week 1-2)
- AuthService: OTP generation, JWT signing
- BookingsService: Status transitions
- ArtistsService: CRUD operations
- Target: 70% coverage

Phase 2: API Integration Tests (Week 3-4)
- Authentication flow (send OTP → verify → access protected route)
- Booking lifecycle (create → accept → complete)
- Admin operations (approve artist → verify public listing)
- Target: All critical paths covered

Phase 3: Frontend Component Tests (Week 5-6)
- Auth context
- Booking form validation
- Artist profile display
- Target: 60% coverage

Phase 4: E2E Tests (Week 7-8)
- User registration and login
- Complete booking flow
- Artist profile creation and approval
- Target: 10 critical user journeys
```

#### 2. **Enhance Security**

**Priority:** CRITICAL

```typescript
// Implement rate limiting
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requests per minute
      ignoreUserAgents: [/bot/i] // Ignore bots for rate limiting
    })
  ]
})

// Add helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// Move OTP storage to Redis
private async storeOtp(phone: string, otp: string) {
  await this.redis.setex(`otp:${phone}`, 300, otp);
}

// Use cryptographically secure random
import { randomInt } from 'crypto';
const otp = randomInt(100000, 999999).toString();
```

#### 3. **Add Pagination & Performance Optimization**

**Priority:** HIGH

```typescript
// Standard pagination DTO
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

// Apply to all list endpoints
async findAll(filters: FilterDto & PaginationDto) {
  const skip = (filters.page - 1) * filters.limit;
  const [data, total] = await Promise.all([
    this.prisma.model.findMany({ skip, take: filters.limit }),
    this.prisma.model.count()
  ]);
  return { data, meta: { total, page: filters.page, pageCount: Math.ceil(total / filters.limit) }};
}
```

#### 4. **Implement OpenAPI Documentation**

**Priority:** MEDIUM

```typescript
// Install @nestjs/swagger
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle("ToMoola API")
  .setDescription(
    "Marketplace connecting Indian folk artists with event organizers",
  )
  .setVersion("1.0")
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("api/docs", app, document);
```

#### 5. **Add Monitoring & Error Tracking**

**Priority:** HIGH

```typescript
// Integrate Sentry for error tracking
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Add health check endpoint with details
@Get('health')
async healthCheck() {
  const dbHealth = await this.prisma.$queryRaw`SELECT 1`;
  const redisHealth = await this.redis.ping();
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealth ? 'connected' : 'disconnected',
    redis: redisHealth === 'PONG' ? 'connected' : 'disconnected',
  };
}
```

### 🚀 MEDIUM-TERM (3-6 months)

#### 6. **Implement Event-Driven Architecture**

**Benefits:** Decoupling, scalability, audit trail

```typescript
// Use NestJS Event Emitter
@Injectable()
export class BookingsService {
  constructor(private eventEmitter: EventEmitter2) {}

  async accept(bookingId: string) {
    const booking = await this.updateStatus(bookingId, 'ACCEPTED');

    // Emit event instead of direct service call
    this.eventEmitter.emit('booking.accepted', {
      bookingId: booking.id,
      artistId: booking.artistProfileId,
      clientId: booking.clientId,
      eventDate: booking.eventDate,
    });

    return booking;
  }
}

@OnEvent('booking.accepted')
async handleBookingAccepted(payload: BookingAcceptedEvent) {
  await Promise.all([
    this.notificationsService.notifyClient(payload),
    this.availabilityService.blockDate(payload.artistId, payload.eventDate),
    this.analyticsService.trackBookingAccepted(payload),
  ]);
}
```

#### 7. **Add Caching Layer with Redis**

**Benefits:** Reduced database load, faster response times

```typescript
// Cache public data
@Injectable()
export class ArtFormsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cached = await this.cacheManager.get<ArtForm[]>("art-forms:all");
    if (cached) return cached;

    const artForms = await this.prisma.artForm.findMany();
    await this.cacheManager.set("art-forms:all", artForms, 3600); // 1 hour
    return artForms;
  }

  async create(data: CreateArtFormDto) {
    const artForm = await this.prisma.artForm.create({ data });
    await this.cacheManager.del("art-forms:all"); // Invalidate cache
    return artForm;
  }
}
```

#### 8. **Implement Advanced Search with Elasticsearch**

**Benefits:** Fast full-text search, faceted filtering

```typescript
// Index artists in Elasticsearch
@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexArtist(artist: ArtistProfile) {
    await this.elasticsearchService.index({
      index: "artists",
      id: artist.id,
      body: {
        groupName: artist.groupName,
        description: artist.description,
        artForms: artist.artForms.map((af) => af.artForm.name),
        basedIn: artist.basedIn,
        serviceAreas: artist.serviceAreas,
        basePrice: artist.basePrice,
        averageRating: artist.averageRating,
      },
    });
  }

  async searchArtists(query: string, filters: SearchFilters) {
    const { body } = await this.elasticsearchService.search({
      index: "artists",
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ["groupName^2", "description", "artForms"],
                },
              },
            ],
            filter: [
              { term: { "basedIn.keyword": filters.city } },
              { range: { basePrice: { lte: filters.maxPrice } } },
            ],
          },
        },
      },
    });
    return body.hits.hits.map((hit) => hit._source);
  }
}
```

#### 9. **Add Payment Gateway Integration**

**Current:** Offline payments only
**Improvement:** Support online payments with Razorpay/Stripe

```typescript
// Payment intent creation
@Post('bookings/:id/payment-intent')
async createPaymentIntent(@Param('id') bookingId: string) {
  const booking = await this.bookingsService.findById(bookingId);
  const artist = await this.artistsService.findOne(booking.artistProfileId);

  const paymentIntent = await this.razorpay.orders.create({
    amount: artist.basePrice * 100, // Paise
    currency: 'INR',
    receipt: bookingId,
    notes: {
      bookingId,
      artistId: artist.id,
      clientId: booking.clientId,
    }
  });

  return { clientSecret: paymentIntent.id };
}

// Webhook handler
@Post('webhooks/razorpay')
async handleWebhook(@Body() payload: RazorpayWebhook) {
  if (payload.event === 'payment.captured') {
    await this.bookingsService.markPaid(payload.payload.order.receipt);
  }
}
```

#### 10. **Implement Multi-Tenancy for Agency Support**

**Use Case:** Allow agencies to manage multiple artists

```prisma
model Agency {
  id          String          @id @default(cuid())
  name        String
  email       String          @unique
  phone       String          @unique
  artists     ArtistProfile[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

model ArtistProfile {
  // ... existing fields
  agencyId    String?
  agency      Agency?         @relation(fields: [agencyId], references: [id])
}
```

### 📈 LONG-TERM (6-12 months)

#### 11. **Migrate to Microservices Architecture**

**When:** After user base exceeds 10,000 artists

```
Current Monolith → Service-Oriented Architecture

Services:
├── auth-service          # Authentication & authorization
├── artist-service        # Artist profiles & search
├── booking-service       # Booking management
├── notification-service  # WhatsApp/Email/SMS
├── payment-service       # Payment processing
├── media-service         # File uploads & CDN
└── admin-service         # Admin operations

Benefits:
- Independent scaling (scale booking-service during peak booking season)
- Technology diversity (use Python for ML-based artist recommendations)
- Team autonomy (separate teams per service)
- Fault isolation (artist service down doesn't affect bookings)
```

#### 12. **Add Machine Learning Features**

**Use Cases:**

- Personalized artist recommendations based on booking history
- Fraud detection (fake bookings, abusive reviews)
- Price optimization based on demand
- Chatbot for customer support

#### 13. **Mobile App Development**

**Stack:** React Native (code reuse with React web)
**Features:**

- Native push notifications
- Offline booking draft
- Camera integration for portfolio uploads
- Geolocation for nearby artists

#### 14. **Internationalization (i18n)**

**Support multiple languages:**

- Hindi, Kannada, Tamil, Telugu (for artists)
- English, Hindi (for clients)
- Use `next-intl` for Next.js
- Store translations in database (admin-editable)

### 🛠️ REFACTORING OPPORTUNITIES

#### 15. **Extract Shared Frontend Components**

**Current:** Page components exceed 400 lines
**Improvement:** Create reusable component library

```typescript
// Extract booking form to separate component
<BookingForm
  artistId={artistId}
  onSuccess={(booking) => router.push(`/dashboard/bookings/${booking.id}`)}
  onError={(error) => toast.error(error.message)}
/>

// Extract artist card component
<ArtistCard
  artist={artist}
  showBookButton={isLoggedIn && user.role === 'CLIENT'}
/>
```

#### 16. **Implement Repository Pattern for Data Access**

**Benefits:** Testability, abstraction, easier database switching

```typescript
// Abstract data access
@Injectable()
export class ArtistRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<ArtistProfile | null> {
    return this.prisma.artistProfile.findUnique({
      where: { id },
      include: { user: true, artForms: true },
    });
  }

  async findApproved(filters: ArtistFilters): Promise<ArtistProfile[]> {
    return this.prisma.artistProfile.findMany({
      where: { isApproved: true, ...this.buildWhereClause(filters) },
    });
  }

  private buildWhereClause(filters: ArtistFilters) {
    // Complex query building logic
  }
}

// Service uses repository
@Injectable()
export class ArtistsService {
  constructor(private artistRepository: ArtistRepository) {}

  async findOne(id: string) {
    const artist = await this.artistRepository.findById(id);
    if (!artist) throw new NotFoundException();
    return this.enrichWithAverageRating(artist);
  }
}
```

#### 17. **Add Feature Flags**

**Use Case:** Gradual rollout of new features

```typescript
// Use ConfigCat or LaunchDarkly
@Injectable()
export class FeatureFlagService {
  async isEnabled(flag: string, user?: User): Promise<boolean> {
    return this.configCatClient.getValueAsync(flag, false, {
      identifier: user?.id,
    });
  }
}

// In controller
if (await this.featureFlags.isEnabled("online-payments", user)) {
  return this.handleOnlinePayment(booking);
} else {
  return this.handleOfflinePayment(booking);
}
```

---

## 12. SUMMARY & RECOMMENDATIONS

### 🎯 EXECUTIVE SUMMARY

**ToMoola** is a **well-architected, production-ready marketplace platform** connecting Indian folk artists with event organizers. The codebase demonstrates strong software engineering fundamentals with TypeScript strict mode, clean architecture, and comprehensive feature implementation.

**Current State:**

- ✅ 27/27 frontend pages complete
- ✅ 10/10 backend modules complete
- ✅ Full authentication & authorization
- ✅ Booking management with notifications
- ✅ Admin approval & moderation workflows
- ✅ Deployment configurations ready (Vercel + Railway)

**Code Quality:** 7.5/10

### 🚨 CRITICAL ACTIONS REQUIRED BEFORE PRODUCTION

1. **Implement Testing** (Priority: CRITICAL)
   - Zero test coverage is unacceptable for production
   - Start with backend unit tests (AuthService, BookingsService)
   - Add E2E tests for critical user journeys

2. **Enhance Security** (Priority: CRITICAL)
   - Add rate limiting on auth endpoints (prevent OTP spam)
   - Move OTP storage from memory to Redis (production stability)
   - Use cryptographically secure random for OTP generation

3. **Add Monitoring** (Priority: HIGH)
   - Integrate Sentry for error tracking
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Configure log aggregation (Logtail, DataDog)

4. **Implement Pagination** (Priority: HIGH)
   - Add pagination to all list endpoints (prevent memory exhaustion)
   - Default page size: 20, max: 100

5. **Configure External Services** (Priority: MEDIUM)
   - Set up Cloudflare R2 for photo uploads
   - Configure WhatsApp Cloud API or SMTP email

### 📊 TECHNICAL DEBT SCORECARD

| Category          | Status                   | Debt Level      |
| ----------------- | ------------------------ | --------------- |
| Testing           | ❌ None                  | 🔴 **Critical** |
| Security          | ⚠️ Basic auth only       | 🟡 **Medium**   |
| Performance       | ⚠️ No pagination/caching | 🟡 **Medium**   |
| Observability     | ⚠️ Minimal logging       | 🟡 **Medium**   |
| Documentation     | ✅ Good README           | 🟢 **Low**      |
| Code Organization | ✅ Clean structure       | 🟢 **Low**      |
| Type Safety       | ✅ TypeScript strict     | 🟢 **Low**      |

### 🏆 STRENGTHS TO MAINTAIN

1. **Clean Architecture:** Monorepo structure with clear separation enables scalability
2. **Type Safety:** End-to-end TypeScript with strict mode catches bugs early
3. **Modern Stack:** Next.js 15, NestJS 11, Prisma 6 are all current best practices
4. **Comprehensive Features:** All core marketplace features implemented
5. **Deployment Ready:** Docker, Vercel, Railway configs complete

### 🔮 ROADMAP RECOMMENDATION

**Q1 2026 (Immediate):**

- ✅ Add comprehensive testing (unit, integration, E2E)
- ✅ Implement rate limiting & security hardening
- ✅ Set up monitoring & error tracking
- ✅ Add pagination to all list endpoints
- ✅ Generate OpenAPI documentation

**Q2 2026 (Growth):**

- Add Redis caching layer
- Implement event-driven architecture
- Integrate payment gateway (Razorpay)
- Advanced search with Elasticsearch
- Mobile-responsive optimization

**Q3-Q4 2026 (Scale):**

- Machine learning recommendations
- Multi-tenancy for agencies
- Mobile app (React Native)
- Internationalization (Hindi, Kannada, Tamil)
- Microservices migration (if needed)

### 💡 FINAL VERDICT

**Overall Assessment:** ⭐⭐⭐⭐☆ (4/5 stars)

ToMoola is a **solid, well-engineered MVP** ready for beta launch with minor security enhancements. The architecture is scalable, the tech stack is modern, and the feature set is comprehensive. The primary gaps are **testing and production-grade security**, both of which can be addressed in 2-3 weeks.

**Recommendation:**

- **Proceed to beta launch** after implementing critical security fixes (rate limiting, Redis OTP storage)
- **Delay public launch** until test coverage reaches minimum 60%
- **Monitor closely** in first 3 months and iterate based on user feedback

The team has demonstrated strong engineering discipline. With testing and security improvements, this platform can scale to support thousands of artists and bookings.

---

**End of Technical Audit**
**Generated:** 2026-03-06
**Codebase Version:** As of historical TODO tracker completion (all 95 tasks ✅)
**Auditor:** Senior Software Architect & Code Auditor
