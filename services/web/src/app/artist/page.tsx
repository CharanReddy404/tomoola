"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

const staticStats = [
  { label: "Upcoming Bookings", value: "3", icon: "📅" },
  { label: "Total Events", value: "85", icon: "🎭" },
  { label: "Average Rating", value: "4.9", icon: "⭐" },
  { label: "Total Reviews", value: "12", icon: "💬" },
]

const staticRecentBookings = [
  {
    id: "1",
    emoji: "🎉",
    client: "Ananya Sharma",
    event: "Wedding Reception",
    date: "Feb 15, 2026",
    location: "Bangalore",
    status: "REQUESTED" as const,
  },
  {
    id: "2",
    emoji: "🏢",
    client: "Vikram Patel",
    event: "Corporate Event",
    date: "Feb 20, 2026",
    location: "Mysore",
    status: "ACCEPTED" as const,
  },
  {
    id: "3",
    emoji: "🎊",
    client: "Deepa Rao",
    event: "Festival Celebration",
    date: "Mar 1, 2026",
    location: "Hubli",
    status: "REQUESTED" as const,
  },
  {
    id: "4",
    emoji: "🎂",
    client: "Suresh Kumar",
    event: "Birthday Party",
    date: "Mar 10, 2026",
    location: "Bangalore",
    status: "COMPLETED" as const,
  },
]

interface BookingItem {
  id: string
  emoji: string
  client: string
  event: string
  date: string
  location: string
  status: "REQUESTED" | "ACCEPTED" | "COMPLETED" | "DECLINED"
}

function mapApiBooking(b: any): BookingItem {
  return {
    id: b.id,
    emoji: "🎉",
    client: b.user?.name || b.clientName || "Client",
    event: b.eventType || "Event",
    date: b.eventDate
      ? new Date(b.eventDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    location: b.location || b.city || "",
    status: (b.status || "REQUESTED").toUpperCase() as BookingItem["status"],
  }
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  REQUESTED: "outline",
  ACCEPTED: "default",
  COMPLETED: "secondary",
}

export default function ArtistDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState(staticStats)
  const [bookings, setBookings] = useState<BookingItem[]>(staticRecentBookings)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchBookings = useCallback(() => {
    api
      .getArtistBookings()
      .then((data) => {
        const mapped = data.map(mapApiBooking)
        setBookings(mapped.length > 0 ? mapped.slice(0, 5) : staticRecentBookings)
        const upcoming = mapped.filter(
          (b) => b.status === "REQUESTED" || b.status === "ACCEPTED"
        ).length
        const completed = mapped.filter((b) => b.status === "COMPLETED").length
        if (mapped.length > 0) {
          setStats([
            { label: "Upcoming Bookings", value: String(upcoming), icon: "📅" },
            { label: "Total Events", value: String(mapped.length), icon: "🎭" },
            { label: "Average Rating", value: "4.9", icon: "⭐" },
            { label: "Completed", value: String(completed), icon: "✅" },
          ])
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ARTIST") {
      setIsLoading(false)
      return
    }
    fetchBookings()
  }, [user, authLoading, fetchBookings])

  async function handleAccept(id: string) {
    setActionLoading(id)
    try {
      await api.acceptBooking(id)
      fetchBookings()
    } catch {
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDecline(id: string) {
    setActionLoading(id)
    try {
      await api.declineBooking(id)
      fetchBookings()
    } catch {
    } finally {
      setActionLoading(null)
    }
  }

  if (!authLoading && (!user || user.role !== "ARTIST")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an artist to view your dashboard
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">
        Welcome back{user?.name ? `, ${user.name}` : ""}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border p-4"
                >
                  <span className="text-xl">{booking.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{booking.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.event}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{booking.date}</p>
                    <p>{booking.location}</p>
                  </div>
                  <Badge variant={statusVariant[booking.status] || "outline"}>
                    {booking.status}
                  </Badge>
                  {booking.status === "REQUESTED" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoading === booking.id}
                        onClick={() => handleAccept(booking.id)}
                      >
                        {actionLoading === booking.id ? "..." : "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={actionLoading === booking.id}
                        onClick={() => handleDecline(booking.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
