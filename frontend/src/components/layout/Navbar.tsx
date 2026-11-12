import { Link, useNavigate } from 'react-router-dom'
import { clearToken, isLoggedIn } from '../../lib/token'

export default function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function logout() {
    clearToken()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Shoplet
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {loggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
