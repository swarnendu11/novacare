/**
 * Loading Spinner
 */

export default function Spinner({ size = "md" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizes[size]} border-2 border-primary/30 border-t-primary rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
