import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AppearanceProvider } from "@/components/appearance-provider";
import { copy, fill } from "@/content";
import { site } from "@/content/site";
import { themeAttribute } from "@/lib/appearance";
import { APPEARANCE_KEY, appearanceBootScript, readAppearanceCookie } from "@/lib/appearance-store";
import "../design-system/tokens/tokens.css";
import "../design-system/components/bundle.css";
import "./site.css";

export const metadata: Metadata = {
  title: site.name,
  description: fill(copy.meta.description),
};

async function storedAppearance() {
  // Static GitHub Pages export has no per-request cookies.
  if (process.env.GITHUB_PAGES === "1") return null;
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return readAppearanceCookie(jar.get(APPEARANCE_KEY)?.value);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const DevRoot =
    process.env.NODE_ENV === "development"
      ? (await import("@/components/dev-root")).DevRoot
      : null;
  const stored = await storedAppearance();
  const band = stored?.band ?? site.defaultColor;
  const mode = stored?.mode ?? site.defaultMode;

  return (
    <html lang={site.locale} data-theme={themeAttribute(band, mode)} suppressHydrationWarning>
      <body>
        <Script id="glint-appearance-boot" strategy="beforeInteractive">
          {appearanceBootScript}
        </Script>
        <AppearanceProvider initialBand={band} initialMode={mode}>
          {children}
          {DevRoot ? <DevRoot /> : null}
        </AppearanceProvider>
      </body>
    </html>
  );
}
