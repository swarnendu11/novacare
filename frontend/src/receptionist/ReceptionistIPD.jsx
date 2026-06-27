/**
 * Receptionist IPD Management
 * Admit patients, manage admissions, view ward status
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mockAdmissions, mockBeds, mockDoctors } from "../services/mockData";
import {
  Bed,
  Plus,
  Search,
  Eye,
  LogOut,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

const BADGES = {
  admitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  discharged: "bg-slate-100 text-slate-600 border-slate-200",
};

const INITIAL_FORM = {
  patientName: "",
  patientAge: "",
  gender: "Male",
  doctorName: "",
  department: "",
  ward: "",
  bed: "",
  reason: "",
  notes: "",
};

export default function ReceptionistIPD() {
  const [admissions, setAdmissions] = useState(() => mockAdmissions.getAll());
  const [filter, setFilter] = useState("admitted");
  const [search, setSearch] = useState("");
  const [admitModal, setAdmitModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [dischargeModal, setDischargeModal] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [dischargeNotes, setDischargeNotes] = useState("");
  const availableBeds = mockBeds.getAvailable();
  const doctors = mockDoctors.getAll();

  const filtered = admissions.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAdmit = (e) => {
    e.preventDefault();
    mockAdmissions.create({
      ...form,
      patientId: Date.now(),
      patientAge: Number(form.patientAge),
    });
    setAdmissions(mockAdmissions.getAll());
    toast.success(`${form.patientName} admitted!`);
    setAdmitModal(false);
    setForm(INITIAL_FORM);
  };

  const handleDischarge = () => {
    if (!dischargeModal) return;
    mockAdmissions.discharge(dischargeModal.id, dischargeNotes);
    setAdmissions(mockAdmissions.getAll());
    toast.success(`${dischargeModal.patientName} discharged.`);
    setDischargeModal(null);
    setDischargeNotes("");
  };

  const stats = {
    admitted: admissions.filter((a) => a.status === "admitted").length,
    availableBeds: availableBeds.length,
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <Bed className="w-8 h-8 text-indigo-400" /> IPD & Admissions
            </h2>
            <p className="text-indigo-200 font-medium">
              Manage patient admissions and discharges.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-black">{stats.admitted}</p>
              <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest mt-0.5">
                Admitted
              </p>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-black text-emerald-300">
                {stats.availableBeds}
              </p>
              <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mt-0.5">
                Free Beds
              </p>
            </div>
            <button
              onClick={() => setAdmitModal(true)}
              className="flex items-center gap-2 bg-white text-slate-900 font-black px-5 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" /> Admit Patient
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "admitted", "discharged"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? "bg-indigo-600 text-white shadow-md" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "IPD ID",
                  "Patient",
                  "Doctor",
                  "Ward / Bed",
                  "Admitted",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-black text-indigo-600 text-sm">
                      {a.id}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{a.patientName}</p>
                    <p className="text-xs text-slate-400">
                      {a.patientAge} yrs · {a.gender}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-slate-700">
                      {a.doctorName}
                    </p>
                    <p className="text-xs text-slate-400">{a.department}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{a.ward}</p>
                    <p className="text-xs text-indigo-500 font-bold">
                      Bed: {a.bed}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-slate-600">
                      {a.admitDate}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${BADGES[a.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                    >
                      {a.status === "admitted" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}{" "}
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDetailModal(a)}
                        className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {a.status === "admitted" && (
                        <button
                          onClick={() => setDischargeModal(a)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <Bed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-500">
                      No admissions found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admit Modal */}
      <AnimatePresence>
        {admitModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAdmitModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">
                  Admit Patient
                </h3>
                <button
                  onClick={() => setAdmitModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleAdmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={(e) =>
                        setForm({ ...form, patientName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium text-sm"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={form.patientAge}
                      onChange={(e) =>
                        setForm({ ...form, patientAge: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm"
                    >
                      <option value="">Select...</option>
                      {[
                        "Cardiology",
                        "Neurology",
                        "Orthopedics",
                        "Oncology",
                        "General Medicine",
                        "Pediatrics",
                      ].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Doctor
                  </label>
                  <select
                    value={form.doctorName}
                    onChange={(e) =>
                      setForm({ ...form, doctorName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm"
                  >
                    <option value="">Select Doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} – {d.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Ward
                    </label>
                    <select
                      value={form.ward}
                      onChange={(e) =>
                        setForm({ ...form, ward: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm"
                    >
                      <option value="">Select...</option>
                      {["General Ward", "Female Ward", "Male Ward", "ICU"].map(
                        (w) => (
                          <option key={w}>{w}</option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Bed
                    </label>
                    <select
                      value={form.bed}
                      onChange={(e) =>
                        setForm({ ...form, bed: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-sm"
                    >
                      <option value="">Select Bed...</option>
                      {availableBeds.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} – {b.wardName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Reason for Admission
                  </label>
                  <input
                    type="text"
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdmitModal(false)}
                    className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700"
                  >
                    Admit Patient
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discharge Modal */}
      <AnimatePresence>
        {dischargeModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDischargeModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                  Discharge Patient
                </h3>
                <button
                  onClick={() => setDischargeModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-4">
                <p className="font-black text-rose-800">
                  {dischargeModal.patientName}
                </p>
                <p className="text-xs text-rose-600">
                  {dischargeModal.ward} · Bed {dischargeModal.bed}
                </p>
              </div>
              <textarea
                value={dischargeNotes}
                onChange={(e) => setDischargeNotes(e.target.value)}
                rows={3}
                placeholder="Discharge notes..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setDischargeModal(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDischarge}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black hover:bg-rose-700"
                >
                  Confirm Discharge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                  Admission Detail
                </h3>
                <button
                  onClick={() => setDetailModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  ["ID", detailModal.id],
                  ["Patient", detailModal.patientName],
                  ["Age", `${detailModal.patientAge} · ${detailModal.gender}`],
                  ["Doctor", detailModal.doctorName],
                  ["Department", detailModal.department],
                  ["Ward", detailModal.ward],
                  ["Bed", detailModal.bed],
                  ["Admitted", detailModal.admitDate],
                  ["Reason", detailModal.reason],
                  ["Status", detailModal.status.toUpperCase()],
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
