/**
 * QuickActions — reusable quick-action tile grid
 * Props: actions = [{ label, desc, icon, color, to }]
 */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const COLOR_MAP = {
  blue: {
    bg: "#EFF6FF",
    border: "#BFDBFE",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  green: {
    bg: "#ECFDF5",
    border: "#A7F3D0",
    iconBg: "#D1FAE5",
    iconColor: "#059669",
  },
  purple: {
    bg: "#F5F3FF",
    border: "#DDD6FE",
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  amber: {
    bg: "#FFF7ED",
    border: "#FED7AA",
    iconBg: "#FFE8CC",
    iconColor: "#D97706",
  },
  cyan: {
    bg: "#ECFEFF",
    border: "#A5F3FC",
    iconBg: "#CFFAFE",
    iconColor: "#0891B2",
  },
  rose: {
    bg: "#FFF1F2",
    border: "#FECDD3",
    iconBg: "#FFE4E6",
    iconColor: "#E11D48",
  },
  indigo: {
    bg: "#EEF2FF",
    border: "#C7D2FE",
    iconBg: "#E0E7FF",
    iconColor: "#4338CA",
  },
  teal: {
    bg: "#F0FDFA",
    border: "#99F6E4",
    iconBg: "#CCFBF1",
    iconColor: "#0F766E",
  },
};

function Tile({ label, desc, icon: Icon, color = "blue", to }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <Link
      to={to}
      style={{ display: "block", textDecoration: "none" }}
      className="group"
    >
      <motion.div
        whileHover={{
          y: -8,
          boxShadow: "0 30px 60px -12px rgba(0,0,0,0.12)",
          scale: 1.02,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          borderRadius: 28,
          padding: "28px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 160,
          justifyContent: "center",
          gap: 16,
          fontFamily: "Outfit, sans-serif",
        }}
        className="hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
      >
        {/* Subtle background glow on hover */}
        <div
          className="absolute -right-10 -top-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500"
          style={{ background: c.iconColor }}
        />

        {/* Icon circle */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            background: c.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            border: `1px solid ${c.border}`,
          }}
          className="group-hover:scale-110 group-hover:rotate-6 shadow-sm group-hover:shadow-md flex flex-col items-center justify-center pt-3.5"
        >
          <Icon style={{ width: 28, height: 28, color: c.iconColor }} />
        </div>

        {/* Label */}
        <div className="relative z-10">
          <p
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: "#0F172A",
              marginBottom: 4,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </p>
          {desc && (
            <p
              style={{
                fontSize: 11,
                color: "#64748B",
                fontWeight: 600,
                lineHeight: 1.4,
                maxWidth: "120px",
              }}
            >
              {desc}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function QuickActions({
  title = "Quick Actions",
  actions = [],
  columns = 6,
}) {
  const colClass =
    {
      3: "grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-4",
      5: "grid-cols-3 sm:grid-cols-5",
      6: "grid-cols-3 sm:grid-cols-6",
    }[columns] || "grid-cols-3 sm:grid-cols-6";

  return (
    <section style={{ marginTop: 32 }}>
      <h3 className="section-title mb-6">{title}</h3>
      <div className={`grid ${colClass}`} style={{ gap: 16 }}>
        {actions.map((a) => (
          <Tile key={a.label} {...a} />
        ))}
      </div>
    </section>
  );
}
