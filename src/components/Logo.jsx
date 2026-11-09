// The TotalRecall mark: a line-drawn brain with circuit dots, drawn in SVG so it stays sharp at any size.
export default function Logo({ size = 64, title }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 64 64" role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id="tr-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#tr-logo)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M31 9c-4-3-11-2-13 3-5 0-8 5-6 9-4 2-5 8-1 11-2 4 0 9 5 10 1 5 7 8 12 5 1 3 3 4 3 4" />
        <path d="M33 9c4-3 11-2 13 3 5 0 8 5 6 9 4 2 5 8 1 11 2 4 0 9-5 10-1 5-7 8-12 5-1 3-3 4-3 4" />
        <path d="M32 9v47" />
        <path d="M24 15c4 1 5 5 2 8M15 27c4-2 8 0 9 4M19 40c3-3 7-3 9 0M26 31c2 1 3 3 2 5" />
        <path d="M40 15c-4 1-5 5-2 8M49 27c-4-2-8 0-9 4M45 40c-3-3-7-3-9 0M38 31c-2 1-3 3-2 5" />
      </g>
      <g fill="url(#tr-logo)">
        <circle cx="26" cy="23" r="2" /><circle cx="24" cy="31" r="2" /><circle cx="28" cy="40" r="2" />
        <circle cx="38" cy="23" r="2" /><circle cx="40" cy="31" r="2" /><circle cx="36" cy="40" r="2" />
      </g>
    </svg>
  );
}
