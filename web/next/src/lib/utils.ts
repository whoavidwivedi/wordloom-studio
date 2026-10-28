import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the custom type scale (globals.css) so text-label and friends
// override text-sm instead of being mistaken for colours.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "title",
            "heading",
            "word",
            "body",
            "small",
            "caption",
            "label",
            "micro",
          ],
        },
      ],
      shadow: [{ shadow: ["card", "raised", "overlay", "thumb"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
