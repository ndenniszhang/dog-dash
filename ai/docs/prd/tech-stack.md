# Dog-Dash Technology Stack

## Overview
This document outlines the technology choices for the Dog-Dash platform, organized by feature to demonstrate how each technology contributes to specific platform capabilities. The initial focus is on delivering a web-based MVP using Next.js, with plans to expand to mobile platforms in future phases.

## Web MVP - Feature-Based Tech Stack

### Foundation & Infrastructure
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Next.js** | Application framework | Core framework providing routing, rendering, and API endpoints |
| **TypeScript** | Type safety | Used throughout the application for code quality and developer experience |
| **Cloudflare Workers** | API hosting | Serverless functions for backend operations |
| **Terraform** | Infrastructure as Code | Manages cloud resources and deployment |
| **Jest** | Testing | Unit and integration testing for all features |
| **dotenv** | Environment configuration | Manages environment variables across development stages |

### Feature 1: User Onboarding & Profiles
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Clerk.com** | Authentication & user management | Handles sign-up, login, social auth, and session management |
| **Supabase** | Profile data storage | Stores user profiles, dog profiles, preferences, and settings |
| **React Hook Form** | Form handling | Powers profile creation and editing forms |
| **Zod** | Data validation | Validates user and dog profile data before submission |
| **next-cloudinary** | Image storage | Manages profile pictures and dog photos |
| **Gluestick v2** | UI components | Provides form components, layouts, and UI elements for profiles |

### Feature 2: Location & Booking System
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Google Maps** | Map display | Shows available walkers on map interface |
| **Google Geocoding API** | Address search | Converts addresses to coordinates for location-based searches |
| **Supabase with PostGIS** | Proximity search | Performs geospatial queries to find nearby walkers |
| **date-fns** | Schedule management | Handles date/time calculations for availability windows |
| **TanStack Query** | Data fetching | Manages walker data, availability, and booking state |
| **React Hook Form** | Booking forms | Powers booking request forms |
| **Zustand** | Booking state | Maintains booking flow state and user selections |

### Feature 3: Real-Time Tracking
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Google Maps JavaScript API** | Live map display | Renders real-time walker position on map |
| **Google Distance Matrix API** | ETA calculation | Estimates arrival times and walk distances |
| **Supabase Realtime** | Real-time updates | Subscribes to location changes and status updates |
| **Zustand** | State management | Maintains current walker position and trip status |
| **TanStack Query** | Data synchronization | Handles polling and real-time data updates |
| **react-hot-toast** | Status notifications | Displays walk status changes and important alerts |

### Feature 4: Payments
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Stripe** | Payment processing | Handles payment methods, transactions, and security |
| **Cloudflare Workers** | Payment webhooks | Processes payment events securely |
| **Supabase** | Transaction records | Stores booking and payment history |
| **Zod** | Payment validation | Validates payment data before submission |
| **React Hook Form** | Payment forms | Powers payment information collection forms |

### Feature 5: Rating & Review System
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Supabase** | Ratings storage | Stores ratings, reviews, and calculates average scores |
| **React Hook Form** | Review submission | Powers rating and review submission forms |
| **Zod** | Review validation | Validates rating and review data before submission |
| **TanStack Query** | Data fetching | Fetches and displays rating data on profiles |

### Cross-Cutting Frontend Components
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Gluestick v2** | UI component library | Provides consistent, accessible UI components across features |
| **Zustand** | Global state management | Manages application-wide state where needed |
| **react-hot-toast** | Notifications | Provides user feedback across all features |

## Development & Deployment Approach

### Monorepo Structure
The project will utilize a monorepo structure from the start to facilitate adding React Native mobile applications in future phases, while maintaining separate deployment pipelines.

### Future Mobile Expansion
After successful launch of the web MVP, the platform will expand to include mobile applications:

| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **React Native** | Mobile framework | Reuses business logic while providing native mobile experience |
| **Expo** | Development platform | Simplifies mobile development and deployment processes |
| **Gluestick v2** | UI components | Maintains design consistency between web and mobile |
| **Detox** | E2E testing | Ensures reliable mobile app functionality |

## Development Phases

### Phase 1: MVP Core Features
- User authentication and profiles
- Basic location and booking functionality
- Simple payment processing
- Minimal viable tracking capabilities
- Basic rating system

### Phase 2: Enhanced Features
- Advanced analytics and monitoring (Amplitude, Sentry)
- Comprehensive E2E testing (Cypress)
- Push notifications
- Enhanced UI/UX refinements
- Performance optimizations

### Phase 3: Mobile Expansion
- React Native mobile applications
- Cross-platform feature parity
- Platform-specific optimizations

## Outstanding Technology Decisions
- **Push Notifications Provider:** Considering Firebase Cloud Messaging (FCM) or OneSignal for real-time booking notifications
- **CI/CD Pipeline:** Need to establish continuous integration and deployment workflow specifics
