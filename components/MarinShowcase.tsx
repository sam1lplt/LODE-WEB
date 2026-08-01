"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function MarinShowcase() {
  const t = useTranslations("marin");

  const containerRef = useRef<HTMLElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);

  // Intro text refs (Beat 1 & 2)
  const introGroupRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const line1Ref = useRef<HTMLParagraphElement | null>(null);
  const line2Ref = useRef<HTMLParagraphElement | null>(null);
  const introBodyRef = useRef<HTMLParagraphElement | null>(null);

  // Showcase layout refs (Beat 3 & 4)
  const showcaseCardRef = useRef<HTMLDivElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const specPanelRef = useRef<HTMLDivElement | null>(null);
  const specItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const blackFadeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let splitName: SplitType | null = null;
    let splitLine1: SplitType | null = null;
    let splitLine2: SplitType | null = null;
    let splitIntroBody: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinStageRef.current) return;

      const runSplit = () => {
        if (splitName) splitName.revert();
        if (splitLine1) splitLine1.revert();
        if (splitLine2) splitLine2.revert();
        if (splitIntroBody) splitIntroBody.revert();

        if (nameRef.current) {
          splitName = new SplitType(nameRef.current, {
            types: "chars",
            charClass: "inline-block will-change-transform",
          });
          if (!splitName.chars || splitName.chars.length === 0) {
            console.warn("[MarinShowcase] splitName chars were empty, retrying SplitType");
            splitName = new SplitType(nameRef.current, {
              types: "chars",
              charClass: "inline-block will-change-transform",
            });
          }
        }
        if (line1Ref.current) {
          splitLine1 = new SplitType(line1Ref.current, {
            types: "words",
            wordClass: "inline-block mr-[0.2em] will-change-transform",
          });
        }
        if (line2Ref.current) {
          splitLine2 = new SplitType(line2Ref.current, {
            types: "words",
            wordClass: "inline-block mr-[0.2em] will-change-transform",
          });
        }
        if (introBodyRef.current) {
          splitIntroBody = new SplitType(introBodyRef.current, {
            types: "words",
            wordClass: "inline-block mr-[0.25em] will-change-transform",
          });
        }

        // Initial Element States
        if (introGroupRef.current) {
          gsap.set(introGroupRef.current, { opacity: 1, y: 0 });
        }
        if (showcaseCardRef.current) {
          gsap.set(showcaseCardRef.current, {
            scale: 0.88,
            opacity: 0,
            y: 50,
            rotateY: -4,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          });
        }
        if (blackFadeRef.current) {
          gsap.set(blackFadeRef.current, { opacity: 0 });
        }
        specItemsRef.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0.3, x: -15 });
        });
      };

      runSplit();

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const isMobile = context.conditions?.isMobile ?? false;

          const master = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              pin: pinStageRef.current,
              scrub: isMobile ? 0.5 : 0.8,
              fastScrollEnd: true,
              preventOverlaps: true,
              invalidateOnRefresh: true,
            },
          });

          // ── BEAT 1 (0 → 0.14): Intro Text Hold & Subtle Upward Drift ──
          master.to(
            introGroupRef.current,
            {
              y: -15,
              duration: 0.14,
              ease: "none",
            },
            0
          );

          // ── BEAT 2 (0.14 → 0.32): DRAMATIC TEXT EXPLOSION & CLEAR ──
          if (eyebrowRef.current) {
            master.to(
              eyebrowRef.current,
              {
                opacity: 0,
                y: -50,
                scale: 0.8,
                duration: 0.12,
                ease: "power2.in",
              },
              0.14
            );
          }

          const lineWords = [
            ...(splitLine1?.words || []),
            ...(splitLine2?.words || []),
          ];
          const lineDist = isMobile ? 100 : 280;
          if (lineWords.length > 0) {
            master.to(
              lineWords,
              {
                x: (i) => (i % 2 === 0 ? -lineDist : lineDist),
                y: (i) => (isMobile ? -40 : -120) + (i % 3) * (isMobile ? 15 : 40),
                scale: 0.2,
                opacity: 0,
                rotation: (i) => (i % 2 === 0 ? -25 : 25),
                duration: 0.16,
                stagger: 0.008,
                ease: "power3.in",
              },
              0.14
            );
          }

          const bodyWords = splitIntroBody?.words || [];
          const bodyDist = isMobile ? 120 : 320;
          if (bodyWords.length > 0) {
            master.to(
              bodyWords,
              {
                x: (i) => (i % 2 === 0 ? -bodyDist : bodyDist),
                y: (i) => (isMobile ? 40 : 120) + (i % 4) * (isMobile ? 15 : 30),
                scale: 0.15,
                opacity: 0,
                rotation: (i) => (i % 2 === 0 ? 30 : -30),
                duration: 0.16,
                stagger: 0.006,
                ease: "power3.in",
              },
              0.14
            );
          }

          const nameChars = splitName?.chars || [];
          const charDist = isMobile ? 130 : 450;
          const charYDist = isMobile ? -120 : -320;
          if (nameChars.length > 0) {
            const count = nameChars.length;
            const centerIndex = (count - 1) / 2;

            master.to(
              nameChars,
              {
                x: (i) => {
                  const norm = (i - centerIndex) / (centerIndex || 1);
                  return norm * charDist + (i % 2 === 0 ? 20 : -20);
                },
                y: (i) => {
                  const norm = Math.abs((i - centerIndex) / (centerIndex || 1));
                  return charYDist - norm * (isMobile ? 30 : 80) + (i % 2 === 0 ? -15 : 15);
                },
                scale: isMobile ? 1.3 : 1.8,
                opacity: 0,
                rotation: (i) => (i - centerIndex) * (isMobile ? 18 : 35) + (i % 2 === 0 ? 12 : -12),
                duration: 0.18,
                stagger: {
                  from: "center",
                  amount: 0.08,
                },
                ease: "power4.in",
              },
              0.14
            );
          } else {
            console.warn("[MarinShowcase] splitName chars were empty during timeline build!");
          }

          if (introGroupRef.current) {
            master.to(
              introGroupRef.current,
              {
                opacity: 0,
                duration: 0.04,
              },
              0.30
            );
          }

          // ── BEAT 3 (0.35 → 0.88): STABLE SHOWCASE READ & FOCUS WINDOW ──
          if (showcaseCardRef.current) {
            master.to(
              showcaseCardRef.current,
              {
                scale: 1,
                opacity: 1,
                y: 0,
                rotateY: 0,
                duration: 0.18,
                ease: "power3.out",
              },
              0.35
            );
          }

          specItemsRef.current.forEach((el, idx) => {
            if (el) {
              master.to(
                el,
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.14,
                  ease: "power2.out",
                },
                0.42 + idx * 0.04
              );
            }
          });

          if (showcaseCardRef.current) {
            master.to(
              showcaseCardRef.current,
              {
                y: -8,
                duration: 0.35,
                ease: "none",
              },
              0.50
            );
          }

          if (imageFrameRef.current) {
            const img = imageFrameRef.current.querySelector("img");
            if (img) {
              master.to(
                img,
                {
                  scale: 1.05,
                  duration: 0.35,
                  ease: "none",
                },
                0.50
              );
            }
          }

          // ── BEAT 4 (0.88 → 1.0): Clean Handoff Pass-Through ──
          if (showcaseCardRef.current) {
            master.to(
              showcaseCardRef.current,
              {
                scale: 0.95,
                opacity: 0,
                y: -25,
                duration: 0.12,
                ease: "power2.in",
              },
              0.88
            );
          }

          if (blackFadeRef.current) {
            master.to(
              blackFadeRef.current,
              {
                opacity: 1,
                duration: 0.12,
                ease: "power2.inOut",
              },
              0.88
            );
          }
        }
      );

      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          runSplit();
          ScrollTrigger.refresh();
        });
      }
    }, containerRef);

    return () => {
      if (splitName) splitName.revert();
      if (splitLine1) splitLine1.revert();
      if (splitLine2) splitLine2.revert();
      if (splitIntroBody) splitIntroBody.revert();
      ctx.revert();
    };
  }, [t]);

  return (
    <section
      ref={containerRef}
      id="marin"
      className="relative w-full h-[320svh] min-h-[320vh] md:h-[500vh] bg-[var(--color-black)] select-none font-sans"
    >
      {/* Pinned Full-Viewport Stage */}
      <div
        ref={pinStageRef}
        className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#241c1e] via-[#141210] to-[#080706]"
      >
        {/* Warm High-Contrast Stage Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[1000px] sm:h-[1000px] bg-[var(--color-gold)]/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Black Handoff Fade-Out Overlay (BEAT 4) */}
        <div
          ref={blackFadeRef}
          className="absolute inset-0 z-40 bg-[var(--color-black)] pointer-events-none opacity-0"
        />

        {/* ── INTRO WORDMARK BLOCK (BEAT 1 & 2) ── */}
        <div
          ref={introGroupRef}
          className="absolute z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto pointer-events-none"
        >
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="flex items-center gap-3 mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-[var(--color-gold)] font-medium">
              {t("eyebrow")}
            </span>
          </div>

          {/* MARIN Wordmark */}
          <h2
            ref={nameRef}
            className="text-7xl sm:text-8xl md:text-9xl font-light tracking-[0.2em] text-[var(--color-cream)] uppercase font-sans leading-none my-2 sm:my-3 drop-shadow-md"
          >
            {t("name")}
          </h2>

          {/* Sublines Line 1 & Line 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xl sm:text-3xl md:text-4xl font-light text-[var(--color-cream)] my-3 sm:my-4">
            <p ref={line1Ref} className="italic text-[var(--color-cream)]">
              {t("line1")}
            </p>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] opacity-70" />
            <p ref={line2Ref} className="text-[var(--color-gold)] font-normal">
              {t("line2")}
            </p>
          </div>

          {/* Body Paragraph */}
          <p
            ref={introBodyRef}
            className="text-sm sm:text-base md:text-lg font-light text-[var(--color-stone)] tracking-wide max-w-xl text-center leading-relaxed mt-4 sm:mt-6 opacity-90"
          >
            {t("body")}
          </p>
        </div>

        {/* ── UNBOXED ULTRA-MINIMALIST SHOWCASE LAYOUT (BEAT 3 & 4) ── */}
        <div
          ref={showcaseCardRef}
          className="relative z-30 w-full max-w-6xl mx-auto px-6 sm:px-12 py-4 opacity-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* LEFT COLUMN: FLOATING ARCHITECTURAL PHOTO FRAME */}
            <div className="lg:col-span-7 relative">
              {/* Photo Stage Ambient Backlight Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[var(--color-gold)]/20 via-transparent to-transparent rounded-full blur-[90px] pointer-events-none" />

              <div
                ref={imageFrameRef}
                className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-white/15 bg-black/80 shadow-[0_30px_90px_rgba(0,0,0,0.95)] transition-colors duration-700 hover:border-[var(--color-gold)]/50 group"
              >
                <img
                  src="/images/collection/marin.jpg"
                  alt="MARIN Double Vanity Suite"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* RIGHT COLUMN: HIGH-CONTRAST EDITORIAL SPECIFICATIONS & STORY */}
            <div
              ref={specPanelRef}
              className="lg:col-span-5 flex flex-col justify-center text-left"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_10px_rgba(184,146,90,0.8)]" />
                <span className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)] font-medium">
                  {t("eyebrow")}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--color-cream)] uppercase font-sans leading-none drop-shadow-md">
                {t("name")}
              </h3>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--color-gold)] font-sans font-medium mt-2">
                Dual Suite — Organic Form
              </p>

              {/* Minimalist Line Divider */}
              <div className="w-16 h-[1px] bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-gold)]/50 to-transparent my-5" />

              {/* High-Contrast Specifications List */}
              <div className="flex flex-col gap-4 my-2">
                {/* Spec 1 */}
                <div
                  ref={(el) => {
                    specItemsRef.current[0] = el;
                  }}
                  className="flex flex-col border-l-2 border-[var(--color-gold)] pl-4 py-0.5"
                >
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)]/90 font-medium">
                    {t("spec1Title")}
                  </span>
                  <span className="text-base font-normal text-[var(--color-cream)] mt-1 font-sans">
                    {t("spec1Val")}
                  </span>
                </div>

                {/* Spec 2 */}
                <div
                  ref={(el) => {
                    specItemsRef.current[1] = el;
                  }}
                  className="flex flex-col border-l-2 border-[var(--color-gold)] pl-4 py-0.5"
                >
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)]/90 font-medium">
                    {t("spec2Title")}
                  </span>
                  <span className="text-base font-normal text-[var(--color-cream)] mt-1 font-sans">
                    {t("spec2Val")}
                  </span>
                </div>

                {/* Spec 3 */}
                <div
                  ref={(el) => {
                    specItemsRef.current[2] = el;
                  }}
                  className="flex flex-col border-l-2 border-[var(--color-gold)] pl-4 py-0.5"
                >
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)]/90 font-medium">
                    {t("spec3Title")}
                  </span>
                  <span className="text-base font-normal text-[var(--color-cream)] mt-1 font-sans">
                    {t("spec3Val")}
                  </span>
                </div>
              </div>

              {/* Story Body Paragraph */}
              <p className="text-sm sm:text-base font-light text-[var(--color-cream)]/85 tracking-wide leading-relaxed mt-6">
                {t("body")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
