# ToMoola Deployment Guide

Deployment instructions for the ToMoola marketplace — a platform for booking Indian folk artists.

---

## 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 22+ |
| pnpm | 10.15+ |
| PostgreSQL | 16 |
| Git | Latest |

You will also need:

- A GitHub repository with the ToMoola monorepo pushed
- A PostgreSQL 16 database from **Railway**, **Neon**, **Supabase**, or a similar provider
- Accounts for the deployment platforms described below

---

## 2. Deploy Backend API

### Railway (Recommended)

1. **Create a new project** at [railway.app](https://railway.app).

2. **Add a database** — either add the Railway PostgreSQL plugin or use an external database URL.

3. **Connect your GitHub repo** — select the ToMoola repository.

4. **Configure the service:**
   - Railway auto-detects the Dockerfile at `services/api/Dockerfile`.
   - If prompted, set the **root directory** to the repository root (not `services/api/`), since the Dockerfile uses the monorepo build context.
   - Alternatively, add a `railway.json` at the repo root:
     ```json
     {
       "$schema": "https://railway.com/railway.schema.json",
       "build": {
         "builder": "DOCKERFILE",
         "dockerfilePath": "services/api/Dockerfile"
       },
       "deploy": {
         "healthcheckPath": "/api/health",
         "healthcheckTimeout": 30,
         "restartPolicyType": "ON_FAILURE",
         "restartPolicyMaxRetries": 3
       }
     }
     ```

5. **Set environment variables** — see the [Environment Variables Reference](#6-environment-variables-reference) below. At minimum set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and `PORT=4000`.

6. **Run the initial migration** — open the Railway shell or use the CLI:
   ```bash
   npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
   ```

7. **Seed art forms** — run the seed SQL against your production database:
   ```bash
   psql "$DATABASE_URL" -f packages/db/prisma/seed.sql
   ```

8. **Verify** — hit the health check endpoint:
   ```
   GET https://<your-service>.up.railway.app/api/health
   ```

### Render (Alternative)

1. Create a **Web Service** → choose **Docker** as the environment.
2. Point the Dockerfile path to `services/api/Dockerfile`.
3. Set the **Docker build context** to the repository root.
4. Add all required environment variables.
5. Set the health check path to `/api/health`.
6. Deploy and run the migration via the Render shell.

---

## 3. Deploy Frontend (Vercel)

1. **Import the repository** at [vercel.com](https://vercel.com).

2. **Configure project settings:**

   | Setting | Value |
   |---|---|
   | Root Directory | `services/web` |
   | Framework Preset | Next.js |

3. **Add environment variables:**

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | Your production API URL (e.g., `https://tomoola-api.up.railway.app`) |

4. The existing `vercel.json` in the repo root handles the build command (`pnpm install && pnpm --filter @tomoola/web build`), so no additional build configuration is needed.

5. Vercel auto-deploys on every push to the default branch.

---

## 4. Database Migrations

### Using the deploy script

The repo includes `scripts/deploy-migrate.sh`:

```bash
DATABASE_URL="postgresql://..." ./scripts/deploy-migrate.sh
```

This runs `prisma migrate deploy` against the production database.

### Manual migration

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
```

### Seeding data

The 9 Karnataka folk art forms must be seeded into production. Use the seed file:

```bash
psql "$DATABASE_URL" -f packages/db/prisma/seed.sql
```

This inserts the art forms (Dollu Kunitha, Yakshagana, Huli Vesha, Veeragase, Kamsale, Pata Kunitha, Pooja Kunitha, Garudi Gombe, Chenda Melam) and an initial admin user.

---

## 5. External Services Setup

### Cloudflare R2 (Media Storage)

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and navigate to **R2 Object Storage**.
2. Create a new bucket (e.g., `tomoola-media`).
3. Under **Manage R2 API Tokens**, create a token with **Object Read & Write** permissions scoped to the bucket.
4. Optionally enable a **Custom Domain** or **Public Bucket** for the public URL.
5. Set the environment variables:

   | Variable | Source |
   |---|---|
   | `R2_ACCOUNT_ID` | Cloudflare dashboard → Account ID (sidebar) |
   | `R2_ACCESS_KEY` | API token Access Key ID |
   | `R2_SECRET_KEY` | API token Secret Access Key |
   | `R2_BUCKET` | Bucket name (e.g., `tomoola-media`) |
   | `R2_PUBLIC_URL` | Public bucket URL or custom domain |

### WhatsApp (Meta Cloud API)

1. Create a [Meta Business account](https://business.facebook.com).
2. In the [Meta Developer portal](https://developers.facebook.com), create an app with the **WhatsApp** product.
3. Set up a WhatsApp Business phone number under **WhatsApp > Getting Started**.
4. Copy the **Phone Number ID** and generate a permanent **Access Token**.
5. Set the environment variables:

   | Variable | Value |
   |---|---|
   | `WHATSAPP_ENABLED` | `true` |
   | `WHATSAPP_PHONE_NUMBER_ID` | From the Meta developer dashboard |
   | `WHATSAPP_ACCESS_TOKEN` | Permanent access token |
   | `WHATSAPP_API_VERSION` | `v21.0` (or latest) |

### Email (SMTP)

Use **Resend**, **SendGrid**, **Amazon SES**, or any SMTP provider.

| Variable | Example |
|---|---|
| `EMAIL_ENABLED` | `true` |
| `EMAIL_FROM` | `noreply@tomoola.com` |
| `SMTP_HOST` | `smtp.resend.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `resend` |
| `SMTP_PASS` | Your API key |

---

## 6. Environment Variables Reference

### Backend API (`services/api/`)

| Variable | Description | Required | Example |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/tomoola` |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes | `a-long-random-string-min-32-chars` |
| `PORT` | API server port | No | `4000` |
| `FRONTEND_URL` | Frontend origin for CORS | Yes | `https://tomoola.com` |
| `R2_ACCOUNT_ID` | Cloudflare account ID | Yes | `abc123def456` |
| `R2_ACCESS_KEY` | R2 API token access key | Yes | — |
| `R2_SECRET_KEY` | R2 API token secret key | Yes | — |
| `R2_BUCKET` | R2 bucket name | Yes | `tomoola-media` |
| `R2_PUBLIC_URL` | Public URL for R2 bucket | Yes | `https://media.tomoola.com` |
| `WHATSAPP_ENABLED` | Enable WhatsApp notifications | No | `false` |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta phone number ID | If WA enabled | — |
| `WHATSAPP_ACCESS_TOKEN` | Meta API access token | If WA enabled | — |
| `WHATSAPP_API_VERSION` | WhatsApp API version | No | `v21.0` |
| `EMAIL_ENABLED` | Enable email notifications | No | `false` |
| `EMAIL_FROM` | Sender email address | If email enabled | `noreply@tomoola.com` |
| `SMTP_HOST` | SMTP server host | If email enabled | `smtp.resend.com` |
| `SMTP_PORT` | SMTP server port | If email enabled | `465` |
| `SMTP_USER` | SMTP username | If email enabled | `resend` |
| `SMTP_PASS` | SMTP password / API key | If email enabled | — |

### Frontend (`services/web/`)

| Variable | Description | Required | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `https://tomoola-api.up.railway.app` |

---

## 7. Post-Deployment Checklist

- [ ] API health check passes (`GET /api/health` returns 200)
- [ ] Database migrations applied (`prisma migrate deploy`)
- [ ] Art forms seeded (9 Karnataka folk art forms via `seed.sql`)
- [ ] Admin user created (phone `9999999999` from seed, or via OTP flow)
- [ ] Frontend can reach API (`NEXT_PUBLIC_API_URL` set, CORS configured via `FRONTEND_URL`)
- [ ] Media uploads working (R2 credentials verified)
- [ ] WhatsApp notifications tested (if enabled)
- [ ] Email notifications tested (if enabled)
- [ ] Test booking flow end-to-end (search artist → request booking → accept → complete)
