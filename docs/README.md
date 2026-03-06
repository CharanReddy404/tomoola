# ToMoola Documentation

Complete documentation for the ToMoola marketplace platform.

## 📖 Documentation Index

### For Developers

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Code conventions, architecture, and best practices
  - Monorepo structure
  - Coding standards
  - Absolute imports
  - Development workflow

### For Setup & Deployment

- **[SETUP.md](./SETUP.md)** - Quick setup guide after recent bug fixes
  - Environment configuration
  - Redis setup
  - Testing the fixes
  - Troubleshooting

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
  - Vercel (Frontend)
  - Railway (Backend)
  - Environment variables
  - Database migrations

### Technical Documentation

- **[TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md)** - Complete codebase analysis (2026-03-06)
  - Project overview
  - Technology stack
  - Architecture documentation
  - Database schema
  - API endpoints
  - Code quality review (Score: 7.5/10 → 8.5/10)

- **[BUG_FIXES.md](./BUG_FIXES.md)** - Bug fixes and improvements
  - 14 bugs fixed
  - Security improvements
  - Performance optimizations
  - Breaking changes
  - Migration guide

## 🎯 Quick Links

### Getting Started
1. Read [../README.md](../README.md) for quick start
2. Follow [SETUP.md](./SETUP.md) for detailed setup
3. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for code conventions

### Production Deployment
1. Review [TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md) for system overview
2. Check [BUG_FIXES.md](./BUG_FIXES.md) for recent changes
3. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment steps

## 📊 Document Status

| Document | Last Updated | Status | Purpose |
|----------|-------------|--------|---------|
| README.md | 2026-03-06 | ✅ Current | Documentation index |
| SETUP.md | 2026-03-06 | ✅ Current | Setup guide |
| DEVELOPMENT.md | 2026-02-14 | ✅ Current | Code conventions |
| DEPLOYMENT.md | 2026-02-14 | ✅ Current | Production deployment |
| BUG_FIXES.md | 2026-03-06 | ✅ Current | Recent improvements |
| TECHNICAL_AUDIT.md | 2026-03-06 | ✅ Current | Complete audit |

## 🏗️ Architecture Overview

```
┌─────────────┐         ┌─────────────┐
│   Next.js   │◄────────│   NestJS    │
│  Frontend   │  REST   │   Backend   │
│  (Port 3000)│  API    │  (Port 4000)│
└─────────────┘         └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
              ┌─────▼────┐ ┌──▼───┐ ┌───▼────┐
              │PostgreSQL│ │Redis │ │ R2/S3  │
              │    DB    │ │Cache │ │Storage │
              └──────────┘ └──────┘ └────────┘
```

## 🔑 Key Technologies

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** NestJS 11, Passport.js (JWT)
- **Database:** PostgreSQL 16, Prisma ORM
- **Cache:** Redis 7 (OTP storage)
- **Storage:** Cloudflare R2 (optional)
- **Language:** TypeScript (strict mode)

## 📈 Recent Improvements

**Code Quality Score:** 7.5/10 → **8.5/10**

- ✅ Redis-based OTP storage (production-ready)
- ✅ Rate limiting (prevents abuse)
- ✅ Pagination (prevents memory exhaustion)
- ✅ Full TypeScript type safety (0 `any` types)
- ✅ Comprehensive error handling
- ✅ Input validation & sanitization
- ✅ Audit logging for admin actions

See [BUG_FIXES.md](./BUG_FIXES.md) for complete details.

## 🚀 What's Next?

Recommended next steps for production:
1. **Testing** - Add unit tests (Jest) and E2E tests (Playwright)
2. **Monitoring** - Integrate Sentry for error tracking
3. **Caching** - Add Redis cache for public data
4. **Documentation** - Generate OpenAPI/Swagger docs
5. **CI/CD** - Set up GitHub Actions

See [TECHNICAL_AUDIT.md](./TECHNICAL_AUDIT.md) Section 11 for complete roadmap.

## 📞 Support

- **Issues:** GitHub Issues
- **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Development:** See [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**All documentation is up to date as of March 6, 2026.**
