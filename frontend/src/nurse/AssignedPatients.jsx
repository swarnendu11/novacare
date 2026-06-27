/**
 * Assigned Patients — Nurse Module
 * View patients assigned to nurse with condition, bed, vitals, and treatment details
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockAdmissions } from "../services/mockData";
import {
  Users,
  Heart,
  Thermometer,
  Activity,
  Bed,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Droplets,
} from "lucide-react";

const CONDITION = {
  stable: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
    label: "Stable",
  },
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: AlertTriangle,
    label: "Critical",
  },
  recovering: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Activity,
    label: "Recovering",
  },
};

function getCondition(admission) {
  if (
    admission.reason?.toLowerCase().includes("acute") ||
    admission.ward === "ICU"
  )
    return "critical";
  if (admission.vitals?.length > 2) return "recovering";
  return "stable";
}

export default function AssignedPatients() {
  const admissions = mockAdmissions.getAll({ status: "admitted" });
  const [detailModal, setDetailModal] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? admissions
      : admissions.filter((a) => getCondition(a) === filter);

  return (
    <div
      className="space-y-6 font-sans max-w-[1400px] mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-pink-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-rose-300" /> Assigned Patients
            </h2>
            <p className="text-rose-200 font-medium">
              Monitor your ward patients — conditions, vitals, and treatment
              plans.
            </p>
          </div>
          <div className="flex gap-3">
            {["all", "stable", "critical", "recovering"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === s ? "bg-white text-rose-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}
              >
                {s === "all"
                  ? `All (${admissions.length})`
                  : `${s} (${admissions.filter((a) => getCondition(a) === s).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((a, i) => {
          const cond = getCondition(a);
          const cs = CONDITION[cond];
          const CIcon = cs.icon;
          const lastVitals = a.vitals?.[a.vitals.length - 1];

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[20px] border border-slate-100 overflow-hidden hover:shadow-lg hover:border-rose-200 transition-all group"
            >
              <div className="p-6">
                {/* Patient header */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-md ${cond === "critical" ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-rose-400 to-pink-500"}`}
                  >
                    {a.patientName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-lg tracking-tight">
                      {a.patientName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {a.patientAge}y · {a.gender} · {a.department}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${cs.bg} ${cs.text} ${cs.border}`}
                  >
                    <CIcon className="w-3.5 h-3.5" /> {cs.label}
                  </span>
                </div>

                {/* Ward & Bed */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Bed className="w-3.5 h-3.5" /> {a.ward}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    Bed: {a.bed}
                  </div>
                </div>

                {/* Reason for admission */}
                <p className="text-sm text-slate-600 font-medium mb-4 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">
                    Reason
                  </span>
                  {a.reason}
                </p>

                {/* Last vitals */}
                {lastVitals && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "BP", value: lastVitals.bp, icon: Heart },
                      {
                        label: "Temp",
                        value: lastVitals.temp + "°F",
                        icon: Thermometer,
                      },
                      {
                        label: "Pulse",
                        value: lastVitals.pulse,
                        icon: Activity,
                      },
                      {
                        label: "SpO2",
                        value: lastVitals.spo2 + "%",
                        icon: Droplets,
                      },
                    ].map((v) => (
                      <div
                        key={v.label}
                        className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <v.icon className="w-3.5 h-3.5 mx-auto text-slate-400 mb-1" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {v.label}
                        </p>
                        <p className="text-sm font-black text-slate-800">
                          {v.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setDetailModal(a)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors border border-rose-200 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="font-black text-slate-500">
            No patients match this filter.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDetailModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                  Patient Detail
                </h3>
                <button
                  onClick={() => setDetailModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  ["Name", detailModal.patientName],
                  [
                    "Age / Gender",
                    `${detailModal.patientAge}y · ${detailModal.gender}`,
                  ],
                  ["Ward / Bed", `${detailModal.ward} · ${detailModal.bed}`],
                  ["Department", detailModal.department],
                  ["Doctor", detailModal.doctorName],
                  ["Admit Date", detailModal.admitDate],
                  ["Reason", detailModal.reason],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {k}
                    </span>
                    <span className="font-bold text-sm text-slate-900 text-right max-w-[60%]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              {detailModal.notes && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                  <p className="text-xs font-black text-rose-700 uppercase tracking-widest mb-1">
                    Notes
                  </p>
                  <p className="text-sm font-medium text-rose-900">
                    {detailModal.notes}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
