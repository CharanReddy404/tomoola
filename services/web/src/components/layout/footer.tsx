import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/folk-dances", label: "Folk Dances" },
  { href: "/book", label: "Book Now" },
  { href: "/about", label: "About" },
];

const supportLinks = [
  { href: "#", label: "Help Center" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Privacy Policy" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "YouTube" },
  { href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-serif text-2xl font-bold">
              <span className="text-white">To</span>
              <span className="text-primary">Moola</span>
            </Link>
            <p className="mt-3 text-sm text-white/70">
              Celebrating India&apos;s folk dance traditions
            </p>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <a
                  href="mailto:info@tomoola.com"
                  className="transition hover:text-primary"
                >
                  info@tomoola.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="transition hover:text-primary"
                >
                  +91 98765 43210
                </a>
              </li>
              <li>Bangalore, India</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <p className="text-center text-sm text-white/50">
          &copy; 2026 ToMoola. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
