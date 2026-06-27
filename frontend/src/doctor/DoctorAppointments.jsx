/**
 * Doctor Appointments – Connected to shared hospital workflow.
 * - Loads only THIS doctor's appointments (filtered by doctorId).
 * - "Complete" → auto-generates bill for patient via workflowEvents.
 * - "Add Prescription" → fires prescriptionCreated notification.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { appointmentsApi, prescriptionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  PlusCircle,
  FileText,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

const STATUS_STYLE = {
  scheduled: {
    bg: "rgba(37,99,235,0.10)",
    color: "#2563EB",
    label: "Scheduled",
  },
  completed: {
    bg: "rgba(16,185,129,0.10)",
    color: "#10B981",
    label: "Completed",
  },
  cancelled: {
    bg: "rgba(239,68,68,0.10)",
    color: "#EF4444",
    label: "Cancelled",
  },
};

function getStatus(s) {
  return STATUS_STYLE[s] || { bg: "#F1F5F9", color: "#64748B", label: s };
}

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rxExpanded, setRxExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicines: [{ name: "", dosage: "", duration: "", frequency: "" }],
    instructions: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      // Filter by logged-in doctor's doctorId so each doctor sees only THEIR appointments
      const doctorId = user?.doctorId;
      const params = doctorId ? { doctorId } : {};
      const res = await appointmentsApi.getAll(params);
      setAppointments(
        res.data.sort((a, b) => new Date(b.date) - new Date(a.date)),
      );
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appt, status) => {
    try {
      await appointmentsApi.update(appt.id, { status });
      toast.success(
        status === "completed"
          ? "✅ Appointment completed. Bill auto-generated for patient."
          : status === "cancelled"
            ? "Appointment cancelled."
            : "Status updated.",
      );
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const addMedicine = () => {
    setPrescriptionForm((f) => ({
      ...f,
      medicines: [
        ...f.medicines,
        { name: "", dosage: "", duration: "", frequency: "" },
      ],
    }));
  };

  const removeMedicine = (i) => {
    setPrescriptionForm((f) => ({
      ...f,
      medicines: f.medicines.filter((_, idx) => idx !== i),
    }));
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const meds = prescriptionForm.medicines.filter((m) => m.name.trim());
    if (!meds.length) {
      toast.error("Add at least one medicine");
      return;
    }
    setSubmitting(true);
    try {
      await prescriptionsApi.create({
        appointmentId: selected.id,
        patientId: selected.patientId,
        patientName: selected.patientName,
        doctorId: user?.doctorId || selected.doctorId,
        doctorName: selected.doctorName,
        department: selected.department,
        date: new Date().toISOString().split("T")[0],
        diagnosis: prescriptionForm.diagnosis,
        medicines: meds,
        notes: prescriptionForm.instructions,
      });
      // Also mark appointment completed if not already
      if (selected.status !== "completed") {
        await appointmentsApi.update(selected.id, { status: "completed" });
      }
      toast.success("✅ Prescription saved. Patient has been notified.");
      setSelected(null);
      setRxExpanded(null);
      setPrescriptionForm({
        diagnosis: "",
        medicines: [{ name: "", dosage: "", duration: "", frequency: "" }],
        instructions: "",
      });
      load();
    } catch {
      toast.error("Failed to save prescription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  const filtered = appointments.filter((a) => {
    const matchSearch =
      !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: appointments.length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
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
            <Stethoscope style={{ width: 20, height: 20, color: "#fff" }} />
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#0F172A",
              letterSpacing: "-0.02em",
            }}
          >
            My Appointments
          </h2>
        </div>
        <p
          style={{
            color: "#64748B",
            fontSize: 14,
            fontWeight: 500,
            marginLeft: 52,
          }}
        >
          Manage patient visits, update status, and write prescriptions.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}
      >
        {[
          { key: "all", label: "Total", color: "#64748B", bg: "#F1F5F9" },
          {
            key: "scheduled",
            label: "Scheduled",
            color: "#2563EB",
            bg: "rgba(37,99,235,0.10)",
          },
          {
            key: "completed",
            label: "Completed",
            color: "#10B981",
            bg: "rgba(16,185,129,0.10)",
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
            onClick={() => setFilterStatus(f.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 10,
              cursor: "pointer",
              background: filterStatus === f.key ? f.bg : "#fff",
              border: `1.5px solid ${filterStatus === f.key ? f.color + "50" : "#E2E8F0"}`,
              color: filterStatus === f.key ? f.color : "#64748B",
              fontSize: 13,
              fontWeight: 700,
              transition: "all 0.15s",
              boxShadow:
                filterStatus === f.key ? `0 2px 8px ${f.color}20` : "none",
            }}
          >
            {f.label}
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                background: filterStatus === f.key ? f.color : "#E2E8F0",
                color: filterStatus === f.key ? "#fff" : "#64748B",
                padding: "1px 7px",
                borderRadius: 999,
              }}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}

        {/* Search */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              color: "#94A3B8",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or dept..."
            style={{
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #E2E8F0",
              borderRadius: 10,
              fontSize: 13,
              outline: "none",
              background: "#fff",
              width: 220,
              color: "#0F172A",
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      {/* Appointment cards */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "#fff",
            borderRadius: 16,
            border: "1.5px dashed #E2E8F0",
          }}
        >
          <Calendar
            style={{
              width: 40,
              height: 40,
              color: "#CBD5E1",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "#94A3B8", fontWeight: 600 }}>
            No appointments found.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <AnimatePresence>
            {filtered.map((a, i) => {
              const sc = getStatus(a.status);
              const isRxOpen = rxExpanded === a.id;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    borderLeft: `4px solid ${sc.color}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Patient avatar */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${sc.color}cc, ${sc.color})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {(a.patientName || "P").charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: "#0F172A",
                          lineHeight: 1.2,
                        }}
                      >
                        {a.patientName}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                            color: "#64748B",
                            fontWeight: 600,
                          }}
                        >
                          <Calendar style={{ width: 12, height: 12 }} />{" "}
                          {formatDateIndian(a.date)}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 12,
                            color: "#64748B",
                            fontWeight: 600,
                          }}
                        >
                          <Clock style={{ width: 12, height: 12 }} /> {a.time}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            background: "#F1F5F9",
                            color: "#475569",
                            padding: "2px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {a.department}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        background: sc.bg,
                        color: sc.color,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sc.color,
                        }}
                      />
                      {sc.label}
                    </span>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      {a.status === "scheduled" && (
                        <>
                          <button
                            onClick={() => updateStatus(a, "completed")}
                            title="Mark Complete & Generate Bill"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              borderRadius: 9,
                              background: "rgba(16,185,129,0.10)",
                              color: "#10B981",
                              border: "1px solid rgba(16,185,129,0.25)",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(16,185,129,0.20)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(16,185,129,0.10)";
                            }}
                          >
                            <CheckCircle2 style={{ width: 14, height: 14 }} />{" "}
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(a, "cancelled")}
                            title="Cancel Appointment"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              borderRadius: 9,
                              background: "rgba(239,68,68,0.08)",
                              color: "#EF4444",
                              border: "1px solid rgba(239,68,68,0.20)",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.08)";
                            }}
                          >
                            <XCircle style={{ width: 14, height: 14 }} /> Cancel
                          </button>
                        </>
                      )}
                      {(a.status === "scheduled" ||
                        a.status === "completed") && (
                        <button
                          onClick={() => {
                            setRxExpanded(isRxOpen ? null : a.id);
                            setSelected(a);
                            setPrescriptionForm({
                              diagnosis: "",
                              medicines: [
                                {
                                  name: "",
                                  dosage: "",
                                  duration: "",
                                  frequency: "",
                                },
                              ],
                              instructions: "",
                            });
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            borderRadius: 9,
                            background: "rgba(37,99,235,0.10)",
                            color: "#2563EB",
                            border: "1px solid rgba(37,99,235,0.25)",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(37,99,235,0.18)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(37,99,235,0.10)";
                          }}
                        >
                          <PlusCircle style={{ width: 14, height: 14 }} />
                          Write Rx
                          {isRxOpen ? (
                            <ChevronUp style={{ width: 12, height: 12 }} />
                          ) : (
                            <ChevronDown style={{ width: 12, height: 12 }} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes strip */}
                  {a.notes && (
                    <div
                      style={{
                        padding: "10px 20px 12px 20px",
                        borderTop: "1px solid #F1F5F9",
                        background: "rgba(37,99,235,0.03)",
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <FileText
                        style={{
                          width: 14,
                          height: 14,
                          color: "#94A3B8",
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {a.notes}
                      </p>
                    </div>
                  )}

                  {/* Inline Prescription Form */}
                  <AnimatePresence>
                    {isRxOpen && selected?.id === a.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            borderTop: "2px dashed #E2E8F0",
                            background: "rgba(37,99,235,0.03)",
                            padding: "20px 20px 24px",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#0F172A",
                              marginBottom: 16,
                            }}
                          >
                            📋 Prescription for {a.patientName}
                          </h4>
                          <form onSubmit={handlePrescriptionSubmit}>
                            {/* Diagnosis */}
                            <div style={{ marginBottom: 12 }}>
                              <label
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#64748B",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.07em",
                                  display: "block",
                                  marginBottom: 6,
                                }}
                              >
                                Diagnosis
                              </label>
                              <input
                                value={prescriptionForm.diagnosis}
                                onChange={(e) =>
                                  setPrescriptionForm((f) => ({
                                    ...f,
                                    diagnosis: e.target.value,
                                  }))
                                }
                                placeholder="e.g. Hypertension, Migraine..."
                                style={{
                                  width: "100%",
                                  padding: "9px 14px",
                                  border: "1.5px solid #E2E8F0",
                                  borderRadius: 9,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  outline: "none",
                                  color: "#0F172A",
                                  boxSizing: "border-box",
                                }}
                              />
                            </div>

                            {/* Medicines */}
                            <label
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#64748B",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                display: "block",
                                marginBottom: 8,
                              }}
                            >
                              Medicines
                            </label>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginBottom: 12,
                              }}
                            >
                              {prescriptionForm.medicines.map((m, i) => (
                                <div
                                  key={i}
                                  style={{
                                    background: "#fff",
                                    border: "1px solid #E2E8F0",
                                    borderRadius: 10,
                                    padding: "12px",
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                                    gap: 8,
                                    alignItems: "center",
                                  }}
                                >
                                  {[
                                    {
                                      placeholder: "Medicine name",
                                      field: "name",
                                      required: true,
                                    },
                                    { placeholder: "Dosage", field: "dosage" },
                                    {
                                      placeholder: "Frequency",
                                      field: "frequency",
                                    },
                                    {
                                      placeholder: "Duration",
                                      field: "duration",
                                    },
                                  ].map(({ placeholder, field, required }) => (
                                    <input
                                      key={field}
                                      placeholder={placeholder}
                                      value={m[field]}
                                      required={required}
                                      onChange={(e) => {
                                        const next = [
                                          ...prescriptionForm.medicines,
                                        ];
                                        next[i] = {
                                          ...next[i],
                                          [field]: e.target.value,
                                        };
                                        setPrescriptionForm((f) => ({
                                          ...f,
                                          medicines: next,
                                        }));
                                      }}
                                      style={{
                                        padding: "7px 10px",
                                        border: "1px solid #E2E8F0",
                                        borderRadius: 7,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        outline: "none",
                                        color: "#0F172A",
                                        width: "100%",
                                        boxSizing: "border-box",
                                      }}
                                    />
                                  ))}
                                  {prescriptionForm.medicines.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMedicine(i)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        color: "#EF4444",
                                        cursor: "pointer",
                                        padding: 4,
                                      }}
                                    >
                                      <XCircle
                                        style={{ width: 16, height: 16 }}
                                      />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={addMedicine}
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#2563EB",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                marginBottom: 12,
                              }}
                            >
                              + Add another medicine
                            </button>

                            {/* Instructions */}
                            <div style={{ marginBottom: 16 }}>
                              <label
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#64748B",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.07em",
                                  display: "block",
                                  marginBottom: 6,
                                }}
                              >
                                Instructions / Notes
                              </label>
                              <textarea
                                value={prescriptionForm.instructions}
                                onChange={(e) =>
                                  setPrescriptionForm((f) => ({
                                    ...f,
                                    instructions: e.target.value,
                                  }))
                                }
                                rows={2}
                                placeholder="Special instructions for patient..."
                                style={{
                                  width: "100%",
                                  padding: "9px 14px",
                                  border: "1.5px solid #E2E8F0",
                                  borderRadius: 9,
                                  fontSize: 13,
                                  fontWeight: 500,
                                  outline: "none",
                                  color: "#0F172A",
                                  resize: "vertical",
                                  boxSizing: "border-box",
                                }}
                              />
                            </div>

                            <div style={{ display: "flex", gap: 10 }}>
                              <button
                                type="button"
                                onClick={() => setRxExpanded(null)}
                                style={{
                                  padding: "10px 20px",
                                  border: "1.5px solid #E2E8F0",
                                  borderRadius: 10,
                                  fontSize: 13,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  color: "#64748B",
                                  background: "#fff",
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                  flex: 1,
                                  padding: "10px 20px",
                                  background:
                                    "linear-gradient(135deg, #2563EB, #06B6D4)",
                                  border: "none",
                                  borderRadius: 10,
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: "#fff",
                                  cursor: submitting
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: submitting ? 0.7 : 1,
                                }}
                              >
                                {submitting
                                  ? "Saving…"
                                  : "✅ Save Prescription & Complete Visit"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
