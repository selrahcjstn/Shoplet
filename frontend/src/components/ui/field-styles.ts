/** Shared look for Input, Textarea and Select (44px height is set per control). */
export const controlClasses = (hasError: boolean) =>
  [
    'block w-full rounded-md border bg-surface px-3 text-base text-content',
    'placeholder:text-content-muted transition-colors duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary',
    'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-muted',
    hasError ? 'border-error' : 'border-border-strong',
  ].join(' ')
