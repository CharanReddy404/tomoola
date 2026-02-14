"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export default function AvailabilityPage() {
  const { user, isLoading: authLoading } = useAuth()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [blockedDates, setBlockedDates] = useState<Set<number>>(
    new Set([8, 15, 22])
  )
  const [bookedDates, setBookedDates] = useState<Set<number>>(
    new Set([5, 12, 20])
  )
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const artistProfileId = user?.artistProfile?.id

  const fetchAvailability = useCallback(() => {
    if (!artistProfileId) return
    setIsLoading(true)
    api
      .getAvailability(artistProfileId, year, month + 1)
      .then((data) => {
        if (data?.blockedDates) {
          const blocked = new Set<number>(
            (data.blockedDates as string[]).map((d) => new Date(d).getDate())
          )
          setBlockedDates(blocked)
        }
        if (data?.bookedDates) {
          const booked = new Set<number>(
            (data.bookedDates as string[]).map((d) => new Date(d).getDate())
          )
          setBookedDates(booked)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [artistProfileId, year, month])

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ARTIST") {
      setIsLoading(false)
      return
    }
    if (artistProfileId) {
      fetchAvailability()
    } else {
      setIsLoading(false)
    }
  }, [user, authLoading, fetchAvailability, artistProfileId])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthName = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  async function toggleDate(day: number) {
    if (bookedDates.has(day) || actionLoading) return
    const dateStr = toDateString(year, month, day)
    const isCurrentlyBlocked = blockedDates.has(day)

    setBlockedDates((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })

    setActionLoading(true)
    try {
      if (isCurrentlyBlocked) {
        await api.unblockDates([dateStr])
      } else {
        await api.blockDates([dateStr])
      }
    } catch {
      setBlockedDates((prev) => {
        const next = new Set(prev)
        if (isCurrentlyBlocked) {
          next.add(day)
        } else {
          next.delete(day)
        }
        return next
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (!authLoading && (!user || user.role !== "ARTIST")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an artist to manage availability
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Availability</h1>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          ← Prev
        </Button>
        <span className="font-medium text-lg min-w-[180px] text-center">
          {monthName}
        </span>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          Next →
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-1 max-w-md">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 max-w-md">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isBlocked = blockedDates.has(day)
            const isBooked = bookedDates.has(day)

            return (
              <button
                key={day}
                onClick={() => toggleDate(day)}
                className={cn(
                  "aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-colors border",
                  isBooked
                    ? "bg-blue-100 text-blue-700 border-blue-200 cursor-default"
                    : isBlocked
                      ? "bg-destructive/10 text-destructive border-destructive/20 line-through"
                      : "bg-white border-border hover:bg-muted cursor-pointer"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-destructive" />
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-blue-500" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}
