"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

type BookingStatus = "Requested" | "Accepted" | "Completed" | "Cancelled";

interface BookingDetail {
  id: string;
  status: BookingStatus;
  artistName: string;
  artForm: string;
  emoji: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  location: string;
  venue: string;
  message: string;
  hasReview: boolean;
  review?: { rating: number; comment: string };
}

const STATIC_BOOKINGS: Record<string, BookingDetail> = {
  "bk-001": {
    id: "bk-001",
    status: "Accepted",
    artistName: "Sri Mahalakshmi Dollu Kunitha",
    artForm: "Dollu Kunitha",
    emoji: "🥁",
    eventDate: "Mar 15, 2026",
    eventTime: "6:00 PM – 8:00 PM",
    eventType: "Wedding Reception",
    location: "Bangalore, Karnataka",
    venue: "Royal Orchid Convention Centre",
    message:
      "We would love a 45-minute performance with traditional drums. Please include 8 performers.",
    hasReview: false,
  },
  "bk-002": {
    id: "bk-002",
    status: "Requested",
    artistName: "Yakshagana Mandali Udupi",
    artForm: "Yakshagana",
    emoji: "🎭",
    eventDate: "Feb 28, 2026",
    eventTime: "7:00 PM – 9:30 PM",
    eventType: "Corporate Event",
    location: "Mangalore, Karnataka",
    venue: "The Gateway Hotel",
    message: "Looking for a 2-hour Yakshagana performance for our annual gala.",
    hasReview: false,
  },
  "bk-003": {
    id: "bk-003",
    status: "Completed",
    artistName: "Pili Vesha Troupe Dakshina",
    artForm: "Huli Vesha",
    emoji: "🐯",
    eventDate: "Jan 20, 2026",
    eventTime: "4:00 PM – 6:00 PM",
    eventType: "Festival Celebration",
    location: "Mysore, Karnataka",
    venue: "Dasara Exhibition Grounds",
    message: "",
    hasReview: true,
    review: {
      rating: 5,
      comment:
        "Absolutely incredible performance! The energy was unmatched and our guests were mesmerized. Highly recommend!",
    },
  },
  "bk-004": {
    id: "bk-004",
    status: "Cancelled",
    artistName: "Veeragase Kalavidaru",
    artForm: "Veeragase",
    emoji: "⚔️",
    eventDate: "Dec 10, 2025",
    eventTime: "5:00 PM – 7:00 PM",
    eventType: "Temple Festival",
    location: "Hubli, Karnataka",
    venue: "Siddheshwar Temple Grounds",
    message: "Need a high-energy performance for the annual temple festival.",
    hasReview: false,
  },
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  Requested: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const TIMELINE_STEPS = ["Requested", "Accepted", "Completed"] as const;

function normalizeStatus(status: string): BookingStatus {
  const s = status.toLowerCase();
  if (s === "requested" || s === "pending") return "Requested";
  if (s === "accepted" || s === "confirmed") return "Accepted";
  if (s === "completed") return "Completed";
  if (s === "cancelled" || s === "declined") return "Cancelled";
  return "Requested";
}

function mapApiBooking(b: any): BookingDetail {
  return {
    id: b.id,
    status: normalizeStatus(b.status),
    artistName: b.artistProfile?.groupName || b.artistName || "Artist",
    artForm: b.artistProfile?.artForms?.[0] || b.artForm || "",
    emoji: "🎭",
    eventDate: b.eventDate
      ? new Date(b.eventDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    eventTime: b.eventTime || "",
    eventType: b.eventType || "Event",
    location: b.location || b.city || "",
    venue: b.venue || "",
    message: b.message || b.notes || "",
    hasReview: !!b.review,
    review: b.review
      ? { rating: b.review.rating, comment: b.review.comment }
      : undefined,
  };
}

function getTimelineIndex(status: BookingStatus): number {
  if (status === "Cancelled") return -1;
  return TIMELINE_STEPS.indexOf(
    status as (typeof TIMELINE_STEPS)[number]
  );
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`text-2xl transition ${
            interactive
              ? "cursor-pointer hover:scale-110"
              : "cursor-default"
          } ${star <= rating ? "text-accent" : "text-muted-foreground/30"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    if (authLoading) return;

    api
      .getBooking(resolvedParams.id)
      .then((data) => setBooking(mapApiBooking(data)))
      .catch(() => {
        const staticBooking = STATIC_BOOKINGS[resolvedParams.id];
        if (staticBooking) setBooking(staticBooking);
      })
      .finally(() => setIsLoading(false));
  }, [resolvedParams, authLoading]);

  async function handleSubmitReview() {
    if (!booking || reviewRating === 0 || submitting) return;
    setSubmitting(true);
    try {
      await api.createReview({
        bookingId: booking.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login to view booking details
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || !resolvedParams) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Booking not found
        </h3>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard">← Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const timelineIdx = getTimelineIndex(booking.status);
  const showReviewForm =
    booking.status === "Completed" && !booking.hasReview && !submitted;
  const showExistingReview = booking.hasReview && booking.review;

  return (
    <div>
      <Button asChild variant="ghost" className="mb-6 -ml-2 text-muted-foreground">
        <Link href="/dashboard">← Back to Bookings</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{booking.emoji}</span>
              <div>
                <CardTitle className="font-serif text-xl">
                  {booking.artistName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {booking.artForm}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-sm px-3 py-1 ${STATUS_STYLES[booking.status]}`}
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Date
              </p>
              <p className="text-sm font-medium">{booking.eventDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Time
              </p>
              <p className="text-sm font-medium">{booking.eventTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Event Type
              </p>
              <p className="text-sm font-medium">{booking.eventType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="text-sm font-medium">{booking.location}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Venue
              </p>
              <p className="text-sm font-medium">{booking.venue}</p>
            </div>
          </div>

          {booking.message && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Message
              </p>
              <p className="text-sm">{booking.message}</p>
            </div>
          )}

          <Separator />

          {booking.status !== "Cancelled" ? (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                Timeline
              </p>
              <div className="flex items-center gap-0">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          i <= timelineIdx
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i <= timelineIdx ? "✓" : i + 1}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          i <= timelineIdx
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`w-16 sm:w-24 h-0.5 mx-2 ${
                          i < timelineIdx ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This booking was cancelled.
            </p>
          )}

          {showExistingReview && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Your Review
                </p>
                <StarRating rating={booking.review!.rating} />
                <p className="text-sm mt-2">{booking.review!.comment}</p>
              </div>
            </>
          )}

          {showReviewForm && (
            <>
              <Separator />
              <div>
                <h3 className="font-serif text-lg font-semibold mb-4">
                  Leave a Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rating</p>
                    <StarRating
                      rating={reviewRating}
                      onRate={setReviewRating}
                      interactive
                    />
                  </div>
                  <Textarea
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={reviewRating === 0 || submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {submitted && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Your Review
                </p>
                <StarRating rating={reviewRating} />
                <p className="text-sm mt-2">{reviewComment}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
