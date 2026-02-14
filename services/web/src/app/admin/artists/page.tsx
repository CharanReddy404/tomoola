"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

type ArtistStatus = "pending" | "approved" | "rejected"

interface Artist {
  id: string
  name: string
  artForm: string
  location: string
  kyc: "Verified" | "Pending" | "Not Submitted"
  appliedDate: string
  status: ArtistStatus
}

const sampleArtists: Artist[] = [
  { id: "1", name: "Dollu Masters", artForm: "Dollu Kunitha", location: "Hubli", kyc: "Verified", appliedDate: "2026-01-28", status: "pending" },
  { id: "2", name: "Yaksha Kala Troupe", artForm: "Yakshagana", location: "Mangalore", kyc: "Pending", appliedDate: "2026-01-30", status: "pending" },
  { id: "3", name: "Huli Vesha Group", artForm: "Huli Vesha", location: "Udupi", kyc: "Verified", appliedDate: "2026-01-15", status: "approved" },
  { id: "4", name: "Veeragase Ensemble", artForm: "Veeragase", location: "Dharwad", kyc: "Verified", appliedDate: "2026-01-10", status: "approved" },
  { id: "5", name: "Karnataka Puppeteers", artForm: "Garudi Gombe", location: "Mysore", kyc: "Not Submitted", appliedDate: "2026-02-01", status: "rejected" },
]

function mapApiArtist(a: any): Artist {
  return {
    id: a.id,
    name: a.groupName || a.user?.name || "Artist",
    artForm: a.artForms?.[0] || a.artForm || "",
    location: a.basedIn || a.location || "",
    kyc: a.kycStatus === "VERIFIED"
      ? "Verified"
      : a.kycStatus === "PENDING"
        ? "Pending"
        : "Not Submitted",
    appliedDate: a.createdAt
      ? new Date(a.createdAt).toISOString().split("T")[0]
      : "",
    status: (a.status || "pending").toLowerCase() as ArtistStatus,
  }
}

const tabs: { label: string; value: ArtistStatus }[] = [
  { label: "Pending Approval", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
]

function kycBadgeClass(kyc: Artist["kyc"]) {
  switch (kyc) {
    case "Verified":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Not Submitted":
      return "bg-gray-100 text-gray-600"
  }
}

export default function AdminArtistsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<ArtistStatus>("pending")
  const [artists, setArtists] = useState<Artist[]>(sampleArtists)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchArtists = useCallback(() => {
    api
      .getPendingArtists()
      .then((data) => {
        if (data && data.length > 0) {
          setArtists(data.map(mapApiArtist))
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ADMIN") {
      setIsLoading(false)
      return
    }
    fetchArtists()
  }, [user, authLoading, fetchArtists])

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await api.approveArtist(id)
      fetchArtists()
    } catch {
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id)
    try {
      await api.rejectArtist(id)
      fetchArtists()
    } catch {
    } finally {
      setActionLoading(null)
    }
  }

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an admin to manage artists
        </h3>
        <Button asChild>
          <Link href="/admin/login">Login</Link>
        </Button>
      </div>
    )
  }

  const filtered = artists.filter((a) => a.status === activeTab)

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Artist Management</h1>

      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No artists in this category.
            </p>
          )}
          {filtered.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 pt-0">
                <Avatar size="lg">
                  <AvatarFallback>{artist.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {artist.artForm} &middot; {artist.location}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={kycBadgeClass(artist.kyc)}>
                      KYC: {artist.kyc}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Applied: {artist.appliedDate}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {activeTab === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={actionLoading === artist.id}
                        onClick={() => handleApprove(artist.id)}
                      >
                        {actionLoading === artist.id ? "..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={actionLoading === artist.id}
                        onClick={() => handleReject(artist.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Suspend
                      </Button>
                    </>
                  )}
                  {activeTab === "rejected" && (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
