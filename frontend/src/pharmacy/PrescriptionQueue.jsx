import React, { useState } from "react";
import {
  useGetPrescriptionsQuery,
  useUpdatePrescriptionStatusMutation,
} from "../services/pharmacyApi";
import { showToast } from "../shared/utils/notifications";
import { DashboardSkeleton } from "../shared/components/Loading";
import {
  Pill,
  Clock,
  CheckCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Calendar,
} from "lucide-react";

export default function PrescriptionQueue() {
  const [status, setStatus] = useState("pending");
  const { data: prescriptions, isLoading } = useGetPrescriptionsQuery(status);
  const [updateStatus] = useUpdatePrescriptionStatusMutation();

  const handleUpdate = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      showToast(`Prescription ${newStatus} successfully`, "success");
    } catch (err) {
      showToast("Failed to update prescription status", "error");
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-10 pb-20 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Prescription Queue
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Dispensing intelligence & verification.
          </p>
        </div>

        {/* State Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
          {["pending", "processing", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                status === s
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {(prescriptions || []).map((p) => (
          <div
            key={p.id}
            className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-all ${
                p.priority === "urgent" ? "bg-rose-500" : "bg-indigo-500"
              }`}
            />

            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <User size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {p.patientName}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={12} />{" "}
                    {new Date(p.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {p.priority === "urgent" && (
                <span className="bg-rose-100 text-rose-600 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-rose-200">
                  Urgent
                </span>
              )}
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 mb-8 border border-dashed border-slate-200">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                <ShieldCheck size={14} className="text-indigo-500" /> Authorized
                Meds
              </div>
              <ul className="space-y-4">
                {(p.medicines || []).map((m, idx) => (
                  <li key={idx} className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 leading-tight">
                        {m.name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 mt-0.5">
                        {m.instructions}
                      </span>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                      x{m.qty}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              {status === "pending" && (
                <button
                  onClick={() => handleUpdate(p.id, "processing")}
                  className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
                >
                  Start Fulfillment
                </button>
              )}
              {status === "processing" && (
                <button
                  onClick={() => handleUpdate(p.id, "completed")}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Confirm Dispensing
                </button>
              )}
            </div>
          </div>
        ))}
        {(!prescriptions || prescriptions.length === 0) && (
          <div className="col-span-full py-32 bg-slate-50/50 border border-dashed border-slate-200 rounded-[40px] flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-200 mb-8">
              <Clock size={32} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              No {status} orders in queue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
