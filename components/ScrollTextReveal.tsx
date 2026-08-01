"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollTextReveal() {
  const t = useTranslations("philosophy");
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    let splitInstance: SplitType | null = null;
    let isCancelled = false;

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !paragraphRef.current) return;

      const initAnimation = () => {
        if (isCancelled || !paragraphRef.current || !sectionRef.current) return;

        // 1. Split paragraph into individual words cleanly
        splitInstance = new SplitType(paragraphRef.current, {
          types: "words",
          wordClass: "inline-block mr-[0.25em] my-[0.08em]",
        });

        const words = splitInstance.words;
        if (!words || words.length === 0) return;

        // 2. Set initial dim state on all word spans (25% opacity stone color)
        gsap.set(words, {
          color: "rgba(156, 144, 134, 0.25)",
          opacity: 0.25,
        });

        // 3. Eyebrow reveal animation
        if (eyebrowRef.current) {
          gsap.fromTo(
            eyebrowRef.current,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                end: "top 65%",
                scrub: 0.5,
              },
            }
          );
        }

        // 4. Compact scrub-on-scroll word-by-word reveal (NO PINNING, min-h-[25vh])
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        // Scrub from dim stone (25% opacity) to bright cream (#E8DFD3)
        tl.fromTo(
          words,
          {
            color: "rgba(156, 144, 134, 0.25)",
            opacity: 0.25,
          },
          {
            color: "rgba(232, 223, 211, 1)",
            opacity: 1,
            stagger: 0.1,
            ease: "none",
          }
        );

        // Refresh ScrollTrigger calculations after text splitting & font loading
        ScrollTrigger.refresh();
      };

      // Ensure fonts are fully loaded before calculating text split & metrics
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          initAnimation();
        });
      } else {
        initAnimation();
      }

      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (splitInstance) splitInstance.revert();
          initAnimation();
        }, 250);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
      };
    }, sectionRef);

    return () => {
      isCancelled = true;
      if (splitInstance) {
        splitInstance.revert();
      }
      ctx.revert();
    };
  }, [t]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative min-h-[25vh] w-full py-14 sm:py-20 md:py-24 px-5 sm:px-8 md:px-16 flex flex-col items-center justify-center bg-[var(--color-black)] text-[var(--color-cream)] select-none font-sans"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow Label */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-2.5 mb-5 md:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
          <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-[var(--color-gold)] font-medium font-sans">
            {t("eyebrow")}
          </span>
        </div>

        {/* Refined Compact Editorial Paragraph */}
        <p
          ref={paragraphRef}
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal font-sans tracking-tight leading-snug md:leading-normal text-center"
        >
          {t("text")}
        </p>
      </div>
    </section>
  );
}
