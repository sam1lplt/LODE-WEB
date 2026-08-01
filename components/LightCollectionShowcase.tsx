"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface ProductSpec {
  labelKey: string;
  valueKey: string;
  defaultLabel: string;
  defaultValue: string;
}

export interface ProductItem {
  id: string;
  translationKey: string;
  defaultName: string;
  defaultTag: string;
  defaultSubtitle: string;
  defaultDesc: string;
  image: string;
  specs: ProductSpec[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: "onyx",
    translationKey: "onyx",
    defaultName: "ONYX",
    defaultTag: "YEŞİL ONİKS SERİSİ",
    defaultSubtitle: "Mat Akrilik & Doğal Oniks Mermer",
    defaultDesc: "Adaçayı yeşilinin dinginliği, altın damarlı yeşil oniks mermerin büyüleyici derinliğiyle buluşuyor.",
    image: "/images/collection/onyx.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Adaçayı Yeşili Mat Akrilik",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Duvar Paneli",
        defaultValue: "Doğal Yeşil Oniks Mermer",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Ayna",
        defaultValue: "Pirinç Çerçeveli Dairesel Ayna",
      },
    ],
  },
  {
    id: "ava",
    translationKey: "ava",
    defaultName: "AVA",
    defaultTag: "MİMARİ BANYO SERİSİ",
    defaultSubtitle: "Doğal Taş & Özel Ahşap Kaplama",
    defaultDesc: "AVA serisi, modern mimari çizgileri doğal malzeme dokularıyla buluşturan rafine banyo tasarımı sunar.",
    image: "/images/products/ava.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Üst Yüzey",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Ayna Detayı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
    ],
  },
  {
    id: "eron",
    translationKey: "eron",
    defaultName: "ERON",
    defaultTag: "LÜKS MİMARİ SERİ",
    defaultSubtitle: "Özel Kabine & Doğal Mermer",
    defaultDesc: "ERON mimari serisi, keskin minimalist hatları ve özel üretim detaylarıyla mekanlara karakter katar.",
    image: "/images/products/eron.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Tezgah",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Aksesuar",
        defaultValue: "Özellik Detayı Eklenecek",
      },
    ],
  },
  {
    id: "ilya",
    translationKey: "ilya",
    defaultName: "ILYA",
    defaultTag: "DOĞAL AHŞAP SERİSİ",
    defaultSubtitle: "Masif Ahşap & Honlanmış Taş",
    defaultDesc: "ILYA serisi, masif dokuların zarafetini yalın mimari formlarla buluşturan özel banyo koleksiyonudur.",
    image: "/images/products/ilya.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Üst Yüzey",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Ayna",
        defaultValue: "Özellik Detayı Eklenecek",
      },
    ],
  },
  {
    id: "ilya-antrasit",
    translationKey: "ilya-antrasit",
    defaultName: "ILYA ANTRASİT",
    defaultTag: "ANTRASİT KOLEKSİYONU",
    defaultSubtitle: "Mat Antrasit & Doğal Taş",
    defaultDesc: "ILYA Antrasit, koyu tonların derinliğini ve modern mimari estetiği banyolarınıza taşır.",
    image: "/images/products/ilya-antrasit.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Tezgah",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Ayna",
        defaultValue: "Özellik Detayı Eklenecek",
      },
    ],
  },
  {
    id: "ilya-glory",
    translationKey: "ilya-glory",
    defaultName: "ILYA GLORY",
    defaultTag: "",
    defaultSubtitle: "Pirinç Detaylı Özel Kaplama",
    defaultDesc: "ILYA Glory, özel pirinç detayları ve zengin yüzey dokularıyla mimari banyo tasarımında zirveyi temsil eder.",
    image: "/images/products/ilya-glory.jpg",
    specs: [
      {
        labelKey: "spec1Title",
        valueKey: "spec1Val",
        defaultLabel: "Gövde Yapısı",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec2Title",
        valueKey: "spec2Val",
        defaultLabel: "Tezgah",
        defaultValue: "Özellik Detayı Eklenecek",
      },
      {
        labelKey: "spec3Title",
        valueKey: "spec3Val",
        defaultLabel: "Ayna",
        defaultValue: "Özellik Detayı Eklenecek",
      },
    ],
  },
];

