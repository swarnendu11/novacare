/**
 * HeroSection — reusable dashboard hero banner
 * Props: title, subtitle, badge, badgeIcon, rightSlot, gradient
 */
import { motion } from "framer-motion";

const GRADIENTS = {
  blue: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
  doctor: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 80%, #0EA5E9 100%)",
  patient: "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
  reception: "linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #2563EB 100%)",
  admin: "linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #0EA5E9 100%)",
  green: "linear-gradient(135deg, #059669 0%, #10B981 60%, #06B6D4 100%)",
};

export default function HeroSection({
  title,
  subtitle,
  badge,
  badgeIcon: BadgeIcon,
  rightSlot,
  variant = "blue",
  className = "",
}) {
  const bg = GRADIENTS[variant] || GRADIENTS.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ background: bg }}
      className={`relative rounded-[32px] overflow-hidden shadow-2xl ${className}`}
    >
      {/* Animated Decorative Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ background: "rgba(255,255,255,0.15)" }}
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[80px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ background: "rgba(255,255,255,0.08)" }}
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-[60px] pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-10 py-10">
        {/* Left text */}
        <div className="flex-1 min-w-0">
          {badge && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
              className="inline-flex items-center gap-2 text-white text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-2xl mb-6 shadow-lg"
            >
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              {badge}
            </motion.span>
          )}

          <h2
            className="text-[34px] lg:text-[42px] font-black text-white leading-[1.1] tracking-tight mb-4"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="text-lg text-white/80 font-bold max-w-2xl leading-relaxed"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Right slot (appointment card, chip row, etc.) */}
        {rightSlot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 w-full lg:w-auto"
          >
            {rightSlot}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
