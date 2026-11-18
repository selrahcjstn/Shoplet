import { api } from './api-client'

export type UploadPurpose = 'product' | 'logo' | 'cover'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

/** A friendly reason the file cannot be used, or null when it is fine. */
export function checkImage(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return 'Choose a JPG, PNG or WebP image.'
  if (file.size > MAX_BYTES) return 'Choose an image smaller than 5 MB.'
  return null
}

interface Signature {
  uploadUrl: string
  params: Record<string, string>
}

/**
 * Uploads a photo straight to Cloudinary and returns its address. The API signs the request,
 * so the Cloudinary secret never reaches the browser. XHR rather than fetch, for upload progress.
 */
export async function uploadImage(
  file: File,
  purpose: UploadPurpose,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const { uploadUrl, params } = await api<Signature>('/uploads/signature', {
    method: 'POST',
    body: JSON.stringify({ purpose }),
  })

  const form = new FormData()
  for (const [key, value] of Object.entries(params)) form.append(key, value)
  form.append('file', file)

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', uploadUrl)
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100))
    }
    request.onload = () => {
      const body = JSON.parse(request.responseText || '{}') as { secure_url?: string; error?: { message?: string } }
      if (request.status >= 200 && request.status < 300 && body.secure_url) resolve(body.secure_url)
      else reject(new Error(body.error?.message ?? 'The photo could not be uploaded. Try again.'))
    }
    request.onerror = () => reject(new Error('The photo could not be uploaded. Check your connection.'))
    request.send(form)
  })
}
