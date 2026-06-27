/**
 * PatientMedicationHistory — Clinical timeline of all prescriptions and purchases.
 * Features a timeline-driven UI, medication adherence views, and high-fidelity history cards.
 */

import { motion } from "framer-motion";
import {
  Calendar,
  ClipboardList,
  Pill,
  ArrowRight,
  Download,
  History,
  ShieldCheck,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const MOCK_HISTORY = [
  {
    id: "Rx-7412",
    date: "Mar 24, 2026",
    doctor: "Dr. Arjun Mehta",
    diagnosis: "Hypertension",
    status: "dispensed",
    medicines: ["Amlodipine 5mg", "Telmisartan 40mg"],
  },
  {
    id: "Rx-6981",
    date: "Feb 12, 2026",
    doctor: "Dr. Priya Sharma",
    diagnosis: "Migraine",
    status: "dispensed",
    medicines: ["Sumatriptan 50mg", "Naproxen 500mg"],
  },
  {
    id: "Rx-5421",
    date: "Jan 05, 2026",
    doctor: "Dr. Vikram Nair",
    diagnosis: "Lipid Disorder",
    status: "dispensed",
    medicines: ["Atorvastatin 10mg"],
  },
];

const HistoryCard = ({ record, i }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.1 }}
    className="relative pl-12 pb-12 group last:pb-0"
  >
    {/* Timeline vertical line */}
    <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />

    {/* Timeline dot */}
    <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-all shadow-sm group-hover:shadow-md z-10">
      <Calendar size={18} />
    </div>

    <div className="flex flex-col md:flex-row gap-6 p-8 bg-white border border-slate-50 rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 block">
              {record.date}
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {record.diagnosis}
            </h3>
          </div>
          <span className="badge-premium badge-premium-success">
            <ShieldCheck size={10} className="mr-1.5" /> Full Supply
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {record.medicines.map((med) => (
            <span
              key={med}
              className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Pill size={12} className="text-blue-400" /> {med}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-slate-400 pt-4 border-t border-slate-50 font-bold text-xs">
          <div className="flex items-center gap-2">
            <ClipboardList size={14} /> {record.id}
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />{" "}
            {record.doctor}
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col justify-end gap-2 md:w-32">
        <button className="flex-1 p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-500/20 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group/btn">
          <Download size={16} />{" "}
          <span className="md:hidden text-xs font-black uppercase">Report</span>
        </button>
        <button className="flex-1 p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function PatientMedicationHistory() {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Profile Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-slate-900 p-10 rounded-[48px] shadow-heavy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] -z-1" />

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center p-1 backdrop-blur-xl">
            <div className="w-full h-full bg-blue-600 rounded-[24px] flex items-center justify-center shadow-2xl text-white font-black text-2xl">
              JE
            </div>
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-black tracking-tight mb-1">
              Justin EMR Patient
            </h1>
            <div className="flex items-center gap-4 opacity-50 text-xs font-bold uppercase tracking-widest">
              <span>P-741209</span>
              <span className="w-1 h-1 rounded-full bg-white opacity-40" />
              <span>32 Years • Male</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { label: "Total Fills", value: "42", color: "blue" },
            { label: "Active", value: "3", color: "emerald" },
            { label: "Missed", value: "0", color: "rose" },
            { label: "Adherence", value: "98%", color: "indigo" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-4 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl"
            >
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                {stat.label}
              </p>
              <p className={`text-xl font-black text-${stat.color}-400`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Timeline View */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                <History size={20} />
              </span>{" "}
              Order History
            </h2>
            <button className="text-xs font-black text-blue-500 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2">
              View Full Clinical EMR <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="mt-8">
            {MOCK_HISTORY.map((record, i) => (
              <HistoryCard key={record.id} record={record} i={i} />
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="card-premium p-8 bg-slate-50/30 border-dashed">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-6">
              <AlertCircle size={16} className="text-rose-500" /> Allergies &
              Warnings
            </h3>
            <div className="space-y-3">
              {["Penicillin", "Sulfonamides"].map((all) => (
                <div
                  key={all}
                  className="px-4 py-3 bg-white rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between animate-fade-in group hover:bg-rose-600 hover:text-white transition-all cursor-default"
                >
                  <span className="text-xs font-bold">{all}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white/80 transition-colors">
                    Grade 4 (Severe)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Refill Schedule
              </h3>
            </div>
            <div className="space-y-6">
              {[
                { name: "Amlodipine 5mg", day: "12 Apr", progress: 85 },
                { name: "Atorvastatin 10mg", day: "05 May", progress: 40 },
              ].map((sch) => (
                <div key={sch.name} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{sch.name}</span>
                    <span className="text-blue-600">Refill in {sch.day}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sch.progress}%` }}
                      className="h-full bg-blue-600 shadow-lg shadow-blue-500/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
