import "@/styles/globals.css"
import type { Metadata } from "next"

import Background from "@/components/Background"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wordloom-studio.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wordloom Studio | Pronounceable Words",
    template: "%s | Wordloom Studio",
  },
  description:
    "Find short, pronounceable names for brands, products, and projects. Every name sounds like it could be a real word.",
  keywords: [
    "wordloom",
    "wordloom studio",
    "name generator",
    "brand names",
    "product names",
    "pronounceable names",
    "phonotactic naming tool",
  ],
  authors: [
    { name: "Avi Dwivedi", url: "https://whoavidwivedi.work" },
    { name: "Neeraj Dalal", url: "https://nrjdalal.com" },
  ],
  creator: "Avi Dwivedi",
  openGraph: {
    title: "Wordloom Studio | Pronounceable Words",
    description:
      "Find short, pronounceable names for brands, products, and projects. Every name sounds like it could be a real word.",
    url: siteUrl,
    siteName: "Wordloom Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wordloom Studio | Pronounceable Words",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordloom Studio | Pronounceable Words",
    description:
      "Find short, pronounceable names for brands, products, and projects. Every name sounds like it could be a real word.",
    images: ["/og-image.png"],
    creator: "@whoavidwivedi",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body>
        <ThemeProvider>
          <Background />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
