@AGENTS.md

# Campedèl Digital Menu — Developer Guide

## Project Overview
Digital menu system for the Campedèl-Hof farm restaurant on the Seiser Alm, South Tyrol.
- **Guest app:** `/menu` — mobile-first, multilingual (DE/IT/EN), allergen filter
- **Admin panel:** `/admin/dashboard`, `/admin/items`, `/admin/categories` (auth required)

## Tech Stack
- Next.js 16 App Router + TypeScript + Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)
- next-intl for i18n (locale stored in cookie `locale`)
- Framer Motion for animations
- dnd-kit for drag-and-drop in admin

## Key Files
- `app/menu/page.tsx` — guest menu (server component, fetches from Supabase)
- `app/admin/(protected)/layout.tsx` — auth guard (redirects to `/admin/login` if not authenticated)
- `supabase/schema.sql` — full DB schema (run first)
- `supabase/seed.sql` — all menu items, wines, categories, allergens (run after schema)
- `lib/i18n/request.ts` — i18n config reading locale from cookie
- `lib/messages/{de,it,en}.json` — all UI strings

## Setup Steps
1. Create Supabase project → run `supabase/schema.sql` → run `supabase/seed.sql`
2. Create Supabase Storage bucket `menu-images` (public)
3. Fill `.env.local` with real Supabase credentials
4. Create an admin user in Supabase Auth (email + password)
5. `npm run dev` → visit `http://localhost:3000/menu`
6. Deploy on Vercel → add env vars → connect domain
7. Generate QR code pointing to `https://yourdomain.com/menu`

## Design Tokens
- Gold: `#C9A96E` — prices, active states, CTAs
- Pine green: `#2D5016` — badges, allergen filter
- Bg light: `#FAFAF8` | Bg dark: `#1A1A18`
- Fonts: Playfair Display (headings) + Inter (body)

## Allergens
All 14 EU allergens (Reg. 1169/2011) are seeded. Never remove or hide allergen data.
Codes: A=Gluten, B=Krebstiere, C=Eier, D=Fisch, E=Erdnüsse, F=Soja, G=Milch,
H=Nüsse, L=Sellerie, M=Senf, N=Sesam, O=Sulfite, P=Lupinen, R=Weichtiere

## Wine Categories
Slugs: `schaumwein`, `weisswein`, `rotwein` — these render WineCard instead of MenuCard.
Wine fields: `wine_producer`, `wine_region`, `wine_doc`, `wine_style`, `wine_grapes[]`, `is_bio`.
