import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../api/AuthContext';
import { api } from '../api/client';
import Loader from '../components/Loader';

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [closed, setClosed] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.getTicket(id)
      .then((d) => {
        setTicket(d.ticket);
        setMessages(d.messages);
        setIsStaff(d.isStaff);
      })
      .catch((e) => setError(e.message));
  }, [id, user]);

  useEffect(() => {
    if (!ticket) return;
    const socket = io(api.backendUrl, { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => socket.emit('join_ticket', id));
    socket.on('auth_error', (msg) => console.warn('Ticket auth error:', msg));
    socket.on('message', (m) => {
      if (m.ticketId !== id) return;
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
    });
    socket.on('ticket_closed', ({ ticketId: closedId }) => {
      if (closedId !== id) return;
      setClosed(true);
    });

    return () => socket.disconnect();
  }, [ticket, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const content = input.trim();
    if (!content || !socketRef.current) return;
    socketRef.current.emit('send_message', { ticketId: id, content });
    setInput('');
  }

  async function handleClose() {
    if (!confirm('Close this ticket? This cannot be undone.')) return;
    await api.closeTicket(id);
    setTicket((t) => ({ ...t, status: 'closed' }));
  }

  if (!user) {
    return (
      <section className="center-page">
        <div>
          <h1>Login required</h1>
          <a href={api.loginUrl(`/ticket/${id}`)} className="btn btn-primary">Login with Discord</a>
        </div>
      </section>
    );
  }
  if (error) return <section className="center-page"><p>⚠️ {error}</p></section>;
  if (!ticket) return <section className="center-page"><Loader label="Loading ticket…" /></section>;

  const isOpen = ticket.status === 'open' && !closed;

  return (
    <section style={{ paddingTop: 36 }}>
      <div className="wrap ticket-layout">
        <div className="ticket-meta">
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Ticket #{ticket.number}</h3>
            <span className={`badge ${isOpen ? 'badge-open' : 'badge-closed'}`}>{isOpen ? 'open' : 'closed'}</span>

            <p className="label">Category</p>
            <p className="value">{ticket.category}</p>
            <p className="label">Opened by</p>
            <p className="value">{ticket.username}</p>
            <p className="label">Opened</p>
            <p className="value">{new Date(ticket.createdAt).toLocaleString()}</p>
            <p className="label">Subject</p>
            <p className="value" style={{ fontWeight: 500 }}>{ticket.subject}</p>

            {isOpen ? (
              <button className="btn btn-danger btn-block" style={{ marginTop: 22 }} onClick={handleClose}>🔒 Close Ticket</button>
            ) : (
              <p style={{ marginTop: 22, fontSize: '0.82rem', color: 'var(--ink-faint)' }}>Closed by {ticket.closedBy}</p>
            )}

            {isStaff && <Link to="/dashboard" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>← Back to Dashboard</Link>}
          </div>
        </div>

        <div>
          <div className="chat-shell">
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.staff ? 'staff-side' : 'user-side'} ${m.authorId === user.id ? 'is-me' : ''}`}>
                  <div className="meta">{m.authorName}{m.staff ? ' · Staff' : ''}{m.source === 'discord' ? ' · via Discord' : ''}</div>
                  <div>{m.content}</div>
                </div>
              ))}
              {closed && <div className="msg system">🔒 This ticket has been closed.</div>}
              <div ref={messagesEndRef} />
            </div>
            {isOpen ? (
              <div className="chat-input-row">
                <input
                  type="text"
                  placeholder="Type your message..."
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button className="btn btn-primary" onClick={send}>Send</button>
              </div>
            ) : (
              <div className="chat-closed-banner">🔒 This ticket is closed. Open a new one from the Support page if you need further help.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
