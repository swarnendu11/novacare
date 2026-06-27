import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import toast from "react-hot-toast";
import { useGetDashboardStatsQuery } from "../modules/dashboard/dashboardApi";
import { DashboardSkeleton } from "../shared/components/Loading";
import { showToast } from "../shared/utils/notifications";
import { formatNumberIndian } from "../utils/formatIndian";
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  IndianRupee,
  Bed,
  TrendingUp,
  FlaskConical,
  Pill,
  Heart,
  Shield,
  ArrowRight,
  Building2,
} from "lucide-react";
import { mockActivity } from "../services/mockData";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { useGreeting } from "../hooks/useGreeting";

const PALETTE = [
  "#2563EB",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#EF4444",
];

const REVENUE_DATA = [
  { day: "Mon", total: 42000, ipd: 15000, opd: 27000 },
  { day: "Tue", total: 58000, ipd: 22000, opd: 36000 },
  { day: "Wed", total: 49000, ipd: 18000, opd: 31000 },
  { day: "Thu", total: 65000, ipd: 28000, opd: 37000 },
  { day: "Fri", total: 72000, ipd: 31000, opd: 41000 },
  { day: "Sat", total: 85000, ipd: 38000, opd: 47000 },
  { day: "Sun", total: 94000, ipd: 42000, opd: 52000 },
];

const APPT_DATA = [
  { day: "Mon", count: 38 },
  { day: "Tue", count: 52 },
  { day: "Wed", count: 45 },
  { day: "Thu", count: 61 },
  { day: "Fri", count: 70 },
  { day: "Sat", count: 83 },
  { day: "Sun", count: 47 },
];

