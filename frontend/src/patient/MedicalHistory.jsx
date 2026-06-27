import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { appointmentsApi } from "../services/api";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";
import {
  Calendar,
  Stethoscope,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  Heart,
} from "lucide-react";

/* ─── Department → accent color map ─────────────────────────────────────── */
const DEPT_COLOR = {
  Cardiology: {
    border: "#2563EB",
    bg: "rgba(37,99,235,0.06)",
    dot: "#2563EB",
    light: "#EFF6FF",
  },
  Neurology: {
    border: "#8B5CF6",
    bg: "rgba(139,92,246,0.06)",
    dot: "#8B5CF6",
    light: "#F5F3FF",
  },
  Orthopedics: {
    border: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    dot: "#F59E0B",
    light: "#FFFBEB",
  },
  Pediatrics: {
    border: "#10B981",
    bg: "rgba(16,185,129,0.06)",
    dot: "#10B981",
    light: "#ECFDF5",
  },
  Dermatology: {
    border: "#EC4899",
    bg: "rgba(236,72,153,0.06)",
    dot: "#EC4899",
    light: "#FDF2F8",
  },
  Ophthalmology: {
    border: "#06B6D4",
    bg: "rgba(6,182,212,0.06)",
    dot: "#06B6D4",
    light: "#ECFEFF",
  },
  Oncology: {
    border: "#EF4444",
    bg: "rgba(239,68,68,0.06)",
    dot: "#EF4444",
    light: "#FEF2F2",
  },
  "General Medicine": {
    border: "#F59E0B",
    bg: "rgba(245,158,11,0.06)",
    dot: "#F59E0B",
    light: "#FFFBEB",
  },
};

const getDeptStyle = (dept) =>
  DEPT_COLOR[dept] || {
    border: "#64748B",
    bg: "rgba(100,116,139,0.06)",
    dot: "#64748B",
    light: "#F8FAFC",
  };

/* ─── Status config ─────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  completed: {
    bg: "rgba(16,185,129,0.12)",
    color: "#10B981",
    icon: CheckCircle2,
    markerBorder: "#10B981",
    label: "Completed",
  },
  scheduled: {
    bg: "rgba(37,99,235,0.12)",
    color: "#2563EB",
    icon: Clock,
    markerBorder: "#2563EB",
    label: "Scheduled",
  },
  cancelled: {
    bg: "rgba(239,68,68,0.12)",
    color: "#EF4444",
    icon: XCircle,
    markerBorder: "#EF4444",
    label: "Cancelled",
  },
};

const getStatus = (s) =>
  STATUS_CONFIG[s] || {
    bg: "rgba(100,116,139,0.12)",
    color: "#64748B",
    icon: Stethoscope,
    markerBorder: "#94A3B8",
    label: s,
  };

/* ─── Doctor avatar (initials) ──────────────────────────────────────────── */
function DoctorAvatar({ name, dept }) {
  const ds = getDeptStyle(dept);
  const initials = (name || "D")
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${ds.border}cc, ${ds.border})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        color: "#fff",
        fontSize: 14,
        flexShrink: 0,
        boxShadow: `0 4px 12px ${ds.border}44`,
      }}
    >
      {initials}
    </div>
  );
}

