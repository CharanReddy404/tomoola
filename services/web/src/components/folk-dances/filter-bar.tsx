"use client";

import { useState } from "react";

const CATEGORIES = [
  "All",
  "Percussion",
  "Theater",
  "Dance",
  "Ritualistic",
  "Devotional",
  "Puppetry",
] as const;

export function FilterBar({
  onFilterChange,
}: {
  onFilterChange?: (filter: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => {
            setActiveFilter(category);
            onFilterChange?.(category);
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === category
              ? "bg-primary text-white"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
