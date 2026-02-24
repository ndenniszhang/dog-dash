# System Component Diagram

This diagram illustrates the high-level components of the Dog Dash application, emphasizing the **Feature Hook** architecture where the UI Layer is strictly decoupled from backend services and business logic.

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef hooks fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef service fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef database fill:#e0e0e0,stroke:#424242,stroke-width:2px,shape:cylinder;

    subgraph Client_App["Client Application (Next.js / React Native)"]
        direction TB
        
        subgraph UI_Layer["App Component Layer (Wrapped UI)"]
            AuthPages["Auth Pages\n(Login, Signup)"]:::frontend
            ProfilePages["Profile Pages\n(Owner/Walker/Pet)"]:::frontend
            MapDashboard["Map Dashboard\n(Tracking/Search)"]:::frontend
            BookingFlow["Booking Flow\n(Scheduler, Payment)"]:::frontend
        end
        
        subgraph Component_Library["Core UI Library"]
            Gluestack["Gluestack UI v2"]:::frontend
            CustomWrappers["App Wrappers\n(packages/ui)"]:::frontend
        end

        subgraph Feature_Hooks["Feature Hook Layer (The Only Public API)"]
            AuthHooks["useAuth()\n(Logic + Clerk SDK)"]:::hooks
            MapHooks["useWalkerMap()\n(Logic + Google SDK)"]:::hooks
            BookingHooks["useModules()\n(Logic + Query)"]:::hooks
            ProfileHooks["useProfile()\n(Logic + Query)"]:::hooks
        end

        subgraph State_Internal["Internal State & Caching"]
            ServerState["TanStack Query Cache"]:::hooks
            GlobalState["Zustand Store"]:::hooks
        end
        
        subgraph Service_Layer["Service Abstraction Layer"]
            Services["Service Interfaces\n(UserService, BookingService)"]:::service
            ServiceImpls["Service Implementations\n(SupabaseImpl, MockImpl)"]:::service
        end
    end

    subgraph Backend_Services["Backend Services"]
        NextAPI["Next.js API Routes / Server Actions"]:::backend
        EdgeFunctions["Cloudflare Workers\n(Webhooks/Notifications)"]:::backend
    end

    subgraph Data_Layer["Data Persistence"]
        MainDB[("Supabase PostgreSQL\n(User Data, Bookings)")]:::database
        SpatialDB[("PostGIS\n(Spatial Index)")]:::database
    end

    subgraph External_Services["External Integrations"]
        Clerk["Clerk Auth Provider"]:::external
        GoogleMaps["Google Maps API\n(Geocoding, Routing)"]:::external
        Stripe["Stripe Payments"]:::external
        Firebase["Firebase FCM\n(Push Notifications)"]:::external
        Storage["Object Storage\n(Images/Docs)"]:::external
    end

    %% Relationships - UI Components
    AuthPages --> CustomWrappers
    ProfilePages --> CustomWrappers
    MapDashboard --> CustomWrappers
    BookingFlow --> CustomWrappers
    CustomWrappers --> Gluestack

    %% Relationships - UI to Feature Hooks (STRICT GATEWAY)
    AuthPages --> AuthHooks
    ProfilePages --> ProfileHooks
    MapDashboard --> MapHooks
    BookingFlow --> BookingHooks

    %% Relationships - Hooks to Internals
    AuthHooks -.-> Clerk
    BookingHooks --> ServerState
    ProfileHooks --> ServerState
    MapHooks --> GlobalState
    MapHooks --> GoogleMaps

    %% Relationships - State to Service Layer
    ServerState --> Services
    Services -.-> ServiceImpls

    %% Relationships - Service Impl to Backend/External
    ServiceImpls <--> NextAPI
    ServiceImpls <--> MainDB
    ServiceImpls --> Stripe
    
    %% Relationships - Backend to External
    NextAPI --> Stripe
    EdgeFunctions --> Firebase
    EdgeFunctions --> Stripe

    %% Relationships - Data
    NextAPI --> MainDB
    MainDB --- SpatialDB
    ServiceImpls -- Uploads --> Storage
    
```

## Architecture Usage Rules

### 1. The Strict Interface Rule
*   **Components** (UI Layer) may **ONLY** import from the **Feature Hook Layer**.
*   Components must **NEVER** import:
    *   `TanStack Query` directly (useQuery).
    *   `Zustand` stores directly.
    *   `Supabase` or `Clerk` SDKs directly.
    *   `Service` classes.

### 2. Feature Hooks Contain Logic
*   Hooks are not just pass-throughs. They contain the **Business Logic** (e.g., "If booking is confirmed, start polling location").
*   They orchestrate multiple sources (e.g., Auth + Database + Maps).

### 3. Services are Dumb
*   Services only fetch/mutate data. They do not know about React state or UI logic.
