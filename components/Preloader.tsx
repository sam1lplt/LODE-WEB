"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePreloader } from "@/contexts/PreloaderContext";

const SESSION_KEY = "lode_preloader_played";

export default function Preloader() {
  const { onPreloaderExit } = usePreloader();
  const [shouldRender, setShouldRender] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topHalfRef = useRef<HTMLDivElement | null>(null);
  const bottomHalfRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // Check sessionStorage on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        setShouldRender(false);
        // Fire immediately so Hero doesn't wait
        onPreloaderExit();
      }
    } catch {
      // sessionStorage unavailable — play anyway
    }
    setHasCheckedSession(true);
  }, [onPreloaderExit]);

  // Run the animation sequence once session check is done and we should render
  useEffect(() => {
    if (!hasCheckedSession || !shouldRender) return;
    if (!overlayRef.current || !logoRef.current || !lineRef.current || !topHalfRef.current || !bottomHalfRef.current) return;

    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        // Mark as played
        try {
          sessionStorage.setItem(SESSION_KEY, "true");
        } catch {
          // ignore
        }
        // Re-enable body scroll
        document.body.style.overflow = "";
        // Unmount the preloader DOM
        setShouldRender(false);
      },
    });

    // ── PHASE 1: LOGO REVEAL (0 – 1.2s) ──
    // Logo clip-path wipe from left to right
    tl.fromTo(
      logoRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power3.inOut",
      },
      0
    );

    // Gold line draws out from center
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.inOut",
      },
      0.2
    );

    // ── PHASE 2: HOLD (1.2s – 1.8s) ──
    // Just a pause — timeline naturally holds

    // ── PHASE 3: EXIT (1.8s – 2.8s) ──
    // Logo + line fade out with slight scale up
    tl.to(
      [logoRef.current, lineRef.current],
      {
        scale: 1.08,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      1.8
    );

    // Signal Hero entrance when the overlay split begins
    tl.call(() => {
      onPreloaderExit();
    }, [], 2.0);

    // Split reveal: top half slides up, bottom half slides down
    tl.to(
      topHalfRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      },
      2.1
    );

    tl.to(
      bottomHalfRef.current,
      {
        yPercent: 100,
        duration: 0.8,
        ease: "power4.inOut",
      },
      2.1
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [hasCheckedSession, shouldRender, onPreloaderExit]);

  // Don't render anything during SSR or if session says already played
  if (!hasCheckedSession || !shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-auto"
      aria-hidden="true"
    >
      {/* Top half of the split overlay */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[var(--color-black)]"
      />

      {/* Bottom half of the split overlay */}
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[var(--color-black)]"
      />

      {/* Centered brand intro content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* LODE Logo */}
        <div
          ref={logoRef}
          className="flex items-center justify-center"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <img
            src="/images/lode-logo-light.png"
            alt="LODE"
            className="w-[160px] sm:w-[220px] md:w-[320px] h-auto"
            draggable={false}
          />
        </div>

        {/* Gold accent line */}
        <div
          ref={lineRef}
          className="mt-5 w-20 md:w-28 h-[1px] bg-[var(--color-gold)] origin-center"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
