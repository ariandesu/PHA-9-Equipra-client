export default function Logo({ className = "" }) {
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent to-accent-2 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5 text-background">
        <path
          d="M7 4h10v3H10v3h7v3h-7v3h7v3H7v-3h3v-3H7v-3h3V7H7V4Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
