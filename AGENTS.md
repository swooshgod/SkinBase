# GlowUp Skincare App — Build Instructions

## Overview
Build a skincare companion app that guides users through personalized routines, tracks progress, and educates on safe product layering.

**Read SPEC.md first** — it contains the full product specification, database schema, and feature breakdown.

## Priority Order

### 🔴 Phase 1: Foundation (Build First)
1. **Next.js 14 Setup**
   - App Router
   - Tailwind CSS
   - Supabase client

2. **Quiz Flow**
   - Skin type selection
   - Concerns (multi-select)
   - Safety tags (pregnancy safe, acne prone, menopause, etc.)
   - Budget preference
   - Experience level (beginner/intermediate/advanced)
   - Store results in Zustand + localStorage

3. **Product Display**
   - Beautiful product cards with images
   - Benefits tags ("hydrating", "anti-aging")
   - "What it improves" section
   - Ingredient score badge (0-100)
   - Safety tags visible (pregnancy safe, fragrance free, etc.)

4. **Filter System**
   - Quick-tap filter pills at top
   - Categories: pregnancy_safe, acne_prone, menopause, fragrance_free, vegan, etc.
   - Multiple filters can be active
   - Filters persist

5. **Guided Routine**
   - AM/PM detection based on time
   - Big "Start Your Morning/Evening Routine" button
   - Step-by-step walkthrough:
     - Large product image
     - Application instructions
     - Optional timer (60s, 2min)
     - "Why this step" education dropdown
     - Progress indicator
   - Completion celebration

### 🟡 Phase 2: Accounts + Persistence
6. **Supabase Auth**
   - Google OAuth
   - Email/password
   - Protected routes

7. **Profile & Loadouts**
   - Save quiz results to profile
   - Create/edit loadouts (product bundles)
   - Set default AM/PM loadouts
   - Quick-log routine

8. **Progress Journal**
   - Camera capture for selfies
   - Photo timeline view
   - Before/after slider comparison
   - Notes per entry

### 🟢 Phase 3: Smart Features
9. **Barcode Scanner**
   - html5-qrcode integration
   - Open Beauty Facts API lookup
   - Manual entry fallback

10. **Product Search**
    - Autocomplete search
    - Filter by category, concern, safety tags
    - Add to loadout

11. **Ingredient Scoring**
    - Parse ingredient lists
    - Flag concerning ingredients
    - Score algorithm (see SPEC.md)

### 🔵 Phase 4: Premium
12. **Paywall**
    - Free vs Pro vs Premium tiers
    - Stripe integration

13. **AI Transformation**
    - Replicate API
    - "See your future skin" toggle
    - Before/after visualization

## Tech Stack (Required)
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Zustand (state)
- html5-qrcode (barcode scanning)
- Framer Motion (animations)

## Design Guidelines
- **Mobile-first** — 90% of users on phones
- **Soft, wellness aesthetic** — creams, soft pinks, sage greens
- **Large tap targets** — minimum 44px
- **Product images prominent** — users recognize products visually
- **Progress feels rewarding** — confetti, streaks, celebrations

## Gradual Progression (Important!)
- Beginners start with 3-step routine ONLY
- Lock advanced products until week 3
- Show "patch test reminder" when adding new products
- Educate before introducing actives

## Sample Products to Seed
Include 50+ real products across:
- Drugstore: CeraVe, The Ordinary, Neutrogena, Vanicream
- Midrange: Paula's Choice, La Roche-Posay, EltaMD
- Luxury: Tatcha, Drunk Elephant, SkinCeuticals

Each product needs:
- Name, brand, image URL
- Category (cleanser, serum, etc.)
- Price tier
- Benefits array
- Safety tags (pregnancy_safe, fungal_safe, etc.)
- Key actives
- Ingredient score

## Database Setup
Run migrations in Supabase. Schema in SPEC.md.

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REPLICATE_API_TOKEN=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Completion Signal
When Phase 1 is complete and working, run:
```bash
openclaw system event --text 'Done: GlowUp Phase 1 complete - Quiz, Products, Guided Routine working' --mode now
```

## Questions?
Check SPEC.md for detailed specifications on any feature.
