import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  analyticsApi,
  prescriptionsApi,
  appointmentsApi,
} from "../services/api";
import { downloadPrescriptionPdf } from "../utils/downloadPdf";
import Spinner from "../components/Spinner";
import { formatDateIndian, formatNumberIndian } from "../utils/formatIndian";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { mockActivity } from "../services/mockData";
import {
  Calendar,
  Pill,
  HeartPulse,
  Activity,
  Thermometer,
  Clock,
  ArrowRight,
  FlaskConical,
  CreditCard,
  Heart,
  CheckCircle2,
  FileText,
  Download,
  Stethoscope,
} from "lucide-react";
import { useGreeting } from "../hooks/useGreeting";

const DONUT_COLORS = ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B"];

const HEALTH_TREND = [
  { day: "Mon", bp: 120, pulse: 72 },
  { day: "Tue", bp: 118, pulse: 74 },
  { day: "Wed", bp: 122, pulse: 70 },
  { day: "Thu", bp: 119, pulse: 73 },
  { day: "Fri", bp: 121, pulse: 71 },
  { day: "Sat", bp: 117, pulse: 75 },
  { day: "Sun", bp: 120, pulse: 72 },
];

export default function PatientDashboard() {
  const [stats, setStats] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const { user } = useAuth();
  const { greeting } = useGreeting();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, prescRes, apptsRes] = await Promise.all([
          analyticsApi.patient(),
          prescriptionsApi.getAll(),
          appointmentsApi.getAll(),
        ]);
        setStats(statsRes.data);
        const myPrescriptions = (prescRes.data || []).filter(
          (p) => p.patientId === user?.id,
        );
        setPrescriptions(myPrescriptions.slice(0, 4));
        const upcoming = (apptsRes.data || [])
          .filter(
            (a) => a.status === "scheduled" && new Date(a.date) >= new Date(),
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextAppointment(upcoming[0] || null);
      } catch (err) {
        console.error("Dashboard load error:", err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
    setActivity(mockActivity.getAll().slice(0, 6));
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-40">
        <Spinner size="lg" />
        <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse">
          Syncing your health profile...
        </p>
      </div>
    );
  }

  const chartData = stats?.appointmentsByStatus
    ? Object.entries(stats.appointmentsByStatus).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const heroRight = (
    <div className="flex flex-wrap gap-4">
      {nextAppointment ? (
        <>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 min-w-[180px] rounded-3xl shadow-xl hover:bg-white/15 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-lg border border-white/10 group-hover:rotate-6 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none mb-1.5">
                  {formatDateIndian(nextAppointment.date)}
                </p>
                <p className="text-[10px] font-black text-cyan-200/60 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />{" "}
                  {nextAppointment.time}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 min-w-[180px] rounded-3xl shadow-xl hover:bg-white/15 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-lg border border-white/10 group-hover:rotate-6 transition-transform">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none mb-1.5">
                  Dr. {nextAppointment.doctorName.split(" ").pop()}
                </p>
                <p className="text-[10px] font-black text-cyan-200/60 uppercase tracking-widest">
                  {nextAppointment.department}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/patient/appointments")}
            className="bg-white px-8 py-4 rounded-3xl shadow-2xl hover:bg-cyan-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-blue-700 flex items-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
          >
            Manage Session <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-3xl shadow-xl flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white/40" />
          </div>
          <div>
            <p className="text-white/60 font-bold text-sm">
              No scheduled visits
            </p>
            <Link
              to="/patient/book"
              className="text-white text-xs font-black uppercase tracking-widest hover:underline mt-1 block"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col gap-10 pb-20 animate-fade-in"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <HeroSection
        variant="patient"
        badge="Wellness Center"
        badgeIcon={Heart}
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Patient"} 👋`}
        subtitle="Your personalized health overview is ready. System synchronized."
        rightSlot={heroRight}
      />

      <StatsCards
        columns={4}
        stats={[
          {
            label: "Total Consultations",
            value: formatNumberIndian(stats?.totalAppointments || 0),
            icon: Calendar,
            gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            trend: "Lifetime Registry",
          },
          {
            label: "Visits Finalized",
            value: stats?.appointmentsByStatus?.completed || 0,
            icon: CheckCircle2,
            gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            trend: "Health Summary",
            trendUp: true,
          },
          {
            label: "Active Medication",
            value: prescriptions.length,
            icon: Pill,
            gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            trend: "Medicine Track",
          },
          {
            label: "Pending Visits",
            value: stats?.appointmentsByStatus?.scheduled || 0,
            icon: Clock,
            gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
            trend: "Next Phase",
          },
        ]}
      />

      <QuickActions
        title="Patient Quick Control"
        actions={[
          {
            label: "Find Care",
            desc: "Book new session",
            icon: Calendar,
            color: "blue",
            to: "/patient/book",
          },
          {
            label: "Lab Vault",
            desc: "Secure diagnostics",
            icon: FlaskConical,
            color: "purple",
            to: "/patient/lab-reports",
          },
          {
            label: "E-Pharmacy",
            desc: "Review active Rx",
            icon: Pill,
            color: "teal",
            to: "/patient/prescriptions",
          },
          {
            label: "Finances",
            desc: "Bills & insurance",
            icon: CreditCard,
            color: "green",
            to: "/patient/billing",
          },
          {
            label: "Timeline",
            desc: "Full medical history",
            icon: FileText,
            color: "indigo",
            to: "/patient/history",
          },
        ]}
        columns={5}
      />

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h3 className="section-title">Health Biometrics</h3>
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Real-time update: Today, 10:30 AM
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Heart Rate",
              value: "72",
              unit: "bpm",
              icon: HeartPulse,
              color: "#F43F5E",
              trend: "Stable Pulse Registry",
              pulse: true,
            },
            {
              label: "Blood Pressure",
              value: "120/80",
              unit: "mmHg",
              icon: Activity,
              color: "#3B82F6",
              trend: "Optimal Systolic Range",
            },
            {
              label: "Temperature",
              value: "98.6",
              unit: "°F",
              icon: Thermometer,
              color: "#10B981",
              trend: "Nominal Body Heat",
            },
          ].map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              whileHover={{
                y: -8,
                boxShadow: "0 30px 60px rgba(0,0,0,0.08)",
                scale: 1.02,
              }}
              className={`dashboard-card group p-10 relative overflow-hidden`}
              style={{
                background: `linear-gradient(135deg, ${v.color}05 0%, #ffffff 100%)`,
              }}
            >
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
                style={{ background: v.color }}
              />
              <div className="flex items-center justify-between mb-8">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {v.label}
                </p>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border border-white`}
                  style={{
                    background: `${v.color}15`,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <v.icon
                    className={`w-7 h-7 ${v.pulse ? "animate-pulse" : ""}`}
                    style={{ color: v.color }}
                  />
                </div>
              </div>
              <div className="flex items-end gap-2.5 mb-6">
                <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  {v.value}
                </p>
                <p className="text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">
                  {v.unit}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {v.trend}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="dashboard-card p-10 flex flex-col"
        >
          <h3 className="section-title">Health Trajectory</h3>
          <p className="section-subtitle mt-1 mb-8">
            Clinical data distribution
          </p>
          <div className="flex-1 min-h-[200px] relative">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DONUT_COLORS[i % DONUT_COLORS.length]}
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
              <div className="flex flex-col h-full items-center justify-center opacity-30">
                <Calendar className="w-12 h-12 mb-3 text-slate-300" />
                <p className="font-black text-slate-400 text-xs uppercase tracking-widest">
                  Awaiting Logs
                </p>
              </div>
            )}
            {chartData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-900 leading-none">
                  {stats?.totalAppointments || 0}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Activity
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {chartData.map((d, i) => (
              <div
                key={d.name}
                className="flex items-center gap-3 p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {d.name}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {d.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 dashboard-card p-10"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="section-title">Clinical Stability</h3>
              <p className="section-subtitle mt-1">Vitals Trend Analysis</p>
            </div>
            <div className="flex gap-6">
              {[
                ["#2563EB", "Sys BP"],
                ["#F43F5E", "Pulse Rate"],
              ].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: c, boxShadow: `0 0 10px ${c}40` }}
                  />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={HEALTH_TREND}
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
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 800 }}
                  domain={[60, 135]}
                />
                <Tooltip
                  cursor={{
                    stroke: "#2563EB",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                  contentStyle={{
                    borderRadius: 24,
                    border: "none",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
                    padding: "16px 24px",
                  }}
                  itemStyle={{ fontWeight: 800 }}
                />
                <Line
                  type="monotone"
                  dataKey="bp"
                  name="BP"
                  stroke="#2563EB"
                  strokeWidth={5}
                  dot={{
                    fill: "#2563EB",
                    r: 6,
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 10, stroke: "#fff", strokeWidth: 4 }}
                  animationDuration={2000}
                />
                <Line
                  type="monotone"
                  dataKey="pulse"
                  name="Pulse"
                  stroke="#F43F5E"
                  strokeWidth={5}
                  dot={{
                    fill: "#F43F5E",
                    r: 6,
                    strokeWidth: 3,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 10, stroke: "#fff", strokeWidth: 4 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 dashboard-card overflow-hidden"
        >
          <div className="flex items-center justify-between p-8 border-bottom-light">
            <h3 className="section-title flex items-center gap-3">
              <Pill className="w-6 h-6 text-teal-600" /> Active Prescriptions
            </h3>
            <Link
              to="/patient/prescriptions"
              className="btn-outline !py-2.5 !px-5 !text-[10px] !font-black !uppercase !tracking-widest shadow-sm !border-teal-100 !text-teal-600 hover:!bg-teal-50"
            >
              Full History <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
          {prescriptions.length ? (
            <div className="divide-y divide-slate-50">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  className="p-8 flex items-center justify-between gap-6 hover:bg-slate-50/80 transition-all group cursor-default"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter leading-none mb-1">
                        RX
                      </span>
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg tracking-tight">
                        {p.diagnosis || "Clinical Consult"}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5" /> {p.doctorName}
                        </span>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                          {formatDateIndian(p.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      downloadPrescriptionPdf(p.id).catch(() =>
                        toast.error("Download failed"),
                      )
                    }
                    className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-700 shadow-sm transition-all active:scale-90"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center opacity-30">
              <Pill className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                No Active Medication
              </p>
            </div>
          )}
        </motion.div>

        <ActivityFeed
          title="Clinical Log"
          live
          items={activity}
          maxHeight={480}
        />
      </div>
    </div>
  );
}
