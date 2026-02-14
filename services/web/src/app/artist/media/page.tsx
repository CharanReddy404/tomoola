"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

interface MediaItem {
  id: string
  type: "image" | "video"
  caption: string
  url: string
}

const staticMedia: MediaItem[] = [
  { id: "1", type: "image", caption: "Dollu Kunitha performance", url: "" },
  { id: "2", type: "image", caption: "Group photo", url: "" },
  { id: "3", type: "image", caption: "Festival event", url: "" },
  { id: "4", type: "image", caption: "Stage setup", url: "" },
  { id: "5", type: "video", caption: "Wedding highlight reel", url: "https://youtube.com/watch?v=example1" },
  { id: "6", type: "video", caption: "Full performance", url: "https://youtube.com/watch?v=example2" },
]

export default function MediaPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [media, setMedia] = useState<MediaItem[]>(staticMedia)
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("image")
  const [mediaCaption, setMediaCaption] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const artistProfileId = user?.artistProfile?.id

  const fetchMedia = useCallback(() => {
    if (!artistProfileId) return
    api
      .getArtistMedia(artistProfileId)
      .then((data) => {
        if (data && data.length > 0) {
          setMedia(
            data.map((m: any) => ({
              id: String(m.id),
              type: m.type || "image",
              caption: m.caption || "",
              url: m.url || "",
            }))
          )
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [artistProfileId])

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "ARTIST") {
      setIsLoading(false)
      return
    }
    if (artistProfileId) {
      fetchMedia()
    } else {
      setIsLoading(false)
    }
  }, [user, authLoading, fetchMedia, artistProfileId])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!mediaUrl.trim()) return
    setSubmitting(true)
    try {
      await api.addMedia({
        type: mediaType,
        url: mediaUrl,
        caption: mediaCaption,
      })
      setMediaUrl("")
      setMediaType("image")
      setMediaCaption("")
      setDialogOpen(false)
      fetchMedia()
    } catch {
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setMedia((prev) => prev.filter((item) => item.id !== id))
    try {
      await api.deleteMedia(id)
    } catch {
      fetchMedia()
    }
  }

  if (!authLoading && (!user || user.role !== "ARTIST")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an artist to manage media
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Media</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Media</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Media</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div className="space-y-2">
                <Label htmlFor="mediaUrl">URL</Label>
                <Input
                  id="mediaUrl"
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={mediaType} onValueChange={setMediaType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaCaption">Caption</Label>
                <Input
                  id="mediaCaption"
                  placeholder="Describe this media..."
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-muted rounded-xl flex flex-col items-center justify-center overflow-hidden"
            >
              <span className="text-4xl">
                {item.type === "image" ? "📷" : "▶️"}
              </span>
              {item.type === "video" && (
                <span className="text-xs text-muted-foreground mt-1">
                  YouTube
                </span>
              )}
              <p className="text-xs text-muted-foreground mt-2 px-2 text-center">
                {item.caption}
              </p>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑️ Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
