import type {
  User,
  ArtistProfile,
  ArtForm,
  Booking,
  Review,
  Media,
  AdminStats,
  UploadUrlResponse,
  PaginatedResponse,
} from "@tomoola/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}

export const api = {
  // Auth
  sendOtp: (phone: string) =>
    fetchAPI<{ success: boolean; message: string }>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, otp: string, role?: string) =>
    fetchAPI<{ token: string; user: User }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp, role }),
    }),
  getMe: () => fetchAPI<User>("/auth/me"),

  // Art Forms
  getArtForms: () => fetchAPI<ArtForm[]>("/art-forms"),
  getArtFormBySlug: (slug: string) => fetchAPI<ArtForm>(`/art-forms/${slug}`),

  // Artists
  getArtists: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchAPI<PaginatedResponse<ArtistProfile>>(`/artists${query}`);
  },
  getArtist: (id: string) => fetchAPI<ArtistProfile>(`/artists/${id}`),
  getArtistsByArtForm: (slug: string) =>
    fetchAPI<ArtistProfile[]>(`/artists/art-form/${slug}`),
  createArtistProfile: (data: Partial<ArtistProfile>) =>
    fetchAPI<ArtistProfile>("/artists", { method: "POST", body: JSON.stringify(data) }),
  updateArtistProfile: (id: string, data: Partial<ArtistProfile>) =>
    fetchAPI<ArtistProfile>(`/artists/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Bookings
  createBooking: (data: Partial<Booking>) =>
    fetchAPI<Booking>("/bookings", { method: "POST", body: JSON.stringify(data) }),
  getBooking: (id: string) => fetchAPI<Booking>(`/bookings/${id}`),
  getMyBookings: () => fetchAPI<PaginatedResponse<Booking>>("/bookings/my"),
  getArtistBookings: () => fetchAPI<PaginatedResponse<Booking>>("/bookings/artist"),
  acceptBooking: (id: string) =>
    fetchAPI<Booking>(`/bookings/${id}/accept`, { method: "PATCH" }),
  declineBooking: (id: string) =>
    fetchAPI<Booking>(`/bookings/${id}/decline`, { method: "PATCH" }),
  completeBooking: (id: string) =>
    fetchAPI<Booking>(`/bookings/${id}/complete`, { method: "PATCH" }),
  cancelBooking: (id: string) =>
    fetchAPI<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" }),

  // Availability
  blockDates: (dates: string[]) =>
    fetchAPI<{ success: boolean }>("/availability", {
      method: "POST",
      body: JSON.stringify({ dates }),
    }),
  unblockDates: (dates: string[]) =>
    fetchAPI<{ success: boolean }>("/availability", {
      method: "DELETE",
      body: JSON.stringify({ dates }),
    }),
  getAvailability: (artistProfileId: string, year: number, month: number) =>
    fetchAPI<string[]>(
      `/availability/${artistProfileId}?year=${year}&month=${month}`
    ),

  // Reviews
  createReview: (data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) =>
    fetchAPI<Review>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  getArtistReviews: (artistProfileId: string) =>
    fetchAPI<Review[]>(`/reviews/artist/${artistProfileId}`),

  // Media
  addMedia: (data: { type: string; url: string; caption?: string }) =>
    fetchAPI<Media>("/media", { method: "POST", body: JSON.stringify(data) }),
  deleteMedia: (id: string) =>
    fetchAPI<{ success: boolean }>(`/media/${id}`, { method: "DELETE" }),
  getArtistMedia: (artistProfileId: string) =>
    fetchAPI<Media[]>(`/media/artist/${artistProfileId}`),
  getUploadUrl: (filename: string, contentType: string) =>
    fetchAPI<UploadUrlResponse>("/media/upload-url", {
      method: "POST",
      body: JSON.stringify({ filename, contentType }),
    }),

  // Admin
  getAdminStats: () => fetchAPI<AdminStats>("/admin/stats"),
  getPendingArtists: () => fetchAPI<ArtistProfile[]>("/admin/artists/pending"),
  approveArtist: (id: string) =>
    fetchAPI<ArtistProfile>(`/admin/artists/${id}/approve`, { method: "PATCH" }),
  rejectArtist: (id: string) =>
    fetchAPI<ArtistProfile>(`/admin/artists/${id}/reject`, { method: "PATCH" }),
  getAdminBookings: (status?: string) =>
    fetchAPI<Booking[]>(`/admin/bookings${status ? `?status=${status}` : ""}`),
  getAdminArtForms: () => fetchAPI<ArtForm[]>("/admin/art-forms"),
  createArtForm: (data: Partial<ArtForm>) =>
    fetchAPI<ArtForm>("/admin/art-forms", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateArtForm: (id: string, data: Partial<ArtForm>) =>
    fetchAPI<ArtForm>(`/admin/art-forms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteArtForm: (id: string) =>
    fetchAPI<{ success: boolean }>(`/admin/art-forms/${id}`, { method: "DELETE" }),

  // Moderation
  getFlaggedContent: () => fetchAPI<{ media: Media[]; reviews: Review[] }>("/admin/moderation"),
  flagMedia: (id: string, reason?: string) =>
    fetchAPI<Media>(`/admin/moderation/media/${id}/flag`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  unflagMedia: (id: string) =>
    fetchAPI<Media>(`/admin/moderation/media/${id}/unflag`, { method: "PATCH" }),
  removeMedia: (id: string) =>
    fetchAPI<Media>(`/admin/moderation/media/${id}/remove`, { method: "PATCH" }),
  flagReview: (id: string, reason?: string) =>
    fetchAPI<Review>(`/admin/moderation/reviews/${id}/flag`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  unflagReview: (id: string) =>
    fetchAPI<Review>(`/admin/moderation/reviews/${id}/unflag`, { method: "PATCH" }),
  removeReview: (id: string) =>
    fetchAPI<Review>(`/admin/moderation/reviews/${id}/remove`, { method: "PATCH" }),
};
