/**
 * Ward Boy Tasks — Task Management with completion toggles
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Package,
  Bed,
  ArrowRight,
  Trash2,
  ShowerHead,
} from "lucide-react";

const INITIAL_TASKS = [
  {
    id: 1,
    task: "Wheelchair transfer — John Patient to Radiology",
    location: "G-101 → Radiology",
    type: "transfer",
    time: "10:15 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    task: "Clean & sanitize Room F-205 for new admission",
    location: "F-205",
    type: "cleaning",
    time: "10:45 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: 3,
    task: "Deliver medical supplies to ICU Ward",
    location: "Store → ICU",
    type: "delivery",
    time: "11:00 AM",
    priority: "high",
    status: "pending",
  },
  {
    id: 4,
    task: "Assist patient transfer — Alice Brown to X-Ray",
    location: "F-204 → X-Ray",
    type: "transfer",
    time: "11:30 AM",
    priority: "medium",
    status: "pending",
  },
  {
    id: 5,
    task: "Prepare bed for new admission — General Ward",
    location: "G-103",
    type: "bed-prep",
    time: "12:00 PM",
    priority: "low",
    status: "pending",
  },
  {
    id: 6,
    task: "Escort discharged patient to exit",
    location: "O-301 → Exit",
    type: "transfer",
    time: "01:00 PM",
    priority: "low",
    status: "pending",
  },
  {
    id: 7,
    task: "Bed linen change — General Ward G-102",
    location: "G-102",
    type: "cleaning",
    time: "09:00 AM",
    status: "completed",
    priority: "low",
    completedAt: "09:15 AM",
  },
  {
    id: 8,
    task: "Collect lab samples from Oncology Ward",
    location: "O-301 → Lab",
    type: "delivery",
    time: "09:30 AM",
    status: "completed",
    priority: "medium",
    completedAt: "09:42 AM",
  },
];

const PRIORITY_CONFIG = {
  high: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  medium: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};
const TYPE_ICON = {
  transfer: ArrowRight,
  cleaning: ShowerHead,
  delivery: Package,
  "bed-prep": Bed,
};

export default function WardBoyTasks() {
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
    toast.success("Task completed! ✅");
  };

  return (
    <div
      className="space-y-6 font-sans max-w-5xl mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="bg-gradient-to-r from-amber-900 to-yellow-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
              <ClipboardList className="w-8 h-8 text-amber-300" /> My Tasks
            </h2>
            <p className="text-amber-200 font-medium">
              Complete assigned tasks — transfers, cleaning, deliveries, and bed
              preparation.
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
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f.key ? "bg-white text-amber-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((t, i) => {
          const pc = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
          const Icon = TYPE_ICON[t.type] || ClipboardList;
          const isDone = t.status === "completed";
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl border p-5 transition-all ${isDone ? "border-emerald-100 opacity-75" : `${pc.border} hover:shadow-md`}`}
            >
              <div className="flex items-center gap-4">
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
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-bold text-sm ${isDone ? "text-slate-400 line-through" : "text-slate-900"}`}
                  >
                    {t.task}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.location}</p>
                </div>
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
                        ✓ {t.completedAt}
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
            {filter === "pending" ? "All tasks done! 🎉" : "No tasks found."}
          </p>
        </div>
      )}
    </div>
  );
}
