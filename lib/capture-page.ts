/** Capture the full document to a PNG data URL. Used by the local Dev tools only. */
export async function capturePagePng(): Promise<{ dataUrl: string; filename: string }> {
  const { domToPng } = await import("modern-screenshot");
  const root = document.documentElement;
  const dataUrl = await domToPng(root, {
    width: root.scrollWidth,
    height: root.scrollHeight,
    scale: Math.min(window.devicePixelRatio || 1, 2),
    filter: (node) => {
      if (!(node instanceof Element)) return true;
      if (node.closest("[data-dev-chrome]")) return false;
      if (node.tagName === "NEXTJS-PORTAL") return false;
      return true;
    },
  });
  const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  return { dataUrl, filename: `glint-${stamp}.png` };
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
