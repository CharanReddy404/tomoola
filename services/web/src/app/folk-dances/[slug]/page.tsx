import Link from "next/link";
import { notFound } from "next/navigation";
import { ART_FORMS } from "@tomoola/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EMOJIS: Record<string, string> = {
  "dollu-kunitha": "🥁",
  yakshagana: "🎭",
  "huli-vesha": "🐯",
  veeragase: "⚔️",
  kamsale: "🔔",
  "pata-kunitha": "💃",
  "pooja-kunitha": "🙏",
  "garudi-gombe": "🎪",
  "chenda-melam": "🎵",
};

const DESCRIPTIONS: Record<string, string> = {
  "dollu-kunitha":
    "A powerful drum dance performed by the Kuruba community, featuring rhythmic beats and energetic movements that captivate audiences.",
  yakshagana:
    "A traditional theater form combining dance, music, dialogue, and elaborate costumes in mythological narratives.",
  "huli-vesha":
    "The Tiger Dance, a vibrant body-painting art where performers mimic tiger movements during Navaratri.",
  veeragase:
    "A vigorous dance honoring Veerabhadra, performed with intense energy and dramatic warrior-like expressions.",
  kamsale:
    "A devotional dance dedicated to Lord Mahadeshwara, performed with brass cymbals and rhythmic footwork.",
  "pata-kunitha":
    "A colorful dance performed with decorated wooden frames, celebrating harvests and community gatherings.",
  "pooja-kunitha":
    "A ritualistic dance performed during temple festivals, invoking divine blessings through graceful movements.",
  "garudi-gombe":
    "Giant puppet dance featuring towering figures manipulated by skilled puppeteers during festivals.",
  "chenda-melam":
    "A powerful percussion ensemble creating thunderous rhythms with traditional chenda drums.",
};

const PRICES: Record<string, number> = {
  "dollu-kunitha": 15000,
  yakshagana: 25000,
  "huli-vesha": 12000,
  veeragase: 10000,
  kamsale: 8000,
  "pata-kunitha": 10000,
  "pooja-kunitha": 9000,
  "garudi-gombe": 18000,
  "chenda-melam": 12000,
};

const GRADIENTS: Record<string, string> = {
  "dollu-kunitha": "from-orange-500 to-red-600",
  yakshagana: "from-emerald-500 to-teal-700",
  "huli-vesha": "from-amber-400 to-orange-600",
  veeragase: "from-red-600 to-rose-800",
  kamsale: "from-violet-500 to-purple-700",
  "pata-kunitha": "from-pink-400 to-rose-500",
  "pooja-kunitha": "from-amber-400 to-orange-500",
  "garudi-gombe": "from-sky-500 to-indigo-600",
  "chenda-melam": "from-teal-400 to-emerald-500",
};

const ARTIST_GRADIENTS = [
  "from-orange-400 to-red-500",
  "from-violet-400 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-blue-600",
  "from-pink-400 to-rose-600",
  "from-amber-400 to-yellow-600",
];

const PLACEHOLDER_ARTISTS = [
  {
    id: "artist-1",
    name: "Sri Mahadeshwara Troupe",
    emoji: "🥁",
    gradient: "from-orange-400 to-red-500",
    location: "Mysore, Karnataka",
    price: 15000,
  },
  {
    id: "artist-2",
    name: "Nandi Kalavidaru",
    emoji: "🎶",
    gradient: "from-violet-400 to-purple-600",
    location: "Hubli, Karnataka",
    price: 12000,
  },
  {
    id: "artist-3",
    name: "Chamundi Folk Artists",
    emoji: "🎭",
    gradient: "from-emerald-400 to-teal-600",
    location: "Bangalore, Karnataka",
    price: 18000,
  },
];

export default async function ArtFormDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staticArtForm = ART_FORMS.find((a) => a.slug === slug);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let apiData: any = null;
  try {
    const res = await fetch(`${API_URL}/api/art-forms/${slug}`, { cache: "no-store" });
    if (res.ok) apiData = await res.json();
  } catch {}

  const artForm = apiData || staticArtForm;

  if (!artForm) {
    notFound();
  }

  const description = artForm.description || DESCRIPTIONS[slug];
  const basePrice = artForm.basePrice ?? PRICES[slug] ?? 10000;
  const artists: any[] = apiData?.artists ?? [];
  const displayArtists = artists.length > 0 ? artists : PLACEHOLDER_ARTISTS;

  return (
    <div>
      <section className="bg-secondary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${GRADIENTS[slug] ?? "from-gray-400 to-gray-600"} flex items-center justify-center`}
            >
              <span className="text-4xl">{EMOJIS[slug] ?? "🎶"}</span>
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold">
                {artForm.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white backdrop-blur-sm">
                  {artForm.region}
                </Badge>
                <Badge className="bg-accent/20 text-accent backdrop-blur-sm">
                  {artForm.category}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-3xl">
            {description}
          </p>
          <div className="flex items-center gap-8 mt-8">
            <div>
              <p className="text-white text-2xl font-bold font-serif">
                {displayArtists.length}
              </p>
              <p className="text-white/60 text-sm">Artists Available</p>
            </div>
            <div>
              <p className="text-white text-2xl font-bold font-serif">
                ₹{basePrice.toLocaleString("en-IN")}
              </p>
              <p className="text-white/60 text-sm">Starting From</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold mb-6">
            {artForm.name} Artists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArtists.map((artist, index) => {
              const isReal = artists.length > 0;
              const artistId = isReal ? artist.id : artist.id;
              const artistName = isReal ? (artist.stageName || artist.user?.name || "Artist") : artist.name;
              const artistLocation = isReal ? (artist.city || "Karnataka") : artist.location;
              const artistPrice = isReal ? (artist.basePrice ?? basePrice) : artist.price;
              const artistEmoji = isReal ? (EMOJIS[slug] ?? "🎶") : artist.emoji;
              const artistGradient = isReal
                ? (ARTIST_GRADIENTS[index % ARTIST_GRADIENTS.length])
                : artist.gradient;

              return (
                <Card
                  key={artistId}
                  className="overflow-hidden p-0 hover:shadow-lg transition"
                >
                  <div
                    className={`relative h-48 bg-gradient-to-br ${artistGradient} flex items-center justify-center`}
                  >
                    <span className="text-6xl">{artistEmoji}</span>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-serif text-lg font-semibold">
                      {artistName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ★ {artist.avgRating?.toFixed(1) ?? "4.8"} · {artist.reviewCount ?? 12} reviews
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {artistLocation}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-primary font-semibold">
                        ₹{artistPrice?.toLocaleString("en-IN")}
                      </span>
                      <Button asChild size="sm">
                        <Link href={`/artists/${artistId}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We can help you find the perfect {artForm.name} group for your
            event. Get in touch and we&apos;ll match you with the right artists.
          </p>
          <Button asChild size="lg">
            <Link href="/about">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
