import { Link } from 'react-router-dom';
import { useSiteConfig } from '../api/SiteConfigContext';
import Reveal from '../components/Reveal';

const FEATURE_CARDS = [
  ['🎵', 'Music Playback', 'Play, queue, seek, loop and search across sources with zero lag — 21 music commands and counting.'],
  ['🎚️', '27 Audio Filters', '8D, nightcore, daycore, karaoke, vaporwave and more — reshape any track in one command.'],
  ['📃', 'Playlists & Likes', 'Build personal playlists, like songs, and replay your favourites whenever you want.'],
  ['🎧', 'Spotify Integration', 'Link your Spotify account to search and import playlists straight into Lyra.'],
  ['👤', 'Profiles & Badges', 'Bios, achievements, listening history and badges — a whole identity inside your server.'],
  ['🎉', 'Fun Commands', '8ball, ship, roast, truth and 14 more games to keep your community laughing.'],
  ['⚙️', 'Server Config', '24/7 mode, autoplay, custom prefix, ignored channels — tune Lyra to fit your server.'],
  ['🎫', 'Live Ticket Support', 'Open a ticket right here on the website and chat live with staff — synced straight to Discord.'],
];

const STEPS = [
  ['01', 'Login with Discord', 'One click, no forms, no passwords — just your Discord account.'],
  ['02', 'Describe your issue', "Pick a category and tell us what's going on."],
  ['03', 'A ticket channel opens', 'Instantly created in our Discord support server, visible only to you and staff.'],
  ['04', 'Chat live, either side', 'Reply on the website or in Discord — messages sync instantly both ways.'],
];

export default function Home() {
  const { botInviteUrl, supportServerInvite } = useSiteConfig();

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">🎶 Discord Music Bot</span>
            <h1>Lyra Music <span>High quality music, 24/7, right in your server.</span></h1>
            <p className="lead">Crystal clear playback, 27 audio filters, playlists, Spotify integration, and a live ticket support desk your members can reach straight from this website.</p>
            <div className="hero-ctas">
              <a href={botInviteUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">➕ Add to Discord</a>
              <Link to="/commands" className="btn btn-ghost">📖 View Commands</Link>
            </div>
            <div className="stat-row">
              <div className="stat-pill">🔊 <b>Crystal Clear</b> Sound Quality</div>
              <div className="stat-pill">🎧 <b>24/7</b> Always With You</div>
              <div className="stat-pill">💜 <b>116+</b> Commands</div>
            </div>
          </div>
          <div className="hero-art">
            <div className="washi-tape"></div>
            <figure className="polaroid">
              <img src="/images/avatar-square.png" alt="Lyra Music mascot" />
              <figcaption>~ always playing something nice ~</figcaption>
            </figure>
            <span className="floaty" style={{ top: 0, left: -10 }}>🎵</span>
            <span className="floaty" style={{ bottom: 30, right: -16, animationDelay: '1.2s' }}>✦</span>
            <span className="floaty" style={{ top: '40%', left: -30, animationDelay: '2s' }}>💜</span>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What Lyra does</span>
            <h2>Everything your server needs</h2>
            <p>From late-night lofi to 3am nightcore — plus real help when something breaks.</p>
          </div>
          <div className="grid grid-4">
            {FEATURE_CARDS.map(([icon, title, desc], i) => (
              <Reveal as="div" className="card" key={title} delay={i * 60}>
                <div className="icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">🎫 Need help?</span>
            <h2>Support that actually reaches you</h2>
            <p>No more shouting into a channel. Open a ticket on the website and talk to staff in real time.</p>
          </div>
          <div className="steps">
            {STEPS.map(([no, title, desc], i) => (
              <Reveal as="div" className="step-card" key={no} delay={i * 80}>
                <span className="step-no">{no}</span>
                <h4>{title}</h4>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 34 }}>
            <Link to="/support" className="btn btn-primary">🎫 Open a Support Ticket</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal className="cta-band">
            <h2>Ready to bring Lyra home?</h2>
            <p>Add Lyra to your server in seconds — free, high quality, and always awake.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={botInviteUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">➕ Add to Discord</a>
              <a href={supportServerInvite} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">💬 Join Support Server</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
