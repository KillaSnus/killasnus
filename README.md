# KILLASNUS - Production-Ready Full-Stack Ecommerce & CMS Platform

A complete, production-ready, full-stack ecommerce and custom CMS platform engineered for modern nicotine pouch and all-white snus retail. Designed from the ground up with a **Premium Dark** aesthetic, pure black backgrounds (`#09090b`), rich metallic gold accents (`#d4af37`), mobile-first responsiveness, and blazing fast performance.

---

## 🚀 Tech Stack

### Frontend
- **Next.js 15 (App Router)** - Server components, streaming SSR, and optimized client interactivity.
- **TypeScript 5** - End-to-end type safety for models, API contracts, and components.
- **Tailwind CSS** - Custom luxury dark gold theme, glassmorphism, responsive grids.
- **Framer Motion & Lucide Icons** - Micro-interactions, sliding drawers, and animated feedback.

### Backend & API
- **Next.js API Routes** - RESTful endpoints with input validation and role-based access control.
- **Prisma ORM** - High-performance PostgreSQL data layer with connection pooling.
- **Firebase Authentication & Firebase Admin SDK** - Email/Password, Google OAuth, and secure token verification.
- **Stripe & PayPal SDKs** - Card payments, wallets, and custom gateway integrations.
- **PapaParse** - High-speed streaming CSV parser & generator with Shopify compatibility.

### Database & Storage
- **PostgreSQL** - Compatible with Neon, Supabase, Cloudflare Hyperdrive, AWS RDS.
- **Cloudflare R2** - S3-compatible zero-egress cloud storage for high-resolution product photography and assets.

### Deployment Targets
- **Cloudflare Pages / Cloudflare Workers**
- **Vercel / AWS / Docker Node.js server**

---

## 💎 Features Overview

### 1. Custom CMS Admin Dashboard (`/admin`)
- **Dashboard Overview**: Gross sales, net orders, customer acquisition, average order value (AOV), low stock alerts, revenue velocity.
- **Products Module**: Complete CRUD, gallery uploader, variant matrices (1 can, 10-pack roll, 30-pack box), pouch specifications, bulk status toggle, bulk delete, CSV export.
- **Categories Module**: Nested category tree supporting Flavours (*Mint & Ice, Fruit & Berry, Cola & Energy*), Strengths (*Light, Medium, Strong, X-Strong, Ultra*), and General categories.
- **Brands Module**: Pre-configured with all 18 market-leading brands (*Velo, Pablo, Killa, Iceberg, Jixx, Greatest, ZYN, Siberia, Kurwa, White Fox, Ace, Kelly White, Goat, Thor, Rush, 77, XQS, Zone*).
- **Orders Module**: Multi-status workflow (*Pending, Paid, Processing, Shipped, Completed, Refunded, Cancelled*), live courier tracking updates (Royal Mail, DPD, DHL), timeline audit log, and printable invoices.
- **Customers CRM**: Customer search, lifetime spend metrics, tag management (*VIP, Wholesale, High-Volume*), and private internal notes.
- **Coupons Engine**: Percentage (%) and fixed amount (£) discounts with minimum spend rules, usage limits, and expiry dates.
- **Reviews Moderation**: Approve/reject customer reviews, rating breakdowns, and verified purchaser badges.
- **Menus Manager**: Multi-level navigation builder for header menus and footer columns.
- **Payment Gateway Manager**: Toggle and configure Stripe, PayPal, Cash on Delivery, Faster Payments Bank Transfer, Crypto (BTC/ETH/USDT), or create custom gateways.
- **Shipping Settings**: Free delivery threshold (£50+ default), standard and express next-day delivery rates.
- **SEO Settings**: Default meta tags, canonical domains, and automated `/sitemap.xml` generator.
- **Universal Import/Export Center**: Import/export CSVs for Products, Customers, Orders, Categories, Brands, Blogs, and Pages. Directly imports Shopify export files (`products_export_1.csv` and `customers_export.csv`).

### 2. Drag & Drop Visual Page Builder (`/admin/pages/builder/[id]`)
Interactive page canvas supporting 14 modular building blocks:
1. `Hero` (Headlines, background gradients, dual CTAs)
2. `Slider` (Rotating carousel banners)
3. `Banner` (Promotional image callout)
4. `Grid` (Multi-column feature layout)
5. `Product Carousel` (Live product scroller)
6. `Brand Carousel` (Nordic brand crest showcase)
7. `Countdown` (Flash-sale urgency timer)
8. `Blog Grid` (Latest editorial articles)
9. `FAQ` (Expandable accordion questions)
10. `Reviews` (Customer testimonials)
11. `Newsletter` (VIP club email capture)
12. `HTML` (Raw custom markup embed)
13. `CSS` (Scoped styling block)
14. `JavaScript` (Client-side interactive script)

