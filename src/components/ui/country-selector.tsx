"use client";

import * as React from "react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";
import type { Country } from "../data/countries";

interface CountrySelectorProps {
  countries: Country[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: boolean;
}

export function CountrySelector({
  countries,
  value,
  onValueChange,
  placeholder = "Select a country",
  searchPlaceholder = "Search...",
  emptyMessage = "No country found.",
  error = false,
}: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.code === value);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-14 w-full items-center justify-between rounded-md border bg-gray-50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500" : "border-input"
        )}
      >
        {selectedCountry ? (
          <span className="flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          <div className="flex items-center border-b px-3 py-2">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-auto py-1">
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => {
                    onValueChange(country.code);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100",
                    value === country.code && "bg-gray-100 font-medium"
                  )}
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
