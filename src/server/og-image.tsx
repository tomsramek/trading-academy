import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import type { Level } from "@/lib/content/schema";

/*
 * The picture shown when a link to the academy is shared (Open Graph): the dark theme with the blue
 * glow from the hero, the title and Professor Wick. The image renderer cannot read CSS variables, so
 * the colors below are the dark-theme values of the tokens in globals.css.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const COLORS = {
  background: "#09090b", // zinc-950
  foreground: "#fafafa", // zinc-50
  muted: "#a1a1aa", // zinc-400
  bull: "#22c55e", // green-500
  primary: "#2563eb", // blue-600
  level: {
    beginner: "#4ade80", // green-400
    intermediate: "#60a5fa", // blue-400
    advanced: "#a78bfa", // violet-400
  } satisfies Record<Level, string>,
};

export type WickPose = "standing" | "coffee";

// Professor Wick in the dark theme – the same drawing as ProfessorWickFigure.
function wickSvg(pose: WickPose) {
  const { background: bg, foreground: fg, bull, primary, muted } = COLORS;
  const cap = (transform: string, tassel: number) =>
    `<g transform="${transform}" fill="${fg}" stroke="${fg}" stroke-linejoin="round"><polygon points="-40,0 0,-18 40,0 0,18" stroke-width="3"/><line x1="${tassel}" y1="4" x2="${tassel}" y2="26" stroke-width="3"/><circle cx="${tassel}" cy="29" r="4" stroke="none"/></g>`;
  const body = `<line x1="120" y1="150" x2="120" y2="186" stroke="${bull}" stroke-width="6"/><rect x="96" y="70" width="48" height="84" rx="10" fill="${bull}"/>`;
  const figure =
    pose === "standing"
      ? `${body}<circle cx="110" cy="100" r="4.5" fill="${bg}"/><circle cx="130" cy="100" r="4.5" fill="${bg}"/><path d="M108 116 q12 12 24 0" fill="none" stroke="${bg}" stroke-width="4" stroke-linecap="round"/>${cap("translate(120 58)", 32)}`
      : `${body}<g fill="none" stroke="${bg}" stroke-linecap="round"><path d="M104 99 h12 M124 99 h12" stroke-width="4"/><path d="M106 101 q4 4 8 0 M126 101 q4 4 8 0" stroke-width="3"/><path d="M105 108 q5 3 10 0 M125 108 q5 3 10 0" stroke-width="2.5" opacity="0.4"/></g><path d="M112 122 q8 7 16 0" fill="none" stroke="${bg}" stroke-width="4" stroke-linecap="round"/><path d="M143 122 q12 6 17 -2" fill="none" stroke="${bull}" stroke-width="6" stroke-linecap="round"/><rect x="156" y="104" width="30" height="34" rx="5" fill="${primary}"/><path d="M186 112 q11 0 11 9 q0 9 -11 9" fill="none" stroke="${primary}" stroke-width="5"/><path d="M164 122 v10 M171 116 v12 M178 111 v12" stroke="${fg}" stroke-width="2" stroke-linecap="round"/><g fill="${fg}"><rect x="162" y="124" width="4" height="5"/><rect x="169" y="118" width="4" height="7"/><rect x="176" y="113" width="4" height="7"/></g><g fill="none" stroke="${muted}" stroke-width="3" stroke-linecap="round"><path d="M164 98 q-5 -7 0 -14 q5 -7 0 -14"/><path d="M176 96 q-5 -7 0 -14 q5 -7 0 -14"/></g>${cap("translate(118 58) rotate(-8)", 32)}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 30 160 165">${figure}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// The logo from src/app/icon.svg and the site font (Geist, OFL – src/assets/fonts), read once.
// The font bundled with next/og has no semibold and spaces words too widely.
let assets:
  Promise<{ logo: string; regular: Buffer; semibold: Buffer }> | undefined;
function loadAssets() {
  assets ??= Promise.all([
    readFile(path.join(process.cwd(), "src/app/icon.svg")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")),
  ]).then(([logo, regular, semibold]) => ({
    logo: `data:image/svg+xml;base64,${logo.toString("base64")}`,
    regular,
    semibold,
  }));
  return assets;
}

type OgImageOptions = {
  title: string;
  // A line above the title – the course of a lesson, or the site's tagline.
  eyebrow?: string;
  level?: { value: Level; label: string };
  // The bottom line, e.g. "Free · trading-academy.app".
  footer: string;
  pose: WickPose;
};

export async function ogImage({
  title,
  eyebrow,
  level,
  footer,
  pose,
}: OgImageOptions) {
  const { background, foreground, muted } = COLORS;
  const { logo, regular, semibold } = await loadAssets();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 64,
        backgroundColor: background,
        backgroundImage:
          "radial-gradient(circle at 78% 30%, rgba(37,99,235,0.45), transparent 45%), radial-gradient(circle at 10% 100%, rgba(124,58,237,0.30), transparent 45%)",
        color: foreground,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          paddingRight: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a page */}
          <img src={logo} width={56} height={56} alt="" />
          <span style={{ fontSize: 34, fontWeight: 600 }}>Trading Academy</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {(level ?? eyebrow) && (
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {level && (
                <span
                  style={{
                    display: "flex",
                    padding: "6px 18px",
                    borderRadius: 999,
                    border: `2px solid ${COLORS.level[level.value]}`,
                    color: COLORS.level[level.value],
                    fontSize: 26,
                  }}
                >
                  {level.label}
                </span>
              )}
              {eyebrow && (
                <span style={{ fontSize: 30, color: muted }}>{eyebrow}</span>
              )}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 64 : 76,
              fontWeight: 600,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
        </div>

        <span style={{ fontSize: 28, color: muted }}>{footer}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not a page */}
        <img src={wickSvg(pose)} width={300} height={309} alt="" />
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 600 },
      ],
    },
  );
}
