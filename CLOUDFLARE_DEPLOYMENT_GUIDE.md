# Cloudflare Deployment & Architecture Guide for KILLASNUS

This document provides complete instructions for deploying the **KILLASNUS** full-stack nicotine pouch ecommerce platform using Cloudflare Pages / Cloudflare Workers, Cloudflare R2 object storage, and managed PostgreSQL (Neon / Supabase / Cloudflare Hyperdrive).

---

## 1. Architecture Overview

```
                                      ┌────────────────────────┐
                                      │   Cloudflare Edge      │
                                      │  (DNS, DDoS, SSL, WAF) │
                                      └───────────┬────────────┘
                                                  │
                                                  ▼
                        ┌──────────────────────────────────────────────────┐
                        │      Cloudflare Pages / OpenNext Worker          │
                        │        (Next.js 15 App Router Frontend & API)    │
                        └──────────┬───────────────────────┬───────────────┘
                                   │                       │
               ┌───────────────────┴───────┐     ┌─────────┴────────────────┐
               ▼                           ▼     ▼                          ▼
   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
   │ Cloudflare Hyperdrive │   │ Cloudflare R2 Bucket  │   │ Firebase Auth Service │
   │  (PostgreSQL Pooler)  │   │ (Zero-Egress Storage) │   │ (JWT & Admin SDK)     │
   └───────────┬───────────┘   └───────────────────────┘   └───────────────────────┘
               ▼
   ┌───────────────────────┐
   │ Neon / Supabase / AWS │
   │ PostgreSQL Database   │
   └───────────────────────┘
```

---

## 2. Cloudflare R2 Storage Setup

Cloudflare R2 provides zero-egress fee, S3-compatible object storage for all product photography, user uploads, banners, and brands.

### Step 1: Create an R2 Bucket
1. Open the **Cloudflare Dashboard** -> **R2** -> **Create Bucket**.
2. Name the bucket `killasnus-media`.
3. Select your preferred primary region (e.g. `Western Europe (WEUR)` or `Automatic`).

### Step 2: Generate R2 API Tokens
1. In the R2 Overview, click **Manage R2 API Tokens** -> **Create API Token**.
2. Permissions: **Admin Read & Write**.
3. Copy the following credentials:
   - **Account ID**
   - **Access Key ID**
   - **Secret Access Key**
   - **S3 Endpoint URL**

### Step 3: Enable Public Access or Connect Custom Domain
1. In `killasnus-media` bucket settings -> **Public Access**.
2. Connect a custom domain: e.g. `media.killasnus.com`.
3. Set the public domain in your environment variables:
   ```env
   NEXT_PUBLIC_R2_PUBLIC_URL="https://media.killasnus.com"
   ```

---

## 3. Database Deployment (Neon / Supabase PostgreSQL)

KILLASNUS uses Prisma ORM with PostgreSQL.

### Step 1: Create Managed PostgreSQL
1. Create a project on [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Choose **AWS Frankfurt (eu-central-1)** or **London (eu-west-2)** for low latency to UK/EU buyers.
3. Copy the connection string:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require
   ```

### Step 2: Push Schema & Migrations
Run from terminal:
```bash
# Push schema directly
npx prisma db push

# Apply production migration
npx prisma migrate deploy

# Seed all 18 brands, flavours, initial products, and admin
node prisma/seed.js
```

### Step 3: Optional Cloudflare Hyperdrive Acceleration
Cloudflare Hyperdrive eliminates connection overhead and pools PostgreSQL queries globally:
1. Run `npx wrangler hyperdrive create killasnus-db --connection-string="postgresql://..."`
2. Bind the Hyperdrive connection string as `DATABASE_URL` in Cloudflare Pages.

---

## 4. Firebase Authentication Setup

### Step 1: Create Firebase Project
1. In [Firebase Console](https://console.firebase.google.com), create project `killasnus`.
2. Go to **Authentication** -> **Sign-in method**.
3. Enable **Email/Password** and **Google**.
4. In **Authorized Domains**, add:
   - `localhost`
   - `killasnus.com`
   - `*.pages.dev`

### Step 2: Generate Service Account Key (Admin SDK)
1. In Firebase Console -> **Project settings** -> **Service accounts**.
2. Click **Generate new private key** (downloads JSON file).
3. Copy `client_email`, `project_id`, and `private_key` into production environment variables.

---

## 5. Deploying to Cloudflare Pages via GitHub

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "feat: complete production killasnus ecommerce platform"
git branch -M main
git remote add origin https://github.com/your-org/killasnus.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Go to **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select your repository `killasnus`.
3. Build Settings:
   - **Framework Preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`
4. Add all Environment Variables from `.env.example`.
5. Click **Save and Deploy**.

---

## 6. Verification Checklist

- [x] Age verification modal displays on first visit and persists via cookie.
- [x] All 18 brands clickable with filtered catalog listings.
- [x] Shop by Flavor (Mint & Ice, Fruit & Berry, Cola & Energy) filters correctly.
- [x] Shop by Strength (Light to Ultra 50mg+) filters correctly.
- [x] Slide-out cart drawer adds items, calculates VAT, free shipping threshold (£50), and coupons.
- [x] Checkout creates verified orders in PostgreSQL with timeline tracking.
- [x] Custom CMS Admin dashboard operates at `/admin`.
- [x] Drag & drop Page Builder configures custom block layouts.
- [x] Universal CSV Import/Export successfully parses Shopify exports.
- [x] Cloudflare R2 uploads assets and stores CDN links.
- [x] `/sitemap.xml` and `/robots.txt` dynamic endpoints render valid SEO markup.

