import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pill,
  AlertTriangle,
  ArrowRight,
  Shield,
  Calendar,
  Users,
  IndianRupee,
  Activity,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGreeting } from "../hooks/useGreeting";
import {
  useGetPharmacyStatsQuery,
  useGetPrescriptionsQuery,
} from "../services/pharmacyApi";
import { DashboardSkeleton } from "../shared/components/Loading";

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const { data: stats, isLoading: statsLoading } = useGetPharmacyStatsQuery();
  const { data: prescriptions, isLoading: rxLoading } =
    useGetPrescriptionsQuery("pending");
  // Local loading state removed as we use RTK Query status now

  if (statsLoading || rxLoading) {
    return <DashboardSkeleton />;
  }

  /* ── Hero Chips (Right Slot) ── */
  const heroChips = (
    <div className="flex flex-wrap gap-4">
      {[
        {
          label: "Daily Revenue",
          value: `₹${((stats?.dailySales || 0) / 1000).toFixed(1)}K`,
          color: "#10B981",
        },
        {
          label: "Low Stock Items",
          value: stats?.lowStockItems || 0,
          color: "#F59E0B",
        },
        {
          label: "Pending Rx",
          value: (prescriptions || []).length,
          color: "#EF4444",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] px-6 py-4 lg:min-w-[140px] shadow-xl hover:bg-white/15 transition-all cursor-default"
        >
          <p className="text-[28px] font-black text-white leading-none mb-1">
            {s.value}
          </p>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="flex flex-col gap-10 pb-20 animate-fade-in"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="page-title">Pharmacy Command</h1>
          <p className="section-subtitle mt-2">
            Intelligence overview of NovaCare medical logistics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge-purple px-5 py-2.5 shadow-lg shadow-indigo-500/10">
            <Activity className="w-4 h-4" /> System Online
          </span>
          <Link
            to="/pharmacy/prescriptions"
            className="btn-primary no-underline"
            style={{
              background: "#4F46E5",
              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)",
            }}
          >
            Process Queue <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* ── Hero Banner (Unique Indigo Theme) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)",
        }}
        className="relative rounded-[32px] overflow-hidden shadow-2xl"
      >
        {/* Animated Decorative Blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ background: "rgba(255,255,255,0.12)" }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ background: "rgba(255,255,255,0.06)" }}
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-[60px] pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-10 py-10">
          <div className="flex-1 min-w-0">
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
              <Shield className="w-3.5 h-3.5" /> Medical Logistics Center
            </motion.span>
            <h2 className="text-[34px] lg:text-[42px] font-black text-white leading-[1.1] tracking-tight mb-4">
              {greeting}, {user?.name?.split(" ")[0] || "Pharmacist"} 👋
            </h2>
            <p className="text-lg text-white/80 font-bold max-w-2xl leading-relaxed">
              {salutation} Pharmacy operations are synchronized.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 w-full lg:w-auto"
          >
            {heroChips}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stats Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Medicines",
            value: stats?.totalInventoryCount || 0,
            icon: Pill,
            theme: {
              iconBg: "#EEF2FF",
              iconColor: "#4F46E5",
              trendBg: "#ECFDF5",
              trendColor: "#10B981",
              trendBorder: "#D1FAE5",
            },
            trend: "Healthy Stock",
          },
          {
            label: "Low Stock Alerts",
            value: stats?.lowStockItems || 0,
            icon: AlertTriangle,
            theme: {
              iconBg: "#FFF7ED",
              iconColor: "#F59E0B",
              trendBg: "#FEF2F2",
              trendColor: "#EF4444",
              trendBorder: "#FEE2E2",
            },
            trend: "Requires Action",
          },
          {
            label: "Pending Prescriptions",
            value: (prescriptions || []).length,
            icon: Activity,
            theme: {
              iconBg: "#F0F9FF",
              iconColor: "#0EA5E9",
              trendBg: "#F0F9FF",
              trendColor: "#0EA5E9",
              trendBorder: "#E0F2FE",
            },
            trend: "Active Queue",
          },
          {
            label: "Revenue Today",
            value: `₹${((stats?.dailySales || 0) / 1000).toFixed(1)}K`,
            icon: IndianRupee,
            theme: {
              iconBg: "#F5F3FF",
              iconColor: "#8B5CF6",
              trendBg: "#F5F3FF",
              trendColor: "#8B5CF6",
              trendBorder: "#EDE9FE",
            },
            trend: "Real-time",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * idx, ease: "easeOut" }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.08)",
            }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 relative overflow-hidden transition-all duration-300 shadow-sm"
          >
            {/* Decorative background circle */}
            <div 
              className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03]"
              style={{ background: stat.theme.iconColor }}
            />
            
            <div className="flex items-start justify-between relative z-10 mb-8">
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  background: stat.theme.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="shadow-sm border border-white/50"
              >
                <stat.icon
                  size={30}
                  style={{
                    color: stat.theme.iconColor,
                  }}
                />
              </div>

              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
                style={{
                  background: stat.theme.trendBg,
                  color: stat.theme.trendColor,
                  borderColor: stat.theme.trendBorder,
                }}
              >
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
                {stat.value}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Secondary Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prescription Queue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 dashboard-card p-10 flex flex-col h-[450px]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="section-title">Prescription Queue</h3>
              <p className="section-subtitle mt-1">Live order fulfillment</p>
            </div>
            <Link
              to="/pharmacy/prescriptions"
              className="badge-purple !bg-indigo-600 !text-white !border-indigo-700 shadow-lg shadow-indigo-500/20 px-6 py-2.5 no-underline"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <table className="data-table text-left">
              <thead>
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4 text-center">Priority</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right pr-8">Date</th>
                </tr>
              </thead>
              <tbody>
                {(prescriptions || []).slice(0, 5).map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 py-5 font-bold text-slate-800">
                      {row.patientName}
                    </td>
                    <td className="p-4 py-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${row.priority === "urgent" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="p-4 py-5 text-center">
                      <span className="badge-amber">{row.status}</span>
                    </td>
                    <td className="p-4 py-5 text-right pr-8 text-slate-400 font-bold text-xs">
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(prescriptions || []).length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-20 text-slate-400 font-bold"
                    >
                      No pending prescriptions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="dashboard-card p-10 bg-[#0F172A] border-none text-white h-[450px] relative overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex items-center justify-between mb-8">
            <h3 className="section-title text-white">Stock Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="relative z-10 flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {[
              "Amoxicillin 500mg",
              "Paracetamol 650mg",
              "Azithromycin 250mg",
              "Cough Syrup 100ml",
            ].map((med, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[15px]">{med}</span>
                  <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest border border-orange-500/30">
                    Low Stock
                  </span>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xs font-bold text-slate-400">
                    Stock: <span className="text-white">{i * 5 + 4} units</span>
                  </span>
                  <span className="text-[11px] font-black text-teal-400 group-hover:text-teal-300 uppercase tracking-widest">
                    Reorder →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
