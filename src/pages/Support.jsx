import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { api } from '../api/client';

const CATEGORIES = ['General', 'Bot Bug / Not Working', 'Music Playback Issue', 'Billing / Premium', 'Feature Request', 'Report a User', 'Other'];

export default function Support() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myTickets, setMyTickets] = useState([]);
  const [openTicket, setOpenTicket] = useState(null);
  const [category, setCategory] = useState('General');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.myTickets().then((d) => {
      setMyTickets(d.tickets);
      setOpenTicket(d.openTicket);
    }).catch(() => {});
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (subject.trim().length < 5) {
      setError('Please describe your issue in a bit more detail (min 5 characters).');
      return;
    }
    setSubmitting(true);
    try {
      const { ticket } = await api.createTicket({ category, subject });
      navigate(`/ticket/${ticket.id}`);
    } catch (err) {
      if (err.data?.ticketId) {
        navigate(`/ticket/${err.data.ticketId}`);
        return;
      }
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 10 }}>
        <div className="wrap" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
          <div>
            <span className="eyebrow">🎫 Support Center</span>
            <h1 style={{ fontSize: '4rem' }}>Talk to <span>a real person, fast</span></h1>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Open a ticket below — it creates a private channel in our Discord and syncs live with this page, either direction.
            </p>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 10 }}>
        <div className="wrap support-grid">
          <div>
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {!user ? (
              <div className="note-card">
                <h3 style={{ marginTop: 0 }}>Login to open a ticket</h3>
                <p style={{ color: 'var(--ink-soft)', marginBottom: 22 }}>
                  We use Discord login only — no separate account, no password. This lets our staff know exactly who they're talking to.
                </p>
                <a href={api.loginUrl('/support')} className="btn btn-primary btn-block">🔐 Login with Discord</a>
              </div>
            ) : openTicket ? (
              <div className="note-card">
                <h3 style={{ marginTop: 0 }}>You have an open ticket</h3>
                <p style={{ color: 'var(--ink-soft)' }}>Ticket #{openTicket.number} — {openTicket.subject}</p>
                <Link to={`/ticket/${openTicket.id}`} className="btn btn-primary btn-block">💬 Continue Conversation</Link>
              </div>
            ) : (
              <div className="note-card">
                <h3 style={{ marginTop: 0 }}>Open a new ticket</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Describe your issue</label>
                    <textarea
                      id="subject"
                      rows={5}
                      placeholder="e.g. Lyra keeps disconnecting from voice after 2 minutes in my server..."
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                    {submitting ? 'Creating…' : '🎫 Create Ticket'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div>
            <div className="note-card">
              <h3 style={{ marginTop: 0 }}>How it works</h3>
              <div className="steps" style={{ justifyContent: 'flex-start', gap: 16 }}>
                {[
                  ['01', 'Login with Discord', 'One click — we only ever ask for your username and avatar.'],
                  ['02', 'Describe your issue', 'Pick a category so it reaches the right staff faster.'],
                  ['03', 'A private channel opens', 'Only you and staff can see it in our Discord server.'],
                  ['04', 'Chat live', "Reply here or in Discord — staff can close the ticket when it's resolved."],
                ].map(([no, title, desc]) => (
                  <div key={no} className="step-card" style={{ maxWidth: 'none', flex: '1 1 100%', textAlign: 'left', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="step-no" style={{ fontSize: '1.8rem' }}>{no}</span>
                    <div><h4 style={{ margin: '0 0 4px' }}>{title}</h4><p style={{ margin: 0 }}>{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {user && myTickets.length > 0 && (
          <div className="wrap" style={{ marginTop: 40 }}>
            <h3 className="doodle-note" style={{ fontSize: '1.8rem' }}>Your ticket history</h3>
            {myTickets.map((t) => (
              <div className="ticket-row" key={t.id}>
                <div>
                  <strong>#{t.number}</strong> · {t.category} — {t.subject.length > 60 ? t.subject.slice(0, 60) + '...' : t.subject}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${t.status === 'open' ? 'badge-open' : 'badge-closed'}`}>{t.status}</span>
                  <Link to={`/ticket/${t.id}`} className="btn btn-ghost btn-sm">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