export default function LightCollectionShowcase() {
  const t = useTranslations("lightCollection");

  const [activeIndex, setActiveIndex] = useState(0);

  // Refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const specRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const count = PRODUCTS.length;
  const currentProduct = PRODUCTS[activeIndex];

  // Helper to resolve localized text safely
  const getProductText = (key: string, defaultVal: string) => {
    try {
      const fullKey = `products.${currentProduct.translationKey}.${key}`;
      const res = t(fullKey);
      if (res && res !== fullKey) return res;
    } catch {
      // fallback
    }
    return defaultVal;
  };

  // GSAP ScrollTrigger Entrance Animation (start: "top 75%", once: true)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Card stage entrance
      if (cardContainerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardContainerRef.current,
            start: "top 75%",
            once: true,
          },
        });

        if (imageFrameRef.current) {
          tl.fromTo(
            imageFrameRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
            0
          );
        }

        if (rightColRef.current) {
          tl.fromTo(
            rightColRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
            0.15
          );
        }

        if (dividerRef.current) {
          tl.fromTo(
            dividerRef.current,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: "left", duration: 0.8, ease: "power2.out" },
            0.3
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Carousel Navigation Handler with GSAP Stagger Animation
  const navigate = useCallback(
    (direction: "next" | "prev" | number) => {
      if (isAnimating.current) return;

      let targetIndex = activeIndex;
      let travelDir = 1; // 1 = next, -1 = prev

      if (typeof direction === "number") {
        if (direction === activeIndex) return;
        travelDir = direction > activeIndex ? 1 : -1;
        targetIndex = (direction + count) % count;
      } else if (direction === "next") {
        travelDir = 1;
        targetIndex = (activeIndex + 1) % count;
      } else {
        travelDir = -1;
        targetIndex = (activeIndex - 1 + count) % count;
      }

      isAnimating.current = true;

      const outgoingDrift = travelDir * -40;
      const incomingDrift = travelDir * 40;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      // 1. OUTGOING ANIMATION (~0.25s)
      if (currentImgRef.current) {
        tl.to(
          currentImgRef.current,
          {
            x: outgoingDrift,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
          },
          0
        );
      }

      const outgoingElements = [
        tagRef.current,
        nameRef.current,
        subtitleRef.current,
        ...specRowsRef.current.filter(Boolean),
        descRef.current,
      ].filter(Boolean);

      if (outgoingElements.length > 0) {
        tl.to(
          outgoingElements,
          {
            y: -15,
            opacity: 0,
            duration: 0.22,
            stagger: 0.03,
            ease: "power2.in",
          },
          0
        );
      }

      // 2. STATE CHANGE AT MIDPOINT
      tl.call(() => {
        setActiveIndex(targetIndex);
      });

      // 3. INCOMING ANIMATION (~0.35s)
      if (currentImgRef.current) {
        tl.fromTo(
          currentImgRef.current,
          { x: incomingDrift, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "<"
        );
      }

      if (tagRef.current) {
        tl.fromTo(
          tagRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          "<"
        );
      }

      if (nameRef.current) {
        // Name leads the motion with slightly more travel
        tl.fromTo(
          nameRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.38, ease: "power2.out" },
          "<0.03"
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          "<0.03"
        );
      }

      // Spec rows & gold left-border accents
      specRowsRef.current.forEach((row, idx) => {
        if (!row) return;
        tl.fromTo(
          row,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          `<${0.04 * (idx + 1)}`
        );

        const accentLine = row.querySelector<HTMLElement>(".gold-border-accent");
        if (accentLine) {
          tl.fromTo(
            accentLine,
            { scaleY: 0 },
            { scaleY: 1, transformOrigin: "top", duration: 0.3, ease: "power2.out" },
            "<"
          );
        }
      });

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          "<0.04"
        );
      }
    },
    [activeIndex, count]
  );

  // Keyboard left/right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        navigate("prev");
      } else if (e.key === "ArrowRight") {
        navigate("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

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

  // 3D Parallax Mouse Tilt Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageFrameRef.current) return;
    const rect = imageFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / rect.height) * 6;
    const rotateY = (x / rect.width) * 6;

    gsap.to(imageFrameRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!imageFrameRef.current) return;
    gsap.to(imageFrameRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="light-edition"
      className="relative w-full py-20 sm:py-32 bg-[var(--color-light-bg,#F2EDE6)] text-[var(--color-light-text,#2A2522)] font-sans overflow-hidden border-t border-[var(--color-gold)]/20"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a252206_1px,transparent_1px),linear-gradient(to_bottom,#2a252206_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Ambient Warm Golden Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-gold)]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-12">
        {/* ── SECTION HEADER ── */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-12 sm:mb-24">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_rgba(184,146,90,0.6)]" />
            <span className="text-xs uppercase tracking-[0.4em] text-[var(--color-gold)] font-semibold">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="text-3xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--color-light-text,#2A2522)] uppercase leading-none font-sans">
            {t("title")}
          </h2>

          <p className="text-xs sm:text-base font-light text-[var(--color-stone)] tracking-wide max-w-xl mt-3 sm:mt-4 leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent mt-5 sm:mt-6" />
        </div>

        {/* ── PRODUCT CAROUSEL CONTAINER (UNBOXED ARCHITECTURAL LAYOUT) ── */}
        <div
          ref={cardContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative max-w-6xl mx-auto py-4 sm:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* LEFT COLUMN: FLOATING PHOTO FRAME */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="lg:col-span-7 flex flex-col gap-4 relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* PREV / NEXT NAV BUTTONS (CENTERED RELATIVE TO PHOTO FRAME) */}
              <button
                type="button"
                onClick={() => navigate("prev")}
                aria-label="Previous Product"
                className="absolute left-2 sm:left-3 lg:-left-12 top-[42%] lg:top-1/2 -translate-y-1/2 z-40 w-11 h-11 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 rounded-full border border-[var(--color-gold)]/60 text-[var(--color-light-text,#2A2522)] bg-[#F2EDE6]/90 hover:bg-[var(--color-gold)] hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-md group shadow-md"
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

              <button
                type="button"
                onClick={() => navigate("next")}
                aria-label="Next Product"
                className="absolute right-2 sm:right-3 lg:-right-12 top-[42%] lg:top-1/2 -translate-y-1/2 z-40 w-11 h-11 min-w-[44px] min-h-[44px] sm:w-12 sm:h-12 rounded-full border border-[var(--color-gold)]/60 text-[var(--color-light-text,#2A2522)] bg-[#F2EDE6]/90 hover:bg-[var(--color-gold)] hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-md group shadow-md"
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

              {/* Photo Backlight Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-[var(--color-gold)]/15 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

              {/* Proportioned Photo Stage */}
              <div
                ref={imageFrameRef}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-black/10 bg-[#e5ded4] shadow-[0_25px_70px_rgba(42,37,34,0.12)] transition-shadow duration-500 hover:shadow-[0_35px_90px_rgba(42,37,34,0.18)] group"
              >
                <img
                  ref={currentImgRef}
                  src={currentProduct.image}
                  alt={currentProduct.defaultName}
                  onError={(e) => {
                    // Fallback to onyx image if specific product image is missing
                    (e.target as HTMLImageElement).src = "/images/collection/onyx.jpg";
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-100"
                />

                {/* Soft Ambient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-20" />
              </div>

              {/* DASH INDEX INDICATOR BELOW IMAGE */}
              <div className="flex items-center justify-between px-1 mt-2">
                <span className="text-xs font-sans tracking-[0.25em] text-[var(--color-gold)] font-medium">
                  0{activeIndex + 1} <span className="opacity-40">/</span> 0{count}
                </span>

                <div className="flex items-center gap-1.5">
                  {PRODUCTS.map((prod, idx) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => navigate(idx)}
                      aria-label={`Go to ${prod.defaultName}`}
                      className="min-h-[44px] min-w-[28px] inline-flex items-center justify-center py-2 cursor-pointer group"
                    >
                      <span
                        className={`h-1 rounded-full transition-all duration-500 block ${
                          idx === activeIndex
                            ? "w-8 sm:w-10 bg-[var(--color-gold)] shadow-[0_0_8px_rgba(184,146,90,0.6)]"
                            : "w-4 sm:w-6 bg-[var(--color-stone)]/30 group-hover:bg-[var(--color-gold)]/50"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HIGH-CONTRAST EDITORIAL SPECIFICATIONS */}
            <div ref={rightColRef} className="lg:col-span-5 flex flex-col justify-center text-left">
              {/* Product Tag Badge */}
              {getProductText("tag", currentProduct.defaultTag) ? (
                <div
                  ref={tagRef}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 w-fit mb-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase font-sans">
                    {getProductText("tag", currentProduct.defaultTag)}
                  </span>
                </div>
              ) : (
                <div ref={tagRef} className="h-0 mb-3" />
              )}

              {/* Title & Subtitle */}
              <h3
                ref={nameRef}
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#2A2522] uppercase font-sans leading-none"
              >
                {getProductText("name", currentProduct.defaultName)}
              </h3>
              <p
                ref={subtitleRef}
                className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--color-gold)] font-sans font-medium mt-2"
              >
                {getProductText("subtitle", currentProduct.defaultSubtitle)}
              </p>

              {/* Line Divider */}
              <div
                ref={dividerRef}
                className="w-16 h-[1px] bg-gradient-to-r from-[var(--color-gold)] to-transparent my-5"
              />

              {/* Specifications List */}
              <div className="flex flex-col gap-4 my-2">
                {currentProduct.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    ref={(el) => {
                      specRowsRef.current[sIdx] = el;
                    }}
                    className="relative flex flex-col pl-4 py-0.5"
                  >
                    {/* Gold Left Border Accent */}
                    <div className="gold-border-accent absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-gold)]" />

                    <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)] font-medium">
                      {getProductText(`spec${sIdx + 1}Title`, spec.defaultLabel)}
                    </span>
                    <span className="text-base font-semibold text-[#2A2522] mt-0.5 font-sans">
                      {getProductText(`spec${sIdx + 1}Val`, spec.defaultValue)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description Paragraph */}
              <p
                ref={descRef}
                className="text-sm sm:text-base font-light text-[#2A2522]/80 tracking-wide leading-relaxed mt-6"
              >
                {getProductText("desc", currentProduct.defaultDesc)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
