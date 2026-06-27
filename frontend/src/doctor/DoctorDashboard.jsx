import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { appointmentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { formatINR } from "../utils/formatIndian";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { mockActivity } from "../services/mockData";
import {
  Video,
  FileText,
  ClipboardList,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Stethoscope,
  FlaskConical,
  Bed,
  Activity,
  Heart,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Pill,
} from "lucide-react";
import { useGreeting } from "../hooks/useGreeting";

const WEEKLY_DATA = [
  { day: "Mon", patients: 8 },
  { day: "Tue", patients: 14 },
  { day: "Wed", patients: 11 },
  { day: "Thu", patients: 17 },
  { day: "Fri", patients: 13 },
  { day: "Sat", patients: 9 },
  { day: "Sun", patients: 5 },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await appointmentsApi.getAll({ doctorId: user?.id || 1 });
        setAppointments(res.data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
    setActivity(mockActivity.getAll().slice(0, 6));
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <Spinner size="xl" />
        <p
          style={{ marginTop: 16, color: "#64748B", fontWeight: 600 }}
          className="animate-pulse-soft"
        >
          Loading your dashboard…
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todaysAppts = appointments.filter(
    (a) => a.date === today && a.status === "scheduled",
  );
  const nextPatient = [...todaysAppts].sort((a, b) =>
    a.time.localeCompare(b.time),
  )[0];
  const completedCount = appointments.filter(
    (a) => a.status === "completed",
  ).length;
  const pendingCount = appointments.filter(
    (a) => a.status === "scheduled",
  ).length;
  const estRevenue = completedCount * (user?.fee || 500);

  const heroRight = nextPatient ? (
    <div
      style={{
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.28)",
        borderRadius: 18,
        padding: "18px 22px",
        minWidth: 240,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 900,
          color: "rgba(255,255,255,0.75)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: 8,
        }}
      >
        Next Patient
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#fff",
          marginBottom: 4,
        }}
      >
        {nextPatient.patientName}
      </p>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.80)",
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        {nextPatient.department || "Consultation"}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 900, color: "#7DD3FC" }}>
          {nextPatient.time}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video style={{ width: 16, height: 16, color: "#fff" }} />
          </button>
          <Link
            to="/doctor/prescriptions"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <FileText style={{ width: 16, height: 16, color: "#fff" }} />
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
        paddingBottom: 48,
      }}
      className="animate-fade-in"
    >
      {/* ── Hero ── */}
      <HeroSection
        variant="doctor"
        badge="Doctor Panel"
        badgeIcon={Stethoscope}
        title={`${greeting}, Dr. ${user?.name?.replace(/^Dr\.\s*/i, "").split(" ")[0] || "Doctor"} 👋`}
        subtitle={`${salutation} ${
          todaysAppts.length === 0
            ? "Your schedule is clear today."
            : `You have ${todaysAppts.length} appointments.`
        }`}
        rightSlot={heroRight}
      />

      {/* ── KPI Cards ── */}
      <StatsCards
        columns={4}
        stats={[
          {
            label: "Today's Patients",
            value: todaysAppts.length,
            icon: Users,
            color: "blue",
            iconBg: "rgba(37,99,235,0.09)",
            iconColor: "#2563EB",
            trend: new Date().toLocaleDateString("en-IN", { weekday: "long" }),
          },
          {
            label: "Completed",
            value: completedCount,
            icon: CheckCircle2,
            color: "green",
            iconBg: "rgba(16,185,129,0.09)",
            iconColor: "#10B981",
            trend: "All time",
            trendUp: true,
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: AlertCircle,
            color: "amber",
            iconBg: "rgba(245,158,11,0.09)",
            iconColor: "#D97706",
            trend: "Scheduled",
          },
          {
            label: "Est. Earnings",
            value: formatINR(estRevenue),
            icon: TrendingUp,
            color: "purple",
            iconBg: "rgba(124,58,237,0.09)",
            iconColor: "#7C3AED",
            trend: "From completed visits",
            trendUp: true,
          },
        ]}
      />

      {/* ── Quick Actions ── */}
      <QuickActions
        actions={[
          {
            label: "Write Rx",
            desc: "Create prescription",
            icon: Pill,
            color: "blue",
            to: "/doctor/prescriptions",
          },
          {
            label: "Clinical Notes",
            desc: "View patient records",
            icon: ClipboardList,
            color: "green",
            to: "/doctor/records",
          },
          {
            label: "EMR",
            desc: "Health history & vitals",
            icon: Heart,
            color: "rose",
            to: "/doctor/emr",
          },
          {
            label: "Lab Reports",
            desc: "Test results & orders",
            icon: FlaskConical,
            color: "purple",
            to: "/doctor/lab",
          },
          {
            label: "Admitted IPD",
            desc: "View in-patients",
            icon: Bed,
            color: "cyan",
            to: "/doctor/ipd-patients",
          },
          {
            label: "Schedule",
            desc: "Manage appointments",
            icon: Calendar,
            color: "amber",
            to: "/doctor/schedule",
          },
        ]}
        columns={6}
      />

      {/* ── Schedule + Activity ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}
        className="grid-cols-1 lg:grid-cols-3"
      >
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px 14px",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: "#0F172A",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Clock style={{ width: 18, height: 18, color: "#2563EB" }} />{" "}
              Today's Schedule
            </h3>
            <Link
              to="/doctor/appointments"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#2563EB",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "#EFF6FF",
                padding: "6px 12px",
                borderRadius: 10,
              }}
            >
              View All <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>

          {todaysAppts.length === 0 ? (
            <div className="empty-state m-6">
              <Calendar className="empty-state-icon" />
              <p className="empty-state-title">Schedule is clear!</p>
              <p className="empty-state-body">
                No appointments scheduled for today. Enjoy your free time or
                review patient records.
              </p>
            </div>
          ) : (
            <div>
              {todaysAppts.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    borderBottom: "1px solid #F8FAFC",
                    transition: "background 0.15s",
                  }}
                  className="hover:bg-slate-50/60"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: i === 0 ? "#2563EB" : "#F1F5F9",
                      color: i === 0 ? "#fff" : "#64748B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      flexShrink: 0,
                      boxShadow:
                        i === 0 ? "0 4px 10px rgba(37,99,235,0.3)" : "none",
                    }}
                  >
                    {a.patientName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#1E293B",
                        fontSize: 13,
                      }}
                    >
                      {a.patientName}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 500,
                        marginTop: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Clock style={{ width: 11, height: 11 }} /> {a.time}
                      <span style={{ color: "#E2E8F0" }}>·</span>
                      {a.department || "General"}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    {i === 0 && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 900,
                          color: "#2563EB",
                          background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          padding: "3px 8px",
                          borderRadius: 999,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Next
                      </span>
                    )}
                    <Link
                      to={`/doctor/records?patientId=${a.patientId}`}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748B",
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        padding: "5px 12px",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      className="hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                    >
                      Records
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Feed */}
        <ActivityFeed
          title="Recent Activity"
          items={activity}
          maxHeight={320}
        />
      </div>

      {/* ── Weekly Volume Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: "#0F172A",
                marginBottom: 2,
              }}
            >
              Weekly Patient Volume
            </h3>
            <p style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
              Appointments handled this week
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#10B981",
              background: "#ECFDF5",
              padding: "5px 12px",
              borderRadius: 10,
              border: "1px solid #A7F3D0",
            }}
          >
            <TrendingUp style={{ width: 13, height: 13 }} /> +12% vs last week
          </div>
        </div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={WEEKLY_DATA}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="drGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                  fontWeight: 600,
                }}
                formatter={(v) => [`${v} patients`, "Count"]}
              />
              <Area
                type="monotone"
                dataKey="patients"
                name="Patients"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#drGrad)"
                dot={{ fill: "#2563EB", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
