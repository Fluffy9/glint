import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppearanceProvider } from "@/components/appearance-provider";
import "../design-system/tokens/tokens.css";
import "../design-system/components/bundle.css";
import "./site.css";

export const metadata: Metadata = {
  title: "Glint",
  description: "A screenless fitness band.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="lavender-light">
      <body>
        <AppearanceProvider>{children}</AppearanceProvider>
      </body>
    </html>
  );
}
