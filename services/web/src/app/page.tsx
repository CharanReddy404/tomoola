import Link from "next/link";
import { ART_FORMS } from "@tomoola/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "@/components/home/hero-search";

const ART_FORM_EMOJIS: Record<string, string> = {
  "dollu-kunitha": "🥁",
  yakshagana: "🎭",
  "huli-vesha": "🐯",
  veeragase: "⚔️",
  kamsale: "🔔",
  "garudi-gombe": "🎪",
};

const ART_FORM_GRADIENTS: Record<string, string> = {
  "dollu-kunitha": "from-orange-500 to-red-600",
  yakshagana: "from-emerald-500 to-teal-700",
  "huli-vesha": "from-amber-400 to-orange-600",
  veeragase: "from-red-600 to-rose-800",
  kamsale: "from-violet-500 to-purple-700",
  "garudi-gombe": "from-sky-500 to-indigo-600",
};

const STATS = [
  { value: "50+", label: "Verified Artists" },
  { value: "9", label: "Art Forms" },
  { value: "200+", label: "Events Done" },
  { value: "4.8", label: "Avg Rating" },
];

const STEPS = [
  {
    icon: "🔍",
    title: "Browse & Compare",
    description:
      "Explore detailed profiles, watch performance videos, and compare artists to find the perfect match for your event.",
  },
  {
    icon: "🔒",
    title: "Book & Pay Securely",
    description:
      "Book your preferred artist with a secure payment process. Your money is held safely until the event is completed.",
  },
  {
    icon: "🎉",
    title: "Enjoy Your Event",
    description:
      "Sit back and enjoy an unforgettable cultural experience. Rate and review the artist after the performance.",
  },
];

const FEATURED_ART_FORMS = ART_FORMS.slice(0, 6);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(232,93,42,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(212,168,67,0.06),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block text-accent text-sm font-medium bg-accent/20 px-4 py-1.5 rounded-full mb-6">
              Celebrating India&apos;s Living Heritage
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Book Authentic{" "}
              <span className="text-accent">Folk Artists</span> For Your Events
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Discover and book Karnataka&apos;s finest folk performers — from
              Yakshagana to Dollu Kunitha. Verified artists, secure payments,
              unforgettable experiences.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <HeroSearch />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-white text-3xl sm:text-4xl font-bold font-serif">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-4">
            How ToMoola Works
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Book folk artists for your event in 3 simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <Card
                key={step.title}
                className="text-center p-8 hover:shadow-lg transition"
              >
                <CardContent className="p-0">
                  <span className="text-4xl mb-4 block">{step.icon}</span>
                  <p className="text-sm font-medium text-primary mb-2">
                    Step {i + 1}
                  </p>
                  <h3 className="font-serif text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Art Forms */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-4">
            Explore Folk Art Forms
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Discover the rich cultural heritage of Karnataka through its
            traditional art forms
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_ART_FORMS.map((form) => (
              <Link key={form.slug} href="/folk-dances" className="group">
                <Card className="overflow-hidden p-0 hover:shadow-lg transition">
                  <div
                    className={`relative h-48 bg-gradient-to-br ${ART_FORM_GRADIENTS[form.slug] ?? "from-gray-400 to-gray-600"} flex items-center justify-center`}
                  >
                    <span className="text-6xl">
                      {ART_FORM_EMOJIS[form.slug] ?? "🎶"}
                    </span>
                    <Badge className="absolute top-3 left-3 bg-white/20 text-white backdrop-blur-sm">
                      {form.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-serif text-lg font-semibold group-hover:text-primary transition">
                      {form.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {form.region}
                    </p>
                    <p className="text-primary font-semibold text-sm mt-2">
                      Starting from ₹8,000
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to bring tradition to your event?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join 200+ happy clients who have brought authentic folk
            performances to their celebrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8"
            >
              <Link href="/folk-dances">Browse Artists</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8"
            >
              <Link href="/list-your-group">List Your Group</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
