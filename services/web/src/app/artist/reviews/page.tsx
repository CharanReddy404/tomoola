"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

interface Review {
  id: string
  client: string
  date: string
  rating: number
  comment: string
}

const staticReviews: Review[] = [
  {
    id: "1",
    client: "Ananya Sharma",
    date: "Jan 28, 2026",
    rating: 5,
    comment:
      "Absolutely stunning performance! The Dollu Kunitha was the highlight of our wedding. Every guest was mesmerized. Highly recommend!",
  },
  {
    id: "2",
    client: "Vikram Patel",
    date: "Jan 15, 2026",
    rating: 5,
    comment:
      "Very professional and punctual. The team arrived on time and delivered an energetic performance that kept the crowd engaged throughout.",
  },
  {
    id: "3",
    client: "Deepa Rao",
    date: "Dec 20, 2025",
    rating: 4,
    comment:
      "Great folk dance performance for our temple festival. The crowd loved it. Would have been perfect with a slightly longer set.",
  },
  {
    id: "4",
    client: "Suresh Kumar",
    date: "Nov 10, 2025",
    rating: 5,
    comment:
      "Booked them for a corporate cultural event. The performance was authentic and captivating. Will definitely book again!",
  },
]

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  )
}

export default function ReviewsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(staticReviews)
  const [isLoading, setIsLoading] = useState(true)

  const artistProfileId = user?.artistProfile?.id

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ARTIST") {
      setIsLoading(false)
      return
    }
    if (!artistProfileId) {
      setIsLoading(false)
      return
    }
    api
      .getArtistReviews(artistProfileId)
      .then((data) => {
        if (data && data.length > 0) {
          setReviews(
            data.map((r: any) => ({
              id: String(r.id),
              client: r.user?.name || r.clientName || "Client",
              date: r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "",
              rating: r.rating,
              comment: r.comment || "",
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user, authLoading, artistProfileId])

  if (!authLoading && (!user || user.role !== "ARTIST")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an artist to view reviews
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Reviews</h1>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="flex items-center gap-4 pt-0">
              <span className="text-5xl font-bold">{averageRating}</span>
              <div>
                <Stars count={Math.round(Number(averageRating))} />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.client}</p>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <Stars count={review.rating} />
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
