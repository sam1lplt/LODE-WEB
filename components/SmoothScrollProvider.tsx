"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePreloader } from "@/contexts/PreloaderContext";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const { isPreloading } = usePreloader();

  useEffect(() => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    // Initialize Lenis smooth scrolling instance
    const lenis = new Lenis({
      duration: isTouch ? 0.7 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.0,
    });

    lenisRef.current = lenis;

    // Update ScrollTrigger on Lenis scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis scroll tick with GSAP ScrollTrigger's ticker
    const updateTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTick);

    // Disable lag smoothing in GSAP to prevent jumpy scroll animations
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger on orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      gsap.ticker.remove(updateTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stop/start Lenis based on preloader state
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (isPreloading) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isPreloading]);

  return <>{children}</>;
}
