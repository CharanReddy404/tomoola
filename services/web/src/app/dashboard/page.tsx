"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

type BookingStatus = "Requested" | "Accepted" | "Completed" | "Cancelled";

interface Booking {
  id: string;
  emoji: string;
  artistGroup: string;
  eventType: string;
  eventDate: string;
  location: string;
  status: BookingStatus;
}

const STATIC_BOOKINGS: Booking[] = [
  {
    id: "bk-001",
    emoji: "🥁",
    artistGroup: "Sri Mahalakshmi Dollu Kunitha",
    eventType: "Wedding Reception",
    eventDate: "Mar 15, 2026",
    location: "Bangalore, Karnataka",
    status: "Accepted",
  },
  {
    id: "bk-002",
    emoji: "🎭",
    artistGroup: "Yakshagana Mandali Udupi",
    eventType: "Corporate Event",
    eventDate: "Feb 28, 2026",
    location: "Mangalore, Karnataka",
    status: "Requested",
  },
  {
    id: "bk-003",
    emoji: "🐯",
    artistGroup: "Pili Vesha Troupe Dakshina",
    eventType: "Festival Celebration",
    eventDate: "Jan 20, 2026",
    location: "Mysore, Karnataka",
    status: "Completed",
  },
  {
    id: "bk-004",
    emoji: "⚔️",
    artistGroup: "Veeragase Kalavidaru",
    eventType: "Temple Festival",
    eventDate: "Dec 10, 2025",
    location: "Hubli, Karnataka",
    status: "Cancelled",
  },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  Requested: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

function normalizeStatus(status: string): BookingStatus {
  const s = status.toLowerCase();
  if (s === "requested" || s === "pending") return "Requested";
  if (s === "accepted" || s === "confirmed") return "Accepted";
  if (s === "completed") return "Completed";
  if (s === "cancelled" || s === "declined") return "Cancelled";
  return "Requested";
}

function mapApiBooking(b: any): Booking {
  return {
    id: b.id,
    emoji: "🎭",
    artistGroup: b.artistProfile?.groupName || b.artistName || "Artist",
    eventType: b.eventType || "Event",
    eventDate: b.eventDate
      ? new Date(b.eventDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    location: b.location || b.city || "",
    status: normalizeStatus(b.status),
  };
}

function filterBookings(bookings: Booking[], filter: Filter): Booking[] {
  switch (filter) {
    case "Upcoming":
      return bookings.filter(
        (b) => b.status === "Requested" || b.status === "Accepted"
      );
    case "Completed":
      return bookings.filter((b) => b.status === "Completed");
    case "Cancelled":
      return bookings.filter((b) => b.status === "Cancelled");
    default:
      return bookings;
  }
}

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [bookings, setBookings] = useState<Booking[]>(STATIC_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "CLIENT") {
      setIsLoading(false);
      return;
    }
    api
      .getMyBookings()
      .then((data) => setBookings(data.map(mapApiBooking)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user, authLoading]);

  if (!authLoading && (!user || user.role !== "CLIENT")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as a client to view your bookings
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const filtered = filterBookings(bookings, activeFilter);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="font-serif text-xl font-semibold mb-2">
            No bookings yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start by browsing our talented folk artists
          </p>
          <Button asChild>
            <Link href="/folk-dances">Browse Artists</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id} className="py-0">
              <CardContent className="flex items-center gap-4 py-5">
                <span className="text-3xl shrink-0">{booking.emoji}</span>

                <div className="flex-1 min-w-0">
                  <p className="font-serif font-semibold text-base truncate">
                    {booking.artistGroup}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.eventType} · {booking.eventDate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.location}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={STATUS_STYLES[booking.status]}
                  >
                    {booking.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
