import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-indigo-600">Back to home</Link>
    </div>
  )
}
