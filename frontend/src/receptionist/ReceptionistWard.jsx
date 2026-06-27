/**
 * Receptionist Ward View – Read-only bed/ward status
 */
import { useState } from "react";
import { mockWards, mockBeds } from "../services/mockData";
import { Bed, Users } from "lucide-react";

const BED_STYLES = {
  available: {
    cls: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
  },
  occupied: { cls: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500" },
  maintenance: {
    cls: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
};

export default function ReceptionistWard() {
  const [wards] = useState(() => mockWards.getAll());
  const [beds] = useState(() => mockBeds.getAll());
  const [selectedWard, setSelectedWard] = useState("all");

  const filteredBeds = beds.filter(
    (b) => selectedWard === "all" || b.wardId === Number(selectedWard),
  );
  const availCount = beds.filter((b) => b.status === "available").length;
  const occupiedCount = beds.filter((b) => b.status === "occupied").length;

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-teal-600/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <Bed className="w-8 h-8 text-teal-400" /> Ward & Bed Status
            </h2>
            <p className="text-teal-200 font-medium">
              Real-time bed availability across all wards.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-black text-emerald-300">
                {availCount}
              </p>
              <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mt-0.5">
                Available
              </p>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-black text-red-300">
                {occupiedCount}
              </p>
              <p className="text-[10px] text-red-200 font-bold uppercase tracking-widest mt-0.5">
                Occupied
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedWard("all")}
          className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all ${selectedWard === "all" ? "border-teal-400 ring-2 ring-teal-400/20" : "border-slate-200 hover:border-slate-300"}`}
        >
          <p className="font-black text-slate-900 mb-1">All Wards</p>
          <p className="text-xs text-slate-400">{beds.length} total beds</p>
        </div>
        {wards.map((w) => {
          const occ = Math.round((w.occupiedBeds / w.totalBeds) * 100);
          return (
            <div
              key={w.id}
              onClick={() => setSelectedWard(String(w.id))}
              className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all ${selectedWard === String(w.id) ? "border-teal-400 ring-2 ring-teal-400/20" : "border-slate-200 hover:border-slate-300"}`}
            >
              <p className="font-black text-slate-900 text-sm mb-0.5">
                {w.name}
              </p>
              <p className="text-xs text-slate-400 mb-2">
                {w.occupiedBeds}/{w.totalBeds} · {w.floor} Floor
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${occ > 85 ? "bg-red-500" : occ > 60 ? "bg-amber-400" : "bg-emerald-500"}`}
                  style={{ width: `${occ}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2">
          <Bed className="w-5 h-5 text-teal-600" /> Bed Map{" "}
          <span className="font-bold text-slate-400 text-sm ml-1">
            ({filteredBeds.length} beds)
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredBeds.map((bed) => {
            const s = BED_STYLES[bed.status] || BED_STYLES.available;
            return (
              <div key={bed.id} className={`${s.cls} border rounded-2xl p-3`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs">{bed.id}</span>
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-wider">
                  {bed.status}
                </p>
                {bed.patientName && (
                  <p className="text-[10px] font-bold truncate mt-0.5 opacity-80">
                    {bed.patientName}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
