import React from "react";

interface LogoProps {
  variant?: "light" | "dark" | "gold" | "raw";
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

/**
 * LODE Brand Logo Component
 * Renders the official architectural wordmark & tagline.
 * Variants:
 * - "light": Cream (#E8DFD3) for dark backgrounds
 * - "dark": Deep Aubergine (#3B2226) for light backgrounds
 * - "gold": Brass Gold (#B8925A) accent version
 * - "raw": Original source asset
 */
export default function Logo({
  variant = "light",
  className = "h-6 md:h-7 w-auto",
  alt = "LODE — Kitchen + Bathroom",
  style,
}: LogoProps) {
  const logoSrcMap = {
    light: "/images/lode-logo-light.png",
    dark: "/images/lode-logo-dark.png",
    gold: "/images/lode-logo-gold.png",
    raw: "/images/lode-logo.png",
  };

  return (
    <img
      src={logoSrcMap[variant]}
      alt={alt}
      style={style}
      className={`object-contain transition-opacity duration-300 ${className}`}
    />
  );
}
