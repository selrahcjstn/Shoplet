import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, className = '', ...props }: Props) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none ${className}`}
        {...props}
      />
    </label>
  )
}
