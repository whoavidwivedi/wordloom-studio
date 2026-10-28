import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

// Self-hosted at build time: no render-blocking request to Google, no layout shift.
// Inter ships its opsz axis, so large sizes switch to the Display cut automatically.
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1013" },
  ],
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wordloom-studio.vercel.app"

const title = "Wordloom: find a name for your startup"
const description =
  "Free name generator for founders. Get short, pronounceable names for your startup, company or product that sound like real words, then check the domain and handles in one click."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Wordloom",
  },
  description,
  applicationName: "Wordloom",
  keywords: [
    "startup name generator",
    "company name generator",
    "business name generator",
    "brand name generator",
    "product name ideas",
    "pronounceable names",
    "short brandable names",
    "domain name ideas",
    "naming a startup",
    "wordloom",
  ],
  authors: [
    { name: "Avi Dwivedi", url: "https://whoavidwivedi.work" },
    { name: "Neeraj Dalal", url: "https://nrjdalal.com" },
  ],
  creator: "Avi Dwivedi",
  category: "productivity",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Wordloom",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wordloom: find a name for your startup. Famous startup names it can generate include Stripe, Notion, Slack, Zapier, Dropbox and Uber.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
    creator: "@whoavidwivedi",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

// Structured data so search engines can show Wordloom as a free web app.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Wordloom",
  url: siteUrl,
  description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: [
    { "@type": "Person", name: "Avi Dwivedi", url: "https://whoavidwivedi.work" },
    { "@type": "Person", name: "Neeraj Dalal", url: "https://nrjdalal.com" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          // Static object defined above; no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
