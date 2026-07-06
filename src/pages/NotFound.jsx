import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="center-page">
      <div>
        <h1 style={{ fontSize: '4rem' }}>404</h1>
        <p style={{ marginBottom: 20 }}>This page doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </section>
  );
}
