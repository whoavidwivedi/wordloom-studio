import type { Metadata } from "next"

import StudioClient from "./StudioClient"

export const metadata: Metadata = {
  title: "Workbench",
  description: "Live phonetic naming studio and synthesis workbench.",
}

export default function StudioPage() {
  return <StudioClient />
}
