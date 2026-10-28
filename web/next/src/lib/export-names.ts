export type ExportFormat = "csv" | "txt" | "json"

type NameRow = { name: string; meaning: string }

const FORMATS: Record<ExportFormat, { mime: string; build: (rows: NameRow[]) => string }> = {
  // UTF-8 BOM and CRLF so Excel and Numbers open it cleanly.
  csv: {
    mime: "text/csv;charset=utf-8",
    build: (rows) =>
      "﻿" +
      [
        "name,letters,definition",
        ...rows.map((r) => [r.name, String(r.name.length), r.meaning].map(csvCell).join(",")),
      ].join("\r\n"),
  },
  txt: {
    mime: "text/plain;charset=utf-8",
    build: (rows) =>
      rows.map((r) => (r.meaning ? `${r.name}: ${r.meaning}` : r.name)).join("\n") + "\n",
  },
  json: {
    mime: "application/json",
    build: (rows) =>
      JSON.stringify(
        rows.map((r) => ({ name: r.name, letters: r.name.length, definition: r.meaning || null })),
        null,
        2,
      ) + "\n",
  },
}

function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function today() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Builds the file in the browser and starts a download; nothing leaves the device. */
export function downloadNames(rows: NameRow[], format: ExportFormat) {
  const { mime, build } = FORMATS[format]
  const url = URL.createObjectURL(new Blob([build(rows)], { type: mime }))
  const link = document.createElement("a")
  link.href = url
  link.download = `wordloom-names-${today()}.${format}`
  document.body.append(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function namesAsText(rows: NameRow[]) {
  return FORMATS.txt.build(rows)
}
