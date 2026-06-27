/**
 * Nurse Reports — Shift summaries and daily logs
 */
import { motion } from "framer-motion";
import {
  FileBarChart,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const SHIFT_REPORTS = [
  {
    id: 1,
    date: "Today",
    shift: "Morning (6AM–2PM)",
    patients: 3,
    tasksCompleted: 12,
    totalTasks: 15,
    critical: 1,
    notes:
      "Bob Wilson ICU vitals stabilizing. John Patient BP trending down. Alice Brown wound healing well.",
  },
  {
    id: 2,
    date: "Yesterday",
    shift: "Morning (6AM–2PM)",
    patients: 4,
    tasksCompleted: 18,
    totalTasks: 18,
    critical: 0,
    notes:
      "All patients stable. Carol Davis discharged post-chemo. No incidents.",
  },
  {
    id: 3,
    date: "2 days ago",
    shift: "Night (10PM–6AM)",
    patients: 3,
    tasksCompleted: 8,
    totalTasks: 10,
    critical: 2,
    notes:
      "Two critical alerts in ICU — SpO2 drop for Bob Wilson, resolved with O2 therapy.",
  },
];

export default function NurseReports() {
  return (
    <div
      className="space-y-6 font-sans max-w-5xl mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="bg-gradient-to-r from-rose-900 to-pink-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
            <FileBarChart className="w-8 h-8 text-rose-300" /> Shift Reports
          </h2>
          <p className="text-rose-200 font-medium">
            View daily shift summaries, task completion rates, and clinical
            notes.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {SHIFT_REPORTS.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-[20px] border border-slate-100 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase tracking-widest">
                    {r.date}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.shift}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Patients
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {r.patients}
                  </p>
                </div>
                <div className="text-center bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-200">
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                    Tasks
                  </p>
                  <p className="text-xl font-black text-emerald-700">
                    {r.tasksCompleted}/{r.totalTasks}
                  </p>
                </div>
                {r.critical > 0 && (
                  <div className="text-center bg-red-50 rounded-xl px-4 py-2 border border-red-200">
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">
                      Critical
                    </p>
                    <p className="text-xl font-black text-red-700">
                      {r.critical}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${(r.tasksCompleted / r.totalTasks) * 100}%` }}
              />
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1.5">
                Shift Notes
              </p>
              <p className="text-sm font-medium text-rose-900 leading-relaxed">
                {r.notes}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
