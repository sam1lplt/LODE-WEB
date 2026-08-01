"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface PreloaderContextValue {
  /** True while the preloader overlay is still covering the page */
  isPreloading: boolean;
  /** Called by Preloader when its exit animation starts — Hero can begin its entrance */
  onPreloaderExit: () => void;
  /** Subscribe to preloader exit — Hero registers a callback here */
  registerHeroEntrance: (cb: () => void) => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isPreloading: true,
  onPreloaderExit: () => {},
  registerHeroEntrance: () => {},
});

export function usePreloader() {
  return useContext(PreloaderContext);
}

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isPreloading, setIsPreloading] = useState(true);
  const heroCallbackRef = React.useRef<(() => void) | null>(null);

  const registerHeroEntrance = useCallback((cb: () => void) => {
    heroCallbackRef.current = cb;
  }, []);

  const onPreloaderExit = useCallback(() => {
    setIsPreloading(false);
    // Fire the Hero entrance animation
    if (heroCallbackRef.current) {
      heroCallbackRef.current();
    }
  }, []);

  return (
    <PreloaderContext.Provider value={{ isPreloading, onPreloaderExit, registerHeroEntrance }}>
      {children}
    </PreloaderContext.Provider>
  );
}
