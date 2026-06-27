/**
 * Ward & Bed Management – Admin
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mockWards, mockBeds } from "../services/mockData";
import {
  Bed,
  Users,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Filter,
} from "lucide-react";

const BED_STATUS_STYLE = {
  available: {
    cls: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Available",
  },
  occupied: {
    cls: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
    label: "Occupied",
  },
  maintenance: {
    cls: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
    label: "Maintenance",
  },
};

export default function WardManagement() {
  const [wards] = useState(() => mockWards.getAll());
  const [beds, setBeds] = useState(() => mockBeds.getAll());
  const [selectedWard, setSelectedWard] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBeds = beds.filter((b) => {
    const matchWard =
      selectedWard === "all" || b.wardId === Number(selectedWard);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchWard && matchStatus;
  });

  const occupancy = (ward) =>
    Math.round((ward.occupiedBeds / ward.totalBeds) * 100);

  const updateBedStatus = (bedId, newStatus) => {
    mockBeds.updateStatus(bedId, newStatus);
    setBeds(mockBeds.getAll());
    toast.success(`Bed ${bedId} status updated to ${newStatus}`);
  };

  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status === "available").length;
  const occupiedBeds = beds.filter((b) => b.status === "occupied").length;
  const maintenanceBeds = beds.filter((b) => b.status === "maintenance").length;

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <Bed className="w-8 h-8 text-teal-400" /> Ward & Bed Management
            </h2>
            <p className="text-teal-200 font-medium">
              Monitor bed occupancy and ward assignments across all floors.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              {
                label: "Total Beds",
                value: totalBeds,
                color: "bg-white/10 border-white/20",
              },
              {
                label: "Available",
                value: availableBeds,
                color:
                  "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
              },
              {
                label: "Occupied",
                value: occupiedBeds,
                color: "bg-red-500/20 border-red-500/30 text-red-300",
              },
              {
                label: "Maintenance",
                value: maintenanceBeds,
                color: "bg-amber-500/20 border-amber-500/30 text-amber-300",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.color} border rounded-2xl px-4 py-2.5 text-center`}
              >
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-80">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wards.map((ward) => {
          const occ = occupancy(ward);
          const barColor =
            occ > 85
              ? "bg-red-500"
              : occ > 60
                ? "bg-amber-400"
                : "bg-emerald-500";
          return (
            <motion.div
              key={ward.id}
              whileHover={{ y: -3 }}
              onClick={() =>
                setSelectedWard(
                  selectedWard === String(ward.id) ? "all" : String(ward.id),
                )
              }
              className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer transition-all ${selectedWard === String(ward.id) ? "border-blue-400 ring-2 ring-blue-400/20 shadow-blue-100" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100">
                  <Bed className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {ward.floor} Floor
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1">
                {ward.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-3">
                {ward.occupiedBeds} / {ward.totalBeds} beds occupied
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`${barColor} h-1.5 rounded-full transition-all`}
                  style={{ width: `${occ}%` }}
                />
              </div>
              <p
                className={`text-xs font-black mt-1.5 ${occ > 85 ? "text-red-600" : occ > 60 ? "text-amber-600" : "text-emerald-600"}`}
              >
                {occ}% Occupancy
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bed Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-600" />
            {selectedWard === "all"
              ? "All Beds"
              : `${wards.find((w) => String(w.id) === selectedWard)?.name || "Selected Ward"} – Beds`}
            <span className="text-sm font-bold text-slate-400 ml-1">
              ({filteredBeds.length})
            </span>
          </h3>
          <div className="flex gap-2">
            {["all", "available", "occupied", "maintenance"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterStatus === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredBeds.map((bed) => {
              const style =
                BED_STATUS_STYLE[bed.status] || BED_STATUS_STYLE.available;
              return (
                <motion.div
                  key={bed.id}
                  whileHover={{ scale: 1.03 }}
                  className={`${style.cls} border rounded-2xl p-4 cursor-default group relative`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm">{bed.id}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-1">
                    {style.label}
                  </p>
                  {bed.status === "occupied" && bed.patientName && (
                    <p className="text-xs font-bold truncate opacity-80">
                      {bed.patientName}
                    </p>
                  )}
                  {bed.type === "icu" && (
                    <span className="mt-1 inline-block text-[9px] font-black uppercase tracking-widest bg-white/60 px-1.5 py-0.5 rounded">
                      ICU
                    </span>
                  )}
                  {/* Status change buttons on hover */}
                  {bed.status !== "occupied" && (
                    <div className="absolute inset-x-2 bottom-2 hidden group-hover:flex gap-1">
                      {bed.status !== "available" && (
                        <button
                          onClick={() => updateBedStatus(bed.id, "available")}
                          className="flex-1 bg-white text-[9px] font-black rounded py-1 shadow-sm hover:bg-emerald-50 text-emerald-700 transition-colors"
                        >
                          Available
                        </button>
                      )}
                      {bed.status !== "maintenance" && (
                        <button
                          onClick={() => updateBedStatus(bed.id, "maintenance")}
                          className="flex-1 bg-white text-[9px] font-black rounded py-1 shadow-sm hover:bg-amber-50 text-amber-700 transition-colors"
                        >
                          Maintenance
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          {filteredBeds.length === 0 && (
            <div className="py-16 text-center">
              <Bed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">
                No beds found for selected filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
