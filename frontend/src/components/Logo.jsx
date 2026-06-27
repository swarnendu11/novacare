/**
 * NovaCare Logo - Minimal medical cross with subtle pulse
 */

export default function Logo({ className = "w-10 h-10", variant = "icon" }) {
  if (variant === "full") {
    return <img className={className} src="/logo-light.svg" alt="NovaCare" />;
  }
  if (variant === "full-dark") {
    return <img className={className} src="/logo-dark.svg" alt="NovaCare" />;
  }
  return <img className={className} src="/logo-icon.svg" alt="NovaCare" />;
}
