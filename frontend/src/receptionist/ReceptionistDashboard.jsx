import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Clock,
  CreditCard,
  Stethoscope,
  ArrowRight,
  Activity,
  Calendar,
  IndianRupee,
  FileText,
  Bed,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { appointmentsApi, doctorsApi } from "../services/api";
import Spinner from "../components/Spinner";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { mockActivity } from "../services/mockData";
import { useAuth } from "../context/AuthContext";
import { useGreeting } from "../hooks/useGreeting";

const HOURLY_DATA = [
  { hour: "8AM", patients: 3 },
  { hour: "9AM", patients: 7 },
  { hour: "10AM", patients: 11 },
  { hour: "11AM", patients: 9 },
  { hour: "12PM", patients: 5 },
  { hour: "1PM", patients: 4 },
  { hour: "2PM", patients: 8 },
  { hour: "3PM", patients: 12 },
  { hour: "4PM", patients: 6 },
];

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const [appointments, setAppointments] = useState([]);
  const [activeDoctors, setActiveDoctors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  const report = {
    dailyRevenue: 45000,
    pendingPayments: 4,
    totalPatients: 142,
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [appRes, docRes] = await Promise.all([
          appointmentsApi.getAll(),
          doctorsApi.getAll(),
        ]);
        const today = new Date().toISOString().split("T")[0];
        setAppointments(
          appRes.data.filter(
            (a) => a.date === today && a.status === "scheduled",
          ),
        );
        setActiveDoctors(docRes.data.filter((d) => d.available).length);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
    setActivity(mockActivity.getAll().slice(0, 6));
  }, []);

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
          Loading command centre…
        </p>
      </div>
    );
  }

  const upcoming = [...appointments]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);

  const heroChips = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {[
        {
          label: "Revenue",
          value: `₹${(report.dailyRevenue / 1000).toFixed(0)}K`,
          icon: IndianRupee,
          bg: "rgba(16,185,129,0.22)",
        },
        {
          label: "Unpaid",
          value: report.pendingPayments,
          icon: FileText,
          bg: "rgba(239,68,68,0.22)",
        },
        {
          label: "Waiting",
          value: appointments.length,
          icon: Clock,
          bg: "rgba(245,158,11,0.22)",
        },
        {
          label: "Doctors On",
          value: activeDoctors,
          icon: Stethoscope,
          bg: "rgba(255,255,255,0.15)",
        },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            background: s.bg,
            border: "1px solid rgba(255,255,255,0.20)",
            backdropFilter: "blur(8px)",
            borderRadius: 16,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.20)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <s.icon style={{ width: 17, height: 17, color: "#fff" }} />
          </div>
          <div>
            <p
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.65)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: 3,
              }}
            >
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

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
        variant="reception"
        badge="Active Shift"
        badgeIcon={Activity}
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Receptionist"} 👋`}
        subtitle={`${salutation} Managing front desk and patient flow.`}
        rightSlot={heroChips}
      />

      {/* ── KPI Cards ── */}
      <StatsCards
        columns={4}
        stats={[
          {
            label: "Today's Appointments",
            value: appointments.length,
            icon: Calendar,
            color: "blue",
            iconBg: "rgba(37,99,235,0.09)",
            iconColor: "#2563EB",
            trend: "Scheduled today",
          },
          {
            label: "Total Patients",
            value: report.totalPatients,
            icon: Users,
            color: "green",
            iconBg: "rgba(16,185,129,0.09)",
            iconColor: "#10B981",
            trend: "Registered patients",
            trendUp: true,
          },
          {
            label: "Doctors On Duty",
            value: activeDoctors,
            icon: Stethoscope,
            color: "purple",
            iconBg: "rgba(124,58,237,0.09)",
            iconColor: "#7C3AED",
            trend: "Currently active",
          },
          {
            label: "Pending Payments",
            value: report.pendingPayments,
            icon: CreditCard,
            color: "red",
            iconBg: "rgba(239,68,68,0.09)",
            iconColor: "#DC2626",
            trend: "Awaiting collection",
          },
        ]}
      />

      {/* ── Quick Commands ── */}
      <QuickActions
        title="Quick Commands"
        actions={[
          {
            label: "New Walk-In",
            desc: "Register walk-in patient",
            icon: UserPlus,
            color: "blue",
            to: "/receptionist/walkin",
          },
          {
            label: "Live Queue",
            desc: "Monitor patient queue",
            icon: Activity,
            color: "amber",
            to: "/receptionist/queue",
          },
          {
            label: "Billing",
            desc: "Process payments & invoices",
            icon: CreditCard,
            color: "green",
            to: "/receptionist/billing",
          },
          {
            label: "Doctor Roster",
            desc: "Today's doctor schedule",
            icon: Stethoscope,
            color: "purple",
            to: "/receptionist/roster",
          },
          {
            label: "IPD Admissions",
            desc: "Manage in-patients",
            icon: Bed,
            color: "cyan",
            to: "/receptionist/ipd",
          },
          {
            label: "Ward & Beds",
            desc: "View bed availability",
            icon: Building2,
            color: "rose",
            to: "/receptionist/ward",
          },
        ]}
        columns={6}
      />

      {/* ── Queue + Chart ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}
        className="grid-cols-1 lg:grid-cols-3"
      >
        {/* Upcoming queue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
              padding: "20px 22px 14px",
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
              <Clock style={{ width: 18, height: 18, color: "#2563EB" }} /> Up
              Next
            </h3>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 900,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "3px 10px",
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
              className="animate-pulse-soft"
            >
              ● Live
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty-state m-5">
              <Calendar className="empty-state-icon" />
              <p className="empty-state-title">Queue is clear!</p>
              <p className="empty-state-body">
                No scheduled arrivals right now.
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
              }}
            >
              {/* Timeline vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 32,
                  top: 28,
                  bottom: 28,
                  width: 2,
                  background: "#F1F5F9",
                  zIndex: 0,
                }}
              />
              {upcoming.map((a, idx) => (
                <div
                  key={a.id}
                  style={{ position: "relative", paddingLeft: 38, zIndex: 1 }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: idx === 0 ? "#FEF3C7" : "#EFF6FF",
                      border: `2px solid ${idx === 0 ? "#F59E0B" : "#2563EB"}`,
                      position: "absolute",
                      left: 10,
                      top: 14,
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      background: idx === 0 ? "#FFF9EC" : "#F8FAFC",
                      border: `1px solid ${idx === 0 ? "#FDE68A" : "#E2E8F0"}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          color: idx === 0 ? "#D97706" : "#2563EB",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {a.time}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 900,
                          background: idx === 0 ? "#FDE68A" : "#E2E8F0",
                          color: idx === 0 ? "#92400E" : "#475569",
                          padding: "2px 7px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        {a.department || "General"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontWeight: 900,
                        color: "#1E293B",
                        fontSize: 14,
                      }}
                    >
                      {a.patientName}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3,
                      }}
                    >
                      <Stethoscope style={{ width: 11, height: 11 }} />{" "}
                      {a.doctorName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: "12px 22px",
              borderTop: "1px solid #F1F5F9",
              textAlign: "center",
            }}
          >
            <Link
              to="/receptionist/appointments"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#2563EB",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              View All Appointments{" "}
              <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </motion.div>

        {/* Hourly flow chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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
              marginBottom: 18,
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
                Hourly Patient Flow
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
                Walk-ins & appointments per hour
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: "#2563EB",
                background: "#EFF6FF",
                padding: "6px 13px",
                borderRadius: 10,
                border: "1px solid #BFDBFE",
              }}
            >
              <CheckCircle2 style={{ width: 13, height: 13 }} /> Peak: 3 PM
            </div>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={HOURLY_DATA}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 700 }}
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
                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Activity Feed ── */}
      <ActivityFeed title="Recent Activity" items={activity} maxHeight={300} />
    </div>
  );
}
