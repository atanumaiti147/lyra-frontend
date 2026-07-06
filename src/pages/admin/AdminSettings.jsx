import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../api/client';
import Loader from '../../components/Loader';

export default function AdminSettings() {
  const { canEditContent } = useOutletContext();
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.adminSettings().then((d) => setSettings(d.settings)).catch((e) => setError(e.message));
  }, []);

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function saveSettings(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      logoUrl: form.logoUrl.value,
      faviconUrl: form.faviconUrl.value,
      seoTitle: form.seoTitle.value,
      seoDescription: form.seoDescription.value,
    };
    try {
      const { settings: saved } = await api.adminSaveSettings(payload);
      setSettings(saved);
      flash();
    } catch (e2) {
      setError(e2.message);
    }
  }

  if (!canEditContent) {
    return <div className="card admin-card"><p>You don't have permission to edit site settings.</p></div>;
  }

  return (
    <div>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✅ Saved.</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

      <div className="card admin-card">
        <h3 style={{ marginTop: 0 }}>⚙️ Site Settings — Logo &amp; SEO</h3>
        <p style={{ color: 'var(--ink-faint)', fontSize: '0.85rem', marginTop: -8 }}>
          Controls the logo shown in the navbar, the browser tab title/icon, and the description search engines show.
        </p>
        {!settings ? (
          <Loader label="Loading settings…" size="sm" />
        ) : (
          <form onSubmit={saveSettings}>
            <div className="admin-form-grid" style={{ marginBottom: 4 }}>
              <div className="form-group">
                <label>Logo URL</label>
                <input type="text" name="logoUrl" defaultValue={settings.logoUrl} placeholder="/images/avatar-square.png" />
              </div>
              <div className="form-group">
                <label>Favicon URL</label>
                <input type="text" name="faviconUrl" defaultValue={settings.faviconUrl} placeholder="/favicon.ico" />
              </div>
            </div>
            <div className="form-group">
              <label>SEO Title</label>
              <input type="text" name="seoTitle" defaultValue={settings.seoTitle} placeholder="Lyra Music — Discord Music Bot" />
            </div>
            <div className="form-group">
              <label>SEO Description</label>
              <textarea name="seoDescription" rows={3} defaultValue={settings.seoDescription} placeholder="Short description shown in search results" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Save Settings</button>
          </form>
        )}
      </div>
    </div>
  );
}
