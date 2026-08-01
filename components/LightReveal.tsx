"use client";

import React, { useEffect, useRef } from "react";
import SplitType from "split-type";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function LightReveal() {
  const t = useTranslations("lightReveal");

  const containerRef = useRef<HTMLElement | null>(null);
  const pinStageRef = useRef<HTMLDivElement | null>(null);

  // Light & Overlay refs
  const lightBgOverlayRef = useRef<HTMLDivElement | null>(null);
  const glowOverlayRef = useRef<HTMLDivElement | null>(null);

  // Text refs
  const questionRef = useRef<HTMLHeadingElement | null>(null);
  const answerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let splitAnswer: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinStageRef.current) return;

      const runSplit = () => {
        if (splitAnswer) splitAnswer.revert();

        if (answerRef.current) {
          splitAnswer = new SplitType(answerRef.current, {
            types: "words",
            wordClass: "inline-block mr-[0.25em] will-change-transform",
          });
        }

        // Initial Element States
        if (lightBgOverlayRef.current) {
          gsap.set(lightBgOverlayRef.current, { opacity: 0 });
        }

        if (glowOverlayRef.current) {
          gsap.set(glowOverlayRef.current, {
            opacity: 0,
            scale: 1,
          });
        }

        if (questionRef.current) {
          gsap.set(questionRef.current, {
            opacity: 0.4,
            scale: 1,
            y: 0,
            color: "rgba(156, 144, 134, 0.5)",
          });
        }

        if (answerRef.current) {
          gsap.set(answerRef.current, { opacity: 1 });
        }

        const answerWords = splitAnswer?.words || [];
        if (answerWords.length > 0) {
          gsap.set(answerWords, { opacity: 0, y: 30 });
        }
      };

      runSplit();

      // Master ScrollTrigger Timeline
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
              scrub: isMobile ? 0.4 : 0.8,
              fastScrollEnd: true,
              preventOverlaps: true,
              invalidateOnRefresh: true,
            },
          });

          // ── BEAT 1 (0 → 0.18): THE QUESTION IN DARKNESS ──
          if (questionRef.current) {
            master.to(
              questionRef.current,
              {
                y: -10,
                duration: 0.18,
                ease: "none",
              },
              0
            );
          }

          // ── BEAT 2 (0.18 → 0.42): LIGHT FIXTURE FLICKER ──
          if (glowOverlayRef.current && questionRef.current) {
            const flickerTl = gsap.timeline();

            if (isMobile) {
              flickerTl
                .to([glowOverlayRef.current], { opacity: 0.5, duration: 0.06, ease: "none" })
                .to(questionRef.current, { opacity: 0.8, color: "#E8DFD3", duration: 0.06, ease: "none" }, "<")

                .to([glowOverlayRef.current], { opacity: 0.15, duration: 0.05, ease: "none" })
                .to(questionRef.current, { opacity: 0.3, color: "rgba(156, 144, 134, 0.4)", duration: 0.05, ease: "none" }, "<")

                .to([glowOverlayRef.current], { opacity: 1.0, duration: 0.07, ease: "none" })
                .to(questionRef.current, { opacity: 1.0, color: "#FFFFFF", duration: 0.07, ease: "none" }, "<");
            } else {
              flickerTl
                .to([glowOverlayRef.current], { opacity: 0.35, duration: 0.03, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 0.8, color: "#E8DFD3", duration: 0.03, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 0, duration: 0.04, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 0.3, color: "rgba(156, 144, 134, 0.4)", duration: 0.04, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 0.75, duration: 0.05, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 1.0, color: "#E8DFD3", duration: 0.05, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 0.15, duration: 0.03, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 0.4, color: "rgba(156, 144, 134, 0.5)", duration: 0.03, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 0.95, duration: 0.06, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 1.0, color: "#FFFFFF", duration: 0.06, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 0.3, duration: 0.02, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 0.5, color: "#E8DFD3", duration: 0.02, ease: "steps(1)" }, "<")

                .to([glowOverlayRef.current], { opacity: 1.0, duration: 0.02, ease: "steps(1)" })
                .to(questionRef.current, { opacity: 1.0, color: "#FFFFFF", duration: 0.02, ease: "steps(1)" }, "<");
            }

            master.add(flickerTl, 0.18);
          }

          // ── BEAT 3 (0.42 → 0.85): FULL ILLUMINATION & PALETTE SHIFT ──
          if (lightBgOverlayRef.current) {
            master.to(
              lightBgOverlayRef.current,
              {
                opacity: 1,
                duration: 0.22,
                ease: "power2.inOut",
              },
              0.42
            );
          }

          if (glowOverlayRef.current) {
            master.to(
              glowOverlayRef.current,
              {
                scale: isMobile ? 1.8 : 2.5,
                opacity: 0.18,
                duration: 0.22,
                ease: "power2.out",
              },
              0.42
            );
          }

          if (questionRef.current) {
            master.to(
              questionRef.current,
              {
                opacity: 0,
                scale: 0.9,
                duration: 0.12,
                ease: "power2.in",
              },
              0.42
            );
          }

          // Answer text ("O zaman ışıkları açalım.") words reveal
          const answerWords = splitAnswer?.words || [];
          if (answerWords.length > 0) {
            master.to(
              answerWords,
              {
                opacity: 1,
                y: 0,
                duration: 0.16,
                stagger: 0.04,
                ease: "power3.out",
              },
              0.46
            );
          } else if (answerRef.current) {
            master.to(
              answerRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.18,
                ease: "power2.out",
              },
              0.46
            );
          }

          // Header Theme Transition to light edition palette
          master.to(
            ":root",
            {
              "--header-theme-light": 1,
              "--header-text-color": "#2A2522",
              duration: 0.22,
              ease: "power2.inOut",
            },
            0.42
          );

          // ── BEAT 4 (0.85 → 1.0): HOLD AND HANDOFF ──
          if (answerRef.current) {
            master.to(
              answerRef.current,
              {
                y: -40,
                opacity: 0,
                duration: 0.15,
                ease: "power2.in",
              },
              0.85
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
      if (splitAnswer) splitAnswer.revert();
      ctx.revert();

      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--header-theme-light", "0");
        document.documentElement.style.setProperty("--header-text-color", "#E8DFD3");
      }
    };
  }, [t]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300svh] min-h-[300vh] md:h-[450vh] bg-[var(--color-black)] select-none font-sans"
    >
      {/* Pinned Full-Viewport Stage */}
      <div
        ref={pinStageRef}
        className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center bg-[var(--color-black)]"
      >
        {/* Light Background Overlay (GPU opacity composited) */}
        <div
          ref={lightBgOverlayRef}
          className="absolute inset-0 bg-[#F2EDE6] opacity-0 pointer-events-none z-0"
        />

        {/* Static Pre-Blurred Radial Glow Overlay */}
        <div
          ref={glowOverlayRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[900px] sm:h-[900px] bg-[radial-gradient(ellipse_at_top,_rgba(255,240,215,0.9)_0%,_rgba(232,223,211,0.5)_30%,_rgba(184,146,90,0.2)_55%,_transparent_75%)] pointer-events-none opacity-0 z-10"
        />

        {/* ── QUESTION TEXT (BEAT 1 & 2) ── */}
        <h2
          ref={questionRef}
          className="absolute z-20 text-3xl sm:text-6xl md:text-8xl font-light tracking-tight text-center px-5 sm:px-8 font-sans select-none pointer-events-none"
        >
          {t("question")}
        </h2>

        {/* ── ANSWER TEXT (BEAT 3 & 4) ── */}
        <h2
          ref={answerRef}
          className="absolute z-20 text-3xl sm:text-6xl md:text-8xl font-light tracking-tight text-center px-5 sm:px-8 font-sans text-[#2A2522] select-none pointer-events-none"
        >
          {t("answer")}
        </h2>
      </div>
    </section>
  );
}
