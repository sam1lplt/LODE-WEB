"use client";

import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Logo from "@/components/Logo";

export default function Footer() {
  const t = useTranslations("footer");

  const footerRef = useRef<HTMLElement | null>(null);
  const brandGroupRef = useRef<HTMLDivElement | null>(null);
  const goldRuleRef = useRef<HTMLDivElement | null>(null);
  const gridColsRef = useRef<(HTMLDivElement | null)[]>([]);
  const signatureBarRef = useRef<HTMLDivElement | null>(null);

  // Agency credit interactive hover refs
  const creditLinkRef = useRef<HTMLAnchorElement | null>(null);
  const tailerCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLSpanElement | null>(null);

  // Scroll entrance animation (ScrollTrigger start "top 85%", once: true)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // 1. Logo and statement fade up (y: 30 -> 0, opacity 0 -> 1)
      if (brandGroupRef.current) {
        tl.fromTo(
          brandGroupRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          0
        );
      }

      // 2. Gold rule draws out (scaleX 0 -> 1, transform-origin left)
      if (goldRuleRef.current) {
        tl.fromTo(
          goldRuleRef.current,
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left", duration: 0.8, ease: "power2.out" },
          0.2
        );
      }

      // 3. Info grid columns stagger up (stagger: 0.08)
      const validCols = gridColsRef.current.filter(Boolean);
      if (validCols.length > 0) {
        tl.fromTo(
          validCols,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" },
          0.3
        );
      }

      // 4. Signature bar fades in last
      if (signatureBarRef.current) {
        tl.fromTo(
          signatureBarRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0.5
        );
      }

      // 5. Header Theme Handoff (Dark Footer -> Light Header Theme)
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 20%",
        onEnter: () => {
          document.documentElement.style.setProperty("--header-theme-light", "0");
          document.documentElement.style.setProperty("--header-text-color", "#E8DFD3");
        },
        onLeaveBack: () => {
          document.documentElement.style.setProperty("--header-theme-light", "1");
          document.documentElement.style.setProperty("--header-text-color", "#2A2522");
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Digital Tailor ripple & hover interaction choreography
  const digitalTailorText = "Digital Tailor";

  const handleLinkMouseEnter = () => {
    // 1. Character ripple on Digital Tailor (y: 0 -> -4 -> 0 stagger 0.02s)
    const validChars = tailerCharsRef.current.filter(Boolean);
    if (validChars.length > 0) {
      gsap.to(validChars, {
        y: -4,
        duration: 0.15,
        stagger: 0.02,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }

    // 2. Underline draws out (scaleX 0 -> 1, 0.4s ease power2.out)
    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.4,
        ease: "power2.out",
      });
    }

    // 3. Arrow translate (x: 0 -> 3, y: 0 -> -3)
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: 3,
        y: -3,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleLinkMouseLeave = () => {
    const validChars = tailerCharsRef.current.filter(Boolean);
    if (validChars.length > 0) {
      gsap.to(validChars, {
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }

    if (underlineRef.current) {
      gsap.to(underlineRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.3,
        ease: "power2.in",
      });
    }

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full bg-[var(--color-black,#141210)] text-[var(--color-cream,#E8DFD3)] font-sans overflow-hidden select-none"
    >
      {/* Soft gradient transition at top (light-bg → black over ~120px) */}
      <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-[#F2EDE6] to-[#141210] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-12">
        {/* ── BAND 1: BRAND STATEMENT ── */}
        <div className="py-16 md:py-24 flex flex-col items-start text-left">
          <div ref={brandGroupRef} className="flex flex-col gap-6">
            <Logo variant="light" className="w-[180px] sm:w-[220px] h-auto" />

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--color-cream)] max-w-2xl leading-snug tracking-tight">
              {t("statement")}
            </h2>
          </div>

          {/* Thin Gold Rule */}
          <div
            ref={goldRuleRef}
            className="w-full h-[1px] bg-[var(--color-gold)]/60 mt-10 md:mt-14"
          />
        </div>

        {/* ── BAND 2: INFO GRID ── */}
        <div className="py-12 border-t border-b border-[var(--color-stone)]/15 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Column 1: NAVIGATION */}
          <div
            ref={(el) => {
              gridColsRef.current[0] = el;
            }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium font-sans">
              {t("navTitle")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: t("navCollection"), target: "collection" },
                { label: t("navMarin"), target: "marin" },
                { label: t("navLight"), target: "light-edition" },
                { label: t("navPhilosophy"), target: "philosophy" },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleScrollTo(link.target)}
                    className="text-sm font-light text-[var(--color-stone)] hover:text-[var(--color-cream)] transition-colors duration-300 min-h-[44px] inline-flex items-center"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: İLETİŞİM / CONTACT */}
          <div
            ref={(el) => {
              gridColsRef.current[1] = el;
            }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium font-sans">
              {t("contactTitle")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-light text-[var(--color-stone)]">
              <li className="leading-relaxed">{t("address")}</li>
              <li>
                <a
                  href="tel:+902120000000"
                  className="hover:text-[var(--color-cream)] transition-colors duration-300 min-h-[44px] inline-flex items-center"
                >
                  {t("phone")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@lode.com.tr"
                  className="hover:text-[var(--color-cream)] transition-colors duration-300 min-h-[44px] inline-flex items-center"
                >
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: TAKİP ET / FOLLOW */}
          <div
            ref={(el) => {
              gridColsRef.current[2] = el;
            }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium font-sans">
              {t("socialTitle")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { name: "Instagram", href: "https://instagram.com" },
                { name: "Pinterest", href: "https://pinterest.com" },
                { name: "LinkedIn", href: "https://linkedin.com" },
              ].map((social, i) => (
                <li key={i}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-sm font-light text-[var(--color-stone)] hover:text-[var(--color-gold)] transition-colors duration-300 min-h-[44px] inline-flex items-center w-fit"
                  >
                    <span>{social.name}</span>
                    <span className="absolute bottom-1 left-0 w-full h-[1px] bg-[var(--color-gold)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── BAND 3: SIGNATURE BAR ── */}
        <div
          ref={signatureBarRef}
          className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[var(--color-stone)]"
        >
          {/* LEFT: COPYRIGHT */}
          <span>{t("copyright")}</span>

          {/* RIGHT: AGENCY CREDIT (UNIFIED INTERACTIVE LINK) */}
          <a
            ref={creditLinkRef}
            href="https://themedya.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleLinkMouseEnter}
            onMouseLeave={handleLinkMouseLeave}
            className="group relative inline-flex items-center gap-1 text-xs select-none min-h-[44px] py-2 px-1"
          >
            {/* Digital Tailor */}
            <div className="relative inline-flex items-center">
              <span className="font-sans font-light uppercase tracking-[0.25em] text-[var(--color-gold)]">
                {digitalTailorText.split("").map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      tailerCharsRef.current[i] = el;
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>

              {/* Underline draw */}
              <div
                ref={underlineRef}
                className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-[var(--color-gold)] scale-x-0 origin-left"
              />
            </div>

            {/* Thin vertical divider */}
            <span className="w-[1px] h-3.5 bg-[var(--color-stone)]/30 mx-2" />

            {/* The Medya */}
            <span className="font-sans font-medium text-[var(--color-cream)] group-hover:text-white transition-colors duration-300">
              The Medya
            </span>

            {/* Diagonal arrow glyph */}
            <span
              ref={arrowRef}
              className="inline-block text-[var(--color-gold)] text-sm font-sans transition-colors duration-300 ml-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
