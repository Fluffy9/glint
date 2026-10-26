"use client";

import type { CSSProperties } from "react";
import type { BoxMetrics } from "@/lib/glint-box/metrics";
import { MARK_PATH } from "@/lib/glint-box/patterns";

type Props = {
  b: BoxMetrics;
  wayName: string;
  outlined?: boolean;
  rx: number;
  ry: number;
};

export function SlideBox({ b, wayName, outlined = false, rx, ry }: Props) {
  const edge = outlined ? "2px solid #29252c" : "0";
  const labelEdge = outlined ? "2px solid #29252c" : "0";

  const vars = {
    "--rx": `${rx}deg`,
    "--ry": `${ry}deg`,
    "--shift": `${b.shift}px`,
    "--sl": `${b.sl}px`,
    "--W": `${b.W}px`,
    "--D": `${b.D}px`,
    "--H": `${b.H}px`,
    "--W2": `${b.W2}px`,
    "--D2": `${b.D2}px`,
    "--H2": `${b.H2}px`,
    "--nW2": `${b.nW2}px`,
    "--nD2": `${b.nD2}px`,
    "--nH2": `${b.nH2}px`,
    "--Wt": `${b.Wt}px`,
    "--Dt": `${b.Dt}px`,
    "--Ht": `${b.Ht}px`,
    "--Wt2": `${b.Wt2}px`,
    "--Dt2": `${b.Dt2}px`,
    "--Ht2": `${b.Ht2}px`,
    "--nWt2": `${b.nWt2}px`,
    "--nDt2": `${b.nDt2}px`,
    "--nHt2": `${b.nHt2}px`,
    "--frame": `${b.frame}px`,
    "--shW": `${b.shW}px`,
    "--shH": `${b.shH}px`,
    "--shL": `${b.shL}px`,
    "--shT": `${b.shT}px`,
  } as CSSProperties;

  return (
    <div className="gb-pivot" style={vars}>
      <div className="gb-shadow" />
      <div className="gb-sway">
        <div className="gb-rot p3">
          <div className="gb-shift p3">
            <div className="gb-tray p3">
              <div
                className="gb-face gb-tray-top"
                style={{ border: edge, background: "#fffaf2" }}
              >
                <div
                  className="gb-strip"
                  style={{
                    left: b.stripL,
                    display: b.stripDisplay,
                    background:
                      "conic-gradient(rgba(41,37,44,0.30) 25%, transparent 0 50%, rgba(41,37,44,0.30) 0 75%, transparent 0) 0 0 / 6px 6px",
                  }}
                />
                <div
                  className="gb-strip"
                  style={{
                    left: b.stripL2,
                    display: b.stripDisplay,
                    background:
                      "conic-gradient(rgba(41,37,44,0.22) 25%, transparent 0) 0 0 / 6px 6px",
                  }}
                />
                <svg
                  width={b.coilD}
                  height={b.coilD}
                  viewBox={`0 0 ${b.coilD} ${b.coilD}`}
                  aria-hidden
                  className="gb-coil"
                  style={{
                    left: b.coilL,
                    top: b.coilT,
                    display: b.coilDisplay,
                  }}
                >
                  <defs>
                    <clipPath id={b.clipId}>
                      <path clipRule="evenodd" d={b.annulus} />
                    </clipPath>
                  </defs>
                  <path
                    fillRule="evenodd"
                    d={b.annulus}
                    style={{ fill: "var(--gb-accent)" }}
                  />
                  <g clipPath={`url(#${b.clipId})`}>
                    <path className="gb-pat" d={b.patCoil} />
                  </g>
                  <path
                    fillRule="evenodd"
                    d={b.annulus}
                    style={{
                      fill: "none",
                      stroke: b.coilStroke,
                      strokeWidth: 2,
                    }}
                  />
                </svg>
                <div className="gb-tray-hint" style={{ fontSize: b.capFs }}>
                  Slide →
                </div>
              </div>

              <div
                className="gb-face gb-tray-front"
                style={{ border: edge, background: "#fffaf2" }}
              >
                <div className="gb-shade" style={{ background: "rgba(41,37,44,0.05)" }} />
              </div>
              <div
                className="gb-face gb-tray-back"
                style={{ border: edge, background: "#fffaf2" }}
              >
                <div className="gb-shade" style={{ background: "rgba(41,37,44,0.16)" }} />
              </div>

              <div
                className="gb-face gb-tray-end"
                style={{
                  border: edge,
                  background: "#fffaf2",
                  boxShadow: `inset 0 0 0 ${b.frame}px var(--gb-accent)`,
                }}
              >
                <div className="gb-end-mark">
                  <svg
                    width={b.endMark}
                    height={b.endMark}
                    viewBox="0 0 100 100"
                    aria-hidden
                  >
                    <path style={{ fill: "var(--gb-strong)" }} d={MARK_PATH} />
                  </svg>
                </div>
                <div className="gb-shade" style={{ background: "rgba(41,37,44,0.03)" }} />
              </div>
              <div
                className="gb-face gb-tray-end-back"
                style={{ border: edge, background: "#fffaf2" }}
              >
                <div className="gb-shade" style={{ background: "rgba(41,37,44,0.22)" }} />
              </div>
            </div>

            <div
              className="gb-face gb-sleeve-top"
              style={{
                border: edge,
                backgroundImage:
                  "linear-gradient(150deg, rgba(255,255,255,0.32), rgba(255,255,255,0) 42%, rgba(41,37,44,0.07))",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
              }}
            >
              <svg
                width={b.sparkBox}
                height={b.sparkBox}
                viewBox="0 0 100 100"
                aria-hidden
                className="gb-lid-spark"
                style={{ left: "10%", top: "12%", width: b.spA, height: b.spA }}
              >
                <path style={{ fill: "#fffaf2" }} d={MARK_PATH} />
              </svg>
              <svg
                width={b.sparkBox}
                height={b.sparkBox}
                viewBox="0 0 100 100"
                aria-hidden
                className="gb-lid-spark"
                style={{ left: "82%", top: "20%", width: b.spB, height: b.spB }}
              >
                <path style={{ fill: "var(--gb-strong)" }} d={MARK_PATH} />
              </svg>
              <svg
                width={b.sparkBox}
                height={b.sparkBox}
                viewBox="0 0 100 100"
                aria-hidden
                className="gb-lid-spark"
                style={{ left: "13%", top: "78%", width: b.spB, height: b.spB }}
              >
                <path style={{ fill: "var(--gb-strong)" }} d={MARK_PATH} />
              </svg>
              <div className="gb-lid-copy" style={{ gap: b.gap }}>
                <svg
                  width={b.markPx}
                  height={b.markPx}
                  viewBox="0 0 100 100"
                  aria-hidden
                  style={{ position: "static" }}
                >
                  <path style={{ fill: "var(--gb-deepink)" }} d={MARK_PATH} />
                </svg>
                <span
                  className="gb-word"
                  style={{
                    fontSize: b.wordFs,
                    textShadow: `0 ${b.ts}px 0 rgba(255,255,255,0.55)`,
                  }}
                >
                  GLINT
                </span>
                <span className="gb-cap" style={{ fontSize: b.capFs }}>
                  Screenless band
                </span>
              </div>
              <div
                className="gb-sticker"
                style={{
                  padding: `${b.stPadY}px ${b.stPadX}px`,
                  border: labelEdge,
                  boxShadow: b.stShadow,
                  fontSize: b.capFs,
                }}
              >
                20 mm · {wayName}
              </div>
            </div>

            <div
              className="gb-face gb-sleeve-front"
              style={{
                border: edge,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
              }}
            >
              <svg
                width={b.W}
                height={b.H}
                viewBox={`0 0 ${b.W} ${b.H}`}
                aria-hidden
              >
                <path className="gb-pat" d={b.patF} />
              </svg>
            </div>
            <div className="gb-face gb-sleeve-back" style={{ border: edge }}>
              <svg
                width={b.W}
                height={b.H}
                viewBox={`0 0 ${b.W} ${b.H}`}
                aria-hidden
              >
                <path className="gb-pat" d={b.patF} />
              </svg>
              <div className="gb-shade" style={{ background: "rgba(41,37,44,0.14)" }} />
            </div>
            <div className="gb-face gb-sleeve-bottom" style={{ border: edge }}>
              <div className="gb-shade" style={{ background: "rgba(41,37,44,0.25)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
