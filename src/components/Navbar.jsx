import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ session, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="text-3xl">🥤</span>
            <span className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Jost, Poppins, sans-serif' }}>
              BlendBase
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="hover:opacity-80 transition font-medium"
            >
              Recipes
            </Link>

            {session ? (
              <>
                <Link 
                  to="/create" 
                  className="hover:opacity-80 transition font-medium"
                >
                  Create
                </Link>
                <Link 
                  to="/dashboard" 
                  className="hover:opacity-80 transition font-medium"
                >
                  Dashboard
                </Link>
                <span className="text-sm opacity-90">
                  {session.user.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth">
                <button className="bg-white text-primary px-6 py-2 rounded-lg hover:shadow-lg transition font-semibold">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button - Hidden on Desktop */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // X icon when menu is open
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides down when open */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white/20">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className="block py-2 hover:bg-white/10 rounded-lg px-3 transition font-medium"
            >
              Recipes
            </Link>

            {session ? (
              <>
                <Link 
                  to="/create" 
                  onClick={closeMobileMenu}
                  className="block py-2 hover:bg-white/10 rounded-lg px-3 transition font-medium"
                >
                  Create
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={closeMobileMenu}
                  className="block py-2 hover:bg-white/10 rounded-lg px-3 transition font-medium"
                >
                  Dashboard
                </Link>
                <div className="py-2 px-3 text-sm opacity-90 border-t border-white/20 mt-2 pt-3">
                  {session.user.email}
                </div>
                <button
                  onClick={() => {
                    onSignOut()
                    closeMobileMenu()
                  }}
                  className="w-full text-left py-2 hover:bg-white/10 rounded-lg px-3 transition font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={closeMobileMenu}>
                <button className="w-full bg-white text-primary py-2 rounded-lg hover:shadow-lg transition font-semibold">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar