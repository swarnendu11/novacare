/**
 * ActivityFeed — reusable recent activity list
 * Props: items = [{ id, type, title, desc, time, date }]
 */
import { motion } from "framer-motion";

const TYPE_CONFIG = {
  admit: { emoji: "🏥", bg: "#EFF6FF", color: "#2563EB" },
  lab: { emoji: "🧪", bg: "#F5F3FF", color: "#7C3AED" },
  rx: { emoji: "💊", bg: "#ECFDF5", color: "#059669" },
  appt: { emoji: "📅", bg: "#ECFEFF", color: "#0891B2" },
  payment: { emoji: "💰", bg: "#FFF7ED", color: "#D97706" },
  system: { emoji: "⚙️", bg: "#F8FAFC", color: "#64748B" },
  staff: { emoji: "👥", bg: "#FFF1F2", color: "#E11D48" },
  doctor: { emoji: "👨‍⚕️", bg: "#EEF2FF", color: "#4338CA" },
  discharge: { emoji: "🚪", bg: "#ECFDF5", color: "#059669" },
  transfer: { emoji: "🔄", bg: "#FFF7ED", color: "#D97706" },
};

function ActivityItem({ item, index }) {
  const cfg = TYPE_CONFIG[item.type] || {
    emoji: "📌",
    bg: "#F8FAFC",
    color: "#64748B",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "16px 28px",
        borderBottom: "1px solid rgba(226, 232, 240, 0.3)",
      }}
      className="hover:bg-slate-50/50 last:border-0 transition-colors duration-300"
    >
      {/* Icon bubble */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: cfg.bg,
          border: `1px solid ${cfg.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          marginTop: 2,
        }}
        className="shadow-sm"
      >
        {cfg.emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#1E293B",
            lineHeight: 1.3,
            fontFamily: "Outfit, sans-serif",
          }}
        >
          {item.title}
        </p>
        {item.desc && (
          <p
            style={{
              fontSize: 12,
              color: "#64748B",
              fontWeight: 600,
              marginTop: 4,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {item.desc}
          </p>
        )}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
            {item.time}
          </span>
          {item.date && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {item.date}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivityFeed({
  title = "Recent Activity",
  items = [],
  live = false,
  maxHeight = 320,
}) {
  return (
    <div
      className="dashboard-card overflow-hidden"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 28px",
          borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
        }}
      >
        <h3 className="section-title !text-lg flex items-center gap-3">
          <span className="text-xl">🔔</span> {title}
        </h3>
        {live && (
          <span className="badge-red animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" /> LIVE
          </span>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="py-20 flex flex-col items-center opacity-40">
          <p className="text-lg font-bold text-slate-400">No recent activity</p>
          <p className="text-sm font-medium text-slate-400">
            System events will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{ maxHeight, overflowY: "auto" }}
          className="custom-scrollbar"
        >
          {items.map((item, i) => (
            <ActivityItem key={item.id || i} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
