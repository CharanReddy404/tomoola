"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ART_FORMS } from "@tomoola/shared";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [artForm, setArtForm] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (artForm) params.set("artForm", artForm);
    if (city) params.set("city", city);
    if (date) params.set("date", date);
    router.push(`/folk-dances?${params.toString()}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
      <select
        value={artForm}
        onChange={(e) => setArtForm(e.target.value)}
        className="flex-1 p-3 rounded-xl bg-muted/50 border-0 text-sm text-foreground outline-none"
      >
        <option value="">Select Art Form</option>
        {ART_FORMS.map((form) => (
          <option key={form.slug} value={form.slug}>
            {form.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 p-3 rounded-xl bg-muted/50 border-0 text-sm text-foreground outline-none"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 p-3 rounded-xl bg-muted/50 border-0 text-sm text-foreground outline-none"
      />
      <Button
        onClick={handleSearch}
        className="bg-primary text-white px-8 rounded-xl"
        size="lg"
      >
        <Search className="size-4" />
        Search
      </Button>
    </div>
  );
}