const PORTS = {
  admin: 3001,
  doctor: 3002,
  patient: 3003,
  receptionist: 3004,
  nurse: 3005,
  wardboy: 3006,
  pharmacy: 3007,
  ambulance: 3008,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (error) {
      showToast(
        "Offline mode: Using cached or simulated intelligence.",
        "error",
      );
    }
    setActivity(mockActivity.getAll().slice(0, 8));
  }, [error]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const deptData = stats?.appointmentsByDepartment
    ? Object.entries(stats.appointmentsByDepartment).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const heroChips = (
    <div className="flex flex-wrap gap-4">
      {[
        {
          label: "Today's Revenue",
          value: `₹${((stats?.revenueToday || 84500) / 1000).toFixed(0)}K`,
          color: "#10B981",
        },
        {
          label: "Bed Occupancy",
          value: `${Math.round(((stats?.admittedPatients || 24) / 30) * 100)}%`,
          color: "#F59E0B",
        },
        {
          label: "Pending Alerts",
          value: stats?.pendingAlerts || 3,
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
          <h1 className="page-title">Hospital Commander</h1>
          <p className="section-subtitle mt-2">
            Intelligence overview of NovaCare facility performance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge-green px-5 py-2.5 shadow-lg shadow-emerald-500/10">
            <Activity className="w-4 h-4" /> System Online
          </span>
          <Link to="/admin/ipd" className="btn-primary no-underline">
            IPD Control <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <HeroSection
        variant="admin"
        badge="Health Operations Center"
        badgeIcon={Shield}
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Admin"} 👋`}
        subtitle={`${salutation} System health 100%.`}
        rightSlot={heroChips}
      />

      <StatsCards
        columns={6}
        stats={[
          {
            label: "Total Patients",
            value: formatNumberIndian(stats?.totalUsers || 248),
            icon: Users,
            gradient: "linear-gradient(135deg,#3730A3,#4F46E5)",
            trend: "12%",
            trendUp: true,
          },
          {
            label: "Active Doctors",
            value: stats?.totalDoctors || 42,
            icon: Stethoscope,
            gradient: "linear-gradient(135deg,#0E7490,#06B6D4)",
            trend: "On Duty",
          },
          {
            label: "Appointments",
            value: stats?.todayAppointments || 18,
            icon: Calendar,
            gradient: "linear-gradient(135deg,#5B21B6,#8B5CF6)",
            trend: "Scheduled",
          },
          {
            label: "Admitted Patients",
            value: stats?.admittedPatients || 24,
            icon: Bed,
            gradient: "linear-gradient(135deg,#92400E,#F59E0B)",
            trend: "Active IPD",
          },
          {
            label: "Available Beds",
            value: stats?.availableBeds || 6,
            icon: Heart,
            gradient: "linear-gradient(135deg,#065F46,#10B981)",
            trend: "Vacancy",
          },
          {
            label: "Revenue Today",
            value: `₹${((stats?.revenueToday || 84500) / 1000).toFixed(0)}K`,
            icon: IndianRupee,
            gradient: "linear-gradient(135deg,#9D174D,#EC4899)",
            trend: "18%",
            trendUp: true,
          },
        ]}
      />

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 dashboard-card p-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
            <div>
              <h3 className="section-title">Revenue Architecture</h3>
              <p className="section-subtitle mt-1">
                Cross-unit financial breakdown
              </p>
            </div>
            <div className="flex items-center gap-6">
              {[
                ["#2563EB", "Total"],
                ["#10B981", "IPD"],
                ["#06B6D4", "OPD"],
              ].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: c, boxShadow: `0 0 12px ${c}60` }}
                  />
                  <span className="text-xs font-black text-slate-500">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={REVENUE_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {[
                    ["gT", "#2563EB"],
                    ["gI", "#10B981"],
                    ["gO", "#06B6D4"],
                  ].map(([id, c]) => (
                    <linearGradient
                      key={id}
                      id={id}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 13, fontWeight: 800 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 800 }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 20,
                    border: "none",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                    padding: "16px 24px",
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: 14 }}
                  formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  name="Total"
                  dataKey="total"
                  stroke="#2563EB"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#gT)"
                  filter="drop-shadow(0 10px 10px rgba(37, 99, 235, 0.2))"
                />
                <Area
                  type="monotone"
                  name="IPD"
                  dataKey="ipd"
                  stroke="#10B981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#gI)"
                />
                <Area
                  type="monotone"
                  name="OPD"
                  dataKey="opd"
                  stroke="#06B6D4"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#gO)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Pie */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card p-10 flex flex-col"
        >
          <h3 className="section-title">Department Distribution</h3>
          <p className="section-subtitle mt-1">
            Speciality workload allocation
          </p>
          <div className="flex-1 min-h-[250px] relative mt-8">
            {deptData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {deptData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PALETTE[i % PALETTE.length]}
                        cornerRadius={8}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 20,
                      border: "none",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 font-bold">
                No data available
              </div>
            )}
            {deptData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {stats?.totalAppointments || 0}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Volume
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 mt-8">
            {deptData.slice(0, 4).map((d, i) => (
              <div
                key={d.name}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="text-sm font-black text-slate-700">
                    {d.name}
                  </span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Charts Row 2 + Quick Links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 dashboard-card p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="section-title">Patient Traffic</h3>
              <p className="section-subtitle mt-1">
                Weekly appointment frequency
              </p>
            </div>
            <Link
              to="/admin/appointments"
              className="badge-blue !bg-blue-600 !text-white !border-blue-700 shadow-lg shadow-blue-500/20 px-6 py-2.5 no-underline"
            >
              Analyze Trajectory
            </Link>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={APPT_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 13, fontWeight: 800 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 800 }}
                />
                <Tooltip
                  cursor={{ fill: "#F1F5F9", radius: 12 }}
                  contentStyle={{
                    borderRadius: 20,
                    border: "none",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontWeight: 800 }}
                  formatter={(v) => [`${v} Patients`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#2563EB"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={45}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Action Links Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="dashboard-card p-10"
        >
          <h3 className="section-title mb-8">Executive Hub</h3>
          <div className="flex flex-col gap-3">
            {[
              {
                label: "Ward Commander",
                sub: "Bed tracking systems",
                icon: Bed,
                iconBg: "rgba(37,99,235,0.08)",
                iconColor: "#2563EB",
                to: "/admin/ipd",
              },
              {
                label: "Lab Operations",
                sub: "Diagnostic oversight",
                icon: FlaskConical,
                iconBg: "rgba(139,92,246,0.08)",
                iconColor: "#8B5CF6",
                to: "/admin/lab",
              },
              {
                label: "Pharma Inventory",
                sub: "Critical drug supply",
                icon: Pill,
                iconBg: "rgba(6,182,212,0.08)",
                iconColor: "#06B6D4",
                href: `http://localhost:${PORTS.pharmacy}`,
              },
              {
                label: "Emergency Dispatch",
                sub: "Fleet & Ambulance",
                icon: Activity,
                iconBg: "rgba(239,68,68,0.08)",
                iconColor: "#EF4444",
                href: `http://localhost:${PORTS.ambulance}`,
              },
              {
                label: "Revenue Vault",
                sub: "Financial reconciliations",
                icon: IndianRupee,
                iconBg: "rgba(245,158,11,0.08)",
                iconColor: "#F59E0B",
                to: "/admin/billing",
              },
              {
                label: "Staffing Matrix",
                sub: "Resource allocation",
                icon: Building2,
                iconBg: "rgba(71,85,105,0.08)",
                iconColor: "#475569",
                to: "/admin/departments",
              },
            ].map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 no-underline group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.iconColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 truncate">
                      {item.sub}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 no-underline group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.iconColor }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 truncate">
                      {item.sub}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              )
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Activity Feed ── */}
      <ActivityFeed
        title="Live Activity Feed"
        items={activity}
        live
        maxHeight={340}
      />
    </div>
  );
}
