/**
 * Patient Movement — Ward Boy Module
 * Manage patient transfers between rooms and departments
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { mockAdmissions, mockBeds } from "../services/mockData";
import {
  ArrowRightLeft,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  User,
} from "lucide-react";

const TRANSFER_LOG = [
  {
    id: 1,
    patient: "John Patient",
    from: "G-101",
    to: "Radiology",
    time: "10:15 AM",
    status: "in-transit",
    type: "Wheelchair",
  },
  {
    id: 2,
    patient: "Alice Brown",
    from: "F-204",
    to: "X-Ray Lab",
    time: "11:30 AM",
    status: "scheduled",
    type: "Stretcher",
  },
  {
    id: 3,
    patient: "Bob Wilson",
    from: "ICU-01",
    to: "CT Scan",
    time: "09:00 AM",
    status: "completed",
    type: "Wheelchair",
  },
];

const STATUS_STYLE = {
  "in-transit": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  scheduled: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

export default function PatientMovement() {
  const [transfers, setTransfers] = useState(TRANSFER_LOG);
  const admissions = mockAdmissions.getAll({ status: "admitted" });

  const markComplete = (id) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t)),
    );
    toast.success("Transfer completed! ✅");
  };

  return (
    <div
      className="space-y-6 font-sans max-w-5xl mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="bg-gradient-to-r from-amber-900 to-yellow-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
            <ArrowRightLeft className="w-8 h-8 text-amber-300" /> Patient
            Movement
          </h2>
          <p className="text-amber-200 font-medium">
            Manage patient transfers between wards, departments, and diagnostic
            centres.
          </p>
        </div>
      </div>

      {/* Active Transfers */}
      <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-amber-500" /> Transfer Log
        </h3>
        <div className="space-y-3">
          {transfers.map((t, i) => {
            const ss = STATUS_STYLE[t.status] || STATUS_STYLE.scheduled;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-xl border ${ss.border} ${ss.bg}`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
                      <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900">
                        {t.patient}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{t.from}</span>
                        <ArrowRight className="w-3 h-3 text-amber-500" />
                        <span className="font-bold text-amber-700">{t.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 uppercase tracking-widest">
                      {t.type}
                    </span>
                    <span
                      className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border ${ss.bg} ${ss.text} ${ss.border}`}
                    >
                      {t.status === "in-transit"
                        ? "🚶 In Transit"
                        : t.status === "completed"
                          ? "✅ Done"
                          : "📋 Scheduled"}
                    </span>
                    {t.status !== "completed" && (
                      <button
                        onClick={() => markComplete(t.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />{" "}
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Currently Admitted */}
      <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" /> Admitted Patients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {admissions.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 transition-all flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-black text-amber-700 border border-amber-200">
                {a.patientName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900">
                  {a.patientName}
                </p>
                <p className="text-xs text-slate-500">
                  {a.ward} · Bed {a.bed}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
