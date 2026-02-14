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
    fetchAPI<{ message: string }>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, otp: string, role?: string) =>
    fetchAPI<{ token: string; user: any }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp, role }),
    }),
  getMe: () => fetchAPI<any>("/auth/me"),

  // Art Forms
  getArtForms: () => fetchAPI<any[]>("/art-forms"),
  getArtFormBySlug: (slug: string) => fetchAPI<any>(`/art-forms/${slug}`),

  // Artists
  getArtists: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchAPI<any[]>(`/artists${query}`);
  },
  getArtist: (id: string) => fetchAPI<any>(`/artists/${id}`),
  getArtistsByArtForm: (slug: string) =>
    fetchAPI<any[]>(`/artists/art-form/${slug}`),
  createArtistProfile: (data: any) =>
    fetchAPI<any>("/artists", { method: "POST", body: JSON.stringify(data) }),
  updateArtistProfile: (id: string, data: any) =>
    fetchAPI<any>(`/artists/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Bookings
  createBooking: (data: any) =>
    fetchAPI<any>("/bookings", { method: "POST", body: JSON.stringify(data) }),
  getBooking: (id: string) => fetchAPI<any>(`/bookings/${id}`),
  getMyBookings: () => fetchAPI<any[]>("/bookings/my"),
  getArtistBookings: () => fetchAPI<any[]>("/bookings/artist"),
  acceptBooking: (id: string) =>
    fetchAPI<any>(`/bookings/${id}/accept`, { method: "PATCH" }),
  declineBooking: (id: string) =>
    fetchAPI<any>(`/bookings/${id}/decline`, { method: "PATCH" }),
  completeBooking: (id: string) =>
    fetchAPI<any>(`/bookings/${id}/complete`, { method: "PATCH" }),
  cancelBooking: (id: string) =>
    fetchAPI<any>(`/bookings/${id}/cancel`, { method: "PATCH" }),

  // Availability
  blockDates: (dates: string[]) =>
    fetchAPI<any>("/availability", {
      method: "POST",
      body: JSON.stringify({ dates }),
    }),
  unblockDates: (dates: string[]) =>
    fetchAPI<any>("/availability", {
      method: "DELETE",
      body: JSON.stringify({ dates }),
    }),
  getAvailability: (artistProfileId: string, year: number, month: number) =>
    fetchAPI<any>(
      `/availability/${artistProfileId}?year=${year}&month=${month}`
    ),

  // Reviews
  createReview: (data: {
    bookingId: string;
    rating: number;
    comment?: string;
  }) =>
    fetchAPI<any>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  getArtistReviews: (artistProfileId: string) =>
    fetchAPI<any[]>(`/reviews/artist/${artistProfileId}`),

  // Media
  addMedia: (data: { type: string; url: string; caption?: string }) =>
    fetchAPI<any>("/media", { method: "POST", body: JSON.stringify(data) }),
  deleteMedia: (id: string) =>
    fetchAPI<any>(`/media/${id}`, { method: "DELETE" }),
  getArtistMedia: (artistProfileId: string) =>
    fetchAPI<any[]>(`/media/artist/${artistProfileId}`),
  getUploadUrl: (filename: string, contentType: string) =>
    fetchAPI<{ uploadUrl: string; publicUrl: string; key: string }>("/media/upload-url", {
      method: "POST",
      body: JSON.stringify({ filename, contentType }),
    }),

  // Admin
  getAdminStats: () => fetchAPI<any>("/admin/stats"),
  getPendingArtists: () => fetchAPI<any[]>("/admin/artists/pending"),
  approveArtist: (id: string) =>
    fetchAPI<any>(`/admin/artists/${id}/approve`, { method: "PATCH" }),
  rejectArtist: (id: string) =>
    fetchAPI<any>(`/admin/artists/${id}/reject`, { method: "PATCH" }),
  getAdminBookings: (status?: string) =>
    fetchAPI<any[]>(`/admin/bookings${status ? `?status=${status}` : ""}`),
  getAdminArtForms: () => fetchAPI<any[]>("/admin/art-forms"),
  createArtForm: (data: any) =>
    fetchAPI<any>("/admin/art-forms", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateArtForm: (id: string, data: any) =>
    fetchAPI<any>(`/admin/art-forms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteArtForm: (id: string) =>
    fetchAPI<any>(`/admin/art-forms/${id}`, { method: "DELETE" }),

  // Moderation
  getFlaggedContent: () => fetchAPI<any>("/admin/moderation"),
  flagMedia: (id: string, reason?: string) =>
    fetchAPI<any>(`/admin/moderation/media/${id}/flag`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  unflagMedia: (id: string) =>
    fetchAPI<any>(`/admin/moderation/media/${id}/unflag`, { method: "PATCH" }),
  removeMedia: (id: string) =>
    fetchAPI<any>(`/admin/moderation/media/${id}/remove`, { method: "PATCH" }),
  flagReview: (id: string, reason?: string) =>
    fetchAPI<any>(`/admin/moderation/reviews/${id}/flag`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  unflagReview: (id: string) =>
    fetchAPI<any>(`/admin/moderation/reviews/${id}/unflag`, { method: "PATCH" }),
  removeReview: (id: string) =>
    fetchAPI<any>(`/admin/moderation/reviews/${id}/remove`, { method: "PATCH" }),
};
