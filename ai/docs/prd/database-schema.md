# Dog Dash Database Schema

## Overview
This document outlines the database schema for the Dog Dash application, designed to support the MVP features while maintaining scalability for future enhancements. The schema is optimized for a Next.js application with Clerk for authentication and Google Maps for location services.

## Core Entities

### 1. Users
Stores user account information managed by Clerk authentication.

```typescript
interface User {
  id: string;                     // Clerk user ID (primary key)
  email: string;                  // User's email address
  firstName: string;              // User's first name
  lastName: string;               // User's last name
  phoneNumber: string;            // User's phone number
  profileImageUrl?: string;       // URL to profile image
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: Date;                // Account creation timestamp
  updatedAt: Date;                // Last profile update timestamp
}
```

### 2. WalkerProfiles
Extended profile information for walkers.

```typescript
interface WalkerProfile {
  userId: string;                  // References User.id
  bio?: string;                    // Short bio/description
  address: string;                 // Primary address
  city: string;
  state: string;
  zipCode: string;
  location: {                      // GeoJSON point for geospatial queries
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  rating?: number;                 // Average rating as a walker
  totalWalks: number;              // Total walks completed
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. PetProfiles
Information about pets that will be walked.

```typescript
interface PetProfile {
  id: string;                       // Unique identifier
  ownerId: string;                  // References User.id
  name: string;                     // Pet's name
  breed?: string;                   // Pet breed
  age?: number;                     // Pet age in years
  weight?: number;                  // Weight in pounds
  description?: string;             // Additional notes
  imageUrls: string[];              // Array of image URLs
  specialNeeds?: string;            // Any special care instructions
  isActive: boolean;                // Whether the pet is active
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Walks
Scheduled walk information.

```typescript
interface Walk {
  id: string;                       // Unique identifier
  petId: string;                    // References Pet.id
  walkerId: string;                 // References User.id
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: Date;             // Scheduled start time
  scheduledEnd: Date;               // Scheduled end time
  actualStart?: Date;               // Actual start time
  actualEnd?: Date;                 // Actual end time
  pickupLocation: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  dropoffLocation?: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  distance?: number;              // In miles
  duration?: number;              // In minutes
  price: number;                  // Total price in cents
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string;       // Payment processor reference
  specialInstructions?: string;   // Any special instructions
  cancellationReason?: string;    // If cancelled
  cancelledBy?: string;           // User ID who cancelled
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Reviews
Reviews left by users after walk completion.

```typescript
interface Review {
  id: string;                     // Unique identifier
  walkId: string;                 // References Walk.id
  reviewerId: string;             // References User.id (person leaving review)
  revieweeId: string;             // References User.id (person being reviewed)
  rating: number;                 // 1-5 stars
  comment?: string;               // Review text
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. Notifications
System notifications for users.

```typescript
interface Notification {
  id: string;                     // Unique identifier
  userId: string;                 // References User.id
  type: 'walk_request' | 'walk_confirmed' | 'walk_completed' | 'payment' | 'system';
  title: string;                  // Notification title
  message: string;                // Notification message
  isRead: boolean;                // Whether the notification has been read
  relatedEntityType?: string;     // e.g., 'walk', 'payment'
  relatedEntityId?: string;       // ID of the related entity
  createdAt: Date;
  readAt?: Date;
}
```

## Indexes

1. **Users**
   - `id` (Primary Key)
   - `email` (Unique)

2. **UserProfiles**
   - `userId` (Primary Key, Foreign Key to Users)
   - `location` (2dsphere index for geospatial queries)

3. **Pets**
   - `id` (Primary Key)
   - `ownerId` (Index, Foreign Key to Users)

4. **Walks**
   - `id` (Primary Key)
   - `ownerId` (Index, Foreign Key to Users)
   - `walkerId` (Index, Foreign Key to Users)
   - `scheduledStart` (Index)
   - `status` (Index)
   - `pickupLocation` (2dsphere index)

5. **Reviews**
   - `id` (Primary Key)
   - `walkId` (Unique, Foreign Key to Walks)
   - `reviewerId` (Index, Foreign Key to Users)
   - `revieweeId` (Index, Foreign Key to Users)

6. **Notifications**
   - `id` (Primary Key)
   - `userId` (Index, Foreign Key to Users)
   - `isRead` (Index)
   - `createdAt` (Index, Descending)

## Relationships

1. **User 1:1 UserProfile**
   - A user has one profile
   - A profile belongs to one user

2. **User 1:M Pets**
   - A user can have multiple pets
   - Each pet belongs to one user

3. **User 1:M Walks (as owner)**
   - A user can schedule multiple walks
   - Each walk has one owner

4. **User 1:M Walks (as walker)**
   - A user can be assigned to multiple walks as a walker
   - Each walk has at most one walker

5. **Walk 1:1 Review**
   - Each walk can have one review (from owner to walker)
   - Each review is about one walk

6. **User 1:M Notifications**
   - A user can have multiple notifications
   - Each notification belongs to one user

## Data Access Patterns

1. **Finding Available Walkers**
   - Query UserProfiles with location near walk pickup location
   - Filter by availability and rating
   - Sort by distance and rating

2. **Scheduling a Walk**
   - Create Walk record
   - Create notification for available walkers

3. **Viewing Walk History**
   - Query Walks by ownerId or walkerId
   - Sort by scheduledStart (descending)
   - Include related Pets and Reviews

4. **Processing Payments**
   - Update Walk paymentStatus
   - Create transaction record
   - Send payment confirmation notification

## Security Considerations

1. **Authentication**
   - All API endpoints require valid Clerk authentication
   - User can only access their own data unless explicitly shared

2. **Authorization**
   - Owners can only manage their own pets and walks
   - Walkers can only update walks they are assigned to
   - Reviews can only be left by the walk owner after completion

3. **Data Protection**
   - Sensitive data (payment info) is stored by payment processor
   - Location data is only stored with user consent
   - Personal data is encrypted at rest

## Future Considerations

1. **Performance Optimization**
   - Add read replicas for high-traffic queries
   - Implement caching for frequently accessed data
   - Consider sharding by geographic region

2. **Scalability**
   - Plan for database sharding as user base grows
   - Consider event sourcing for audit trails
   - Implement message queues for async processing

3. **New Features**
   - Support for recurring walks
   - In-app messaging between users
   - Advanced scheduling options
   - Pet health tracking
   - Integration with pet health services
