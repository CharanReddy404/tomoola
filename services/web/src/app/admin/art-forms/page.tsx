"use client"

import { useState, useEffect, useCallback } from "react"
import { ART_FORMS, KARNATAKA_REGIONS } from "@tomoola/shared"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

const artFormEmojis: Record<string, string> = {
  "dollu-kunitha": "🥁",
  yakshagana: "🎭",
  "huli-vesha": "🐯",
  veeragase: "⚔️",
  kamsale: "🙏",
  "pata-kunitha": "🏳️",
  "pooja-kunitha": "🪔",
  "garudi-gombe": "🎎",
  "chenda-melam": "🪘",
}

const staticArtistCounts: Record<string, number> = {
  "dollu-kunitha": 6,
  yakshagana: 8,
  "huli-vesha": 4,
  veeragase: 3,
  kamsale: 2,
  "pata-kunitha": 3,
  "pooja-kunitha": 2,
  "garudi-gombe": 1,
  "chenda-melam": 3,
}

const categories = ["Percussion", "Theater", "Dance", "Ritualistic", "Devotional", "Puppetry"]

interface ArtFormItem {
  id?: string
  slug: string
  name: string
  region: string
  category: string
  artistCount?: number
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function AdminArtFormsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [artForms, setArtForms] = useState<ArtFormItem[]>(
    ART_FORMS.map((af) => ({
      slug: af.slug,
      name: af.name,
      region: af.region,
      category: af.category,
      artistCount: staticArtistCounts[af.slug] ?? 0,
    }))
  )
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formRegion, setFormRegion] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormSlug(toSlug(formName))
  }, [formName])

  const fetchArtForms = useCallback(() => {
    api
      .getAdminArtForms()
      .then((data) => {
        if (data && data.length > 0) {
          setArtForms(
            data.map((af: any) => ({
              id: af.id,
              slug: af.slug,
              name: af.name,
              region: af.region || "",
              category: af.category || "",
              artistCount: af.artistCount ?? af._count?.artists ?? 0,
            }))
          )
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
    fetchArtForms()
  }, [user, authLoading, fetchArtForms])

  function openNew() {
    setEditingId(null)
    setFormName("")
    setFormSlug("")
    setFormRegion("")
    setFormCategory("")
    setFormDescription("")
    setDialogOpen(true)
  }

  function openEdit(artForm: ArtFormItem) {
    setEditingId(artForm.id || null)
    setFormName(artForm.name)
    setFormSlug(artForm.slug)
    setFormRegion(artForm.region)
    setFormCategory(artForm.category)
    setFormDescription("")
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const data = {
      name: formName,
      slug: formSlug,
      region: formRegion,
      category: formCategory,
      description: formDescription,
    }
    try {
      if (editingId) {
        await api.updateArtForm(editingId, data)
      } else {
        await api.createArtForm(data)
      }
      setDialogOpen(false)
      fetchArtForms()
    } catch {
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(artForm: ArtFormItem) {
    if (!artForm.id) return
    try {
      await api.deleteArtForm(artForm.id)
      fetchArtForms()
    } catch {
    }
  }

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an admin to manage art forms
        </h3>
        <Button asChild>
          <Link href="/admin/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Art Form Management</h1>
        <Button onClick={openNew}>+ Add New Art Form</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artForms.map((artForm) => (
            <Card key={artForm.slug}>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{artFormEmojis[artForm.slug] ?? "🎵"}</span>
                    <div>
                      <p className="font-medium">{artForm.name}</p>
                      <p className="text-xs text-muted-foreground">{artForm.slug}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-muted px-2 py-1 rounded">{artForm.region}</span>
                  <span className="bg-muted px-2 py-1 rounded">{artForm.category}</span>
                  <span className="bg-muted px-2 py-1 rounded">
                    {artForm.artistCount ?? 0} artists
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(artForm)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(artForm)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Art Form" : "Add New Art Form"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Dollu Kunitha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={formSlug} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={formRegion} onValueChange={setFormRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {KARNATAKA_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
