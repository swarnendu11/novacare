/**
 * NovaCare Ambulance — Analytics
 * Emergency response analytics and operational metrics
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  AlertCircle,
  Ambulance,
  Calendar,
  Clock,
  Download,
  Filter,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { analyticsApi } from "../services/api";
import Spinner from "../components/Spinner";

// Chart Card Component
function ChartCard({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-black text-slate-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// Stat Box
function StatBox({ label, value, trend, trendUp, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-1 ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 mt-4">{value}</p>
      <p className="text-sm font-bold text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await analyticsApi.getDashboard();
        setData(analytics);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pieColors = ["#3B82F6", "#60A5FA", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 animate-fade-in font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            Analytics & Reports
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Emergency response metrics and operational insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm focus:outline-none focus:border-red-300"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={() => toast.info("Export report functionality")}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatBox
          icon={AlertCircle}
          label="Total Emergencies"
          value={data?.activeEmergencies + data?.completedToday || 0}
          trend="+12% vs last week"
          trendUp={true}
        />
        <StatBox
          icon={Clock}
          label="Avg Response Time"
          value={`${data?.avgResponseTime || 0}m`}
          trend="-8% vs last week"
          trendUp={true}
        />
        <StatBox
          icon={Ambulance}
          label="Fleet Utilization"
          value={`${Math.round(((data?.onCall || 0) / (data?.totalAmbulances || 1)) * 100)}%`}
          trend="Optimal"
          trendUp={true}
        />
        <StatBox
          icon={Users}
          label="Driver Efficiency"
          value="94%"
          trend="+3% vs last month"
          trendUp={true}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <ChartCard title="Response Time Trend" icon={Clock} delay={0}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weeklyDispatches || []}>
                <defs>
                  <linearGradient id="colorDispatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                />
                <Area
                  type="monotone"
                  dataKey="dispatches"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDispatches)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Emergency Types */}
        <ChartCard title="Emergency Types Distribution" icon={AlertCircle} delay={0.1}>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.emergenciesByType || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {(data?.emergenciesByType || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {(data?.emergenciesByType || []).map((item, index) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="text-slate-600">
                      {item.type} ({item.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Hourly Activity */}
        <ChartCard title="Hourly Emergency Activity" icon={Zap} delay={0.2}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.hourlyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0" }}
                />
                <Bar dataKey="calls" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Fleet Status */}
        <ChartCard title="Fleet Status Overview" icon={Ambulance} delay={0.3}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Ambulance className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Available</p>
                  <p className="text-xs text-slate-500">Ready for dispatch</p>
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600">{data?.available || 0}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ambulance className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">On Call</p>
                  <p className="text-xs text-slate-500">Active emergencies</p>
                </div>
              </div>
              <p className="text-2xl font-black text-blue-600">{data?.onCall || 0}</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Ambulance className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Maintenance</p>
                  <p className="text-xs text-slate-500">Out of service</p>
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600">{data?.maintenance || 0}</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Response Time by Priority" icon={Activity} delay={0.4}>
          <div className="space-y-3">
            {[
              { label: "Critical", time: "4.2 min", pct: 85 },
              { label: "High", time: "6.8 min", pct: 70 },
              { label: "Medium", time: "9.5 min", pct: 55 },
              { label: "Low", time: "12.3 min", pct: 40 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="w-16 text-sm font-bold text-slate-600">{item.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-sm font-black text-slate-900 w-20 text-right">{item.time}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Driver Performance" icon={Users} delay={0.5}>
          <div className="space-y-4">
            {[
              { name: "Rajesh Kumar", trips: 1240, rating: 4.8 },
              { name: "Sarah Lee", trips: 2150, rating: 4.9 },
              { name: "David James", trips: 1080, rating: 4.7 },
              { name: "Priya Nair", trips: 420, rating: 4.5 },
            ].map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-black text-blue-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{driver.name}</p>
                    <p className="text-xs text-slate-500">{driver.trips} trips</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-slate-900">{driver.rating}</span>
                  <span className="text-xs text-amber-400">★</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="System Health" icon={Zap} delay={0.6}>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-900">GPS Tracking</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                  100% Online
                </span>
              </div>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900">Dispatch System</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Operational
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900">Fleet Health</span>
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  {data?.lowFuel || 0} Need Fuel
                </span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${100 - ((data?.lowFuel || 0) / (data?.totalAmbulances || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
