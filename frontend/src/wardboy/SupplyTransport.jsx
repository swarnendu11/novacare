/**
 * Supply Transport — NovaCare Wardboy
 * Manage logistics like transporting blood samples to the lab or medicines to the ward.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  PackageSearch,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Package,
  FlaskConical,
  Pill,
  FileText
} from "lucide-react";

const INITIAL_TRANSFERS = [
  {
    id: "TR-201",
    item: "Blood Samples (3 Vials)",
    from: "ICU-02",
    to: "Pathology Lab",
    type: "lab",
    status: "pending",
    time: "11:15 AM"
  },
  {
    id: "TR-202",
    item: "IV Fluids (10 Bags)",
    from: "Central Pharmacy",
    to: "General Ward F",
    type: "pharmacy",
    status: "in-transit",
    time: "11:30 AM"
  },
  {
    id: "TR-203",
    item: "Patient Case Files",
    from: "Records Dept",
    to: "Dr. Arjun's Cabin",
    type: "documents",
    status: "pending",
    time: "12:00 PM"
  },
  {
    id: "TR-204",
    item: "Clean Linens",
    from: "Laundry",
    to: "Ward G",
    type: "supplies",
    status: "delivered",
    time: "09:00 AM"
  }
];

const TYPE_CONFIG = {
  "lab": { icon: FlaskConical, bg: "bg-purple-50 text-purple-600 border-purple-200" },
  "pharmacy": { icon: Pill, bg: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  "documents": { icon: FileText, bg: "bg-blue-50 text-blue-600 border-blue-200" },
  "supplies": { icon: Package, bg: "bg-amber-50 text-amber-600 border-amber-200" }
};

export default function SupplyTransport() {
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [filter, setFilter] = useState("active");

  const active = transfers.filter(t => t.status === "pending" || t.status === "in-transit");
  const completed = transfers.filter(t => t.status === "delivered");
  const filtered = filter === "active" ? active : completed;

  const updateStatus = (id, newStatus) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (newStatus === "in-transit") toast.success("Item picked up! 🏃");
    if (newStatus === "delivered") toast.success("Item delivered successfully! ✅");
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl text-white font-black tracking-tight flex items-center gap-3 mb-2">
              <PackageSearch className="w-8 h-8 text-cyan-300" /> Supply & Logistics
            </h2>
            <p className="text-cyan-200 font-medium">
              Manage physical transfers of lab samples, medicines, and supplies.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === "active" ? "bg-white text-cyan-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}
            >
              Active ({active.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === "completed" ? "bg-white text-cyan-900" : "bg-white/10 border border-white/20 text-white hover:bg-white/20"}`}
            >
              History ({completed.length})
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((t, i) => {
          const conf = TYPE_CONFIG[t.type] || TYPE_CONFIG["supplies"];
          const Icon = conf.icon;
          
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all hover:shadow-md ${t.status === "delivered" ? "border-slate-200 opacity-70" : t.status === "in-transit" ? "border-cyan-300 shadow-cyan-500/10" : "border-slate-200"}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${conf.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{t.item}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      <MapPin className="w-3 h-3 text-slate-400" /> {t.from}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100">
                      <MapPin className="w-3 h-3 text-cyan-500" /> {t.to}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> {t.time}
                </div>
                
                {t.status === "pending" && (
                  <button onClick={() => updateStatus(t.id, "in-transit")} className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md">
                    Start Pickup
                  </button>
                )}
                
                {t.status === "in-transit" && (
                  <button onClick={() => updateStatus(t.id, "delivered")} className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md flex items-center gap-2 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Mark Delivered
                  </button>
                )}
                
                {t.status === "delivered" && (
                  <span className="text-emerald-500 font-black text-sm flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> Delivered
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="font-black text-slate-500">
            No transport tasks found in this view.
          </p>
        </div>
      )}
    </div>
  );
}
