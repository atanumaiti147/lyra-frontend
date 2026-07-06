import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Loader from '../components/Loader';

export default function Commands() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    api.commands().then(setData).catch((e) => setError(e.message));
  }, []);

  const q = search.trim().toLowerCase();

  // Reset to "All" whenever the person starts searching, so search always
  // looks across every category instead of being silently scoped to one.
  useEffect(() => {
    if (q) setActiveCategory('all');
  }, [q]);

  const filteredCategories = useMemo(() => {
    if (!data) return [];
    return data.categories
      .filter((c) => activeCategory === 'all' || c.category === activeCategory)
      .map((c) => ({
        ...c,
        commands: q ? c.commands.filter((cmd) => cmd.name.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q)) : c.commands,
      }))
      .filter((c) => c.commands.length > 0);
  }, [data, activeCategory, q]);

  if (error) return <section className="center-page"><p>⚠️ {error}</p></section>;
  if (!data) return <section className="center-page"><Loader label="Loading commands…" /></section>;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 10 }}>
        <div className="wrap" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
          <div>
            <span className="eyebrow">📖 {data.totalCommands} commands</span>
            <h1 style={{ fontSize: '4rem' }}>Command <span>reference</span></h1>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Search, or pick a category below to browse just that section.</p>
            <input
              type="text"
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginTop: 20, width: '100%', maxWidth: 420, padding: '14px 18px', borderRadius: 999, border: '1.5px solid var(--line)', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 6 }}>
        <div className="wrap">
          <nav className="cat-tabs" aria-label="Command categories">
            <button
              type="button"
              className={`cat-tab${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              🗂️ All <span className="cat-tab-count">{data.totalCommands}</span>
            </button>
            {data.categories.map((c) => (
              <button
                key={c.category}
                type="button"
                className={`cat-tab${activeCategory === c.category ? ' active' : ''}`}
                onClick={() => setActiveCategory(c.category)}
              >
                <span aria-hidden="true">{c.icon}</span> {c.category} <span className="cat-tab-count">{c.commands.length}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section style={{ paddingTop: 16 }}>
        <div className="wrap">
          {filteredCategories.length === 0 && (
            <p className="no-results">{q ? `No commands match "${search}".` : 'No commands in this category.'}</p>
          )}
          {filteredCategories.map((cat) => (
            <div key={cat.category} style={{ marginBottom: 40 }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{cat.icon}</span> {cat.category}
                <span className="cat-heading-count">{cat.commands.length} commands</span>
              </h2>
              <div className="cmd-list grid grid-2">
                {cat.commands.map((cmd) => (
                  <div className="card" key={cmd.name} style={{ padding: 18 }}>
                    <strong>{cmd.prefix || `/${cmd.name}`}</strong>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{cmd.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
