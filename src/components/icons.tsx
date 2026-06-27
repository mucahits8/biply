type IconProps = { className?: string };

export function NfcIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
      <path d="M15 17c4 4 4 10 0 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M9 12c7 7 7 17 0 24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="28" y="11" width="12" height="26" rx="3" stroke="currentColor" strokeWidth="3.5" />
      <path d="M32 32h4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function QrIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
      <path d="M8 8h12v12H8zM28 8h12v12H28zM8 28h12v12H8z" stroke="currentColor" strokeWidth="3" />
      <path d="M29 29h4v4h-4zM37 29h3v11h-8M25 37h3M25 25h3M36 24h4" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
      <path d="M24 6 39 12v10c0 10-6 17-15 20C15 39 9 32 9 22V12l15-6Z" stroke="currentColor" strokeWidth="3" />
      <path d="m17 24 5 5 10-11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
