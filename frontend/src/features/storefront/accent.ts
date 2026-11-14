import type { CSSProperties } from 'react'

const FALLBACK = '#176b5b'

/** Relative luminance (WCAG) of a #rrggbb color. */
function luminance(hex: string): number {
  const channel = (start: number) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

/**
 * The shop's accent color as CSS variables, with a text color that stays readable on top of it.
 * A pale accent gets dark text; a deep one gets white.
 */
export function accentStyle(accent: string | null): CSSProperties {
  const color = accent && /^#[0-9a-f]{6}$/i.test(accent) ? accent : FALLBACK
  const onColor = luminance(color) > 0.4 ? '#183b35' : '#ffffff'
  return { '--shop-accent': color, '--shop-on-accent': onColor } as CSSProperties
}
