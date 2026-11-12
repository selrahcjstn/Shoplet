import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/** Centered content, max 1280px, 16 / 24 / 32px side padding. */
export default function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)} {...props} />
}
