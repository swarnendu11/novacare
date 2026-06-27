/**
 * Nurse Tasks & Treatments — NovaCare
 * Task checklist with medicine administration, vitals recording, and treatment tracking
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pill,
  Thermometer,
  Droplets,
  Syringe,
  Heart,
  Filter,
  Check,
} from "lucide-react";

const INITIAL_TASKS = [
  {
    id: 1,
    patient: "John Patient",
    room: "G-101",
    task: "Administer Amlodipine 5mg",
    type: "medicine",
    time: "10:00 AM",
    priority: "high",
    status: "pending",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: 2,
    patient: "Alice Brown",
    room: "F-204",
    task: "IV Drip Change – Normal Saline 500ml",
    type: "iv",
    time: "10:30 AM",
    priority: "medium",
    status: "pending",
    doctor: "Dr. Kiran Rao",
  },
  {
    id: 3,
    patient: "Bob Wilson",
    room: "ICU-01",
    task: "Monitor Vitals – Hourly Check",
    type: "vitals",
    time: "11:00 AM",
    priority: "critical",
    status: "pending",
    doctor: "Dr. Rohan Gupta",
  },
  {
    id: 4,
    patient: "John Patient",
    room: "G-101",
    task: "Aspirin 75mg – After Meal",
    type: "medicine",
    time: "12:00 PM",
    priority: "medium",
    status: "pending",
    doctor: "Dr. Arjun Mehta",
  },
  {
    id: 5,
    patient: "Alice Brown",
    room: "F-204",
    task: "Wound Dressing – Right Arm",
    type: "dressing",
    time: "02:00 PM",
    priority: "high",
    status: "pending",
    doctor: "Dr. Kiran Rao",
  },
  {
    id: 6,
    patient: "Bob Wilson",
    room: "ICU-01",
    task: "Insulin Injection – 4 Units",
    type: "injection",
    time: "01:00 PM",
    priority: "critical",
    status: "pending",
    doctor: "Dr. Rohan Gupta",
  },
  {
    id: 7,
    patient: "John Patient",
    room: "G-101",
    task: "Record Blood Pressure",
    type: "vitals",
    time: "09:00 AM",
    status: "completed",
    priority: "medium",
    doctor: "Dr. Arjun Mehta",
    completedAt: "09:05 AM",
  },
  {
    id: 8,
    patient: "Alice Brown",
    room: "F-204",
    task: "Morning Medication Round",
    type: "medicine",
    time: "08:00 AM",
    status: "completed",
    priority: "high",
    doctor: "Dr. Kiran Rao",
    completedAt: "08:12 AM",
  },
  {
    id: 9,
    patient: "Bob Wilson",
    room: "ICU-01",
    task: "SpO2 Monitoring",
    type: "vitals",
    time: "08:30 AM",
    status: "completed",
    priority: "critical",
    doctor: "Dr. Rohan Gupta",
    completedAt: "08:32 AM",
  },
];

const TYPE_ICON = {
  medicine: Pill,
  vitals: Thermometer,
  iv: Droplets,
  injection: Syringe,
  dressing: Heart,
  default: ClipboardList,
};
const PRIORITY_CONFIG = {
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  medium: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
};

export default function NurseTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState("pending");

  const pending = tasks.filter((t) => t.status === "pending");
  const completed = tasks.filter((t) => t.status === "completed");
  const filtered =
    filter === "pending" ? pending : filter === "completed" ? completed : tasks;

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed",
              completedAt: new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : t,
      ),
    );
    const task = tasks.find((t) => t.id === id);
    toast.success(`✅ "${task?.task}" completed!`);
  };

  return (
    <div
      className="space-y-6 font-sans max-w-5xl mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-pink-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
              <ClipboardList className="w-8 h-8 text-rose-300" /> Tasks &
              Treatments
            </h2>
            <p className="text-rose-200 font-medium">
              Manage medicine administration, vitals recording, and care tasks.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { key: "pending", label: "Pending", count: pending.length },
              { key: "completed", label: "Done", count: completed.length },
              { key: "all", label: "All", count: tasks.length },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f.key ? "bg-white text-rose-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.map((t, i) => {
          const pc = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
          const Icon = TYPE_ICON[t.type] || TYPE_ICON.default;
          const isDone = t.status === "completed";

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl border transition-all ${isDone ? "border-emerald-100 opacity-75" : `${pc.border} hover:shadow-md`} p-5`}
            >
              <div className="flex items-center gap-4">
                {/* Complete toggle */}
                <button
                  onClick={() => !isDone && handleComplete(t.id)}
                  disabled={isDone}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isDone ? "bg-emerald-100 text-emerald-600" : `${pc.bg} ${pc.text} hover:scale-110 cursor-pointer`}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </button>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm ${isDone ? "text-slate-400 line-through" : "text-slate-900"}`}
                  >
                    {t.task}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium">
                      {t.patient} · {t.room}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Rx by {t.doctor}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${pc.bg} ${pc.text} ${pc.border}`}
                  >
                    {t.priority}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.time}
                    </p>
                    {isDone && (
                      <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                        ✓ Done at {t.completedAt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-300 mb-4" />
          <p className="font-black text-slate-500">
            {filter === "pending"
              ? "All tasks completed! 🎉"
              : "No tasks found."}
          </p>
        </div>
      )}
    </div>
  );
}
