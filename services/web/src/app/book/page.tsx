"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ART_FORMS, EVENT_TYPES } from "@tomoola/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export default function BookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtForm, setSelectedArtForm] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [loadingArtists, setLoadingArtists] = useState(false);

  useEffect(() => {
    if (!selectedArtForm) {
      setArtists([]);
      setSelectedArtist("");
      return;
    }
    setLoadingArtists(true);
    setSelectedArtist("");
    api
      .getArtistsByArtForm(selectedArtForm)
      .then((data) => setArtists(data))
      .catch(() => setArtists([]))
      .finally(() => setLoadingArtists(false));
  }, [selectedArtForm]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      artistProfileId: selectedArtist,
      eventDate: formData.get("date") as string,
      eventType: formData.get("eventType") as string,
      eventLocation: formData.get("location") as string,
      message: (formData.get("message") as string) || undefined,
    };

    try {
      await api.createBooking(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <section className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Book Your Folk Group
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Fill in the details below and we&apos;ll connect you with the
            perfect artists for your event.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {success ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                  Booking Request Submitted
                </h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ve received your request and will get back to you
                  shortly with the best artists for your event.
                </p>
                <Button onClick={() => setSuccess(false)}>
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8">
                {error && (
                  <div className="mb-6 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="artForm">Choose Art Form</Label>
                    <select
                      id="artForm"
                      name="artForm"
                      required
                      value={selectedArtForm}
                      onChange={(e) => setSelectedArtForm(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    >
                      <option value="">Select an art form</option>
                      {ART_FORMS.map((form) => (
                        <option key={form.slug} value={form.slug}>
                          {form.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artist">Select Artist</Label>
                    <select
                      id="artist"
                      name="artist"
                      required
                      value={selectedArtist}
                      onChange={(e) => setSelectedArtist(e.target.value)}
                      disabled={!selectedArtForm || loadingArtists}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:opacity-50"
                    >
                      <option value="">
                        {loadingArtists
                          ? "Loading artists..."
                          : !selectedArtForm
                            ? "Select an art form first"
                            : artists.length === 0
                              ? "No artists available"
                              : "Select an artist"}
                      </option>
                      {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                          {artist.stageName || artist.user?.name || artist.name || "Artist"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    >
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Event Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City or venue name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us more about your event, requirements, or any special requests..."
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mt-10 text-center">
            <h3 className="font-serif text-xl font-semibold mb-2">
              Need help?
            </h3>
            <p className="text-muted-foreground text-sm mb-1">
              📧 info@tomoola.com
            </p>
            <p className="text-muted-foreground text-sm">
              📞 +91 98765 43210
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
