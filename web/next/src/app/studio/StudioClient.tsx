"use client"

import { useRouter } from "next/navigation"

import { Studio } from "@/components/Studio"

export default function StudioClient() {
  const router = useRouter()

  return (
    <div className="bg-background text-foreground relative flex h-screen w-full flex-col overflow-hidden">
      <Studio onBack={() => router.push("/")} />
    </div>
  )
}
