"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function ProfilePage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth()

  const [groupName, setGroupName] = useState("Maruthi Dollu Kunitha Sangha")
  const [description, setDescription] = useState(
    "Traditional Dollu Kunitha performers from Bangalore with over 15 years of experience in folk dance and cultural events."
  )
  const [artForms, setArtForms] = useState(["Dollu Kunitha", "Veeragase"])
  const [serviceAreas, setServiceAreas] = useState(["Bangalore", "Mysore", "Hubli"])
  const [languages, setLanguages] = useState(["Kannada", "Hindi", "English"])
  const [groupSize, setGroupSize] = useState(12)
  const [basePrice, setBasePrice] = useState(15000)
  const [priceUnit, setPriceUnit] = useState("per-event")
  const [basedIn, setBasedIn] = useState("Bangalore, Karnataka")
  const [experience, setExperience] = useState(15)
  const [newArtForm, setNewArtForm] = useState("")
  const [newServiceArea, setNewServiceArea] = useState("")
  const [saving, setSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (user?.artistProfile) {
      const p = user.artistProfile
      if (p.groupName) setGroupName(p.groupName)
      if (p.description) setDescription(p.description)
      if (p.artForms?.length) setArtForms(p.artForms)
      if (p.serviceAreas?.length) setServiceAreas(p.serviceAreas)
      if (p.languages?.length) setLanguages(p.languages)
      if (p.groupSize) setGroupSize(p.groupSize)
      if (p.basePrice) setBasePrice(p.basePrice)
      if (p.priceUnit) setPriceUnit(p.priceUnit)
      if (p.basedIn) setBasedIn(p.basedIn)
      if (p.experience) setExperience(p.experience)
    }
    setIsLoading(false)
  }, [user, authLoading])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.artistProfile?.id) return
    setSaving(true)
    try {
      await api.updateArtistProfile(user.artistProfile.id, {
        groupName,
        description,
        artForms,
        serviceAreas,
        languages,
        groupSize,
        basePrice,
        priceUnit,
        basedIn,
        experience,
      })
      await refreshUser()
    } catch {
    } finally {
      setSaving(false)
    }
  }

  if (!authLoading && (!user || user.role !== "ARTIST")) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔒</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          Please login as an artist to edit your profile
        </h3>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-serif text-2xl">Edit Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="border-input h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Art Forms</Label>
              <div className="flex flex-wrap gap-2">
                {artForms.map((form) => (
                  <Badge key={form} variant="secondary">
                    {form}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() =>
                        setArtForms((prev) => prev.filter((f) => f !== form))
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add art form"
                  value={newArtForm}
                  onChange={(e) => setNewArtForm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newArtForm.trim()) {
                      e.preventDefault()
                      setArtForms((prev) => [...prev, newArtForm.trim()])
                      setNewArtForm("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newArtForm.trim()) {
                      setArtForms((prev) => [...prev, newArtForm.trim()])
                      setNewArtForm("")
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (₹)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Price Unit</Label>
                <Select value={priceUnit} onValueChange={setPriceUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-event">Per Event</SelectItem>
                    <SelectItem value="per-hour">Per Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="basedIn">Based In</Label>
              <Input
                id="basedIn"
                value={basedIn}
                onChange={(e) => setBasedIn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Service Areas</Label>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <Badge key={area} variant="secondary">
                    {area}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() =>
                        setServiceAreas((prev) =>
                          prev.filter((a) => a !== area)
                        )
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add service area"
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newServiceArea.trim()) {
                      e.preventDefault()
                      setServiceAreas((prev) => [
                        ...prev,
                        newServiceArea.trim(),
                      ])
                      setNewServiceArea("")
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newServiceArea.trim()) {
                      setServiceAreas((prev) => [
                        ...prev,
                        newServiceArea.trim(),
                      ])
                      setNewServiceArea("")
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() =>
                        setLanguages((prev) => prev.filter((l) => l !== lang))
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
