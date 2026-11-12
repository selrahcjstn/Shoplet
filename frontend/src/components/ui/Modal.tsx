import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

const widths = { sm: 'w-[400px]', md: 'w-[560px]', lg: 'w-[720px]' }

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: keyof typeof widths
  children: ReactNode
}

/** Native <dialog>: focus trap, Escape to close and backdrop come from the browser. */
export default function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className={cn(
        'm-auto max-w-[calc(100vw-2rem)] rounded-xl bg-surface p-6 text-content shadow-lg',
        'backdrop:bg-brand-ink/40',
        widths[size],
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 id="modal-title" className="text-h4 font-semibold text-brand-ink">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-content-secondary transition-colors hover:bg-surface-muted"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
      {children}
    </dialog>
  )
}
