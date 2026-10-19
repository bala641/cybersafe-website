import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAdmin, loginWithGoogle, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <span className="text-lg font-bold text-white">CyberSafe</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-slate-300 hover:text-cyan-400 transition">Features</Link>
          <Link to="/downloads" className="text-slate-300 hover:text-cyan-400 transition">Download</Link>
          {isAdmin && (
            <Link to="/admin" className="text-slate-300 hover:text-cyan-400 transition">Admin</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-300">{user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition"
            >
              Sign in with Google
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-800 p-4 space-y-2">
          <Link to="/features" className="block text-slate-300 hover:text-cyan-400 py-2">Features</Link>
          <Link to="/downloads" className="block text-slate-300 hover:text-cyan-400 py-2">Download</Link>
          {isAdmin && (
            <Link to="/admin" className="block text-slate-300 hover:text-cyan-400 py-2">Admin</Link>
          )}
          {user ? (
            <button
              onClick={logout}
              className="w-full mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="w-full mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold"
            >
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
