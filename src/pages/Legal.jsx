import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Loader from '../components/Loader';

export default function Legal({ contentKey }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.content(contentKey).then(setContent).catch((e) => setError(e.message));
  }, [contentKey]);

  if (error) return <section className="center-page"><p>⚠️ {error}</p></section>;
  if (!content) return <section className="center-page"><Loader label="Loading…" /></section>;

  const EYEBROWS = {
    'terms-of-service': '📜 Legal',
    'privacy-policy': '🔒 Legal',
    documentation: '📘 Docs',
  };

  return (
    <section style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div className="section-head" style={{ textAlign: 'left', marginBottom: 26 }}>
          <span className="eyebrow">{EYEBROWS[contentKey] || '📄 Page'}</span>
          <h2 style={{ fontSize: '2.6rem' }}>{content.title}</h2>
          <p>Last shown content — editable any time from the admin panel.</p>
        </div>
        <div className="card" style={{ padding: 32, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.body }} />
      </div>
    </section>
  );
}
