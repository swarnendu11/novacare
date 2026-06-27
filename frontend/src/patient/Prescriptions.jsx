/**
 * Prescriptions - Patient (with PDF download)
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { prescriptionsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { downloadPrescriptionPdf } from "../utils/downloadPdf";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";
import { Pill, FileText, ClipboardList } from "lucide-react";

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await prescriptionsApi.getForPatient(user?.id);
        setPrescriptions(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } catch (err) {
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownload = (id) => {
    downloadPrescriptionPdf(id).catch(() => toast.error("Download failed"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="font-sans">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">
        My Prescriptions
      </h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {prescriptions.length ? (
          prescriptions.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-100 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Decorative gradient blur in background */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-teal-400/10 rounded-full blur-3xl group-hover:from-blue-400/20 group-hover:to-teal-400/20 transition-all duration-500 pointer-events-none" />

              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6 relative z-10">
                <div className="flex gap-5">
                  <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0 text-white">
                    <ClipboardList size={28} strokeWidth={2} />
                  </div>
                  <div className="space-y-3">
                    <p className="font-extrabold text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                      Prescription #{p.id}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText size={14} />
                        </span>
                        Doctor:{" "}
                        <span className="text-slate-800 font-bold">
                          {p.doctorName || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <FileText size={14} />
                        </span>
                        Date:{" "}
                        <span className="text-slate-800 font-bold">
                          {formatDateIndian(p.date)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-slate-500">
                        Diagnosis:
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-sm">
                        {p.diagnosis || "General"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(p.id)}
                  className="px-6 py-2.5 bg-white border-2 border-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all active:scale-95 flex-shrink-0"
                >
                  Download PDF
                </button>
              </div>
              {p.medicines?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                  <p className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                      <Pill size={18} />
                    </span>
                    Medicines
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {p.medicines.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-colors"
                      >
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm flex-shrink-0"></div>
                        <div className="text-sm">
                          {typeof m === "object" ? (
                            <div className="space-y-1.5">
                              <span className="font-bold text-slate-800 block">
                                {m.name}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {m.dosage && (
                                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">
                                    {m.dosage}
                                  </span>
                                )}
                                {m.frequency && (
                                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">
                                    {m.frequency}
                                  </span>
                                )}
                                {m.duration && (
                                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">
                                    {m.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="font-bold text-slate-800">
                              {m}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {p.instructions && (
                <div className="mt-4 p-4 text-sm text-blue-800 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="font-bold">Instructions:</span>{" "}
                  {p.instructions}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center bg-slate-50 py-16 px-4 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium mb-4">
              No prescriptions yet. They will appear here after your doctor adds
              them post-visit.
            </p>
            <Link
              to="/patient/appointments"
              className="text-blue-600 font-bold hover:underline"
            >
              View my appointments →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
