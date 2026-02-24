# Dog-Dash Implementation Plan - MVP Focus

## Architectural Standards & Mitigation Strategies

**Adherence to these standards is mandatory to ensure mitigating identified architectural risks.**

1.  **Dependency Pinning:** 
    *   Strictly pin versions for `react`, `react-dom`, and `react-native` in `package.json` utilizing `overrides` or `resolutions` to prevent version conflicts.
2.  **Service Layer Pattern (Repository Pattern):**
    *   **NEVER** call `supabase` directly in UI components.
    *   **ALWAYS** define a Service Interface (e.g., `UserService`) and implement a concrete class (e.g., `SupabaseUserService`).
3.  **Encapsulated Logic Pattern (The Feature Hook Rule):**
    *   **Strict Gateway:** The "Feature Hooks" directory is the *only* public API for the UI layer.
    *   **Abstraction:** UI Components must **NEVER** import SDKs (`clerk`, `supabase`, `stripe`), API keys, or raw `fetch` calls.
    *   **Responsibility:** Feature Hooks (e.g., `useBookingFlow`) must encapsulate all business logic, state management, and data access. They return only the data and action handlers needed by the UI.
4.  **Platform Splitting:**
    *   Use `.native.tsx` and `.web.tsx` extensions for complex interactive components (e.g., Maps) to ensure native-like experiences.

## Feature 1: User Onboarding & Authentication
**Objective:** Provide secure and simple user registration and login.
- [ ] Implement sign-up flow with both OAuth and email/password.
- [ ] Develop login functionality with secure token management.
- [ ] Validate inputs and display meaningful error feedback.

## Feature 2: Walker Profiles
**Objective:** Enable walkers to create and manage their service profiles.
- [ ] Build a profile creation form capturing availability and dog size preferences.
- [ ] Integrate a mechanism for collecting and displaying owner ratings.

## Feature 3: Owner Profiles & Dog Profiles
**Objective:** Allow owners to register, create profiles, and add dog profiles.
- [ ] Implement owner registration flow with profile management.
- [ ] Create a dog profile module to store name, breed, temperament, and other details.
- [ ] Enable updating and retrieval of profile information.

## Feature 4: Availability & Booking
**Objective:** Allow owners to view available walkers and book a walk.
- [ ] Develop a dashboard displaying real-time walker availability.
- [ ] Implement booking request and confirmation flows.
- [ ] Interface with a backend module for booking management.

## Feature 5: In-App Payments
**Objective:** Enable secure money transfers between owners and walkers with commission routing.
- [ ] Integrate a third-party payment gateway for processing transactions.
- [ ] Develop payment processing and commission distribution logic.
- [ ] Handle payment errors and provide user feedback.

## Feature 6: GPS Tracking
**Objective:** Provide real-time tracking of walker location during a booking.
- [ ] Integrate a GPS API to capture and update location data.
- [ ] Develop a live map view for users to monitor walk progress.
- [ ] Ensure smooth and frequent updates of location data.

## Feature 7: Rating & Review System
**Objective:** Facilitate mutual feedback to build trust and maintain quality.
- [ ] Implement a post-walk rating and review submission process.
- [ ] Store and display ratings on both walker and owner profiles.
