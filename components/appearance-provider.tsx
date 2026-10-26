"use client";

import {
  createContext,
  useContext,
  useEffect,
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

type Appearance = {
  band: BandColor;
  mode: AppearanceMode;
  setBand: (band: BandColor) => void;
  setMode: (mode: AppearanceMode) => void;
};

const AppearanceContext = createContext<Appearance | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [band, setBand] = useState<BandColor>(defaultBand);
  const [mode, setMode] = useState<AppearanceMode>(defaultMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeAttribute(band, mode));
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
