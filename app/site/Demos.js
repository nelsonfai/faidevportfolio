import d from './demos.module.css';

// Thin ink browser frame used by the works section.
export function Browser({ url, children, className = '' }) {
  return (
    <div className={`${d.browser} ${className}`}>
      <div className={d.browserBar}>
        <span className={d.dots} aria-hidden="true"><i /><i /><i /></span>
        <span className={d.url}>{url}</span>
      </div>
      <div className={d.browserBody}>{children}</div>
    </div>
  );
}
