"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ARTIST = {
  id: "artist-1",
  name: "Sri Mahadeshwara Troupe",
  artForm: "Dollu Kunitha",
  verified: true,
  rating: 4.8,
  reviews: 24,
  events: 150,
  experience: "12 years",
  price: 15000,
  groupSize: "8-12 members",
  duration: "45-90 minutes",
  basedIn: "Mysore, Karnataka",
  travelsTo: "All over Karnataka, Goa, Tamil Nadu",
  languages: "Kannada, Hindi, English",
  description:
    "Sri Mahadeshwara Troupe is a renowned Dollu Kunitha group from Mysore with over 12 years of experience. Our group consists of 10 highly skilled drummers who deliver powerful and captivating performances. We have performed at weddings, corporate events, cultural festivals, and temple events across Karnataka and neighboring states. Our performances combine traditional rhythms with energetic choreography that leaves audiences spellbound.",
};

const REVIEWS = [
  {
    name: "Priya Sharma",
    date: "Jan 2026",
    rating: 5,
    comment:
      "Absolutely amazing performance at our wedding! The energy was incredible and all our guests were mesmerized. Highly recommend!",
  },
  {
    name: "Rajesh Kumar",
    date: "Dec 2025",
    rating: 5,
    comment:
      "Booked them for a corporate event and they were professional from start to finish. The coordination and showmanship were top-notch.",
  },
  {
    name: "Meena Rao",
    date: "Nov 2025",
    rating: 4,
    comment:
      "Great performance at our temple festival. The troupe was punctual and their drumming was phenomenal. Will book again.",
  },
];

const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const AVAILABLE_DAYS = [3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 28];
const BLOCKED_DAYS = [1, 6, 11, 13, 20, 25];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-accent">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function ArtistProfilePage() {
  const [activeTab, setActiveTab] = useState<"about" | "videos" | "reviews">(
    "about"
  );

  return (
    <div>
      <section className="bg-secondary text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[480px] h-80 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
              <span className="text-8xl">🥁</span>
            </div>
            <div className="flex-1">
              {ARTIST.verified && (
                <Badge className="bg-green-500/20 text-green-400 mb-3">
                  ✓ Verified Artist
                </Badge>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-1">
                {ARTIST.name}
              </h1>
              <p className="text-accent font-medium mb-4">{ARTIST.artForm}</p>
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div>
                  <p className="text-white text-xl font-bold">
                    {ARTIST.rating}
                  </p>
                  <p className="text-white/60 text-xs">Rating</p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">
                    {ARTIST.reviews}
                  </p>
                  <p className="text-white/60 text-xs">Reviews</p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">
                    {ARTIST.events}
                  </p>
                  <p className="text-white/60 text-xs">Events</p>
                </div>
                <div>
                  <p className="text-white text-xl font-bold">
                    {ARTIST.experience}
                  </p>
                  <p className="text-white/60 text-xs">Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/book">Request Booking</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  ♡ Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 lg:flex-[2]">
              <div className="flex gap-1 mb-6 border-b">
                {(["about", "videos", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "about" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">
                      About
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {ARTIST.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "videos" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">
                      Performance Videos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="relative h-40 rounded-lg bg-secondary flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-white text-xl ml-1">▶</span>
                          </div>
                          <span className="absolute bottom-2 left-3 text-white/60 text-xs">
                            Performance {i}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "reviews" && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-serif text-xl font-semibold mb-4">
                      Reviews
                    </h2>
                    <div className="space-y-6">
                      {REVIEWS.map((review, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {review.date}
                              </p>
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {review.comment}
                          </p>
                          {i < REVIEWS.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:flex-1 space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card>
                <CardContent className="p-6">
                  <p className="font-serif text-3xl text-primary font-bold">
                    ₹{ARTIST.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    per event
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">
                      February 2026
                    </p>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                        (day) => (
                          <span
                            key={day}
                            className="py-1 text-muted-foreground font-medium"
                          >
                            {day}
                          </span>
                        )
                      )}
                      {CALENDAR_DAYS.map((day) => {
                        const isAvailable = AVAILABLE_DAYS.includes(day);
                        const isBlocked = BLOCKED_DAYS.includes(day);
                        return (
                          <span
                            key={day}
                            className={`py-1.5 rounded text-xs ${
                              isAvailable
                                ? "bg-green-100 text-green-700"
                                : isBlocked
                                  ? "bg-red-50 text-red-300 line-through"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-green-100" />
                        Available
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-red-50" />
                        Blocked
                      </span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full mb-2">
                    <Link href="/book">Request Booking</Link>
                  </Button>
                  <p className="text-muted-foreground text-xs text-center">
                    You won&apos;t be charged yet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold mb-2">Details</h3>
                  {[
                    { label: "Art Form", value: ARTIST.artForm },
                    { label: "Group Size", value: ARTIST.groupSize },
                    { label: "Duration", value: ARTIST.duration },
                    { label: "Based In", value: ARTIST.basedIn },
                    { label: "Travels To", value: ARTIST.travelsTo },
                    { label: "Languages", value: ARTIST.languages },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium text-right max-w-[60%]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
