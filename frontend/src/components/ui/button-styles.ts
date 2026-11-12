import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-content-inverse hover:bg-primary-hover active:bg-primary-dark',
  secondary: 'bg-primary-light text-primary-dark hover:bg-border',
  outline: 'border border-border-strong bg-surface text-content hover:bg-surface-muted',
  ghost: 'text-content-secondary hover:bg-surface-muted hover:text-content',
  destructive: 'bg-error text-content-inverse hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

/** Class names for anything that should look like a button (e.g. a router Link). */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium',
    'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
