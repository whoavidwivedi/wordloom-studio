import fs from "fs"
import path from "path"

import { ImageResponse } from "next/og"

// Renders public/og-image.png (1200×630) in the landing page's style.
// Run: bun scripts/generate-og.tsx (from web/next)

const BG = "#0d0f12"
const FG = "#f7f8f9"
const MUTED = "#a3a7ae"
const SUBTLE = "#6b7078"
const BORDER = "rgba(255,255,255,0.09)"
const ACTION = "#10b981"

// Famous startup names that Wordloom's generator produces (from the landing
// page's brand section).
const BRANDS = ["stripe", "notion", "slack", "zapier", "dropbox", "uber"]

// Satori reads TTF/OTF/WOFF (not WOFF2); an old user agent makes Google Fonts serve TTF.
async function loadInter(weight: number) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30" },
  }).then((r) => r.text())
  const url = css.match(/src: url\((.+?)\)/)?.[1]
  if (!url) throw new Error(`No font URL for Inter ${weight}`)
  return fetch(url).then((r) => r.arrayBuffer())
}

async function generate() {
  const [inter500, inter600] = await Promise.all([loadInter(500), loadInter(600)])

  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        padding: "56px 72px 52px",
        fontFamily: "Inter",
        color: FG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid, faded toward the edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${BORDER} 1px, transparent 1px), linear-gradient(to bottom, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(ellipse 75% 70% at 50% 0%, transparent 10%, ${BG} 75%)`,
        }}
      />
      {/* Spotlight */}
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -180,
          width: 900,
          height: 620,
          borderRadius: "50%",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.16), rgba(255,255,255,0) 65%)",
          transform: "rotate(-24deg)",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              backgroundImage:
                "radial-gradient(circle at 36% 28%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%), linear-gradient(135deg, #6ee7b7, #10b981 50%, #047857)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.04em" }}>wordloom</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${BORDER}`,
            backgroundColor: "rgba(22,24,28,0.8)",
            borderRadius: 999,
            padding: "6px 16px 6px 6px",
            fontSize: 18,
            color: MUTED,
            fontWeight: 500,
          }}
        >
          <div
            style={{
              backgroundColor: FG,
              color: BG,
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Free
          </div>
          No sign-up, open source
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Find a name for</span>
          <span>your startup.</span>
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 27,
            color: MUTED,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            maxWidth: 820,
          }}
        >
          Short, pronounceable names that sound like real words.
        </div>
      </div>

      {/* Brand names the generator produces, in the landing page's bordered grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 19,
            fontWeight: 500,
            color: SUBTLE,
          }}
        >
          <span>Famous startup names Wordloom can generate</span>
          <span>wordloom-studio.vercel.app</span>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${BORDER}`,
            borderLeft: `1px solid ${BORDER}`,
          }}
        >
          {BRANDS.map((name, i) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                height: 84,
                padding: "0 20px",
                borderRight: `1px solid ${BORDER}`,
                borderBottom: `1px solid ${BORDER}`,
                backgroundColor: i === 0 ? "rgba(16,185,129,0.08)" : "rgba(22,24,28,0.6)",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  color: i === 0 ? FG : "#d4d6da",
                }}
              >
                {name}
              </span>
              <span style={{ fontSize: 16, color: i === 0 ? ACTION : SUBTLE, fontWeight: 500 }}>
                {name.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter600, weight: 600, style: "normal" },
      ],
    },
  )

  const outputPath = path.join(process.cwd(), "public", "og-image.png")
  fs.writeFileSync(outputPath, Buffer.from(await image.arrayBuffer()))
  console.log(`Wrote ${outputPath}`)
}

generate().catch((error) => {
  console.error(error)
  process.exit(1)
})
