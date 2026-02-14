import Link from "next/link";
import { ART_FORMS } from "@tomoola/shared";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/folk-dances/filter-bar";

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
  Percussion: "from-orange-400 to-red-500",
  Theater: "from-purple-400 to-indigo-500",
  Dance: "from-pink-400 to-rose-500",
  Ritualistic: "from-amber-400 to-orange-500",
  Devotional: "from-yellow-400 to-amber-500",
  Puppetry: "from-teal-400 to-emerald-500",
};

const DESCRIPTIONS: Record<string, string> = {
  "dollu-kunitha":
    "A powerful drum dance performed by the Kuruba community, featuring rhythmic beats and energetic movements.",
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

export default async function FolkDancesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  let artForms: any[] = [];
  try {
    const res = await fetch(`${API_URL}/api/art-forms`, { cache: "no-store" });
    if (res.ok) artForms = await res.json();
  } catch {}

  const displayForms = artForms.length > 0 ? artForms : ART_FORMS;

  return (
    <div>
      <section className="bg-secondary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Explore Folk Dance Traditions
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl">
            Discover the rich tapestry of Indian folk dances, each telling a
            unique story
          </p>
          <FilterBar />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayForms.map((artForm) => {
              const slug = artForm.slug;
              const category = artForm.category;
              const name = artForm.name;
              const region = artForm.region;
              const description = artForm.description || DESCRIPTIONS[slug];
              const price = artForm.basePrice ?? PRICES[slug];
              const emoji = EMOJIS[slug] ?? "🎶";
              const gradient = GRADIENTS[category] ?? "from-gray-400 to-gray-600";

              return (
                <Link
                  key={slug}
                  href={`/folk-dances/${slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer py-0 gap-0">
                    <div
                      className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <span className="text-6xl">{emoji}</span>
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {category}
                      </Badge>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-serif text-lg font-semibold">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {region}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">
                        {description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <span className="text-sm font-medium">
                        Starting from ₹{price?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-primary font-medium group-hover:underline">
                        View Artists →
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Are you a folk artist?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join ToMoola and reach thousands of event organizers
          </p>
          <Button asChild size="lg">
            <Link href="/login">Register as Artist</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
