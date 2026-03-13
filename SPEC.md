# GlowUp — Full Product Specification

## Vision
A skincare companion app that educates users, tracks progress, and guides them through personalized routines. Built for real people — pregnancy-safe options, acne-prone skin, menopause support, and gradual progression for beginners.

**Core Philosophy:** Start slow, educate first, build habits safely.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (animations)
- **State:** Zustand (lightweight, persistent)
- **PWA:** next-pwa (installable on phones)

### Backend
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Auth:** Supabase Auth (Google, Apple, Email)
- **Image Storage:** Supabase Storage (progress photos)
- **Edge Functions:** Supabase Edge Functions

### Integrations
- **Barcode Scanning:** html5-qrcode or QuaggaJS (client-side)
- **Product Database:** Open Beauty Facts API (free) + custom fallback
- **Ingredient Scoring:** Custom algorithm based on EWG/INCIDecoder data
- **AI Face Transform:** Replicate API (face restoration/enhancement models)

---

## Database Schema

### users
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE
name            TEXT
created_at      TIMESTAMP
subscription    ENUM('free', 'pro', 'premium')
onboarding_done BOOLEAN DEFAULT false
```

### profiles
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
skin_type       ENUM('oily', 'dry', 'combo', 'sensitive', 'normal')
concerns        TEXT[] -- ['acne', 'aging', 'hyperpigmentation']
tags            TEXT[] -- ['pregnancy_safe', 'menopause', 'rosacea']
budget          ENUM('drugstore', 'midrange', 'luxury')
experience      ENUM('beginner', 'intermediate', 'advanced')
created_at      TIMESTAMP
```

### products
```sql
id              UUID PRIMARY KEY
barcode         TEXT UNIQUE
name            TEXT
brand           TEXT
category        ENUM('cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask', 'oil')
image_url       TEXT
price_tier      ENUM('drugstore', 'midrange', 'luxury')
price_usd       DECIMAL
size_ml         INTEGER

-- Benefits & concerns
benefits        TEXT[] -- ['hydrating', 'anti-aging', 'brightening']
targets         TEXT[] -- ['fine_lines', 'dark_spots', 'acne']

-- Safety tags
pregnancy_safe  BOOLEAN
fungal_safe     BOOLEAN
fragrance_free  BOOLEAN
vegan           BOOLEAN
cruelty_free    BOOLEAN

-- Scoring
ingredient_score INTEGER -- 0-100 (higher = cleaner/safer)
efficacy_score   INTEGER -- 0-100 (based on active ingredients)

-- Ingredients
ingredients     TEXT[]
key_actives     TEXT[] -- ['niacinamide', 'retinol', 'vitamin_c']
avoid_with      TEXT[] -- ['retinol', 'vitamin_c'] for conflicts

-- Metadata
source          TEXT -- 'openbeautyfacts', 'manual', 'user_submitted'
verified        BOOLEAN DEFAULT false
created_at      TIMESTAMP
```

### loadouts
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
name            TEXT -- 'My Morning Routine'
time_of_day     ENUM('am', 'pm', 'both')
products        UUID[] -- ordered list of product IDs
is_default      BOOLEAN DEFAULT false
created_at      TIMESTAMP
```

### progress_logs
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
date            DATE
time_of_day     ENUM('am', 'pm')
loadout_id      UUID REFERENCES loadouts
products_used   UUID[] -- actual products logged
photo_url       TEXT
notes           TEXT
skin_feeling    ENUM('great', 'good', 'okay', 'irritated', 'bad')
created_at      TIMESTAMP
```

### progress_photos
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
photo_url       TEXT
thumbnail_url   TEXT
taken_at        TIMESTAMP
tags            TEXT[] -- ['before', 'week_1', 'week_4']
notes           TEXT
```

### routine_sessions
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users
loadout_id      UUID REFERENCES loadouts
started_at      TIMESTAMP
completed_at    TIMESTAMP
steps_completed INTEGER
total_steps     INTEGER
```

---

## Feature Breakdown

### Phase 1: Foundation (Week 1)
**Goal:** Solid base with visual products and guided routines

- [ ] Next.js project setup with Tailwind
- [ ] Supabase integration (auth + database)
- [ ] Quiz flow (skin type → concerns → tags → budget → experience)
- [ ] Product display with images, benefits, "what it improves"
- [ ] Filter tags UI (pregnancy safe, acne prone, menopause, fragrance free, etc.)
- [ ] AM/PM detection + "Start Your Routine" button
- [ ] Step-by-step guided routine with:
  - Product image + name
  - Application instructions
  - Timer (wait 1-2 min between steps)
  - "Why this step" education
  - "Mark as done" progression
