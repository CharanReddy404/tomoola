# Setup Guide After Bug Fixes

## Quick Start (5 minutes)

All bugs from the technical audit have been fixed! Follow these steps to get running:

### 1. Install New Dependencies

```bash
cd "/Users/charan/Desktop/new project/tomoola"
pnpm install
```

### 2. Start Redis

Redis is now **required** for OTP storage. Choose one option:

**Option A: Docker Compose (Recommended)**
```bash
docker compose up -d
```
This starts both PostgreSQL and Redis.

**Option B: Local Redis**
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

### 3. Update Environment Variables

```bash
cd services/api
```

Edit your `.env` file and add/update:

```bash
# REQUIRED: Generate a strong secret
JWT_SECRET=$(openssl rand -base64 32)

# Redis connection (default works with docker-compose)
REDIS_URL=redis://localhost:6379
```

### 4. Verify Setup

```bash
# Test Redis is running
redis-cli ping
# Should return: PONG

# Test database connection
pnpm --filter @tomoola/api db:studio
```

### 5. Start the Application

```bash
# From root directory
pnpm dev
```

The app should start successfully with:
- ✅ Redis connected
- ✅ Database connected
- ✅ JWT_SECRET loaded
- ✅ Rate limiting active
- ✅ Pagination enabled

---

## What Changed?

### 🔴 Critical Fixes
1. **OTP Storage:** Moved from memory to Redis (production-ready)
2. **OTP Generation:** Now uses cryptographically secure random
3. **Rate Limiting:** Auth endpoints now protected (3 OTP requests/min)
4. **JWT Secret:** Required in all environments (no insecure defaults)

### 🟡 Medium Priority Fixes
5. **Pagination:** All list endpoints now paginated (max 100/page)
6. **Error Handling:** Notification failures logged, don't break bookings
7. **Input Validation:** Comprehensive validation on all DTOs

### 🟢 Low Priority Fixes
8. **TypeScript Types:** Replaced all `any` with proper interfaces
9. **Audit Logging:** Admin actions now logged
10. **Documentation:** Updated .env.example with Redis config

---

## Breaking Changes

⚠️ **Your code needs these updates:**

### 1. API Responses Changed (Pagination)

**Before:**
```typescript
const artists = await api.getArtists(); // returns Artist[]
```

**After:**
```typescript
const response = await api.getArtists(); // returns PaginatedResponse<Artist>
const artists = response.data;
const { total, page, pageCount } = response.meta;
```

### 2. Environment Variables Required

Your `.env` **must** have:
- `JWT_SECRET` (no default fallback)
- `REDIS_URL` or `REDIS_HOST`/`REDIS_PORT`

---

## Testing the Fixes

### 1. Test Rate Limiting

```bash
# Try sending 4 OTP requests in quick succession
for i in {1..4}; do
  curl -X POST http://localhost:4000/api/auth/send-otp \
    -H "Content-Type: application/json" \
    -d '{"phone":"1234567890"}'
done

# 4th request should return 429 Too Many Requests
```

### 2. Test Pagination

```bash
# Get first page
curl "http://localhost:4000/api/artists?page=1&limit=5"

# Response includes meta:
# {
#   "data": [...],
#   "meta": {
#     "total": 50,
#     "page": 1,
#     "limit": 5,
#     "pageCount": 10
#   }
# }
```

### 3. Test OTP Persistence

```bash
# Send OTP
curl -X POST http://localhost:4000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890"}'

# Check Redis (OTP should be stored)
redis-cli KEYS "otp:*"

# Wait 5+ minutes, OTP should auto-expire
```

### 4. Test TypeScript Types

In your frontend code:
```typescript
const response = await api.getArtists();
// TypeScript now knows:
response.data       // ArtistProfile[]
response.meta.total // number
response.data[0].groupName // string (autocomplete works!)
```

---

## Production Deployment

### Railway/Render (Backend)

Add these environment variables:

```bash
# Redis addon URL (provided by Railway/Render)
REDIS_URL=redis://...

# Generate secure secret
JWT_SECRET=your-64-character-random-string

# Everything else stays the same
DATABASE_URL=postgresql://...
PORT=4000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Vercel (Frontend)

No changes needed! Frontend automatically uses the new typed API.

---

## Troubleshooting

### "Cannot connect to Redis"

**Check Redis is running:**
```bash
redis-cli ping
```

**Check REDIS_URL in .env:**
```bash
cat services/api/.env | grep REDIS
```

**Docker Compose users:**
```bash
docker compose ps
# Both postgres and redis should be "Up"
```

### "JWT_SECRET is required"

Generate a strong secret:
```bash
openssl rand -base64 32
```

Add to `services/api/.env`:
```bash
JWT_SECRET=your-generated-secret-here
```

### "Too Many Requests" Error

This is working correctly! Rate limiting is active.
- Wait 60 seconds before retrying
- Or adjust limits in `src/app.module.ts`

### Frontend Type Errors

After pulling changes, rebuild:
```bash
pnpm --filter @tomoola/shared build
pnpm --filter @tomoola/web build
```

---

## Monitoring

Watch logs for these new messages:

**Redis Connection:**
```
[RedisService] Redis connected successfully
```

**Rate Limiting:**
```
Too Many Requests (check IP address in logs)
```

**Admin Actions:**
```
[AdminService] Artist profile abc123 (Dollu Kunitha) approved
```

**Notification Failures (if any):**
```
[BookingsService] Failed to notify artist xyz: Connection timeout
```

---

## Rollback Plan

If issues arise, rollback is simple:

1. **Code:** Git revert to previous commit
2. **Environment:** Remove REDIS_URL from .env (app will fail to start - expected)
3. **Dependencies:** `pnpm install` on previous commit

**Note:** Don't rollback in production without testing. All fixes are thoroughly tested and production-ready.

---

## Support

- **Bug Fixes Documentation:** See `BUG_FIXES.md`
- **Technical Audit:** See `TECHNICAL_AUDIT.md`
- **General Setup:** See `README.md`

**All systems are ready for production deployment! 🚀**
