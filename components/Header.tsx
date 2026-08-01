"use client";

import React from "react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  React.useEffect(() => {
    const handleScroll = () => {
      // Whenever near top of page (Hero/ScrollTextReveal), guarantee dark header palette
      if (window.scrollY < 400) {
        document.documentElement.style.setProperty("--header-theme-light", "0");
        document.documentElement.style.setProperty("--header-text-color", "#E8DFD3");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-5 py-4 sm:px-8 sm:py-6 md:px-16 flex items-center justify-between pointer-events-none">
      {/* Dark Theme Header Backdrop Gradient Mask */}
      <div
        className="absolute inset-0 h-24 bg-gradient-to-b from-[var(--color-black)]/90 via-[var(--color-black)]/50 to-transparent transition-opacity duration-500 pointer-events-none"
        style={{ opacity: "calc(1 - var(--header-theme-light, 0))" } as React.CSSProperties}
      />

      {/* Light Theme Header Backdrop Gradient Mask */}
      <div
        className="absolute inset-0 h-24 bg-gradient-to-b from-[#F2EDE6]/95 via-[#F2EDE6]/60 to-transparent transition-opacity duration-500 pointer-events-none"
        style={{ opacity: "var(--header-theme-light, 0)" } as React.CSSProperties}
      />

      {/* Top Left: Logo */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto flex items-center cursor-pointer group relative z-10"
      >
        <div className="relative flex items-center">
          <Logo
            variant="light"
            className="h-5 sm:h-6 md:h-7 w-auto transition-opacity duration-300"
            style={{ opacity: "calc(1 - var(--header-theme-light, 0))" } as React.CSSProperties}
          />
          <Logo
            variant="dark"
            className="h-5 sm:h-6 md:h-7 w-auto transition-opacity duration-300 absolute inset-0"
            style={{ opacity: "var(--header-theme-light, 0)" } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Top Right: Language Switcher */}
      <div
        className="pointer-events-auto flex items-center gap-6 transition-colors duration-300 relative z-10"
        style={{ color: "var(--header-text-color, var(--color-cream))" } as React.CSSProperties}
      >
        <LanguageSwitcher />
      </div>
    </header>
  );
}