- [ ] Basic responsive design (mobile-first)

### Phase 2: User Accounts + Logging (Week 2)
**Goal:** Persistence and habit tracking

- [ ] Supabase Auth (Google + Email)
- [ ] User profile creation after quiz
- [ ] Save quiz results to profile
- [ ] Loadouts — save/edit product bundles
- [ ] Quick-log: tap loadout → logged for today
- [ ] Progress photo journal:
  - Camera capture
  - Date/time stamp
  - Before/after comparison slider
  - Timeline view
- [ ] Basic stats (streak, days logged, products tried)

### Phase 3: Barcode + Product Search (Week 2-3)
**Goal:** Real product integration

- [ ] Barcode scanner (html5-qrcode)
- [ ] Open Beauty Facts API integration
- [ ] Product search with autocomplete
- [ ] Manual product entry (for products not in DB)
- [ ] Ingredient scoring algorithm:
  - Flag concerning ingredients (parabens, sulfates, etc.)
  - Highlight beneficial actives
  - Score 0-100
- [ ] Product detail page:
  - Full ingredient list
  - Score breakdown
  - "Good for" / "Avoid if" tags
  - User reviews (later)
- [ ] Conflict detection ("Don't use retinol with vitamin C in AM")

### Phase 4: Education System (Week 3)
**Goal:** Safe, gradual progression

- [ ] Experience levels: Beginner → Intermediate → Advanced
- [ ] Beginner mode:
  - Start with 3-step routine only (cleanse, moisturize, SPF)
  - Unlock actives after 2 weeks
  - Warnings before adding new products
  - "Patch test reminder" prompts
- [ ] Layering guide:
  - Visual order diagram
  - Wait times between steps
  - AM vs PM differences
- [ ] Ingredient education cards
- [ ] "Level up" progression system
- [ ] Push notifications for routine reminders

### Phase 5: AI Transformation Preview (Week 4)
**Goal:** Motivation through visualization

- [ ] Replicate API integration (or similar)
- [ ] "See Your Future Skin" feature:
  - Upload current selfie
  - Select routine/timeframe (4 weeks, 8 weeks, 12 weeks)
  - AI generates "improved" version
  - Toggle slider between current/future
- [ ] Disclaimer: "Results vary, this is a visualization"
- [ ] Premium feature (paywall)

### Phase 6: Premium + Polish (Week 4-5)
**Goal:** Monetization and refinement

- [ ] Stripe/Gumroad integration
- [ ] Premium tier unlocks:
  - AI skin transformation
  - Unlimited loadouts
  - Advanced analytics
  - Product recommendations AI
  - Ad-free experience
- [ ] Affiliate links on products (Amazon, Sephora, Ulta)
- [ ] PWA optimization (offline support)
- [ ] Performance optimization
- [ ] Analytics (Plausible or Vercel Analytics)

---

## Filter Tags (Comprehensive List)

### Skin Conditions
- `acne_prone` — Non-comedogenic products only
- `rosacea` — Gentle, no irritants
- `eczema` — Fragrance-free, barrier repair
- `psoriasis` — Gentle, hydrating
- `sensitive` — No harsh actives

### Life Stages
- `pregnancy_safe` — No retinoids, salicylic acid, etc.
- `breastfeeding_safe` — Similar restrictions
- `menopause` — Focus on hydration, collagen support
- `teen` — Acne-focused, gentle

### Preferences
- `fragrance_free` — No added fragrance
- `fungal_safe` — Malassezia-safe (no fatty acids/esters)
- `vegan` — No animal products
- `cruelty_free` — Not tested on animals
- `clean_beauty` — No parabens, sulfates, phthalates
- `reef_safe` — No oxybenzone, octinoxate (sunscreens)

### Concerns
- `anti_aging` — Retinoids, peptides, antioxidants
- `brightening` — Vitamin C, niacinamide, arbutin
- `hydration` — Hyaluronic acid, ceramides
- `oil_control` — Niacinamide, BHA, clay
- `pore_minimizing` — BHA, niacinamide, retinoids
- `dark_spots` — AHAs, vitamin C, tranexamic acid
- `texture` — AHAs, retinoids
- `redness` — Centella, azelaic acid, green tea

---

## Guided Routine Flow

### Time-Based Detection
```
6 AM - 11 AM  → "Good morning! Ready for your AM routine?"
6 PM - 11 PM  → "Evening glow time! Start your PM routine?"
Other times   → Show both options
```

