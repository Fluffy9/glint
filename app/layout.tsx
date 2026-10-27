import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppearanceProvider } from "@/components/appearance-provider";
import { copy, fill } from "@/content";
import { site } from "@/content/site";
import "../design-system/tokens/tokens.css";
import "../design-system/components/bundle.css";
import "./site.css";

export const metadata: Metadata = {
  title: site.name,
  description: fill(copy.meta.description),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const DevRoot =
    process.env.NODE_ENV === "development"
      ? (await import("@/components/dev-root")).DevRoot
      : null;

  return (
    <html lang={site.locale} data-theme={`${site.defaultColor}-${site.defaultMode}`}>
      <body>
        <AppearanceProvider>
          {children}
          {DevRoot ? <DevRoot /> : null}
        </AppearanceProvider>
      </body>
    </html>
  );
}