/* ─── Timeline Marker ────────────────────────────────────────────────────── */
function TimelineMarker({ status }) {
  const sc = getStatus(status);
  const Icon = sc.icon;
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "#fff",
        border: `3px solid ${sc.markerBorder}`,
        boxShadow: `0 4px 10px rgba(0,0,0,0.08), 0 0 0 4px ${sc.markerBorder}1A`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 10,
        position: "relative",
        transition: "transform 0.2s ease",
      }}
      className="group-hover:scale-110 transition-transform duration-200"
    >
      <Icon style={{ width: 20, height: 20, color: sc.markerBorder }} />
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function MedicalHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await appointmentsApi.getAll();
        setAppointments(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } catch {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    load();
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
          gap: 16,
        }}
      >
        <Spinner size="xl" />
        <p
          style={{ color: "#64748B", fontWeight: 600, fontSize: 14 }}
          className="animate-pulse-soft"
        >
          Loading medical history…
        </p>
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);
  const counts = {
    all: appointments.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.30)",
                }}
              >
                <Heart style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Medical History
              </h2>
            </div>
            <p
              style={{
                color: "#64748B",
                fontWeight: 500,
                fontSize: 14,
                marginLeft: 50,
              }}
            >
              A complete timeline of your consultations and treatments.
            </p>
          </div>

          {/* Summary chips */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[
              { key: "all", label: "All", color: "#64748B", bg: "#F1F5F9" },
              {
                key: "completed",
                label: "Completed",
                color: "#10B981",
                bg: "rgba(16,185,129,0.10)",
              },
              {
                key: "scheduled",
                label: "Upcoming",
                color: "#2563EB",
                bg: "rgba(37,99,235,0.10)",
              },
              {
                key: "cancelled",
                label: "Cancelled",
                color: "#EF4444",
                bg: "rgba(239,68,68,0.10)",
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 10,
                  background: filter === f.key ? f.bg : "#fff",
                  border: `1.5px solid ${filter === f.key ? f.color + "50" : "#E2E8F0"}`,
                  color: filter === f.key ? f.color : "#64748B",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow:
                    filter === f.key ? `0 2px 8px ${f.color}20` : "none",
                }}
              >
                {f.label}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    background: filter === f.key ? f.color : "#E2E8F0",
                    color: filter === f.key ? "#fff" : "#64748B",
                    padding: "1px 6px",
                    borderRadius: 999,
                  }}
                >
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {filtered.length > 0 ? (
          <div style={{ position: "relative" }}>
            {/* ── Gradient vertical line ── */}
            <div
              style={{
                position: "absolute",
                left: 21,
                top: 22,
                bottom: 22,
                width: 3,
                background: "linear-gradient(to bottom, #2563EB, #06B6D4)",
                borderRadius: 99,
                zIndex: 0,
              }}
            />

            {/* ── Timeline entries ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {filtered.map((a, i) => {
                const sc = getStatus(a.status);
                const ds = getDeptStyle(a.department);

                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      position: "relative",
                    }}
                    className="group"
                  >
                    {/* Marker */}
                    <TimelineMarker status={a.status} />

                    {/* Card */}
                    <div
                      style={{
                        flex: 1,
                        background: "#fff",
                        borderRadius: 18,
                        border: "1px solid #E2E8F0",
                        borderLeft: `4px solid ${ds.border}`,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 20px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = `${ds.border}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 16px rgba(0,0,0,0.05)";
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.borderLeftColor = ds.border;
                      }}
                    >
                      {/* Card header strip */}
                      <div
                        style={{
                          padding: "16px 20px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 10,
                          borderBottom: `1px solid ${ds.bg === "rgba(37,99,235,0.06)" ? "#EFF6FF" : "#F8FAFC"}`,
                          background: ds.bg,
                        }}
                      >
                        {/* Status badge */}
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 12px",
                            borderRadius: 999,
                            background: sc.bg,
                            color: sc.color,
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: sc.color,
                              display: "inline-block",
                            }}
                          />
                          {sc.label}
                        </span>

                        {/* Date badge */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "#F1F5F9",
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#475569",
                          }}
                        >
                          <Calendar
                            style={{ width: 13, height: 13, color: "#94A3B8" }}
                          />
                          {formatDateIndian(a.date)}
                          {a.time && (
                            <>
                              <span style={{ color: "#CBD5E1" }}>·</span>
                              <Clock
                                style={{
                                  width: 12,
                                  height: 12,
                                  color: "#94A3B8",
                                }}
                              />
                              {a.time}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "16px 20px 18px" }}>
                        {/* Doctor info row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 14,
                          }}
                        >
                          <DoctorAvatar
                            name={a.doctorName}
                            dept={a.department}
                          />
                          <div>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: "#0F172A",
                                lineHeight: 1.2,
                              }}
                            >
                              {a.doctorName}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 3,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: ds.dot,
                                }}
                              />
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: ds.border,
                                }}
                              >
                                {a.department || "General"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {a.notes ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "12px 14px",
                              background: "rgba(37,99,235,0.05)",
                              border: "1px dashed #CBD5F5",
                              borderRadius: 8,
                            }}
                          >
                            <FileText
                              style={{
                                width: 16,
                                height: 16,
                                color: "#93AFFE",
                                marginTop: 1,
                                flexShrink: 0,
                              }}
                            />
                            <p
                              style={{
                                fontSize: 13,
                                color: "#334155",
                                fontWeight: 500,
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {a.notes}
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "10px 14px",
                              background: "#F8FAFC",
                              border: "1px dashed #E2E8F0",
                              borderRadius: 8,
                            }}
                          >
                            <FileText
                              style={{
                                width: 14,
                                height: 14,
                                color: "#CBD5E1",
                                flexShrink: 0,
                              }}
                            />
                            <p
                              style={{
                                fontSize: 12,
                                color: "#94A3B8",
                                fontWeight: 500,
                                fontStyle: "italic",
                                margin: 0,
                              }}
                            >
                              No additional notes provided.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline end cap */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                marginLeft: 15,
                marginTop: 12,
                boxShadow: "0 0 0 4px rgba(37,99,235,0.12)",
              }}
            />
          </div>
        ) : (
          /* ── Empty state ── */
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              background: "#fff",
              borderRadius: 24,
              border: "1.5px dashed #E2E8F0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                background: "linear-gradient(135deg, #EFF6FF, #F0FDFA)",
                border: "2px solid #E2E8F0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Activity style={{ width: 32, height: 32, color: "#CBD5E1" }} />
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1E293B",
                marginBottom: 8,
              }}
            >
              {filter === "all"
                ? "No Medical History Yet"
                : `No ${filter} visits`}
            </h3>
            <p
              style={{
                color: "#94A3B8",
                fontWeight: 500,
                fontSize: 14,
                maxWidth: 380,
                margin: "0 auto 28px",
                lineHeight: 1.6,
              }}
            >
              {filter === "all"
                ? "It looks like you haven't had any appointments. Book your first consultation to get started on your health journey."
                : `You have no ${filter} visits matching this filter. Try a different status.`}
            </p>
            {filter === "all" ? (
              <Link
                to="/patient/book"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  borderRadius: 12,
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                <Calendar style={{ width: 16, height: 16 }} />
                Book Your First Appointment
              </Link>
            ) : (
              <button
                onClick={() => setFilter("all")}
                style={{
                  padding: "10px 24px",
                  borderRadius: 12,
                  background: "#F1F5F9",
                  border: "1px solid #E2E8F0",
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Show All History
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
