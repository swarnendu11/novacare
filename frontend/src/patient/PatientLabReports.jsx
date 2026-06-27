/**
 * Patient Lab Reports – Patient View
 * View personal lab reports and download
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { mockLabReports } from "../services/mockData";
import { useAuth } from "../context/AuthContext";
import {
  FlaskConical,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const STATUS_STYLE = {
  completed: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  pending: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  processing: {
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
};

export default function PatientLabReports() {
  const { user } = useAuth();
  const [reports] = useState(() =>
    mockLabReports.getAll({ patientId: user?.id || 3 }),
  );
  const [viewModal, setViewModal] = useState(null);

  return (
    <div className="space-y-6 pb-10 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <FlaskConical className="w-8 h-8 text-purple-400" /> My Lab
              Reports
            </h2>
            <p className="text-purple-200 font-medium">
              View and download your laboratory test results.
            </p>
          </div>
          <div className="flex gap-3">
            {["completed", "pending"].map((s) => (
              <div
                key={s}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-center"
              >
                <p className="text-xl font-black">
                  {reports.filter((r) => r.status === s).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-purple-200 capitalize">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <FlaskConical className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="font-black text-slate-500">No lab reports found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r, i) => {
            const S = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
            const SIcon = S.icon;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                      <FlaskConical className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-slate-900">
                          {r.testName}
                        </p>
                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                          {r.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Ordered by {r.doctorName} · {r.orderedDate}
                      </p>
                      {r.resultDate && (
                        <p className="text-xs text-slate-400 font-medium">
                          Results: {r.resultDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${S.cls}`}
                    >
                      <SIcon className="w-3 h-3" /> {r.status}
                    </span>
                    {r.status === "completed" && (
                      <>
                        <button
                          onClick={() => setViewModal(r)}
                          className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {r.status === "pending" && (
                      <p className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        Awaiting results
                      </p>
                    )}
                  </div>
                </div>
                {r.status === "completed" && r.result && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs font-black text-green-700 uppercase tracking-widest mb-1.5">
                      Result Summary
                    </p>
                    <p className="text-sm text-green-900 font-medium leading-relaxed">
                      {r.result}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* View Detail Modal */}
      <AnimatePresence>
        {viewModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                  Lab Report Detail
                </h3>
                <button
                  onClick={() => setViewModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  ["Report ID", viewModal.id],
                  ["Test", viewModal.testName],
                  ["Category", viewModal.testCategory],
                  ["Ordered By", viewModal.doctorName],
                  ["Ordered Date", viewModal.orderedDate],
                  ["Result Date", viewModal.resultDate || "—"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {k}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              {viewModal.result && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
                    Result
                  </p>
                  <p className="text-sm font-medium text-emerald-900 leading-relaxed">
                    {viewModal.result}
                  </p>
                  {viewModal.interpretation && (
                    <>
                      <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mt-3 mb-1">
                        Interpretation
                      </p>
                      <p className="text-sm font-medium text-emerald-900">
                        {viewModal.interpretation}
                      </p>
                    </>
                  )}
                </div>
              )}
              <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
