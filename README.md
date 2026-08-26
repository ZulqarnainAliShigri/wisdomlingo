# WisdomLingo

Education consultancy platform for German language training, European study-abroad
counselling and paid apprenticeships.

```
wisdom/
├── frontend/     React 18 + TypeScript + Tailwind (the website and admin dashboard)
├── backend/      Supabase project: SQL migrations, seed data, security policies
└── README.md     you are here
```

- **Brand:** blue `#1E40AF`, red `#DC2626`, Inter
- **Phone:** 03118526814
- **Admin:** `admin@wisdomlingo.com` at `/admin`

## Quick start

```bash
cd frontend
npm install
npm start            # http://localhost:3000
```

The site runs immediately with bundled demo content. To make it editable, set up the backend
(see [`backend/README.md`](backend/README.md)) and put the two keys in `frontend/.env.local`:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

## Frontend

| Route | Page |
|---|---|
| `/` | Home — hero, stats, three program cards |
| `/courses` | German (A1–C2), English (IELTS, Spoken), Religious (Quran, Arabic, Persian) tabs |
| `/study-abroad` | 6 countries with expandable benefits + 4-step application process |
| `/apprenticeships` | 5 fields with salary, duration, requirements, benefits |
| `/about` | Company introduction + contact form |
| `/admin` | Admin login |
| `/admin/dashboard` | Protected dashboard — Courses, Destinations, Apprenticeships, Messages |

Structure:

```
frontend/src/
├── components/
│   ├── admin/      AdminList, form modals, image upload, tabs
│   ├── layout/     Navbar, Footer, Logo, SiteLayout, ScrollToTop
│   ├── public/     CourseCard, CountryCard, ApprenticeshipCard, ContactForm
│   ├── ui/         Modal, ConfirmDialog, MediaImage, PageHero, EmptyState, Loader
│   └── ProtectedRoute.tsx
├── config/         company details, navigation
├── data/           seed content, shared page content
├── hooks/          useAuth, useRemoteList, useAdminCollection
├── lib/            supabase client, storage upload, mappers, utils
├── pages/          the eight routes
├── types/          shared data types
└── App.tsx         routing only
```

## Backend

Supabase — Postgres + Auth + Storage. All of it is defined in
[`backend/supabase/`](backend/supabase) as migrations plus a seed file, so it can be rebuilt
from scratch. Public visitors can read active content and submit the contact form; only the
signed-in admin can write. See [`backend/README.md`](backend/README.md).

## Admin dashboard

Sign in at `/admin`. The dashboard has a left sidebar (a slide-in drawer on mobile) with four sections:

| Section | Actions |
|---|---|
| **Courses** | add / edit / delete, search, filter by category, upload image, show or hide |
| **Destinations** | add / edit / delete countries, benefits and requirements one per line |
| **Apprenticeships** | add / edit / delete fields, salary, duration, requirements, benefits |
| **Messages** | read contact enquiries, mark read/unread, delete, reply by email or phone |

Deleting asks for confirmation and also removes the uploaded image. Every action shows a toast.
Without Supabase configured the dashboard still renders with demo data, clearly marked
read-only.

## Deployment (Cloudflare Pages)

```bash
cd frontend
npm run build        # output: frontend/build
```

Upload `frontend/build` via **Workers & Pages → Create → Pages → Upload assets**, or connect
the repo with:

| Setting | Value |
|---|---|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `build` |

Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` under Settings → Environment
variables for both Production and Preview, then redeploy — CRA bakes them in at build time,
so an existing deployment will not pick them up.

`frontend/public/_redirects` already routes every path to `index.html` so client-side routes
survive a refresh.
