"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

/* ========================================================================= */
/* LODE CURATED COLLECTION PRODUCTS                                           */
/* Real product photos location: /public/images/collection/                 */
/* ========================================================================= */
const PRODUCTS: Product[] = [
  {
    id: "01",
    name: "IRMA",
    subtitle: "Wall-Mounted Vanity Suite",
    image: "/images/collection/irma.jpg",
  },
  {
    id: "02",
    name: "ELYX",
    subtitle: "Architectural Cabinet",
    image: "/images/collection/elyx.jpg",
  },
  {
    id: "03",
    name: "LUMA",
    subtitle: "Nero Marquina Suite",
    image: "/images/collection/luma.jpg",
  },
];

/* Helper to compute responsive 3D slot styles for GSAP */
const getSlotProps = (slot: "center" | "left" | "right" | "hidden", isMobile: boolean) => {
  switch (slot) {
    case "center":
      return {
        xPercent: -50,
        x: "0%",
        y: 0,
        z: isMobile ? 20 : 90,         // Pushed forward in 3D depth towards camera
        rotateY: 0,                    // Facing straight
        rotateX: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 30,
        pointerEvents: "auto" as const,
      };
    case "left":
      return {
        xPercent: -50,
        x: isMobile ? "-76%" : "-66%",
        y: 0,
        z: isMobile ? -50 : -140,       // Receded back in 3D exhibition gallery depth
        rotateY: isMobile ? 14 : 28,   // Curved 3D rotation angled towards center
        rotateX: 0,
        scale: isMobile ? 0.68 : 0.8,
        opacity: isMobile ? 0.35 : 0.45,
        filter: isMobile ? "blur(3px)" : "blur(3px)",
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    case "right":
      return {
        xPercent: -50,
        x: isMobile ? "76%" : "66%",
        y: 0,
        z: isMobile ? -50 : -140,       // Receded back in 3D exhibition gallery depth
        rotateY: isMobile ? -14 : -28, // Curved 3D rotation angled towards center
        rotateX: 0,
        scale: isMobile ? 0.68 : 0.8,
        opacity: isMobile ? 0.35 : 0.45,
        filter: isMobile ? "blur(3px)" : "blur(3px)",
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    default:
      return {
        xPercent: -50,
        x: "0%",
        y: 0,
        z: -300,
        rotateY: 0,
        rotateX: 0,
        scale: 0.5,
        opacity: 0,
        filter: "blur(12px)",
        zIndex: 0,
        pointerEvents: "none" as const,
      };
  }
};

export default function Collection() {
  const t = useTranslations("collection");
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInitialMount = useRef(true);
  const touchStartX = useRef<number | null>(null);

  const count = PRODUCTS.length;
  const currentProduct = PRODUCTS[activeIndex];

  // Carousel navigation callback
  const navigate = useCallback(
    (direction: "next" | "prev" | number) => {
      if (typeof direction === "number") {
        setActiveIndex((direction + count) % count);
      } else if (direction === "next") {
        setActiveIndex((prev) => (prev + 1) % count);
      } else {
        setActiveIndex((prev) => (prev - 1 + count) % count);
      }
    },
    [count]
  );

  // Set initial 3D GSAP positions & ScrollTrigger entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const isMobile = window.innerWidth < 640;

      // Initial 3D positioning of cards without animation
      PRODUCTS.forEach((_, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        let relativeOffset = (index - activeIndex + count) % count;
        if (relativeOffset > count / 2) relativeOffset -= count;

        let slotName: "center" | "left" | "right" | "hidden" = "hidden";
        if (relativeOffset === 0) slotName = "center";
        else if (relativeOffset === -1) slotName = "left";
        else if (relativeOffset === 1) slotName = "right";

        const props = getSlotProps(slotName, isMobile);
        gsap.set(el, { ...props, opacity: 0 }); // start hidden for entrance

        const goldFrame = el.querySelector<HTMLElement>(".gold-frame");
        const cornerAccents = el.querySelectorAll<HTMLElement>(".corner-accent");
        if (goldFrame) gsap.set(goldFrame, { opacity: slotName === "center" ? 1 : 0 });
        cornerAccents.forEach((accent) => gsap.set(accent, { opacity: slotName === "center" ? 1 : 0 }));
      });

      // ScrollTrigger entrance reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          PRODUCTS.forEach((_, index) => {
            const el = cardRefs.current[index];
            if (!el) return;

            let relativeOffset = (index - activeIndex + count) % count;
            if (relativeOffset > count / 2) relativeOffset -= count;

            let slotName: "center" | "left" | "right" | "hidden" = "hidden";
            if (relativeOffset === 0) slotName = "center";
            else if (relativeOffset === -1) slotName = "left";
            else if (relativeOffset === 1) slotName = "right";

            const props = getSlotProps(slotName, isMobile);

            gsap.to(el, {
              ...props,
              duration: 1.2,
              delay: slotName === "center" ? 0 : 0.2,
              ease: "power3.out",
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []); // Run once on mount

  // Animate 3D cards smoothly when activeIndex changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const isMobile = window.innerWidth < 640;

    PRODUCTS.forEach((_, index) => {
      const el = cardRefs.current[index];
      if (!el) return;

      let relativeOffset = (index - activeIndex + count) % count;
      if (relativeOffset > count / 2) relativeOffset -= count;

      let slotName: "center" | "left" | "right" | "hidden" = "hidden";
      if (relativeOffset === 0) slotName = "center";
      else if (relativeOffset === -1) slotName = "left";
      else if (relativeOffset === 1) slotName = "right";

      const targetProps = getSlotProps(slotName, isMobile);

      gsap.to(el, {
        ...targetProps,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Smoothly transition active gold frame & corner accents
      const goldFrame = el.querySelector<HTMLElement>(".gold-frame");
      const cornerAccents = el.querySelectorAll<HTMLElement>(".corner-accent");

      if (goldFrame) {
        gsap.to(goldFrame, {
          opacity: slotName === "center" ? 1 : 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      cornerAccents.forEach((accent) => {
        gsap.to(accent, {
          opacity: slotName === "center" ? 1 : 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });

    // Text crossfade & subtle 3D slide
    if (titleRef.current && subtitleRef.current && counterRef.current) {
      gsap.fromTo(
        [titleRef.current, subtitleRef.current, counterRef.current],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeIndex, count]);

  // 3D Interactive Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || window.innerWidth < 640) return;
    const rect = stageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const rotX = (-mouseY / rect.height) * 12; // Max 12 deg tilt
    const rotY = (mouseX / rect.width) * 14;   // Max 14 deg tilt

    const centerEl = cardRefs.current[activeIndex];
    if (centerEl) {
      gsap.to(centerEl, {
        rotateX: rotX,
        rotateY: rotY,
        duration: 0.5,
        ease: "power2.out",
      });

      // Parallax move inner image inside frame
      const img = centerEl.querySelector("img");
      if (img) {
        gsap.to(img, {
          x: (mouseX / rect.width) * 16,
          y: (mouseY / rect.height) * 16,
          scale: 1.08,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  const handleMouseLeave = () => {
    const centerEl = cardRefs.current[activeIndex];
    if (centerEl) {
      gsap.to(centerEl, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: "power2.out",
      });
      const img = centerEl.querySelector("img");
      if (img) {
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1.05,
          duration: 0.7,
          ease: "power2.out",
        });
      }
    }
  };

  const touchStartY = useRef<number | null>(null);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        navigate("next");
      } else {
        navigate("prev");
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const productSubtitles: Record<string, string> = {
    "01": t("irmaSubtitle"),
    "02": t("elyxSubtitle"),
    "03": t("lumaSubtitle"),
  };

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative w-full pt-28 md:pt-32 pb-14 md:pb-20 px-4 sm:px-8 md:px-16 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1d1618] via-[#141210] to-[#0a0908] text-[var(--color-cream)] overflow-hidden select-none font-sans"
    >
      {/* Ambient Gold Stage Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[850px] sm:h-[850px] bg-[var(--color-gold)]/6 rounded-full blur-[150px] pointer-events-none" />

      {/* ── TEXT BLOCK ── */}
      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-2 md:mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
        <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-[var(--color-gold)] font-medium">
          {t("eyebrow")}
        </span>
      </div>

      {/* Product Name & Subtitle */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto min-h-[90px] sm:min-h-[110px]">
        <h2
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--color-cream)] uppercase leading-none"
        >
          {currentProduct.name}
        </h2>
        <p
          ref={subtitleRef}
          className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[var(--color-gold)] font-medium mt-2"
        >
          {productSubtitles[currentProduct.id] || currentProduct.subtitle}
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent mx-auto my-3 md:my-4" />

      {/* Counter */}
      <div
        ref={counterRef}
        className="flex items-center justify-center gap-2 mb-6 md:mb-8 text-xs md:text-sm font-sans tracking-[0.2em] font-medium text-[var(--color-stone)]"
      >
        <span>{currentProduct.id}</span>
        <span className="text-[var(--color-gold)]">—</span>
        <span>0{PRODUCTS.length}</span>
      </div>

      {/* ── 3D CAROUSEL STAGE ── */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-6xl mx-auto h-[230px] sm:h-[320px] md:h-[400px] lg:h-[460px] flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]"
      >
        {/* Nav Arrow Left */}
        <button
          type="button"
          onClick={() => navigate("prev")}
          aria-label="Previous Product"
          className="absolute left-2 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--color-gold)]/50 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)] transition-all duration-300 flex items-center justify-center backdrop-blur-md group shadow-2xl"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 3D Floor Spotlight Reflection Beam */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent rounded-full blur-xl pointer-events-none z-0 shadow-[0_0_60px_rgba(212,175,55,0.3)]" />

        {/* PRODUCT CARDS 3D CONTAINER */}
        <div className="relative w-full h-full [transform-style:preserve-3d]">
          {PRODUCTS.map((product, index) => {
            let relativeOffset = (index - activeIndex + count) % count;
            if (relativeOffset > count / 2) relativeOffset -= count;

            const isCenter = relativeOffset === 0;
            const isLeft = relativeOffset === -1;
            const isRight = relativeOffset === 1;

            return (
              <div
                key={product.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => {
                  if (isLeft) navigate("prev");
                  if (isRight) navigate("next");
                }}
                className={`absolute top-0 left-1/2 w-[280px] sm:w-[420px] md:w-[540px] lg:w-[640px] aspect-[16/10] rounded-sm overflow-hidden will-change-transform [transform-style:preserve-3d] ${
                  isCenter ? "cursor-default" : "cursor-pointer"
                }`}
                style={{ transformOrigin: "center center" }}
              >
                {/* 3D Card Glass & Frame Container */}
                <div className="relative w-full h-full p-2.5 sm:p-3.5 md:p-4 border border-[var(--color-stone)]/40 bg-[#141210]/95 shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-colors duration-500 [transform-style:preserve-3d]">
                  {/* Dynamic Active Gold 3D Frame Overlay */}
                  <div className="gold-frame absolute inset-0 border border-[var(--color-gold)]/80 bg-[#171513] shadow-[0_35px_80px_-10px_rgba(59,34,38,0.85)] pointer-events-none transition-opacity duration-500 opacity-0" />

                  {/* Product Image Box with 3D Parallax Depth */}
                  <div className="relative w-full h-full overflow-hidden rounded-sm bg-black/60 z-10 [transform-style:preserve-3d]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105"
                    />
                  </div>

                  {/* Corner Accents (Active Center Only) */}
                  <div className="corner-accent absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[var(--color-gold)]/90 z-20 pointer-events-none opacity-0" />
                  <div className="corner-accent absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[var(--color-gold)]/90 z-20 pointer-events-none opacity-0" />
                  <div className="corner-accent absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[var(--color-gold)]/90 z-20 pointer-events-none opacity-0" />
                  <div className="corner-accent absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[var(--color-gold)]/90 z-20 pointer-events-none opacity-0" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Nav Arrow Right */}
        <button
          type="button"
          onClick={() => navigate("next")}
          aria-label="Next Product"
          className="absolute right-2 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[var(--color-gold)]/50 text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-black)] transition-all duration-300 flex items-center justify-center backdrop-blur-md group shadow-2xl"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── PAGINATION DOT INDICATORS ── */}
      <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8 z-30 relative">
        {PRODUCTS.map((product, idx) => (
          <button
            key={product.id}
            type="button"
            onClick={() => navigate(idx)}
            aria-label={`Go to product ${product.name}`}
            className={`transition-all duration-500 rounded-full ${
              idx === activeIndex
                ? "w-8 h-2 bg-[var(--color-gold)] shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                : "w-2 h-2 bg-[var(--color-stone)]/40 hover:bg-[var(--color-gold)]/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

