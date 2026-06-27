/**
 * Room Info — Ward Boy Module
 * View wards, beds, and occupancy status
 */
import { motion } from "framer-motion";
import { mockWards, mockBeds } from "../services/mockData";
import {
  Building2,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Wrench,
} from "lucide-react";

const BED_STATUS_STYLE = {
  available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  occupied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Bed,
  },
  maintenance: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: Wrench,
  },
};

export default function RoomInfo() {
  const wards = mockWards.getAll();
  const beds = mockBeds.getAll();

  return (
    <div
      className="space-y-6 font-sans max-w-[1400px] mx-auto pb-10"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="bg-gradient-to-r from-amber-900 to-yellow-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-amber-300" /> Room & Bed Info
            </h2>
            <p className="text-amber-200 font-medium">
              View ward occupancy, bed availability, and room status.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-center">
              <p className="text-xl font-black">
                {beds.filter((b) => b.status === "available").length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                Available
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-center">
              <p className="text-xl font-black">
                {beds.filter((b) => b.status === "occupied").length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                Occupied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {wards.map((w, i) => {
          const wardBeds = beds.filter((b) => b.wardId === w.id);
          const occupancy = Math.round((w.occupiedBeds / w.totalBeds) * 100);
          const isHigh = occupancy > 80;
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[20px] border border-slate-100 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-200">
                      <Building2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg tracking-tight">
                        {w.name}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">
                        Floor: {w.floor}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${isHigh ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
                  >
                    {occupancy}%
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full ${isHigh ? "bg-red-500" : "bg-amber-500"}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-4">
                  <span>{w.occupiedBeds} occupied</span>
                  <span>{w.totalBeds - w.occupiedBeds} available</span>
                  <span>{w.totalBeds} total</span>
                </div>

                {/* Beds in ward */}
                {wardBeds.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {wardBeds.map((b) => {
                      const bs =
                        BED_STATUS_STYLE[b.status] ||
                        BED_STATUS_STYLE.available;
                      const BIcon = bs.icon;
                      return (
                        <div
                          key={b.id}
                          className={`p-2.5 rounded-lg border ${bs.border} ${bs.bg}`}
                        >
                          <div className="flex items-center gap-2">
                            <BIcon className={`w-3.5 h-3.5 ${bs.text}`} />
                            <span className="text-xs font-black text-slate-700">
                              {b.id}
                            </span>
                          </div>
                          {b.patientName && (
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                              {b.patientName}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
