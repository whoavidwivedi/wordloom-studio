import fs from "fs"
import path from "path"

import { ImageResponse } from "next/og"

async function generate() {
  const ogImage = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(circle 800px at 50% -80px, rgba(255, 255, 255, 0.10), transparent 70%), radial-gradient(circle 600px at 90% 100%, rgba(255, 255, 255, 0.05), transparent 60%)",
        padding: "54px 64px 46px 64px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle technical grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.85,
        }}
      />

      {/* Top Navbar Lockup */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Circular W Icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "linear-gradient(145deg, #27272a, #09090b)",
              border: "1px solid rgba(255, 255, 255, 0.24)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.28), 0 4px 14px rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path
                d="M5 9L9.5 23L16 11.5L22.5 23L27 9"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ fontSize: "25px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Wordloom
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                fontWeight: 600,
                color: "#d4d4d8",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "5px",
                padding: "2px 8px",
                letterSpacing: "-0.01em",
              }}
            >
              Studio
            </span>
          </div>
        </div>

        {/* Model Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(24, 24, 27, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "9999px",
            padding: "6px 14px",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#a1a1aa",
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px #10b981",
            }}
          />
          <span style={{ color: "#e4e4e7" }}>CMU Phonotactic Model</span>
          <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>|</span>
          <span>100k+ Corpus</span>
        </div>
      </div>

      {/* Center Content: Headline & Subheadline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
            color: "#fafafa",
            maxWidth: "1040px",
          }}
        >
          Find short, pronounceable names that sound like real words.
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "880px",
            letterSpacing: "-0.01em",
          }}
        >
          Built on English phonetic letter transitions and cross-referenced with WordNet
          definitions.
        </div>
      </div>

      {/* Workbench Card Preview */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "rgba(18, 18, 22, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "14px",
          boxShadow:
            "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 44px -8px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#a1a1aa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#ffffff", fontWeight: 600 }}>Phonotactic Synthesis</span>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "1px 6px",
                fontSize: "10px",
                color: "#d4d4d8",
              }}
            >
              5-6 chars
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#10b981", fontWeight: 600 }}>98% Pronounceable</span>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
            <span>Instant Dictionary Match</span>
          </div>
        </div>

        {/* Words Grid */}
        <div
          style={{
            display: "flex",
            padding: "16px 20px",
            gap: "16px",
          }}
        >
          {/* Word 1 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                lumin
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                def
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.3 }}>
              a unit of luminous flux; radiant clarity
            </span>
          </div>

          {/* Word 2 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                solis
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                def
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.3 }}>
              solar illumination; radiating center
            </span>
          </div>

          {/* Word 3 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                velox
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  color: "#71717a",
                }}
              >
                neologism
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#a1a1aa", lineHeight: 1.3 }}>
              swift, agile, high-velocity motion
            </span>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          fontSize: "13px",
          color: "#71717a",
        }}
      >
        {/* CLI hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "6px",
            padding: "5px 10px",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#e4e4e7",
          }}
        >
          <span style={{ color: "#71717a" }}>$</span>
          <span>bunx wordloom -l 5 -p vo</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#d4d4d8", fontWeight: 600 }}>wordloom-studio.vercel.app</span>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
          <span style={{ color: "#a1a1aa" }}>Crafted by Avi Dwivedi</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )

  const arrayBuffer = await ogImage.arrayBuffer()
  const outputPath = path.resolve(process.cwd(), "public/og-image.png")
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer))
  console.log(
    `Successfully generated OG image at: ${outputPath} (${fs.statSync(outputPath).size} bytes)`,
  )
}

generate().catch(console.error)
