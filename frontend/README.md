# WisdomLingo — Frontend

React 18 + TypeScript + Tailwind CSS, talking directly to Supabase.
Project overview lives in the [root README](../README.md); backend setup in
[`../backend/README.md`](../backend/README.md).

## Commands

```bash
npm install
npm start            # dev server, http://localhost:3000
npm run build        # production bundle in build/
npm test             # CRA test runner
```

## Environment

Copy `.env.example` to `.env.local` and fill in:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

Only `REACT_APP_*` variables reach the bundle, and only at build time — restart `npm start`
after changing them. When they are missing the app runs on the seed content in
`src/data/seed.ts` and the admin dashboard switches to read-only demo mode, so nothing
crashes and no request is sent to a fake URL.

## Structure

| Path | Contains |
|---|---|
| `src/App.tsx` | routes only |
| `src/pages/` | Home, Courses, StudyAbroad, Apprenticeships, About, AdminLogin, AdminDashboard, NotFound |
| `src/components/layout/` | Navbar (sticky, hamburger under `lg`), Footer, Logo, SiteLayout, ScrollToTop |
| `src/components/public/` | CourseCard, CountryCard, ApprenticeshipCard, ContactForm |
| `src/components/admin/` | AdminSidebar, AdminList, CoursesTab, CountriesTab, ApprenticeshipsTab, MessagesTab, form modals, ImageUploadField, ArrayTextarea |
| `src/components/ui/` | Modal, ConfirmDialog, MediaImage, PageHero, SectionHeading, EmptyState, Loader |
| `src/hooks/` | `useAuth`, `useRemoteList`, `useAdminCollection` |
| `src/lib/` | `supabase.ts`, `storage.ts` (upload/delete), `mappers.ts`, `utils.ts` |
| `src/config/` | company details, navigation links |
| `src/data/` | seed content and shared page copy |
| `src/types/` | shared data types |

## Key pieces

**`useAuth`** — wraps `AuthProvider`, exposes `session`, `user`, `loading`, `signIn`,
`signOut`. One `onAuthStateChange` subscription for the whole app.

**`ProtectedRoute`** — shows a loader while the session resolves, then redirects signed-out
visitors to `/admin`.

**`useRemoteList`** — public reads: fetches active rows, falls back to seed data on error or
empty table.

**`useAdminCollection`** — one CRUD implementation (load, save, remove, toggleActive) shared
by all three content tabs; deleting a row also deletes its uploaded image.

**`uploadImage(file, folder)`** — validates type and size, uploads to the `course-images`
bucket and returns the public URL.

## Styling

Tailwind with brand tokens in `tailwind.config.js` (`primary` `#1E40AF`, `accent` `#DC2626`,
Inter) and component classes in `src/index.css` — `.btn-primary`, `.btn-accent`, `.btn-ghost`,
`.card`, `.input`, `.label`, `.badge`, `.container-page`, `.section`, `.h2`.

Every page is mobile-first: one column on phones, two on tablets, up to three or six on
desktop. Admin tables become cards below `lg`.
