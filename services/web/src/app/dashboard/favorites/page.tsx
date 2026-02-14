"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FavoriteArtist {
  slug: string;
  name: string;
  artForm: string;
  category: string;
  price: number;
  emoji: string;
  gradient: string;
}

const FAVORITES: FavoriteArtist[] = [
  {
    slug: "dollu-kunitha-troupe",
    name: "Sri Mahalakshmi Dollu Kunitha",
    artForm: "Dollu Kunitha",
    category: "Percussion",
    price: 15000,
    emoji: "🥁",
    gradient: "from-orange-400 to-red-500",
  },
  {
    slug: "yakshagana-mandali",
    name: "Yakshagana Mandali Udupi",
    artForm: "Yakshagana",
    category: "Theater",
    price: 25000,
    emoji: "🎭",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    slug: "huli-vesha-dakshina",
    name: "Pili Vesha Troupe Dakshina",
    artForm: "Huli Vesha",
    category: "Dance",
    price: 12000,
    emoji: "🐯",
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function FavoritesPage() {
  if (FAVORITES.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">❤️</p>
        <h3 className="font-serif text-xl font-semibold mb-2">
          No saved artists yet
        </h3>
        <p className="text-muted-foreground mb-6">
          Browse artists and save your favorites
        </p>
        <Button asChild>
          <Link href="/folk-dances">Browse Artists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {FAVORITES.map((artist) => (
        <Card
          key={artist.slug}
          className="overflow-hidden py-0 gap-0 hover:shadow-lg transition"
        >
          <div
            className={`relative h-48 bg-gradient-to-br ${artist.gradient} flex items-center justify-center`}
          >
            <span className="text-6xl">{artist.emoji}</span>
            <Badge className="absolute top-3 left-3" variant="secondary">
              {artist.category}
            </Badge>
          </div>
          <CardContent className="pt-4">
            <h3 className="font-serif text-lg font-semibold">{artist.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {artist.artForm}
            </p>
            <p className="text-primary font-semibold text-sm mt-2">
              Starting from ₹{artist.price.toLocaleString("en-IN")}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 pb-5">
            <Button variant="outline" size="sm" className="flex-1">
              Remove
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/folk-dances/${artist.slug}`}>View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
