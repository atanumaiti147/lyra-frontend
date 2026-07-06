import useReveal from './useReveal';

// Wrap any block of content to have it fade + slide in the first time it
// scrolls into view. `delay` (ms) staggers multiple Reveals in a row.
// <Reveal><div className="card">...</div></Reveal>
// <Reveal as="section" delay={120} className="extra-class">...</Reveal>
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', style, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
