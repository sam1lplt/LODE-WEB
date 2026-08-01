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
  const glowOverlayRef = useRef<HTMLDivElement | null>(null);
  const blackFadeRef = useRef<HTMLDivElement | null>(null);

  // Text refs
  const questionRef = useRef<HTMLHeadingElement | null>(null);
  const answerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let splitAnswer: SplitType | null = null;

    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinStageRef.current) return;

      const setupChoreography = () => {
        if (!containerRef.current || !pinStageRef.current) return;

        if (splitAnswer) splitAnswer.revert();

        // 1. Split Answer into Words for Beat 3 reveal
        if (answerRef.current) {
          splitAnswer = new SplitType(answerRef.current, {
            types: "words",
            wordClass: "inline-block mr-[0.25em] will-change-transform",
          });
        }

        // Initial States
        gsap.set(pinStageRef.current, {
          backgroundColor: "#141210",
        });

        if (glowOverlayRef.current) {
          gsap.set(glowOverlayRef.current, {
            opacity: 0,
            scale: 1,
            filter: "blur(20px)",
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
          gsap.set(answerRef.current, {
            opacity: 0,
          });
        }

        const answerWords = splitAnswer?.words || [];
        if (answerWords.length > 0) {
          gsap.set(answerWords, {
            opacity: 0,
            y: 30,
          });
        }

        // Master ScrollTrigger Timeline
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: pinStageRef.current,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // ── BEAT 1 (0 → 0.18): THE QUESTION IN DARKNESS ──
        // Question holds in dim opacity with subtle drift
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

        // ── BEAT 2 (0.18 → 0.42): THE LIGHT FIXTURE FLICKER ──
        // Irregular stepped keyframe flickering sequence like an old filament catching
        if (glowOverlayRef.current && questionRef.current) {
          const flickerTl = gsap.timeline();

          // Rapid uneven flashes on glow overlay & question text opacity
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

          master.add(flickerTl, 0.18);
        }

        // ── BEAT 3 (0.42 → 0.85): FULL ILLUMINATION & PALETTE SHIFT ──
        // 1. Stage background transitions from --color-black (#141210) to --color-light-bg (#F2EDE6)
        master.to(
          pinStageRef.current,
          {
            backgroundColor: "#F2EDE6",
            duration: 0.22,
            ease: "power2.inOut",
          },
          0.42
        );

        // 2. Glow overlay expands, softens, and settles into ambient room light (~0.18)
        if (glowOverlayRef.current) {
          master.to(
            glowOverlayRef.current,
            {
              scale: 2.5,
              filter: "blur(60px)",
              opacity: 0.18,
              duration: 0.22,
              ease: "power2.out",
            },
            0.42
          );
        }

        // 3. Question text scales & fades out
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

        // 4. Answer text ("O zaman ışıkları açalım.") fades in with staggered words
        if (answerRef.current) {
          master.to(
            answerRef.current,
            {
              opacity: 1,
              duration: 0.04,
            },
            0.46
          );
        }

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
        }

        // 5. Header Theme Transition: animate CSS variables on :root to shift Header to dark palette
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
        // Answer holds 100% solid until 0.85, then drifts up and fades out
        if (answerRef.current) {
          master.to(
            answerRef.current,
            {
              y: -50,
              opacity: 0,
              duration: 0.15,
              ease: "power2.in",
            },
            0.85
          );
        }

        // Background stays fully at #F2EDE6 through end of pin, ensuring seamless handoff to next light section
        master.to(
          pinStageRef.current,
          {
            backgroundColor: "#F2EDE6",
            duration: 0.15,
          },
          0.85
        );

        // Refresh calculations
        ScrollTrigger.refresh();
      };

      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          setupChoreography();
        });
      } else {
        setupChoreography();
      }
    }, containerRef);

    return () => {
      if (splitAnswer) splitAnswer.revert();
      ctx.revert();

      // Reset root CSS variables on unmount
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--header-theme-light", "0");
        document.documentElement.style.setProperty("--header-text-color", "#E8DFD3");
      }
    };
  }, [t]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] md:h-[450vh] bg-[var(--color-black)] select-none font-sans"
    >
      {/* Pinned Full-Viewport Stage */}
      <div
        ref={pinStageRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center transition-colors"
      >
        {/* Warm Fixture Radial Glow Overlay */}
        <div
          ref={glowOverlayRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] sm:w-[1000px] sm:h-[1000px] bg-[radial-gradient(ellipse_at_top,_rgba(255,240,215,0.85)_0%,_transparent_75%)] pointer-events-none z-10"
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
