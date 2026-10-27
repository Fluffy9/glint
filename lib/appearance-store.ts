import { bandColors, type AppearanceMode, type BandColor } from "@/lib/appearance";

export const APPEARANCE_KEY = "glint-appearance";

export type StoredAppearance = {
  band: BandColor;
  mode: AppearanceMode;
};

const bands = new Set<string>(bandColors.map((color) => color.id));

function decodeAppearance(raw: string): StoredAppearance | null {
  const parsed = JSON.parse(raw) as { band?: unknown; mode?: unknown };
  const band = typeof parsed.band === "string" && bands.has(parsed.band) ? (parsed.band as BandColor) : null;
  const mode = parsed.mode === "light" || parsed.mode === "dark" ? parsed.mode : null;
  if (!band || !mode) return null;
  return { band, mode };
}

export function readAppearance(storage: Pick<Storage, "getItem">): StoredAppearance | null {
  const raw = storage.getItem(APPEARANCE_KEY);
  if (!raw) return null;
  try {
    return decodeAppearance(raw);
  } catch {
    return null;
  }
}

export function readAppearanceCookie(raw: string | undefined): StoredAppearance | null {
  if (!raw) return null;
  for (const value of [raw, safeDecode(raw)]) {
    try {
      return decodeAppearance(value);
    } catch {
      // try the next encoding
    }
  }
  return null;
}

function safeDecode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function saveAppearance(appearance: StoredAppearance): void {
  const json = JSON.stringify(appearance);
  localStorage.setItem(APPEARANCE_KEY, json);
  document.cookie = `${APPEARANCE_KEY}=${encodeURIComponent(json)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

/** Runs before paint when Next injects it via beforeInteractive. */
export const appearanceBootScript = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(APPEARANCE_KEY)});if(!raw)return;var p=JSON.parse(raw);var bands=${JSON.stringify([...bands])};if(bands.indexOf(p.band)<0)return;if(p.mode!=="light"&&p.mode!=="dark")return;document.documentElement.setAttribute("data-theme",p.band+"-"+p.mode);}catch(e){}})();`;
