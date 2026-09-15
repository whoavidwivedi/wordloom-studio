"use client"

import { useTheme } from "next-themes"
import * as React from "react"
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans text-xs select-none",
          description: "group-[.toast]:text-muted-foreground font-sans text-[11px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium text-xs rounded-lg px-2.5 py-1",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium text-xs rounded-lg px-2.5 py-1",
          closeButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-border",
        },
      }}
      {...props}
    />
  )
}
