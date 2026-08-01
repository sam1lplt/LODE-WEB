"use client";

import React, { useEffect, useRef, useCallback } from "react";
import SplitType from "split-type";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePreloader } from "@/contexts/PreloaderContext";

export default function Hero() {
  const t = useTranslations("hero");
  const { isPreloading, registerHeroEntrance } = usePreloader();

  const heroRef = useRef<HTMLElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subtextRef = useRef<HTMLParagraphElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Hero entrance animation — called by PreloaderContext when preloader exits
  const playEntrance = useCallback(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Video fade-in
      gsap.fromTo(
        [videoContainerRef.current, overlayRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      );

      // 2. SplitType headline reveal
      if (headlineRef.current) {
        // Ensure parent h1 element is visible so SplitType line animations are visible
        gsap.set(headlineRef.current, { opacity: 1 });

        const splitInstance = new SplitType(headlineRef.current, {
          types: "lines",
          lineClass: "overflow-hidden py-1",
        });

        if (splitInstance.lines && splitInstance.lines.length > 0) {
          gsap.fromTo(
            splitInstance.lines,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.1,
              ease: "power4.out",
              delay: 0.3,
            }
          );
        } else {
          // Fallback if SplitType does not split lines
          gsap.fromTo(
            headlineRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.3 }
          );
        }
      }

      // 3. Subtext reveal
      if (subtextRef.current) {
        gsap.fromTo(
          subtextRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.5 }
        );
      }

      // 4. Scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            delay: 0.7,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(scrollIndicatorRef.current, {
                y: 8,
                duration: 1.5,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
              });
            },
          }
        );
      }
    }, heroRef);

    return ctx;
  }, []);

  const hasFiredEntrance = useRef(false);

  // Register the entrance callback with PreloaderContext
  useEffect(() => {
    registerHeroEntrance(() => {
      if (!hasFiredEntrance.current) {
        hasFiredEntrance.current = true;
        playEntrance();
      }
    });
  }, [registerHeroEntrance, playEntrance]);

  // React to isPreloading changes — covers both:
  // 1. Preloader was skipped (isPreloading goes false during Preloader's mount effect)
  // 2. Normal preloader exit (isPreloading goes false when Preloader calls onPreloaderExit)
  useEffect(() => {
    if (!isPreloading && !hasFiredEntrance.current) {
      hasFiredEntrance.current = true;
      // Small delay to let DOM settle after hydration
      const timer = setTimeout(() => {
        playEntrance();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPreloading, playEntrance]);

  // ScrollTrigger: parallax recede on scroll (independent of preloader)
  useEffect(() => {
    if (!heroRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scale: 0.95,
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Set initial hidden state for Hero content so it doesn't flash before animation
  const hiddenStyle = { opacity: 0 } as const;

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-[var(--color-black)] select-none pt-24"
    >
      {/* Background Video Container with dark placeholder fallback */}
      <div
        ref={videoContainerRef}
        className="absolute inset-0 z-0 bg-[var(--color-black)] overflow-hidden"
        style={hiddenStyle}
      >
        {/* ========================================================================= */}
        {/* SWAP IN REAL KLING AI-GENERATED LUXURY BATHROOM VIDEO FILE HERE          */}
        {/* Target file path: /videos/hero-bathroom.mp4                               */}
        {/* TODO: Add compressed mobile video source /videos/hero-bathroom-mobile.mp4 */}
        {/* ========================================================================= */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 ease-out origin-center"
        >
          <source src="/videos/hero-bathroom-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/videos/hero-bathroom.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Dark gradient overlay to preserve legibility */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-gradient-to-b from-[var(--color-black)]/70 via-black/30 to-[var(--color-black)]/90 pointer-events-none"
        style={hiddenStyle}
      />

      {/* Subtle status indicator bar (Desktop) */}
      <div className="relative z-20 w-full px-5 py-4 sm:px-8 md:px-16 flex items-center justify-end">
        <div className="hidden sm:flex items-center gap-3 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
          {t("eyebrow")}
        </div>
      </div>

      {/* Hero Centered Content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-5 max-w-4xl mx-auto my-auto">
        {/* Eyebrow Label (Mobile-friendly) */}
        <div className="flex sm:hidden items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
          {t("eyebrow")}
        </div>

        <h1
          ref={headlineRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--color-cream)] leading-[1.2] sm:leading-[1.25] flex flex-col items-center gap-2 sm:gap-3"
          style={hiddenStyle}
        >
          <span className="block font-light uppercase tracking-[0.16em] sm:tracking-[0.24em] text-[var(--color-cream)]/90">
            {t("headlineLine1")}
          </span>
          <span className="block font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-[var(--color-gold)] drop-shadow-sm">
            {t("headlineLine2")}
          </span>
        </h1>

        <p
          ref={subtextRef}
          className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base font-light text-[var(--color-stone)] tracking-wide max-w-xs sm:max-w-md md:max-w-lg leading-relaxed opacity-90"
          style={hiddenStyle}
        >
          {t("subtext")}
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 w-full py-6 sm:py-8 flex flex-col items-center justify-center">
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center cursor-pointer group min-h-[44px] min-w-[44px] justify-center"
          style={hiddenStyle}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-gold)] font-medium mb-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
            {t("scroll")}
          </span>
          <div className="w-[1px] h-8 sm:h-10 bg-gradient-to-b from-[var(--color-gold)] via-[var(--color-gold)]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
