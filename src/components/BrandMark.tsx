export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="Atlas of Why">
      <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".32" />
        <path d="M32 7C18 7 7 18 7 32s11 25 25 25c11.6 0 21-9.4 21-21 0-9.7-7.8-17.5-17.5-17.5C27.5 18.5 21 25 21 33s6 14 14 14c6.4 0 11.5-5.1 11.5-11.5 0-5.2-4.3-9.5-9.5-9.5-4.4 0-8 3.6-8 8 0 3.6 2.9 6.5 6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="35.5" cy="40.5" r="2.5" fill="var(--lime)" />
        <path d="M32 2v5M32 57v5M2 32h5M57 32h5" stroke="currentColor" strokeWidth="1" opacity=".5" />
      </svg>
      {!compact && <span>Atlas of Why</span>}
    </div>
  )
}
