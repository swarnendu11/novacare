import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Microscope,
  FlaskConical,
  TestTube,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Thermometer,
  Zap,
} from "lucide-react";
import { mockLabReports } from "../services/mockData";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { name: "Mon", tests: 42, critical: 5 },
  { name: "Tue", tests: 58, critical: 8 },
  { name: "Wed", tests: 45, critical: 3 },
  { name: "Thu", tests: 67, critical: 12 },
  { name: "Fri", tests: 85, critical: 15 },
  { name: "Sat", tests: 55, critical: 6 },
  { name: "Sun", tests: 30, critical: 2 },
];

const equipmentStatus = [
  { name: "Hematology Analyzer X1", status: "Active", uptime: "99.8%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Biochemistry Auto-Analyzer", status: "Maintenance", uptime: "85.0%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Centrifuge Unit A", status: "Active", uptime: "100%", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Cold Storage (-80°C)", status: "Warning", uptime: "92.4%", icon: Thermometer, color: "text-red-500", bg: "bg-red-50" },
];

export default function LabDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    critical: 0,
  });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const reports = mockLabReports.getAll();
    const pending = reports.filter((r) => r.status === "pending").length;
    const inProgress = reports.filter((r) => r.status === "in-progress").length;
    const completed = reports.filter((r) => r.status === "completed").length;
    const critical = reports.filter((r) => r.type === "Urgent" && r.status !== "completed").length;

    setStats({ pending, inProgress, completed, critical });
    setRecentReports(reports.slice(0, 5));
  }, []);

  const metricCards = [
    {
      title: "Pending Tests",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
      trend: "+3 from yesterday",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "Active processing",
    },
    {
      title: "Completed Today",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      trend: "+12% efficiency",
    },
    {
      title: "Critical/Urgent",
      value: stats.critical,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
      trend: "Requires immediate attention",
    },
  ];

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[-50px] right-20 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl" />
        <div className="relative flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2 text-white">
              <Microscope className="w-8 h-8 text-teal-300" /> Laboratory Command Center
            </h2>
            <p className="text-teal-100 font-medium text-lg">
              Monitor test queues, analyze diagnostic volume, and manage equipment.
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => navigate("/laboratory/requests")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" /> View Queue
            </button>
            <button
              onClick={() => navigate("/laboratory/reports")}
              className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" /> New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-50 transition-transform group-hover:scale-150 ${card.bg}`} />
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-4 rounded-2xl ${card.bg}`}>
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">{card.title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                  {card.value}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 relative z-10">
              <TrendingUp className="w-4 h-4" /> {card.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Equipment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" /> Weekly Test Volume
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Total vs Critical tests over the last 7 days</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 2, strokeDasharray: "3 3" }}
                  />
                  <Area type="monotone" dataKey="tests" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorTests)" />
                  <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCritical)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Equipment Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Microscope className="w-5 h-5 text-teal-600" /> Equipment Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {equipmentStatus.map((eq, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                  <div className={`p-3 rounded-xl ${eq.bg} ${eq.color}`}>
                    <eq.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{eq.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        eq.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                        eq.status === "Warning" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {eq.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Uptime: {eq.uptime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" /> Live Testing Feed
            </h3>
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {recentReports.map((report) => (
              <div key={report.id} className="p-5 hover:bg-slate-50/80 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                      <TestTube className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">
                        {report.testName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Patient: {report.patientName}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      report.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : report.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <div className="pl-11 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">#{report.id}</span>
                  <span className="text-slate-400 font-medium">{report.date}</span>
                </div>
              </div>
            ))}
            {recentReports.length === 0 && (
              <div className="p-10 text-center text-slate-500 font-medium">
                No recent lab reports found.
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => navigate("/laboratory/requests")}
              className="w-full py-2.5 bg-white border border-slate-200 hover:border-teal-300 text-teal-600 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              View Full Queue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
