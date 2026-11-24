"use client";

import { useState } from "react";
import { Menu, Shuffle, X } from "lucide-react";

interface NavbarProps {
  favouritesCount: number;
  shoppingCount: number;
  activeSection: "discover" | "favourites";
  onSelectSection: (section: "discover" | "favourites") => void;
  onOpenShoppingList: () => void;
  onSurpriseMe: () => void;
}

export default function Navbar({
  favouritesCount,
  shoppingCount,
  activeSection,
  onSelectSection,
  onOpenShoppingList,
  onSurpriseMe,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: "discover" | "favourites", anchorId: string) => {
    onSelectSection(section);
    setMobileMenuOpen(false);
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectSection("discover");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#1B261E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D5A3D]"
        >
          Smart Recipe Finder
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#556358]"
        >
          <a
            href="#pantry"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("discover", "pantry");
            }}
            className="hover:text-[#1B261E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Pantry
          </a>
          <a
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("discover", "discover");
            }}
            className={`hover:text-[#1B261E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeSection === "discover" ? "text-[#1B261E] font-semibold" : ""
            }`}
          >
            Discover
          </a>
          <button
            type="button"
            onClick={() => handleNavClick("favourites", "discover")}
            className={`hover:text-[#1B261E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === "favourites" ? "text-[#1B261E] font-semibold" : ""
            }`}
          >
            Favourites ({favouritesCount})
          </button>
          <button
            type="button"
            onClick={onOpenShoppingList}
            className="hover:text-[#1B261E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Shopping List ({shoppingCount})
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSurpriseMe}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#2D5A3D] hover:bg-[#22462F] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D5A3D]"
          >
            <Shuffle className="w-4 h-4" aria-hidden="true" />
            <span>Surprise Me</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E2DDD3] bg-white text-[#1B261E] hover:bg-[#F1EDE4] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DDD3] bg-[#FFFFFF] px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick("discover", "pantry")}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1B261E] rounded-lg hover:bg-[#F1EDE4]"
          >
            Pantry Ingredients
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("discover", "discover")}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1B261E] rounded-lg hover:bg-[#F1EDE4]"
          >
            Discover Recipes
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("favourites", "discover")}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1B261E] rounded-lg hover:bg-[#F1EDE4]"
          >
            Saved Favourites ({favouritesCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenShoppingList();
            }}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#1B261E] rounded-lg hover:bg-[#F1EDE4]"
          >
            Shopping List ({shoppingCount})
          </button>
        </div>
      )}
    </header>
  );
}
