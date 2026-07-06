export default function Loader({ label = 'Loading…', size = 'md' }) {
  return (
    <div className={`loader-wrap loader-${size}`} role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      {label && <span className="loader-label">{label}</span>}
    </div>
  );
}
