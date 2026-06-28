import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Demo', path: '/demo' },
  { label: 'Upload', path: '/upload' },
  { label: 'Interview', path: '/interview' },
  { label: 'Research', path: '/research' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Resumes', path: '/resumes' },
  { label: 'Datasheet', path: '/datasheet' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timeoutId = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(11, 14, 20, 0.95)' : 'rgba(11, 14, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(148, 163, 184, 0.08)',
        height: '64px',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
          <span style={{ color: '#F5F7FA' }}>CareerSync</span>
          <span style={{ color: '#00C9FF' }}>AI</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-3 py-2 text-sm font-medium transition-colors duration-200"
              style={{
                color: isActive(link.path) ? '#00C9FF' : '#94A3B8',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isActive(link.path) ? '#00C9FF' : '#94A3B8'; }}
            >
              {link.label}
              <span
                className="absolute bottom-0 left-3 right-3 h-[2px] origin-left transition-transform duration-300 ease-out"
                style={{
                  backgroundColor: '#00C9FF',
                  transform: isActive(link.path) ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </Link>
          ))}
        </div>

        {/* Auth-aware CTA Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              style={{
                color: isActive('/admin') ? '#00C9FF' : '#94A3B8',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/admin') ? '#00C9FF' : '#94A3B8'; }}
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive('/account') ? '#00C9FF' : '#94A3B8',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/account') ? '#00C9FF' : '#94A3B8'; }}
              >
                Account
              </Link>
              <Button
                size="sm"
                className="accent-gradient text-white"
                style={{ boxShadow: '0 0 20px rgba(0, 201, 255, 0.2)' }}
                onClick={logout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive('/login') ? '#00C9FF' : '#94A3B8',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive('/login') ? '#00C9FF' : '#94A3B8'; }}
              >
                Log In
              </Link>
              <Button
                size="sm"
                className="accent-gradient text-white"
                style={{ boxShadow: '0 0 20px rgba(0, 201, 255, 0.2)' }}
                asChild
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex items-center justify-center p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={24} style={{ color: '#F5F7FA' }} />
          ) : (
            <Menu size={24} style={{ color: '#F5F7FA' }} />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-[280px] lg:hidden"
              style={{
                backgroundColor: 'rgba(11, 14, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
                paddingTop: '80px',
              }}
            >
              <div className="flex flex-col gap-1 px-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
                      style={{
                        color: isActive(link.path) ? '#00C9FF' : '#94A3B8',
                        backgroundColor: isActive(link.path) ? 'rgba(0, 201, 255, 0.08)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {user?.role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
                      style={{
                        color: isActive('/admin') ? '#00C9FF' : '#94A3B8',
                        backgroundColor: isActive('/admin') ? 'rgba(0, 201, 255, 0.08)' : 'transparent',
                      }}
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45, duration: 0.3 }}
                    >
                      <Link
                        to="/account"
                        className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
                        style={{
                          color: isActive('/account') ? '#00C9FF' : '#94A3B8',
                          backgroundColor: isActive('/account') ? 'rgba(0, 201, 255, 0.08)' : 'transparent',
                        }}
                      >
                        Account
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="mt-4"
                    >
                      <button
                        onClick={logout}
                        className="accent-gradient block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white"
                      >
                        Log Out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45, duration: 0.3 }}
                    >
                      <Link
                        to="/login"
                        className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
                        style={{
                          color: isActive('/login') ? '#00C9FF' : '#94A3B8',
                          backgroundColor: isActive('/login') ? 'rgba(0, 201, 255, 0.08)' : 'transparent',
                        }}
                      >
                        Log In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      className="mt-4"
                    >
                      <Link
                        to="/signup"
                        className="accent-gradient block rounded-lg px-5 py-3 text-center text-sm font-semibold text-white"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
