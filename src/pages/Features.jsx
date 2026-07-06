const CARDS = [
  ['🎵', 'Music Playback — 21 commands', 'Play from any query, manage a full queue, loop tracks or the whole queue, seek within a song, shuffle, and grab synced lyrics.'],
  ['🎚️', 'Audio Filters — 27 commands', '8D, bass boost, nightcore, daycore, vaporwave, karaoke, tremolo, equalizer and more. Stack, reset, or hop between them instantly.'],
  ['📃', 'Playlists — 11 commands', 'Create, load, and manage personal playlists. Add the current song or the whole queue, remove duplicates, and share your list.'],
  ['❤️', 'Favourites — 4 commands', 'Like the song that\u2019s playing, replay your liked list on demand, or clear it out and start fresh.'],
  ['🎧', 'Spotify Integration', 'Login with Spotify, browse your playlists, and search your library without leaving Discord.'],
  ['👤', 'Profile System — 10 commands', 'Bios, achievements, badges, listening history, and a No-Prefix mode for power users.'],
  ['🎉', 'Fun & Games — 18 commands', '8ball, ship calculator, roast, truth, guess-the-number and more anime-style interactions to keep chat alive.'],
  ['ℹ️', 'Information — 15 commands', 'Ping, uptime, server & user info, bot stats, node health, and a clean help menu.'],
  ['⚙️', 'Server Config — 7 commands', '24/7 playback, autoplay, custom prefix, search engine preference, channel ignore list, and full visual config.'],
  ['🎫', 'Live Ticket Support', 'Open a ticket on this website, get a private channel in our Discord instantly, and chat live — synced both ways.'],
];

export default function Features() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 10 }}>
        <div className="wrap" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
          <div>
            <span className="eyebrow">✦ Full feature list</span>
            <h1 style={{ fontSize: '4rem' }}>Everything Lyra <span>can do for your server</span></h1>
            <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              116+ commands across music, filters, playlists, fun, profiles and support — organized below by category.
            </p>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="grid grid-3">
            {CARDS.map(([icon, title, desc]) => (
              <div className="card" key={title}>
                <div className="icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
