import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../api/client';
import Loader from '../../components/Loader';

export default function AdminContent({ contentKey, label }) {
  const { canEditContent } = useOutletContext();
  const [page, setPage] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(null);
    api.adminContent().then((d) => {
      setPage(d.content[contentKey] || { title: label.replace(/^\S+\s/, ''), body: '<p></p>' });
    }).catch((e) => setError(e.message));
  }, [contentKey]);

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function saveContent(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const body = form.body.value;
    try {
      const { content: savedPage } = await api.adminSaveContent(contentKey, { title, body });
      setPage(savedPage);
      flash();
    } catch (e2) {
      setError(e2.message);
    }
  }

  if (!canEditContent) {
    return <div className="card admin-card"><p>You don't have permission to edit this page.</p></div>;
  }

  return (
    <div>
      {saved && <div className="alert alert-success" style={{ marginBottom: 20 }}>✅ Saved.</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

      <div className="card admin-card">
        <h3 style={{ marginTop: 0 }}>{label}</h3>
        {!page ? (
          <Loader label="Loading…" size="sm" />
        ) : (
          <form onSubmit={saveContent}>
            <input
              type="text"
              name="title"
              defaultValue={page.title}
              key={`${contentKey}-title`}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--line)', marginBottom: 10, fontFamily: 'inherit' }}
            />
            <textarea
              name="body"
              rows={10}
              defaultValue={page.body}
              key={`${contentKey}-body`}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--line)', fontFamily: 'inherit' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', margin: '8px 0' }}>Basic HTML allowed: p, h3, ul/li, strong, em, a.</p>
            <button type="submit" className="btn btn-primary btn-sm">Save {page.title}</button>
          </form>
        )}
      </div>
    </div>
  );
}
