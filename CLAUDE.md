# Dog Dash — Claude Context

## Project Overview

Dog Dash is a real-time platform connecting dog owners with vetted walkers (Uber-for-dog-walking). It supports two user roles: **Pet Owners** and **Dog Walkers**. Core features include walker discovery via GPS map, booking & payments, real-time walk tracking, and ratings/reviews.

## Monorepo Structure

```
dog-dash/
├── apps/
│   ├── web/        # Next.js 14 web app (primary)
│   └── expo/       # Expo/React Native mobile app
├── packages/
│   ├── ui/         # Shared UI component library (wraps Gluestack)
│   └── config/     # Shared TypeScript/ESLint configs
└── docs/           # Requirements, design docs, feature specs
```

Managed with **TurboRepo** and npm workspaces.

## Commands

```bash
npm run dev      # Start all apps in dev mode
npm run build    # Build all apps and packages
npm run test     # Run all tests (Jest)
npm run lint     # Lint all code (ESLint)
npm run clean    # Clean build artifacts
```

All commands run via Turbo from the repo root.

## Tech Stack

| Area | Technology |
|------|-----------|
| Web Framework | Next.js 14 |
| Mobile | Expo ~51, React Native 0.74 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (web), Gluestack UI v2 (native) |
| Auth | Clerk v5 |
| Database | Supabase (PostgreSQL + PostGIS) |
| Realtime | Supabase Realtime |
| Payments | Stripe |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Maps | Google Maps JS API, Geocoding, Distance Matrix |
| State (server) | TanStack Query |
| State (client) | Zustand |
| Forms | React Hook Form + Zod |
| Images | next-cloudinary |
| Serverless | Cloudflare Workers (webhooks) |
| Cross-platform nav | Solito + React Navigation |
| Testing | Jest 30, React Testing Library |

## Architecture Rules (CRITICAL)

### Feature Hook Pattern
The codebase enforces strict layering:

```
UI Components → Feature Hooks → Services → External SDKs
```

**Feature Hooks** are the ONLY public API for components:
- `useAuth()` — authentication state and actions
- `useWalkerMap()` — map data and walker locations
- `useBooking()` — booking flow and state
- `useProfile()` — user/walker/pet profile data

**Components MUST NOT directly import:**
- TanStack Query (`@tanstack/react-query`)
- Zustand (`zustand`)
- Clerk SDK (`@clerk/nextjs`)
- Supabase SDK (`@supabase/supabase-js`)
- Service classes

### UI Component Wrapping Rule
- **Never** import Gluestack components directly in feature code
- **Always** use components from `packages/ui`
- This protects against library breaking changes and enables future migrations

### Service Layer
Services only fetch/mutate data — no business logic, no UI concerns. Feature hooks orchestrate services and manage state.

## Database Schema

Six core entities in Supabase PostgreSQL:

| Table | Purpose |
|-------|---------|
| `users` | Clerk-managed accounts (email, name, phone, photo) |
| `walker_profiles` | Walker-specific data (bio, location GeoJSON, rating, totalWalks) |
| `pet_profiles` | Pet data owned by users (breed, age, weight, care instructions) |
| `walks` | Walk records with status lifecycle and pricing (cents) |
| `reviews` | Post-walk ratings (1–5 stars) between owner and walker |
| `notifications` | In-app notifications with read status |

**Walk status lifecycle:** `pending → confirmed → in_progress → completed | cancelled`

Spatial indexes on location fields (PostGIS). Payment data handled by Stripe (not stored locally).

## Design System

**Colors (semantic tokens):**
- Primary: `#3B82F6` (Blue 500) / `#60A5FA` in dark mode
- Success: Green 500 | Error: Red 500 | Warning: Amber 500

**Typography:** Geist (sans) + Geist Mono. Scale: display (48px) → h1–h4 → body1–body2 → caption (12px)

**Spacing:** 4px base unit — `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `xxl` (48px)

**Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

**Icons:** Material Community Icons via `@expo/vector-icons`

**Animation durations:** short 150ms / medium 250ms / long 350ms

Always use theme tokens — never hardcode colors or spacing values.

## Key Conventions

- **Path alias:** `@/*` maps to `apps/web/src/*`
- **Test files:** `__tests__/**`, `*.test.ts(x)`, `*.spec.ts(x)`
- **Validation:** Always use Zod schemas for form and API input validation
- **Accessibility:** WCAG 2.1 AA — maintain 4.5:1 contrast, add ARIA labels
- **No hardcoded colors/spacing** — always reference design tokens
- **Memo expensive components**, lazy-load heavy ones

## Implementation Status

**Done:**
- [x] Theme configuration & base design system setup
- [x] Clerk authentication (OAuth + email/password, webhooks)

**In Progress / Pending:**
- [ ] UI component library (packages/ui)
- [ ] User role selection onboarding
- [ ] Pet Owner onboarding flow (6 stages)
- [ ] Dog Walker onboarding flow (8 stages)
- [ ] Walker profiles & discovery map
- [ ] Booking system
- [ ] Stripe payment integration
- [ ] Real-time GPS tracking (Supabase Realtime + PostGIS)
- [ ] Rating & review system
- [ ] FCM push notifications

## User Flows

**Pet Owner onboarding:** Sign up → Role selection → Profile setup (address, emergency contact) → Pet profile(s) → Payment method → Complete

**Dog Walker onboarding:** Sign up → Role selection → Profile + service area → Background check → Schedule & pricing → Payment/tax setup → Training acknowledgment → Complete
