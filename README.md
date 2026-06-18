# GenZ Era World — Production Ecommerce Platform

> Not your average pop culture store. Premium Action Figures, Sneakers, Apparel & Collectibles.
> **By Kabir Luthra** · [@genzeraworld](https://www.instagram.com/genzeraworld/)

---

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Zustand** (Cart State)
- **Vercel** (Deployment)

---

## 🚀 Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo>
cd genzera-world
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
3. Go to **Storage** → Verify these buckets are created:
   - `product-images` (public)
   - `payment-proofs` (private)
   - `site-assets` (public)

### 3. Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=8569950807
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/genzeraworld/
ADMIN_SETUP_SECRET=choose-a-strong-random-secret
```

Find your keys at: Supabase Dashboard → Settings → API

### 4. Create First Super Admin

After starting the dev server, make a POST request to create your first super admin:

```bash
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@genzeraworld.com",
    "name": "Kabir Luthra",
    "password": "your-secure-password",
    "secret": "your-ADMIN_SETUP_SECRET-value"
  }'
```

Or use any REST client (Thunder Client, Postman, etc.)

This also seeds the default categories: **Action Figures**, **T-Shirts**, **Sneakers**.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## 📦 Vercel Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework preset: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Deploy!

After deployment, update `.env.local` (or Vercel env vars):
```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

And run the setup API call with your production URL to create the super admin on prod.

---

## 🎛 Admin Dashboard

URL: `/admin`

### Features
- **Dashboard** — Order stats, recent orders
- **Orders** — Filter by status, view details, update status, see payment screenshots
- **Products** — Add/edit/delete products, image upload, stock management, featured/trending/new arrival toggles
- **Categories** — Add/edit/delete categories
- **Admins** *(Super Admin only)* — Create/disable admin accounts
- **Settings** — UPI QR code upload, low stock threshold

### Order Statuses
`pending_verification` → `payment_verified` → `packed` → `shipped` → `delivered`

Also: `cancelled`, `refunded`

---

## 🛒 Customer Flow

1. Browse products on homepage
2. Add to cart
3. Checkout (fill shipping details)
4. Payment page — scan UPI QR, pay exact amount
5. Upload screenshot + enter Transaction ID
6. Submit order → Thank You page with Order ID
7. Track order at `/track-order`

---

## 💳 Payment

- **No payment gateway** — Manual UPI verification
- Upload your UPI QR code in Admin → Settings
- Customers upload screenshot + transaction ID
- You verify and update order status manually

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (store)/          # Public storefront
│   │   ├── page.tsx      # Homepage
│   │   ├── shop/         # Shop listing
│   │   ├── product/[slug]/ # Product detail
│   │   ├── category/[slug]/ # Category listing
│   │   ├── checkout/     # Checkout form
│   │   ├── payment/      # Payment page
│   │   ├── thank-you/    # Order confirmation
│   │   └── track-order/  # Order tracking
│   ├── admin/            # Admin panel (protected)
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── admins/
│   │   └── settings/
│   └── api/              # API routes
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── store/            # ProductCard, CartDrawer, etc.
│   └── admin/            # Admin components
├── hooks/
│   └── useCart.ts        # Zustand cart store
├── lib/
│   ├── supabase/         # Client & server clients
│   └── utils.ts          # Helper functions
└── types/
    └── index.ts          # TypeScript types
```

---

## 🎨 Design System

- **Background**: `#050508` (near-black)
- **Primary**: `#7c3aed` (purple)
- **Accent**: `#b44ef0` (bright purple-pink)
- **Text**: `#ffffff` / `#9ca3af`
- **Font Display**: Bebas Neue
- **Font Body**: Inter

---

## 📲 Contact Integration

- **Instagram**: [@genzeraworld](https://www.instagram.com/genzeraworld/)
- **WhatsApp**: `+91 8569950807` (chats only)
- Product pages include "Order on WhatsApp" and "Ask on Instagram" buttons with pre-filled messages

---

## 🔐 Roles

| Feature | Admin | Super Admin |
|---|---|---|
| Manage products | ✅ | ✅ |
| Manage categories | ✅ | ✅ |
| Manage orders | ✅ | ✅ |
| Create admins | ❌ | ✅ |
| Disable admins | ❌ | ✅ |
| Site settings | ✅ | ✅ |
| Activity logs | ✅ | ✅ |

---

## 🚚 Delivery Rules

| Order Value | Delivery Charge |
|---|---|
| Below ₹500 | ₹80 |
| ₹500 and above | FREE |

---

Made with ⚡ for the GenZ fandom.
