"use client"

import { useRouter } from "next/navigation"

import { Studio, type StudioQuery } from "@/components/Studio"

export default function StudioClient({ initialQuery }: { initialQuery: StudioQuery }) {
  const router = useRouter()

  return (
    <div className="bg-background text-foreground relative flex h-screen w-full flex-col overflow-hidden">
      <Studio initialQuery={initialQuery} onBack={() => router.push("/")} />
    </div>
  )
}
