/**
 * Admitted Patients – Doctor View
 * View patients in IPD assigned to this doctor, add vitals
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mockAdmissions } from "../services/mockData";
import { useAuth } from "../context/AuthContext";
import {
  Bed,
  Eye,
  Plus,
  Save,
  X,
  Activity,
  Heart,
  Thermometer,
} from "lucide-react";

export default function IPDPatients() {
  const { user } = useAuth();
  const [admissions] = useState(() =>
    mockAdmissions.getAll({ status: "admitted" }),
  );
  const [vitalModal, setVitalModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [vitalForm, setVitalForm] = useState({
    bp: "",
    temp: "",
    pulse: "",
    spo2: "",
  });

  const handleAddVitals = () => {
    if (!vitalForm.bp || !vitalForm.pulse) {
      toast.error("Enter BP and pulse.");
      return;
    }
    mockAdmissions.addVitals(vitalModal.id, vitalForm);
    toast.success("Vitals recorded!");
    setVitalModal(null);
    setVitalForm({ bp: "", temp: "", pulse: "", spo2: "" });
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
            <Bed className="w-8 h-8 text-blue-400" /> Admitted Patients (IPD)
          </h2>
          <p className="text-blue-200 font-medium">
            Monitor and manage your in-patient cases.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {admissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
          <Bed className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-black text-slate-500 text-lg">
            No admitted patients at this time.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {admissions.map((a) => {
            const latestVitals = a.vitals?.[a.vitals.length - 1];
            return (
              <motion.div
                key={a.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
                      {a.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900">
                        {a.patientName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {a.patientAge} yrs · {a.gender}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    {a.id}
                  </span>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    ["Ward", a.ward],
                    ["Bed", a.bed],
                    ["Dept", a.department],
                    ["Admitted", a.admitDate],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="bg-slate-50 rounded-xl p-2.5 border border-slate-100"
                    >
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {k}
                      </p>
                      <p className="font-black text-slate-800 text-xs mt-0.5 truncate">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reason */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                    Reason
                  </p>
                  <p className="text-sm font-bold text-amber-900">{a.reason}</p>
                </div>

                {/* Latest Vitals */}
                {latestVitals && (
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {[
                      ["BP", latestVitals.bp],
                      ["Temp", `${latestVitals.temp}°F`],
                      ["HR", `${latestVitals.pulse}`],
                      ["O₂", `${latestVitals.spo2}%`],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="text-center bg-slate-50 rounded-lg py-2 border border-slate-100"
                      >
                        <p className="text-[8px] font-bold text-slate-400 uppercase">
                          {k}
                        </p>
                        <p className="font-black text-slate-800 text-xs">{v}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailModal(a)}
                    className="flex-1 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => setVitalModal(a)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Vitals
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDetailModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                  Patient Detail
                </h3>
                <button
                  onClick={() => setDetailModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-2 mb-5">
                {[
                  ["Patient", detailModal.patientName],
                  [
                    "Age / Gender",
                    `${detailModal.patientAge} · ${detailModal.gender}`,
                  ],
                  ["Department", detailModal.department],
                  ["Doctor", detailModal.doctorName],
                  ["Ward", detailModal.ward],
                  ["Bed", detailModal.bed],
                  ["Admitted", detailModal.admitDate],
                  ["Reason", detailModal.reason],
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
              {detailModal.vitals?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                    Vitals History
                  </p>
                  <div className="space-y-2">
                    {detailModal.vitals
                      .slice()
                      .reverse()
                      .map((v, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-3"
                        >
                          <span className="text-xs font-bold text-slate-400">
                            {v.date}
                          </span>
                          <div className="flex gap-3">
                            {[
                              ["BP", v.bp],
                              ["Temp", v.temp],
                              ["HR", `${v.pulse}bpm`],
                              ["O₂", `${v.spo2}%`],
                            ].map(([l, val]) => (
                              <div key={l} className="text-center">
                                <p className="text-[8px] text-slate-400 font-bold uppercase">
                                  {l}
                                </p>
                                <p className="font-black text-xs text-slate-800">
                                  {val}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vitals Modal */}
      <AnimatePresence>
        {vitalModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setVitalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Record Vitals
                </h3>
                <button
                  onClick={() => setVitalModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-5">
                <p className="font-bold text-blue-800 text-sm">
                  {vitalModal.patientName} · {vitalModal.ward} – Bed{" "}
                  {vitalModal.bed}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  {
                    label: "Blood Pressure",
                    field: "bp",
                    placeholder: "120/80",
                  },
                  {
                    label: "Temperature (°F)",
                    field: "temp",
                    placeholder: "98.6",
                  },
                  {
                    label: "Heart Rate (bpm)",
                    field: "pulse",
                    placeholder: "72",
                  },
                  { label: "SpO₂ (%)", field: "spo2", placeholder: "98" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={vitalForm[field]}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, [field]: e.target.value })
                      }
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setVitalModal(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVitals}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Vitals
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
