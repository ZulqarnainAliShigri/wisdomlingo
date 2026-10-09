# WisdomLingo

Education consultancy platform for German language training, European study-abroad
counselling and paid Ausbildung programs.

```
wisdom/
├── src/             React 18 + TypeScript + Tailwind (website and admin dashboard)
├── public/          Static assets, icons, videos, _redirects for Cloudflare Pages
├── scripts/         Post-build SEO prerender script
├── supabase/        Supabase config, SQL migrations, seed data
├── package.json     App scripts and dependencies
├── .env.example     Environment variables template
└── README.md        You are here
```

- **Brand:** blue `#1E40AF`, red `#DC2626`, Inter
- **Phone:** 03118526814
- **Admin:** `admin@wisdomlingo.com` at `/admin`

## Quick start

```bash
npm install
npm start            # http://localhost:3000
```

The site runs immediately with bundled demo content. To connect your Supabase database,
put your keys in `.env.local`:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

## Application structure

| Route | Page |
|---|---|
| `/` | Home — hero, stats, three program cards |
| `/courses` | German (A1–C2), English (IELTS, Spoken), Religious (Quran, Arabic, Persian) tabs |
| `/study-abroad` | 6 countries with expandable benefits + 4-step application process |
| `/ausbildung` | 5 fields with salary, duration, requirements, benefits |
| `/about` | Company introduction + contact form |
| `/admin` | Admin login |
| `/admin/dashboard` | Protected dashboard — Courses, Destinations, Ausbildung, Messages |

Directory layout:

```
src/
├── components/
│   ├── admin/      AdminList, form modals, image upload, tabs
│   ├── layout/     Navbar, Footer, Logo, SiteLayout, ScrollToTop
│   ├── public/     CourseCard, CountryCard, ApprenticeshipCard, ContactForm
│   ├── ui/         Modal, ConfirmDialog, MediaImage, PageHero, EmptyState, Loader
│   └── ProtectedRoute.tsx
├── config/         company details, navigation, media
├── data/           seed content, shared page content
├── hooks/          useAuth, useRemoteList, useAdminCollection, useCompany, useSeo
├── lib/            supabase client, storage upload, mappers, utils
├── pages/          the public and admin routes
├── types/          shared data types
└── App.tsx         routing only
```

## Backend (Supabase)

Supabase provides Postgres, Auth, and Storage. All configurations and migrations are in
[`supabase/`](supabase) (see [`SUPABASE.md`](SUPABASE.md)):
- `supabase/migrations/`: Database schema, tables, RLS policies, storage bucket
- `supabase/seed.sql`: Starter content

To push changes to your Supabase project:
```bash
npm run db:push
```

## Admin dashboard

Sign in at `/admin`. The dashboard has a left sidebar (slide-in drawer on mobile) with sections for:

| Section | Actions |
|---|---|
| **Courses** | add / edit / delete, search, filter by category, upload image, show or hide |
| **Destinations** | add / edit / delete countries, benefits and requirements one per line |
| **Apprenticeships** | add / edit / delete fields, salary, duration, requirements, benefits |
| **Messages** | read contact enquiries, mark read/unread, delete, reply by email or phone |
| **SEO & Settings** | customize site metadata, company phone, address, and social links |

Deleting asks for confirmation and cleans up uploaded media. Without Supabase configured, the dashboard renders with demo data in read-only mode.

## Deployment (Cloudflare Pages)

Because everything is consolidated in a single folder, Cloudflare Pages connects directly to the repository root:

```bash
npm run build        # output: build/
```

### Cloudflare Pages build settings

| Setting | Value |
|---|---|
| **Framework preset** | `Create React App` (or None) |
| **Root directory** | *(leave empty / root)* |
| **Build command** | `npm run build` |
| **Build output directory** | `build` |

Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` under **Settings → Environment variables** for both Production and Preview.

`public/_redirects` contains `/*  /index.html  200` to handle client-side routing on Cloudflare Pages.
