export function SparkleMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="gl-sparkle"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M50 0C53 35 65 47 100 50C65 53 53 65 50 100C47 65 35 53 0 50C35 47 47 35 50 0Z"
      />
    </svg>
  );
}
