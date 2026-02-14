"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"

type Tab = "media" | "reviews"

export default function AdminModerationPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [tab, setTab] = useState<Tab>("media")
  const [media, setMedia] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFlagged = useCallback(() => {
    setIsLoading(true)
    api
      .getFlaggedContent()
      .then((data) => {
        setMedia(data.media || [])
        setReviews(data.reviews || [])
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
    fetchFlagged()
  }, [user, authLoading, fetchFlagged])

  async function handleUnflagMedia(id: string) {
    await api.unflagMedia(id).catch(() => {})
    fetchFlagged()
  }

  async function handleRemoveMedia(id: string) {
    await api.removeMedia(id).catch(() => {})
    fetchFlagged()
  }

  async function handleUnflagReview(id: string) {
    await api.unflagReview(id).catch(() => {})
    fetchFlagged()
  }

  async function handleRemoveReview(id: string) {
    await api.removeReview(id).catch(() => {})
    fetchFlagged()
  }

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an admin to manage moderation
        </h3>
        <Button asChild>
          <Link href="/admin/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Content Moderation</h1>

      <div className="flex gap-2">
        <Button
          variant={tab === "media" ? "default" : "outline"}
          onClick={() => setTab("media")}
        >
          Media
        </Button>
        <Button
          variant={tab === "reviews" ? "default" : "outline"}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : tab === "media" ? (
        <div className="space-y-4">
          {media.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No flagged media
              </CardContent>
            </Card>
          ) : (
            media.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{item.type}</Badge>
                      {item.flagReason && (
                        <Badge className="bg-red-100 text-red-800">
                          {item.flagReason}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm truncate">{item.url}</p>
                    <p className="text-xs text-muted-foreground">
                      Artist: {item.artistProfile?.groupName || "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnflagMedia(item.id)}
                    >
                      Unflag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveMedia(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No flagged reviews
              </CardContent>
            </Card>
          ) : (
            reviews.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                      </span>
                      {item.flagReason && (
                        <Badge className="bg-red-100 text-red-800">
                          {item.flagReason}
                        </Badge>
                      )}
                    </div>
                    {item.comment && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.comment}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      By: {item.client?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnflagReview(item.id)}
                    >
                      Unflag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveReview(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
