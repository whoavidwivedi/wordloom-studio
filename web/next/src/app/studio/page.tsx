import type { Metadata } from "next"

import type { StudioQuery } from "@/components/Studio"

import StudioClient from "./StudioClient"

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Generate thousands of short, pronounceable names for your startup. Filter by length, starting letters and endings, save a shortlist, and check domains and handles.",
  alternates: { canonical: "/studio" },
}

type SearchParams = Record<string, string | string[] | undefined>

const letters = (value: string | string[] | undefined, max: number) =>
  (Array.isArray(value) ? value[0] : (value ?? ""))
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, max)

// Shareable searches: /studio?length=5&prefix=ve&suffix=a&contains=&def=1
function parseQuery(params: SearchParams): StudioQuery {
  const raw = Number(Array.isArray(params.length) ? params.length[0] : params.length)
  const length = Number.isInteger(raw) && raw >= 2 && raw <= 8 ? raw : 5
  return {
    length,
    prefix: letters(params.prefix, length),
    suffix: letters(params.suffix, length),
    contains: letters(params.contains, length),
    defOnly: params.def === "1",
  }
}

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return <StudioClient initialQuery={parseQuery(await searchParams)} />
}
