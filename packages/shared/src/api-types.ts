export interface User {
  id: string;
  phone: string;
  name: string;
  role: "CLIENT" | "ARTIST" | "ADMIN";
  email?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  artistProfile?: ArtistProfile;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  groupName: string;
  basePrice: number;
  priceUnit: string;
  basedIn: string;
  description?: string;
  groupSize?: number;
  serviceAreas: string[];
  languages: string[];
  experience?: number;
  kycStatus: "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED";
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  artForms?: ArtistArtForm[];
  media?: Media[];
  reviews?: Review[];
  averageRating?: number | null;
}

export interface ArtistArtForm {
  id: string;
  artistProfileId: string;
  artFormId: string;
  artForm: ArtForm;
  createdAt: string;
}

export interface ArtForm {
  id: string;
  name: string;
  slug: string;
  description?: string;
  region?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  clientId: string;
  artistProfileId: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  eventLocation: string;
  venueAddress?: string;
  duration?: number;
  message?: string;
  status: "REQUESTED" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  artistProfile?: ArtistProfile;
  review?: Review;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  artistProfileId: string;
  rating: number;
  comment?: string;
  isFlagged: boolean;
  flagReason?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
  client?: User;
  booking?: Booking;
}

export interface Media {
  id: string;
  artistProfileId: string;
  type: "PHOTO" | "VIDEO_LINK";
  url: string;
  caption?: string;
  sortOrder: number;
  isFlagged: boolean;
  flagReason?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  artistProfileId: string;
  date: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalArtists: number;
  approvedArtists: number;
  pendingArtists: number;
  totalBookings: number;
  completedBookings: number;
  totalReviews: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
