import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../api/AuthContext';
import { useSiteConfig } from '../api/SiteConfigContext';
import { api } from '../api/client';

const MORE_LINKS = [
  { to: '/support', label: 'Support' },
  { to: '/docs', label: 'Documentation' },
];

export default function Navbar({ botInviteUrl }) {
  const { user } = useAuth();
  const { logoUrl } = useSiteConfig();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const moreRef = useRef(null);
  const profileRef = useRef(null);

  const isActive = (path) => (location.pathname === path ? 'active' : '');
  const isMoreActive = MORE_LINKS.some((l) => l.to === location.pathname);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onClick(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { setMoreOpen(false); setProfileOpen(false); setMobileOpen(false); }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isStaff = !!user?.staff;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <header className="navbar">
      <div className="wrap">
        <Link to="/" className="brand">
          <img src={logoUrl || '/images/avatar-square.png'} alt="Lyra Music" />
          <span className="brand-text">Lyra Music</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/features" className={isActive('/features')}>Features</Link>
          <Link to="/commands" className={isActive('/commands')}>Commands</Link>

          <div className="nav-dropdown" ref={moreRef}>
            <button
              type="button"
              className={`nav-dropdown-btn ${isMoreActive ? 'active' : ''}`}
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
            >
              More <span className="caret">▾</span>
            </button>
            {moreOpen && (
              <div className="dropdown-menu">
                {MORE_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className={isActive(l.to)}>{l.label}</Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          <a href={botInviteUrl || '#'} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            Add to Discord
          </a>

          {user ? (
            <div className="nav-dropdown profile-dropdown" ref={profileRef}>
              <button type="button" className="user-chip" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
                <img src={user.avatar} alt="" />
                <span className="chip-username">{user.username}</span>
                <span className="caret">▾</span>
              </button>
              {profileOpen && (
                <div className="dropdown-menu dropdown-menu-right">
                  <Link to="/support">🎫 My Tickets</Link>
                  {isStaff && <Link to="/dashboard">🧑‍💼 Staff Dashboard</Link>}
                  {isAdmin && <Link to="/admin">🛠️ Admin Dashboard</Link>}
                  <a href={api.logoutUrl()} className="danger">🚪 Logout</a>
                </div>
              )}
            </div>
          ) : (
            <a href={api.loginUrl(location.pathname)} className="btn btn-ghost btn-sm">Login</a>
          )}

          <button className="mobile-toggle" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-menu">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/features" className={isActive('/features')}>Features</Link>
          <Link to="/commands" className={isActive('/commands')}>Commands</Link>
          {MORE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={isActive(l.to)}>{l.label}</Link>
          ))}
          {user && isStaff && <Link to="/dashboard" className={isActive('/dashboard')}>🧑‍💼 Staff Dashboard</Link>}
          {user && isAdmin && <Link to="/admin" className={isActive('/admin')}>🛠️ Admin Dashboard</Link>}
          <div className="mobile-menu-divider" />
          {user ? (
            <a href={api.logoutUrl()} className="danger">🚪 Logout ({user.username})</a>
          ) : (
            <a href={api.loginUrl(location.pathname)}>Login with Discord</a>
          )}
        </nav>
      )}
    </header>
  );
}
