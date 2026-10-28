import fs from "fs"
import path from "path"

import { ImageResponse } from "next/og"

// Renders the PNG icons and favicon.ico from public/favicon.svg.
// Run: bun scripts/generate-icons.tsx (from web/next)

const root = process.cwd()
const svg = fs.readFileSync(path.join(root, "public", "favicon.svg"), "utf8")
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

async function png(size: number, padding = 0) {
  const inner = size - padding * 2
  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Apple icons are masked by iOS, so they get a full-bleed background.
        backgroundColor: padding ? "#0e1013" : "transparent",
      }}
    >
      <img src={src} width={inner} height={inner} alt="" />
    </div>,
    { width: size, height: size },
  )
  return Buffer.from(await image.arrayBuffer())
}

// ICO with embedded PNG images (supported by every current browser).
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  const entries: Buffer[] = []
  let offset = 6 + images.length * 16
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(entry)
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

async function generate() {
  const write = (file: string, data: Buffer) => {
    fs.writeFileSync(path.join(root, file), data)
    console.log(`Wrote ${file}`)
  }

  write("public/apple-icon.png", await png(180, 24))
  write("public/icon.png", await png(512))
  write("public/favicon.png", await png(192))
  write(
    "src/app/favicon.ico",
    ico([
      { size: 16, data: await png(16) },
      { size: 32, data: await png(32) },
      { size: 48, data: await png(48) },
    ]),
  )
}

generate().catch((error) => {
  console.error(error)
  process.exit(1)
})
