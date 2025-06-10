# Dog-Dash Technology Stack

## Overview
This document outlines the technology choices for the Dog-Dash platform, organized by feature to demonstrate how each technology contributes to specific platform capabilities. The initial focus is on delivering a web-based MVP using Next.js, with plans to expand to mobile platforms in future phases.

## Web MVP - Feature-Based Tech Stack

### Core Development
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Next.js** | Application framework | Core framework providing routing, rendering, and API endpoints |
| **TypeScript** | Type safety | Used throughout the application for code quality and developer experience |
| **Jest** | Testing | Unit and integration testing for all features |
| **dotenv** | Environment configuration | Manages environment variables across development stages |

### Infrastructure & DevOps
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Cloudflare Workers** | API hosting | Serverless functions for backend operations |
| **Terraform** | Infrastructure as Code | Manages cloud resources and deployment |
| **GitHub Actions** | CI/CD pipeline | Automates testing, building, and deployment workflows |

### Feature 1: User Onboarding & Profiles
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Clerk.com** | Authentication & user management | Handles sign-up, login, social auth, and session management |
| **Supabase** | Profile data storage | Stores user profiles, dog profiles, preferences, and settings |
| **React Hook Form** | Form handling | Powers profile creation and editing forms |
| **Zod** | Data validation | Validates user and dog profile data before submission |
| **next-cloudinary** | Image storage | Manages profile pictures and dog photos |
| **Gluestack UI v2** | UI components | Provides form components, layouts, and UI elements for profiles |

### Feature 2: Location & Real-Time Tracking
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Google Maps** | Map display | Shows available walkers on map interface |
| **Google Maps JavaScript API** | Live map display | Renders real-time walker position on map |
| **Google Geocoding API** | Address search | Converts addresses to coordinates for location-based searches |
| **Google Distance Matrix API** | ETA calculation | Estimates arrival times and walk distances |
| **Supabase with PostGIS** | Proximity search | Performs geospatial queries to find nearby walkers |
| **Supabase Realtime** | Real-time updates | Subscribes to location changes and status updates |
| **TanStack Query** | Data synchronization | Handles polling and real-time data updates |
| **Zustand** | State management | Maintains current walker position and trip status |
| **react-hot-toast** | Status notifications | Displays walk status changes and important alerts |

### Feature 3: Booking System & Payments
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Supabase** | Booking data & transactions | Stores booking details, history, and payment records |
| **date-fns** | Schedule management | Handles date/time calculations for availability windows |
| **React Hook Form** | Booking & payment forms | Powers booking request and payment information forms |
| **Stripe** | Payment processing | Handles payment methods, transactions, and security |
| **Cloudflare Workers** | Payment webhooks | Processes payment events and booking updates securely |
| **TanStack Query** | Booking data | Manages walker availability and booking state |
| **Zustand** | Booking state | Maintains booking flow state and user selections |
| **Zod** | Form validation | Validates booking and payment data before submission |

### Feature 4: Push Notifications
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Firebase Cloud Messaging** | Push notification service | Delivers real-time notifications for booking updates, walker arrival, and other events |
| **Cloudflare Workers** | Notification triggers | Processes events and triggers appropriate notifications |
| **Zustand** | Notification state | Manages notification permissions and user preferences |

### Feature 5: Rating & Review System
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **Supabase** | Ratings storage | Stores ratings, reviews, and calculates average scores |
| **React Hook Form** | Review submission | Powers rating and review submission forms |
| **Zod** | Review validation | Validates rating and review data before submission |
| **TanStack Query** | Data fetching | Fetches and displays rating data on profiles |

### Cross-Cutting Components
| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **TypeScript** | Type safety | Ensures code quality across all features and components |
| **Gluestack UI v2** | UI component library | Provides consistent, accessible UI components across features |
| **Zustand** | State management | Manages application-wide and feature-specific state |
| **TanStack Query** | Data management | Handles data fetching, caching, and synchronization across features |
| **Zod** | Schema validation | Provides type-safe validation for all forms and data structures |
| **React Hook Form** | Form handling | Powers all forms throughout the application |
| **react-hot-toast** | User notifications | Provides feedback for user actions across all features |

## Development & Deployment Approach

### Monorepo Structure
The project will utilize a monorepo structure from the start to facilitate adding React Native mobile applications in future phases, while maintaining separate deployment pipelines.

### Future Mobile Expansion
After successful launch of the web MVP, the platform will expand to include mobile applications:

| Technology | Purpose | Implementation |
|------------|---------|---------------|
| **React Native** | Mobile framework | Reuses business logic while providing native mobile experience |
| **Expo** | Development platform | Simplifies mobile development and deployment processes |
| **Gluestack UI v2** | UI components | Maintains design consistency between web and mobile |
| **Detox** | E2E testing | Ensures reliable mobile app functionality |

## Development Phases

### Phase 1: MVP Core Features
- User authentication and profiles
- Basic location and booking functionality
- Simple payment processing
- Minimal viable tracking capabilities
- Basic rating system
- Push notifications with Firebase Cloud Messaging

### Phase 2: Enhanced Features
- Advanced analytics and monitoring (Amplitude, Sentry)
- Comprehensive E2E testing (Cypress)
- Enhanced UI/UX refinements
- Performance optimizations

### Phase 3: Mobile Expansion
- React Native mobile applications
- Cross-platform feature parity
- Platform-specific optimizations
