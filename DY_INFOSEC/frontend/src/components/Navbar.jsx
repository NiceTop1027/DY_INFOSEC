import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Menu, X, User, LogOut, BookOpen, FileText, Bell, HelpCircle, Terminal, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-black border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center relative overflow-hidden">
                <Terminal className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                DYㅣWHITE<span className="text-purple-400">HAT</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/courses" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              COURSES
            </Link>
            <Link to="/notices" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              NOTICE
            </Link>
            <Link to="/faq" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              FAQ
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/5 transition-all font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    ADMIN
                  </Link>
                )}
                <Link to="/my-classroom" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  CLASSROOM
                </Link>
                <Link to="/applications" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  APPLY
                </Link>
                <div className="relative group ml-4">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">{user?.displayName || user?.email?.split('@')[0]}</span>
                    {user?.role === 'admin' && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                        ADMIN
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 backdrop-blur-xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    <Link to="/profile" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/5">
                      Profile
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/5">
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-white/5 border-b border-white/5">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium ml-4">
                  LOGIN
                </Link>
                <Link to="/signup" className="ml-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  SIGN UP
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <Link to="/courses" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              COURSES
            </Link>
            <Link to="/notices" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              NOTICE
            </Link>
            <Link to="/faq" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
              FAQ
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-classroom" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  CLASSROOM
                </Link>
                <Link to="/applications" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  APPLY
                </Link>
                <Link to="/profile" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  PROFILE
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all font-medium">
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium">
                  LOGIN
                </Link>
                <Link to="/signup" className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-center hover:shadow-lg transition-all">
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
