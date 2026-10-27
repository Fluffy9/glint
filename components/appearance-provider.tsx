"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type AppearanceMode,
  type BandColor,
  defaultBand,
  defaultMode,
  themeAttribute,
} from "@/lib/appearance";
import { readAppearance, saveAppearance } from "@/lib/appearance-store";

type Appearance = {
  band: BandColor;
  mode: AppearanceMode;
  setBand: (band: BandColor) => void;
  setMode: (mode: AppearanceMode) => void;
};

const AppearanceContext = createContext<Appearance | null>(null);

function applyAppearance(band: BandColor, mode: AppearanceMode) {
  saveAppearance({ band, mode });
  document.documentElement.setAttribute("data-theme", themeAttribute(band, mode));
}

export function AppearanceProvider({
  children,
  initialBand = defaultBand,
  initialMode = defaultMode,
}: {
  children: ReactNode;
  initialBand?: BandColor;
  initialMode?: AppearanceMode;
}) {
  const [band, setBand] = useState(initialBand);
  const [mode, setMode] = useState(initialMode);
  const synced = useRef(false);

  useLayoutEffect(() => {
    if (!synced.current) {
      synced.current = true;
      const stored = readAppearance(localStorage);
      if (stored && (stored.band !== band || stored.mode !== mode)) {
        setBand(stored.band);
        setMode(stored.mode);
        return;
      }
    }
    applyAppearance(band, mode);
  }, [band, mode]);

  return (
    <AppearanceContext.Provider value={{ band, mode, setBand, setMode }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): Appearance {
  const value = useContext(AppearanceContext);
  if (!value) {
    throw new Error("useAppearance needs AppearanceProvider");
  }
  return value;
}
