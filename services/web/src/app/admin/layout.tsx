"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/artists", label: "Artists", icon: "👥" },
  { href: "/admin/bookings", label: "Bookings", icon: "📋" },
  { href: "/admin/art-forms", label: "Art Forms", icon: "🎭" },
  { href: "/admin/moderation", label: "Moderation", icon: "🛡️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden md:flex w-60 flex-col bg-secondary text-white min-h-screen p-6">
        <div className="font-serif text-lg mb-8">Admin Panel</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href) && item.href !== "/admin"
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors hover:bg-white/10",
                  isActive && "bg-white/10"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="md:hidden border-b bg-card overflow-x-auto">
        <nav className="flex gap-1 px-4 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href) && item.href !== "/admin"
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors hover:bg-muted",
                  isActive && "bg-muted font-medium"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  )
}
