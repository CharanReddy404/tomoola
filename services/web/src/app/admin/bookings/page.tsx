"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

type BookingStatus = "Requested" | "Accepted" | "Completed" | "Cancelled"

interface Booking {
  id: string
  client: string
  artist: string
  eventDate: string
  eventType: string
  location: string
  status: BookingStatus
}

const sampleBookings: Booking[] = [
  { id: "1", client: "Rajesh Kumar", artist: "Dollu Masters", eventDate: "2026-02-15", eventType: "Wedding", location: "Bangalore", status: "Requested" },
  { id: "2", client: "Priya Sharma", artist: "Yaksha Kala Troupe", eventDate: "2026-02-18", eventType: "Corporate Event", location: "Mangalore", status: "Accepted" },
  { id: "3", client: "Anil Desai", artist: "Huli Vesha Group", eventDate: "2026-02-10", eventType: "Festival", location: "Udupi", status: "Completed" },
  { id: "4", client: "Meena Rao", artist: "Veeragase Ensemble", eventDate: "2026-02-22", eventType: "Temple Event", location: "Dharwad", status: "Cancelled" },
  { id: "5", client: "Suresh Patil", artist: "Kamsale Devotees", eventDate: "2026-02-25", eventType: "Reception", location: "Mysore", status: "Accepted" },
  { id: "6", client: "Deepa Hegde", artist: "Pata Kunitha Stars", eventDate: "2026-03-01", eventType: "Cultural Event", location: "Hubli", status: "Requested" },
  { id: "7", client: "Vikram Shetty", artist: "Garudi Gombe Players", eventDate: "2026-02-08", eventType: "Private Party", location: "Bangalore", status: "Completed" },
  { id: "8", client: "Lakshmi Nair", artist: "Chenda Beats", eventDate: "2026-03-05", eventType: "House Warming", location: "Mangalore", status: "Requested" },
]

function normalizeStatus(status: string): BookingStatus {
  const s = status.toLowerCase()
  if (s === "requested" || s === "pending") return "Requested"
  if (s === "accepted" || s === "confirmed") return "Accepted"
  if (s === "completed") return "Completed"
  if (s === "cancelled" || s === "declined") return "Cancelled"
  return "Requested"
}

function mapApiBooking(b: any): Booking {
  return {
    id: b.id,
    client: b.user?.name || b.clientName || "Client",
    artist: b.artistProfile?.groupName || b.artistName || "Artist",
    eventDate: b.eventDate
      ? new Date(b.eventDate).toISOString().split("T")[0]
      : "",
    eventType: b.eventType || "Event",
    location: b.location || b.city || "",
    status: normalizeStatus(b.status),
  }
}

const statuses = ["All", "Requested", "Accepted", "Completed", "Cancelled"] as const

function statusColor(status: BookingStatus) {
  switch (status) {
    case "Requested":
      return "bg-blue-100 text-blue-800"
    case "Accepted":
      return "bg-green-100 text-green-800"
    case "Completed":
      return "bg-gray-100 text-gray-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
  }
}

export default function AdminBookingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [filter, setFilter] = useState<string>("All")
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ADMIN") {
      setIsLoading(false)
      return
    }
    const statusParam = filter === "All" ? undefined : filter.toUpperCase()
    api
      .getAdminBookings(statusParam)
      .then((data) => {
        if (data && data.length > 0) {
          setBookings(data.map(mapApiBooking))
        } else {
          setBookings(sampleBookings)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user, authLoading, filter])

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an admin to view bookings
        </h3>
        <Button asChild>
          <Link href="/admin/login">Login</Link>
        </Button>
      </div>
    )
  }

  const filtered =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-semibold">All Bookings</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No bookings found.
            </p>
          )}
          {filtered.map((booking) => (
            <Card key={booking.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {booking.client} → {booking.artist}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.eventDate} &middot; {booking.eventType} &middot; {booking.location}
                  </p>
                </div>
                <Badge variant="outline" className={statusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
