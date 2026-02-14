import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VISION_CARDS = [
  {
    title: "Bridge Tradition & Technology",
    description:
      "Creating a digital platform that empowers folk artists to showcase their talent, manage bookings, and connect with audiences across the country.",
  },
  {
    title: "Celebrate Authenticity",
    description:
      "Ensuring every performance delivers a genuine cultural experience by working exclusively with verified traditional artists and troupes.",
  },
  {
    title: "Revive Heritage",
    description:
      "Bringing India's rich folk traditions to the world stage by creating opportunities for artists and making these art forms accessible to modern audiences.",
  },
];

const STATS = [
  { value: "50+", label: "Artists" },
  { value: "9", label: "Art Forms" },
  { value: "200+", label: "Events" },
  { value: "15+", label: "Districts" },
];

const CONTACT_INFO = [
  { emoji: "📧", label: "Email", value: "info@tomoola.com" },
  { emoji: "📞", label: "Phone", value: "+91 98765 43210" },
  { emoji: "📍", label: "Location", value: "Bangalore, India" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-secondary text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            About ToMoola
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Bridging tradition and technology to preserve India&apos;s folk
            heritage
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            ToMoola is on a mission to preserve and promote India&apos;s
            incredible folk art traditions. We connect talented folk artists with
            audiences and event organizers, creating sustainable livelihoods
            while ensuring these centuries-old art forms continue to thrive.
            Through technology, we aim to make authentic cultural experiences
            accessible to everyone.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Our Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VISION_CARDS.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-8 text-center">
                  <h3 className="font-serif text-xl font-semibold mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_INFO.map((item) => (
              <Card key={item.label}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="font-semibold mb-2">{item.label}</h3>
                  <p className="text-muted-foreground">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