### 3. Luxury Dark Storefront (`/`)
- **Age Verification Gate**: Compliant 18+ modal with cookie persistence.
- **Announcement Bar**: Free UK shipping ticker & flash deals banner.
- **Interactive Header**: Instant search with autocomplete, category dropdowns, brand selector, customer portal link, and cart badge.
- **Slide-Out Cart Drawer**: Quantity steppers, real-time free shipping progress bar, promo code validator, and subtotal calculation.
- **Product Catalog (`/products`)**: Live faceted filters by Brand, Flavour, Strength, Price Range, and In-Stock status with instant sorting.
- **Product Detail Page (`/products/[slug]`)**: Multi-image thumbnail gallery, pack size selector (Single, 10-pack, 30-pack), nicotine specs table (mg/g, pouches per can, format), usage accordions, customer reviews, and one-click instant checkout.
- **Checkout (`/checkout`)**: Guest and member checkout, address validation, shipping speed selection (Standard vs Next Day), and payment method chooser.
- **Customer Account Portal (`/account`)**: Registration, Email/Password and Google sign in, order history with live timeline tracking, address book, and wishlist.
- **SEO & Compliance**: Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, and mandatory UK/EU nicotine health warning notices.

---

## 🛠️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
cd /Users/apple/Desktop/killasnus
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL (`DATABASE_URL`), Firebase credentials, and payment API keys.

### 3. Database Migration & Seeding
Push the schema to your PostgreSQL database and run the rich seed script:
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed all 18 brands, flavours, products, admin account, and CMS pages
npm run db:seed
```

### 4. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the Custom CMS.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
killasnus/
├── prisma/
│   ├── schema.prisma              # Complete PostgreSQL schema
│   ├── seed.js                    # Production seed with 18 brands & catalog
│   └── migrations/
│       └── 20261108000000_init/
│           └── migration.sql      # Raw SQL migration for immediate deployment
├── src/
│   ├── app/
│   │   ├── (store)/               # Storefront routes
│   │   │   ├── products/          # Catalog & product detail pages
│   │   │   ├── brands/            # 18+ brands directory & brand catalog
│   │   │   ├── cart/              # Dedicated shopping cart page
│   │   │   ├── checkout/          # Multi-gateway checkout & confirmation
│   │   │   ├── account/           # Customer portal, login & orders
│   │   │   ├── blog/              # Educational journal & guides
│   │   │   └── pages/             # Dynamic CMS pages (About, FAQ, etc.)
│   │   ├── admin/                 # Custom CMS Dashboard routes
│   │   │   ├── products/          # Product list & product editor
│   │   │   ├── categories/        # Nested flavours & strengths taxonomy
│   │   │   ├── brands/            # Brands manager
│   │   │   ├── orders/            # Order fulfillment & timeline tracker
│   │   │   ├── customers/         # Customer CRM & tags
│   │   │   ├── pages/             # CMS pages & Drag-and-drop page builder
│   │   │   ├── media/             # Cloudflare R2 Media Library
│   │   │   ├── coupons/           # Discount codes & vouchers
│   │   │   ├── reviews/           # Review moderation
│   │   │   ├── menus/             # Header & footer menus
│   │   │   ├── settings/          # Theme, Payments, Shipping, SEO
│   │   │   ├── import-export/     # Universal CSV import & export
│   │   │   └── analytics/         # Sales & market share analytics
│   │   ├── api/                   # RESTful API endpoints
│   │   ├── globals.css            # Dark gold luxury theme styles
│   │   └── layout.tsx             # Root layout with Age Gate & Cart Drawer
│   ├── components/
│   │   └── store/                 # High-performance storefront components
│   └── lib/
│       ├── prisma.ts              # Prisma client singleton
│       ├── auth.ts                # Session verification & admin protection
│       ├── firebase/              # Client & Admin SDK initializers
│       ├── r2.ts                  # Cloudflare R2 S3 storage client
│       ├── stripe.ts              # Stripe payment processor
│       ├── csv.ts                 # Shopify CSV parser & generator
│       ├── utils.ts               # Formatting, slugify, badge helpers
│       └── store/                 # Cart & Auth React contexts
├── CLOUDFLARE_DEPLOYMENT_GUIDE.md # Cloudflare Pages, R2 & Hyperdrive guide
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## 🔒 Security & Compliance
- **CSRF & Session Verification**: All administrative API routes require valid JWT authorization or admin API key.
- **Role-Based Access Control**: Strict segregation between `CUSTOMER`, `MANAGER`, and `ADMIN` roles.
- **Nicotine Compliance**: Mandatory 18+ age verification modal, unbranded discreet shipping notices, and statutory nicotine warning disclaimers.

