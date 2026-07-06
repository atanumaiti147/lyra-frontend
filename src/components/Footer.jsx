import { Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { api } from '../api/client';

export default function Footer({ botInviteUrl, supportServerInvite }) {
  const { user } = useAuth();

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ marginBottom: 12 }}>
              <img src="/images/avatar-square.png" alt="Lyra Music" />
              Lyra Music
            </div>
            <p>A cozy, high quality Discord music bot with filters, playlists, and a live support ticket system — all in one place.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/commands">Commands</Link></li>
              <li><Link to="/docs">Documentation</Link></li>
              <li><a href={botInviteUrl || '#'} target="_blank" rel="noopener noreferrer">Add to Discord</a></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link to="/support">Open a Ticket</Link></li>
              <li><a href={supportServerInvite || '#'} target="_blank" rel="noopener noreferrer">Support Server</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              {user ? (
                <>
                  <li><Link to="/support">My Tickets</Link></li>
                  <li><a href={api.logoutUrl()}>Logout</a></li>
                </>
              ) : (
                <li><a href={api.loginUrl('/')}>Login with Discord</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lyra Music. Made with 💜 for Discord communities.</span>
          <span>Not affiliated with Discord Inc.</span>
        </div>
      </div>
    </footer>
  );
}
