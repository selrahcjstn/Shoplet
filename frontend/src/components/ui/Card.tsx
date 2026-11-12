import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Set to false for cards that manage their own padding (e.g. image on top). */
  padded?: boolean
}

/** Subtle border, no heavy shadow (see DESIGN.md). */
export default function Card({ padded = true, className, ...props }: CardProps) {
  return <div className={cn('rounded-lg border border-border bg-surface', padded && 'p-6', className)} {...props} />
}
