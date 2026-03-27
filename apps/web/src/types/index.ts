// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'walker';

export type WalkStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type NotificationType =
  | 'walk_request'
  | 'walk_confirmed'
  | 'walk_started'
  | 'walk_completed'
  | 'walk_cancelled'
  | 'payment'
  | 'review'
  | 'system';

export type WalkDuration = 30 | 60 | 90;

// ─── GeoJSON ─────────────────────────────────────────────────────────────────

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  imageUrl: string;
  role: UserRole | null;
  onboardingComplete: boolean;
  notificationPrefs: {
    walkRequests: boolean;
    walkUpdates: boolean;
    payments: boolean;
    marketing: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WalkerProfile {
  id: string;
  userId: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  location: GeoPoint;
  rating: number;
  totalWalks: number;
  serviceRadius: number; // miles
  isActive: boolean;
  pricing: {
    [K in WalkDuration]?: number; // cents
  };
  availability: {
    [day: string]: boolean; // 'monday' → true
  };
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface PetProfile {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  age: number;
  weight: number; // lbs
  description: string;
  specialNeeds: string;
  vetName: string;
  vetPhone: string;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Walk {
  id: string;
  ownerId: string;
  walkerId: string;
  petIds: string[];
  status: WalkStatus;
  scheduledStart: string; // ISO
  scheduledEnd: string; // ISO
  duration: WalkDuration;
  distance: number; // miles
  price: number; // cents
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentIntentId: string;
  pickupLocation: GeoPoint;
  currentLocation: GeoPoint | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  walkId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  read: boolean;
  createdAt: string;
}

// ─── View Models ─────────────────────────────────────────────────────────────

/** Walker profile enriched with user info — used in discovery */
export interface WalkerWithUser extends WalkerProfile {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'imageUrl'>;
  distanceMiles?: number;
}

/** Walk enriched with walker + owner user info */
export interface WalkDetail extends Walk {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'imageUrl'>;
  walker: Pick<User, 'id' | 'firstName' | 'lastName' | 'imageUrl'>;
  pets: PetProfile[];
}

// ─── Form Input Types ─────────────────────────────────────────────────────────

export interface OwnerProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notificationPrefs: User['notificationPrefs'];
}

export interface WalkerProfileInput {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  serviceRadius: number;
}

export interface PetProfileInput {
  name: string;
  breed: string;
  age: number;
  weight: number;
  description: string;
  specialNeeds: string;
  vetName: string;
  vetPhone: string;
}

export interface BookingInput {
  walkerId: string;
  petIds: string[];
  scheduledStart: string;
  duration: WalkDuration;
  notes: string;
}
