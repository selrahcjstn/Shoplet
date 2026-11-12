import { cn } from '../../lib/cn'

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm' }

interface AvatarProps {
  firstName: string
  lastName: string
  size?: keyof typeof sizes
  className?: string
}

/** Initials in a circle. Decorative: the name is always shown next to it. */
export default function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-content-inverse',
        sizes[size],
        className,
      )}
    >
      {firstName.charAt(0)}
      {lastName.charAt(0)}
    </span>
  )
}
