"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: "tr" | "en") => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-xs font-sans tracking-[0.2em] select-none">
      <button
        type="button"
        onClick={() => handleSwitch("tr")}
        className={`transition-all duration-200 uppercase min-h-[44px] min-w-[36px] px-1 py-1 inline-flex items-center justify-center ${
          locale === "tr"
            ? "text-[var(--color-gold)] font-bold border-b border-[var(--color-gold)]"
            : "text-[var(--color-stone)] hover:text-[var(--color-cream)] opacity-60 hover:opacity-100"
        }`}
      >
        TR
      </button>
      <span className="text-[var(--color-stone)]/40">/</span>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`transition-all duration-200 uppercase min-h-[44px] min-w-[36px] px-1 py-1 inline-flex items-center justify-center ${
          locale === "en"
            ? "text-[var(--color-gold)] font-bold border-b border-[var(--color-gold)]"
            : "text-[var(--color-stone)] hover:text-[var(--color-cream)] opacity-60 hover:opacity-100"
        }`}
      >
        EN
      </button>
    </div>
  );
}
