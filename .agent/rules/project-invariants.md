---
trigger: always_on
---

# Dog-Dash AI Project Invariants
This document outlines the strict architectural and coding rules for the Dog-Dash monorepo. As an AI assistant, you MUST adhere to these rules when generating, refactoring, or reviewing code for this project.

## 1. Architectural Patterns
- **Monorepo Structure**: The app is built to support Next.js (Web) and React Native (Mobile). Use `solito` for unified navigation bridging the two routers.
- **Platform Splitting at the Edge**: For platform-specific implementations (e.g. Maps, Gestures), use `.web.tsx` and `.native.tsx` extensions rather than inline platform checks, maintaining a shared common interface.
- **Service Layer**: External integrations (Supabase, Stripe, Clerk) MUST be abstracted behind TypeScript service interfaces/classes. **NEVER** hardcode direct driver calls like `supabase.from(...)` inside React components or UI hooks.
- **Dependency Management**: Strictly pin `react`, `react-dom`, and `react-native` versions across the monorepo using package manager `overrides`/`resolutions` to prevent dependency conflicts.

## 2. State & Data Handling
- **Query Encapsulation**: Components MUST NEVER use `useQuery` or `useMutation` (TanStack Query) directly. All data fetching logic must be encapsulated in custom hooks (e.g., `useMyBookings`) to centralize query keys, caching rules, and invalidation logic.
- **Cost Optimization**: Maximize the use of `staleTime` in TanStack Query. Use polling as a fallback strategy to avoid expensive constant WebSocket (Supabase Realtime) connections unless absolutely necessary (e.g., real-time walker tracking).
- **Zustand for Global State**: Use Zustand for client-side state management (e.g., map tracking state, current booking flow).
- **Zod + React Hook Form**: All forms and data validations across the application must be typed and validated using Zod combined with React Hook Form.

## 3. UI & Design System Rules
- **"Wrap and Constrain" (Strict UI Rule)**: **NEVER** import UI library components (e.g., `Gluestack UI`) directly into feature code (`apps/web` or `apps/expo`). **ALWAYS** create a wrapper component inside `packages/ui` (e.g., `packages/ui/src/AppButton.tsx`) and import from there.
- **The "Dumb UI" Rule**: Components should be strictly for presentation. Business logic, complex `useEffect` chains, and data manipulation must be handled inside abstracted Feature Hooks.
- **Styling**: Adhere strictly to the defined Design System:
  - Font: Geist (sans-serif) / Geist Mono (monospace). Provide accessible WCAG 2.1 AA compliant color contrast.
  - Hardcoded colors should be avoided; always rely on theme tokens to cleanly support Dark Mode.

## 4. Database Schema Guidelines
- **Authentication**: `users.id` corresponds to the external Clerk authentication ID. Do not duplicate core auth state.
- **Geospatial Data**: User schemas (Walker locations, walk pickups) leverage PostGIS GeoJSON `Point` coordinates (`[longitude, latitude]`).
- **Authorization**: Keep ownership clear. Owners mutate their own `Pets` and `Walks`, while Walkers only update assigned `Walks`. Ratings/Reviews happen explicitly between users upon completed walks.
