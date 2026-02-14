"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

type BookingStatus = "REQUESTED" | "ACCEPTED" | "COMPLETED" | "DECLINED"

interface Booking {
  id: string
  client: string
  event: string
  date: string
  location: string
  status: BookingStatus
}

const staticBookings: Booking[] = [
  { id: "1", client: "Ananya Sharma", event: "Wedding Reception", date: "Feb 15, 2026", location: "Bangalore", status: "REQUESTED" },
  { id: "2", client: "Vikram Patel", event: "Corporate Event", date: "Feb 20, 2026", location: "Mysore", status: "ACCEPTED" },
  { id: "3", client: "Deepa Rao", event: "Festival Celebration", date: "Mar 1, 2026", location: "Hubli", status: "REQUESTED" },
  { id: "4", client: "Suresh Kumar", event: "Birthday Party", date: "Mar 10, 2026", location: "Bangalore", status: "COMPLETED" },
  { id: "5", client: "Priya Hegde", event: "Temple Inauguration", date: "Jan 5, 2026", location: "Udupi", status: "COMPLETED" },
  { id: "6", client: "Rahul Menon", event: "College Fest", date: "Jan 20, 2026", location: "Mangalore", status: "DECLINED" },
]

function mapApiBooking(b: any): Booking {
  return {
    id: b.id,
    client: b.client?.name || b.clientName || "Client",
    event: b.eventType || "Event",
    date: b.eventDate
      ? new Date(b.eventDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    location: b.eventLocation || "",
    status: (b.status || "REQUESTED").toUpperCase() as BookingStatus,
  }
}

const filters = ["All", "Pending", "Accepted", "Completed"] as const

const filterMap: Record<(typeof filters)[number], BookingStatus | null> = {
  All: null,
  Pending: "REQUESTED",
  Accepted: "ACCEPTED",
  Completed: "COMPLETED",
}

const statusVariant: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
  REQUESTED: "outline",
  ACCEPTED: "default",
  COMPLETED: "secondary",
  DECLINED: "destructive",
}

export default function BookingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All")
  const [bookings, setBookings] = useState<Booking[]>(staticBookings)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchBookings = useCallback(() => {
    api
      .getArtistBookings()
      .then((data) => {
        const mapped = data.map(mapApiBooking)
        setBookings(mapped.length > 0 ? mapped : staticBookings)
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
          Please login as an artist to view bookings
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  const filtered = activeFilter === "All"
    ? bookings
    : bookings.filter((b) => b.status === filterMap[activeFilter])

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Bookings</h1>

      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{booking.client}</p>
                    <p className="text-sm text-muted-foreground">{booking.event}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{booking.date}</p>
                    <p>{booking.location}</p>
                  </div>
                  <Badge variant={statusVariant[booking.status]}>
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
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No bookings found.</p>
          )}
        </div>
      )}
    </div>
  )
}
