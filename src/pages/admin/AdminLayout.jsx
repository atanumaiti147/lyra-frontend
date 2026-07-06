import { useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { api } from '../../api/client';
import Loader from '../../components/Loader';
import NotFound from '../NotFound';

const TABS = [
  { to: '/admin/users', label: 'Users & Roles', icon: '👥', always: true },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙️', always: false },
  { to: '/admin/documentation', label: 'Documentation', icon: '📘', always: false },
  { to: '/admin/terms-of-service', label: 'Terms of Service', icon: '📜', always: false },
  { to: '/admin/privacy-policy', label: 'Privacy Policy', icon: '🔒', always: false },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [status, setStatus] = useState(null); // 'needs_setup' | 'needs_code' | 'verified'
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const canEditContent = !!user && (user.role === 'superadmin' || (user.permissions || []).includes('edit_content'));

  useEffect(() => {
    if (!isAdmin) return;
    api.adminStatus().then((d) => {
      setStatus(d.status);
      setQrDataUrl(d.qrDataUrl || null);
    }).catch((e) => setError(e.message));
  }, [isAdmin]);

  async function handleVerify(e) {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    try {
      await api.adminVerifyTotp(code);
      setStatus('verified');
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
      setCode('');
    }
  }

  if (loading) return <section className="center-page"><Loader label="Loading…" /></section>;
  if (!user) {
    return (
      <section className="center-page">
        <div><h1>Login required</h1><a href={api.loginUrl('/admin')} className="btn btn-primary">Login with Discord</a></div>
      </section>
    );
  }
  if (!isAdmin) {
    return <NotFound />;
  }

  if (status !== 'verified') {
    return (
      <section className="center-page" style={{ minHeight: '70vh' }}>
        <div className="card" style={{ maxWidth: 440, padding: 40, textAlign: 'left' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

          {status === 'needs_setup' ? (
            <>
              <span className="eyebrow">🔐 One-time setup</span>
              <h2 style={{ marginTop: 6 }}>Connect Google Authenticator</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                Scan this QR code with the Google Authenticator app (or Authy / any TOTP app), then enter the 6-digit code it shows to finish setting up admin access.
              </p>
              {qrDataUrl && (
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                  <img src={qrDataUrl} alt="Scan with Google Authenticator" style={{ maxWidth: 220, margin: '0 auto', borderRadius: 12, border: '1px solid var(--line)' }} />
                </div>
              )}
            </>
          ) : status === 'needs_code' ? (
            <>
              <span className="eyebrow">🔐 Admin Verification</span>
              <h2 style={{ marginTop: 6 }}>Enter your authenticator code</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                Open Google Authenticator and enter the current 6-digit code for Lyra Music Admin.
              </p>
            </>
          ) : (
            <Loader label="Loading…" />
          )}

          {status && (
            <form onSubmit={handleVerify}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="123456"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--line)', fontFamily: 'inherit', fontSize: '1.4rem', textAlign: 'center', letterSpacing: '0.3em', marginBottom: 16 }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={verifying}>
                {verifying ? 'Checking…' : status === 'needs_setup' ? 'Confirm & Enable' : 'Unlock Admin Dashboard'}
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  if (location.pathname === '/admin' || location.pathname === '/admin/') {
    return <Navigate to="/admin/users" replace />;
  }

  const visibleTabs = TABS.filter((t) => t.always || canEditContent);

  return (
    <section style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'left', marginBottom: 22 }}>
          <span className="eyebrow">🛠️ Admin Panel</span>
          <h2 style={{ fontSize: '2.6rem' }}>Admin Dashboard</h2>
          <p>Manage roles, permissions, site settings, and editable page content.</p>
        </div>

        <nav className="admin-tabs" aria-label="Admin sections">
          {visibleTabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}
            >
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </NavLink>
          ))}
        </nav>

        <Outlet context={{ user, canEditContent }} />
      </div>
    </section>
  );
}
