"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"

const staticStats = [
  { label: "Total Artists", value: "32" },
  { label: "Pending Approvals", value: "5", badge: true },
  { label: "Total Bookings", value: "156" },
  { label: "Completed Events", value: "124" },
  { label: "Total Reviews", value: "89" },
]

const staticRecentBookings = [
  { client: "Rajesh Kumar", artist: "Dollu Masters", date: "2026-02-15", event: "Wedding", status: "Requested" },
  { client: "Priya Sharma", artist: "Yaksha Kala Troupe", date: "2026-02-18", event: "Corporate Event", status: "Accepted" },
  { client: "Anil Desai", artist: "Huli Vesha Group", date: "2026-02-20", event: "Festival", status: "Completed" },
  { client: "Meena Rao", artist: "Veeragase Ensemble", date: "2026-02-22", event: "Temple Event", status: "Cancelled" },
  { client: "Suresh Patil", artist: "Kamsale Devotees", date: "2026-02-25", event: "Reception", status: "Accepted" },
]

function statusColor(status: string) {
  switch (status) {
    case "Requested":
      return "bg-blue-100 text-blue-800"
    case "Accepted":
      return "bg-green-100 text-green-800"
    case "Completed":
      return "bg-gray-100 text-gray-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminOverviewPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState(staticStats)
  const [recentBookings, setRecentBookings] = useState(staticRecentBookings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ADMIN") {
      setIsLoading(false)
      return
    }
    api
      .getAdminStats()
      .then((data) => {
        if (data) {
          const mapped = [
            { label: "Total Artists", value: String(data.totalArtists ?? 0) },
            {
              label: "Pending Approvals",
              value: String(data.pendingApprovals ?? 0),
              badge: (data.pendingApprovals ?? 0) > 0,
            },
            { label: "Total Bookings", value: String(data.totalBookings ?? 0) },
            { label: "Completed Events", value: String(data.completedEvents ?? 0) },
            { label: "Total Reviews", value: String(data.totalReviews ?? 0) },
          ]
          setStats(mapped)
          if (data.recentBookings?.length) {
            setRecentBookings(
              data.recentBookings.map((b: any) => ({
                client: b.user?.name || b.clientName || "Client",
                artist:
                  b.artistProfile?.groupName || b.artistName || "Artist",
                date: b.eventDate || "",
                event: b.eventType || "Event",
                status: b.status
                  ? b.status.charAt(0).toUpperCase() +
                    b.status.slice(1).toLowerCase()
                  : "Requested",
              }))
            )
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user, authLoading])

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an admin to view the dashboard
        </h3>
        <Button asChild>
          <Link href="/admin/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Dashboard Overview</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.badge && (
                    <Badge className="bg-red-500 text-white text-[10px]">New</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {booking.client} → {booking.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date} &middot; {booking.event}
                      </p>
                    </div>
                    <Badge variant="outline" className={statusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/artists">👥 Approve Artists</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/bookings">📋 View Bookings</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/art-forms">🎭 Manage Art Forms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
