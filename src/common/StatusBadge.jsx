export default function StatusBadge({ status }) {
  const colorMap = {
    published: '#4ade80',
    active: '#60a5fa',
    draft: '#fbbf24',
  };
  const bgMap = {
    published: 'rgba(74,222,128,0.15)',
    active: 'rgba(96,165,250,0.15)',
    draft: 'rgba(251,191,36,0.15)',
  };

  return (
    <span
      className="status-badge"
      style={{
        color: colorMap[status] || '#9ca3af',
        background: bgMap[status] || 'rgba(255,255,255,0.06)',
      }}
    >
      {status}
    </span>
  );
}
