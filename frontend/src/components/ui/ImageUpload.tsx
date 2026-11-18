import { ImagePlus, Link2, RefreshCw, Trash2 } from 'lucide-react'
import { useId, useRef, useState, type DragEvent } from 'react'
import { errorMessages } from '../../lib/api-client'
import { cn } from '../../lib/cn'
import { checkImage, uploadImage, type UploadPurpose } from '../../lib/upload'
import { controlClasses } from './field-styles'

interface ImageUploadProps {
  label: string
  hint?: string
  purpose: UploadPurpose
  value: string
  onChange: (url: string) => void
  /** Error from the parent form, such as an invalid pasted link. */
  error?: string
  /** "square" for products and logos, "wide" for a 16:5 cover. */
  shape?: 'square' | 'wide'
}

/**
 * Pick, drop or paste a photo. Uploads go straight to Cloudinary and the field ends up holding
 * the image address, so the rest of the form works exactly as it did with pasted links.
 */
export default function ImageUpload({
  label,
  hint,
  purpose,
  value,
  onChange,
  error,
  shape = 'square',
}: ImageUploadProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [pasting, setPasting] = useState(false)

  const uploading = progress !== null
  const message = uploadError || error

  async function handleFile(file: File | undefined) {
    if (!file) return
    const problem = checkImage(file)
    if (problem) {
      setUploadError(problem)
      return
    }
    setUploadError('')
    setProgress(0)
    try {
      onChange(await uploadImage(file, purpose, setProgress))
    } catch (err) {
      setUploadError(err instanceof Error && !('status' in err) ? err.message : (errorMessages(err)[0] ?? ''))
    } finally {
      setProgress(null)
      if (input.current) input.current.value = ''
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    handleFile(event.dataTransfer.files[0])
  }

  const frame = shape === 'wide' ? 'aspect-[16/5]' : 'aspect-square max-w-48'

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-content">
        {label}
      </label>

      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={uploading}
      />

      {value && !uploading ? (
        <div className="flex flex-wrap items-end gap-3">
          <div className={cn('w-full overflow-hidden rounded-lg border border-border bg-surface-muted', frame)}>
            <img src={value} alt="" className="size-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-content hover:bg-surface-muted"
            >
              <RefreshCw aria-hidden className="size-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-content-secondary hover:bg-surface-muted hover:text-error"
            >
              <Trash2 aria-hidden className="size-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 text-center transition-colors',
            shape === 'wide' ? 'aspect-[16/5] min-h-28' : 'aspect-square max-w-48',
            dragging ? 'border-primary bg-primary-light' : 'border-border-strong bg-surface hover:bg-surface-muted',
          )}
        >
          {uploading ? (
            <div className="w-full max-w-40" role="status" aria-live="polite">
              <p className="text-sm font-medium text-content">Uploading {progress}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="flex flex-col items-center gap-2 rounded-md p-2 text-sm text-content-secondary focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ImagePlus aria-hidden className="size-7 text-primary" />
              <span>
                <span className="font-medium text-primary">Upload a photo</span>
                <span className="hidden sm:inline"> or drop it here</span>
              </span>
              <span className="text-xs text-content-muted">JPG, PNG or WebP, up to 5 MB</span>
            </button>
          )}
        </div>
      )}

      {pasting ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://"
          aria-label={`${label} link`}
          className={cn(controlClasses(Boolean(error)), 'h-10 text-sm')}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPasting(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-content-secondary hover:text-content"
        >
          <Link2 aria-hidden className="size-3.5" />
          Paste an image link instead
        </button>
      )}

      {message ? (
        <p className="text-sm text-error">{message}</p>
      ) : (
        hint && <p className="text-sm text-content-secondary">{hint}</p>
      )}
    </div>
  )
}
