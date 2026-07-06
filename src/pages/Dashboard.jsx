import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { api } from '../api/client';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user?.staff) return;
    api.dashboardTickets().then(setData).catch((e) => setError(e.message));
  }, [user, loading]);

  if (loading) return <section className="center-page"><Loader label="Loading…" /></section>;
  if (!user?.staff) {
    return (
      <section className="center-page">
        <div>
          <h1>Staff access only</h1>
          {!user && <a href={api.loginUrl('/dashboard')} className="btn btn-primary">Login with Discord</a>}
        </div>
      </section>
    );
  }
  if (error) return <section className="center-page"><p>⚠️ {error}</p></section>;
  if (!data) return <section className="center-page"><Loader label="Loading tickets…" /></section>;

  return (
    <section style={{ paddingTop: 36 }}>
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'left', marginBottom: 30 }}>
          <span className="eyebrow">🛡️ Staff Only</span>
          <h2 style={{ fontSize: '2.6rem' }}>Ticket Dashboard</h2>
          <p>Every ticket ever opened on the website, live.</p>
        </div>

        <div className="dash-stats">
          <div className="dash-stat"><span className="n">{data.openCount}</span>Open</div>
          <div className="dash-stat"><span className="n">{data.closedCount}</span>Closed</div>
          <div className="dash-stat"><span className="n">{data.tickets.length}</span>Total</div>
        </div>

        {data.tickets.length === 0 ? (
          <p className="no-results">No tickets yet.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th><th>User</th><th>Category</th><th>Subject</th><th>Status</th><th>Opened</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.number}</td>
                  <td>{t.username}</td>
                  <td>{t.category}</td>
                  <td>{t.subject.length > 45 ? t.subject.slice(0, 45) + '...' : t.subject}</td>
                  <td><span className={`badge ${t.status === 'open' ? 'badge-open' : 'badge-closed'}`}>{t.status}</span></td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td><Link to={`/ticket/${t.id}`} className="btn btn-ghost btn-sm">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
