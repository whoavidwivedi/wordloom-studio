import type { Metadata } from "next"

import { DesignSystem } from "./DesignSystem"

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, type, and components behind Wordloom Studio.",
  // Internal reference for building the UI; not part of the public site.
  robots: { index: false, follow: false },
}

export default function DesignPage() {
  return <DesignSystem />
}
