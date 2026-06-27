/**
 * StatsCards — reusable KPI card grid
 * Enhanced with premium colourful themes
 */
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const THEMES = {
  blue: {
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    trendBg: "#ECFDF5",
    trendColor: "#10B981",
    trendBorder: "#D1FAE5",
  },
  emerald: {
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    trendBg: "#ECFDF5",
    trendColor: "#10B981",
    trendBorder: "#D1FAE5",
  },
  amber: {
    iconBg: "#FFF7ED",
    iconColor: "#F59E0B",
    trendBg: "#F0F9FF",
    trendColor: "#0EA5E9",
    trendBorder: "#E0F2FE",
  },
  indigo: {
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
    trendBg: "#ECFDF5",
    trendColor: "#10B981",
    trendBorder: "#D1FAE5",
  },
  rose: {
    iconBg: "#FFF1F2",
    iconColor: "#F43F5E",
    trendBg: "#FFF1F2",
    trendColor: "#F43F5E",
    trendBorder: "#FFE4E6",
  },
  violet: {
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
    trendBg: "#F5F3FF",
    trendColor: "#8B5CF6",
    trendBorder: "#EDE9FE",
  },
};

export default function StatsCards({ stats = [], columns = 4 }) {
  const colClass =
    {
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    }[columns] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${colClass} gap-6`}>
      {stats.map((s, i) => {
        const theme = THEMES[s.color] || THEMES.blue;
        
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{
              y: -8,
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.08)",
              scale: 1.01,
            }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 relative overflow-hidden transition-all duration-300"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {/* Soft decorative background circles */}
            <div 
              className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03]"
              style={{ background: theme.iconColor }}
            />
            
            <div className="flex items-start justify-between relative z-10 mb-8">
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 22,
                  background: theme.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                className="group-hover:scale-110 shadow-sm border border-white/50"
              >
                {s.icon && (
                  <s.icon
                    size={32}
                    style={{
                      color: theme.iconColor,
                    }}
                  />
                )}
              </div>

              {s.trend && (
                <div
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border transition-colors"
                  style={{
                    background: s.trendBg || theme.trendBg,
                    color: s.trendColor || theme.trendColor,
                    borderColor: s.trendBorder || theme.trendBorder,
                  }}
                >
                  {s.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {s.trend}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <h4 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                {s.value}
              </h4>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
                {s.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