### Routine Steps (Example AM)
```
Step 1: Cleanser
├── Product image (large, recognizable)
├── "Massage onto damp skin for 60 seconds"
├── Timer: 60s countdown (optional)
├── Why: "Removes overnight oils and preps skin"
└── [Done] → Next step

Step 2: Toner (if in routine)
├── ...

Step 3: Serum
├── Product image
├── "Apply 3-4 drops, pat gently"
├── Why: "Targets [your concern] with [active ingredient]"
├── Wait timer: 1-2 min before next step
└── [Done] → Next step

Step 4: Moisturizer
├── ...

Step 5: Sunscreen (AM only)
├── "Apply liberally! Two finger lengths"
├── Why: "SPF is the #1 anti-aging product"
├── Pro tip: "Wait 15 min before makeup"
└── [Complete Routine!]
```

### After Completion
- Confetti animation 🎉
- "Routine logged for [date]"
- Option to add progress photo
- Streak counter update

---

## Gradual Progression System

### Level 1: Beginner (Weeks 1-2)
- 3-step routine only: Cleanser → Moisturizer → SPF
- No actives allowed yet
- Daily reminders
- Education cards unlock progressively
- Focus: Build the habit

### Level 2: Explorer (Weeks 3-4)
- Unlock: Serums (gentle ones first)
- Introduce one new product at a time
- 48-hour wait between new products
- Patch test prompts
- Focus: Safe experimentation

### Level 3: Intermediate (Weeks 5-8)
- Unlock: Treatments, masks, acids
- Introduce AM/PM differentiation
- Learn about layering conflicts
- Focus: Personalization

### Level 4: Advanced (Weeks 9+)
- Full product library access
- Advanced actives (retinol, strong acids)
- Custom routine builder
- Focus: Optimization

---

## Monetization

### Free Tier
- Quiz + basic recommendations
- 1 loadout
- 7-day routine history
- Basic guided routines
- Product search (limited)
- Progress photos (last 30 days)

### Pro ($4.99/month or $29.99/year)
- Unlimited loadouts
- Full routine history
- Barcode scanner
- Ingredient scoring
- Product conflict detection
- Unlimited progress photos
- Priority support

### Premium ($9.99/month or $59.99/year)
- Everything in Pro
- AI Skin Transformation
- Advanced analytics & insights
- Personalized product recommendations
- Early access to new features
- No ads

---

## API Integrations

### Open Beauty Facts
- Free, open-source product database
- Barcode lookup
- Ingredient lists
- https://world.openbeautyfacts.org/api

### Replicate (AI Faces)
- Face restoration models
- GFPGAN, CodeFormer, etc.
- Pay-per-use (~$0.01-0.05 per image)
- https://replicate.com

### Supabase
- Auth, database, storage
- Free tier: 500MB DB, 1GB storage
- https://supabase.com

---

## File Structure

```
skincare-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── quiz/
│   │   ├── routine/
│   │   ├── products/
│   │   ├── journal/
│   │   ├── loadouts/
│   │   └── settings/
│   ├── api/
│   │   ├── products/
│   │   ├── barcode/
│   │   └── transform/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── quiz/
│   ├── routine/
│   ├── products/
│   └── journal/
├── lib/
│   ├── supabase.ts
│   ├── products.ts
│   ├── scoring.ts
│   └── utils.ts
├── stores/
│   └── user-store.ts
├── types/
│   └── index.ts
├── public/
│   └── images/
├── supabase/
│   └── migrations/
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Success Metrics

- **Retention:** 7-day return rate > 40%
- **Routine completion:** > 60% of started routines completed
- **Photo uploads:** > 20% of users upload progress photos
- **Conversion:** > 5% free → Pro, > 2% Pro → Premium
- **NPS:** > 50

---

## Launch Checklist

- [ ] Core quiz flow
- [ ] Product database seeded (50+ products)
- [ ] Guided routine works
- [ ] Auth works (Google + Email)
- [ ] Mobile responsive
- [ ] PWA installable
- [ ] Basic analytics
- [ ] Terms of service
- [ ] Privacy policy
- [ ] Stripe/payments ready
- [ ] Launch landing page

---

## Notes

- **Privacy first:** Progress photos never shared, encrypted at rest
- **No medical claims:** "This is for educational purposes, not medical advice"
- **Accessibility:** WCAG 2.1 AA compliance target
- **Performance:** < 3s load time on 3G
