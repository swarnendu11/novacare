/**
 * IPD Management – Admin Portal
 * Admit Patient, View Admitted, Discharge, Transfer
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  mockAdmissions,
  mockBeds,
  mockDoctors,
  mockUsers,
} from "../services/mockData";
import {
  Bed,
  Plus,
  Search,
  X,
  Eye,
  LogOut,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Filter,
} from "lucide-react";

const BADGES = {
  admitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  discharged: "bg-slate-100 text-slate-600 border-slate-200",
  transferred: "bg-blue-50 text-blue-700 border-blue-200",
};

const INITIAL_FORM = {
  patientName: "",
  patientAge: "",
  gender: "Male",
  patientId: "",
  doctorName: "",
  department: "",
  ward: "",
  bed: "",
  reason: "",
  notes: "",
};

export default function IPDManagement() {
  const [admissions, setAdmissions] = useState(() => mockAdmissions.getAll());
  const [filter, setFilter] = useState("admitted");
  const [search, setSearch] = useState("");
  const [admitModal, setAdmitModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [dischargeModal, setDischargeModal] = useState(null);
  const [transferModal, setTransferModal] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [dischargeNotes, setDischargeNotes] = useState("");
  const [transferData, setTransferData] = useState({ ward: "", bed: "" });
  const availableBeds = mockBeds.getAvailable();
  const doctors = mockDoctors.getAll();

  const filtered = admissions.filter((a) => {
    const matchFilter = filter === "all" || a.status === filter;
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAdmit = (e) => {
    e.preventDefault();
    try {
      const admission = mockAdmissions.create({
        ...form,
        patientId: Number(form.patientId) || Date.now(),
        patientAge: Number(form.patientAge),
      });
      setAdmissions(mockAdmissions.getAll());
      toast.success(`${form.patientName} admitted successfully!`);
      setAdmitModal(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      toast.error("Failed to admit patient.");
    }
  };

  const handleDischarge = () => {
    if (!dischargeModal) return;
    mockAdmissions.discharge(dischargeModal.id, dischargeNotes);
    setAdmissions(mockAdmissions.getAll());
    toast.success(`${dischargeModal.patientName} discharged successfully.`);
    setDischargeModal(null);
    setDischargeNotes("");
    setDetailModal(null);
  };

  const handleTransfer = () => {
    if (!transferModal) return;
    mockAdmissions.transfer(
      transferModal.id,
      transferData.ward,
      transferData.bed,
    );
    setAdmissions(mockAdmissions.getAll());
    toast.success("Patient transferred successfully!");
    setTransferModal(null);
    setTransferData({ ward: "", bed: "" });
  };

  const stats = {
    admitted: admissions.filter((a) => a.status === "admitted").length,
    discharged: admissions.filter((a) => a.status === "discharged").length,
    beds: availableBeds.length,
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, #3B82F6 0%, transparent 60%)",
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <Bed className="w-8 h-8 text-blue-400" /> IPD Management
            </h2>
            <p className="text-blue-200 font-medium">
              In-Patient Department · Admissions, Discharges & Transfers
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              {
                label: "Admitted",
                value: stats.admitted,
                color:
                  "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
              },
              {
                label: "Discharged",
                value: stats.discharged,
                color: "bg-slate-500/20 border-slate-500/30 text-slate-300",
              },
              {
                label: "Free Beds",
                value: stats.beds,
                color: "bg-blue-500/20 border-blue-500/30 text-blue-300",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.color} border rounded-2xl px-5 py-3 text-center`}
              >
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
            <button
              onClick={() => setAdmitModal(true)}
              className="flex items-center gap-2 bg-white text-slate-900 font-black px-5 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" /> Admit Patient
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, ID, doctor..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 font-medium text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "admitted", "discharged"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? "bg-blue-600 text-white shadow-md" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
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
                  "Admit Date",
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
              <AnimatePresence>
                {filtered.map((a) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="font-black text-blue-600 text-sm">
                        {a.id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        {a.patientName}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
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
                      <p className="text-sm font-bold text-slate-800">
                        {a.ward}
                      </p>
                      <p className="text-xs text-blue-500 font-bold">
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
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${BADGES[a.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {a.status === "admitted" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailModal(a)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {a.status === "admitted" && (
                          <>
                            <button
                              onClick={() => setTransferModal(a)}
                              className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                              title="Transfer"
                            >
                              <ArrowRightLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDischargeModal(a)}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Discharge"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
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

      {/* Admit Patient Modal */}
      <AnimatePresence>
        {admitModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setAdmitModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-500" /> Admit New Patient
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
                    <label className="label-xs">Patient Name</label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={(e) =>
                        setForm({ ...form, patientName: e.target.value })
                      }
                      required
                      className="input-field"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="label-xs">Age</label>
                    <input
                      type="number"
                      value={form.patientAge}
                      onChange={(e) =>
                        setForm({ ...form, patientAge: e.target.value })
                      }
                      required
                      className="input-field"
                      placeholder="e.g. 45"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-xs">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="input-field"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Department</label>
                    <select
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      required
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {[
                        "Cardiology",
                        "Neurology",
                        "Orthopedics",
                        "Oncology",
                        "General Medicine",
                        "Pediatrics",
                        "Dermatology",
                      ].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-xs">Attending Doctor</label>
                  <select
                    value={form.doctorName}
                    onChange={(e) =>
                      setForm({ ...form, doctorName: e.target.value })
                    }
                    required
                    className="input-field"
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
                    <label className="label-xs">Ward</label>
                    <select
                      value={form.ward}
                      onChange={(e) =>
                        setForm({ ...form, ward: e.target.value })
                      }
                      required
                      className="input-field"
                    >
                      <option value="">Select Ward...</option>
                      {[
                        "General Ward",
                        "Female Ward",
                        "Male Ward",
                        "ICU",
                        "Oncology Ward",
                        "Pediatric Ward",
                        "Post-Op Ward",
                      ].map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-xs">Bed</label>
                    <select
                      value={form.bed}
                      onChange={(e) =>
                        setForm({ ...form, bed: e.target.value })
                      }
                      required
                      className="input-field"
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
                  <label className="label-xs">Reason for Admission</label>
                  <input
                    type="text"
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    required
                    className="input-field"
                    placeholder="e.g. Acute Myocardial Infarction"
                  />
                </div>
                <div>
                  <label className="label-xs">Notes (Optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Initial clinical notes..."
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdmitModal(false)}
                    className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Admit Patient
                  </button>
                </div>
              </form>
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
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-500" /> Admission Details
                </h3>
                <button
                  onClick={() => setDetailModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  ["IPD ID", detailModal.id],
                  [
                    "Patient",
                    `${detailModal.patientName} (${detailModal.patientAge}y, ${detailModal.gender})`,
                  ],
                  ["Doctor", detailModal.doctorName],
                  ["Department", detailModal.department],
                  ["Ward", detailModal.ward],
                  ["Bed", detailModal.bed],
                  ["Admit Date", detailModal.admitDate],
                  ["Discharge Date", detailModal.dischargeDate || "—"],
                  ["Reason", detailModal.reason],
                  ["Status", detailModal.status.toUpperCase()],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {k}
                    </span>
                    <span className="font-bold text-sm text-slate-900 text-right max-w-[60%]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              {detailModal.vitals?.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                    Latest Vitals
                  </p>
                  {detailModal.vitals.slice(-1).map((v, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 text-center">
                      {[
                        ["BP", v.bp],
                        ["Temp", `${v.temp}°F`],
                        ["Pulse", `${v.pulse} bpm`],
                        ["SpO2", `${v.spo2}%`],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="bg-white rounded-xl p-2 border border-slate-200"
                        >
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            {label}
                          </p>
                          <p className="font-black text-slate-900 text-sm">
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {detailModal.status === "admitted" && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setTransferModal(detailModal);
                      setDetailModal(null);
                    }}
                    className="flex-1 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold hover:bg-purple-100 flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-4 h-4" /> Transfer
                  </button>
                  <button
                    onClick={() => {
                      setDischargeModal(detailModal);
                      setDetailModal(null);
                    }}
                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black hover:bg-rose-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Discharge
                  </button>
                </div>
              )}
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
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <LogOut className="w-6 h-6 text-rose-500" /> Discharge Patient
                </h3>
                <button
                  onClick={() => setDischargeModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-5">
                <p className="font-bold text-rose-800">
                  Discharging:{" "}
                  <span className="font-black">
                    {dischargeModal.patientName}
                  </span>
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  Ward: {dischargeModal.ward} · Bed: {dischargeModal.bed}
                </p>
              </div>
              <div className="mb-4">
                <label className="label-xs">Discharge Summary / Notes</label>
                <textarea
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  rows={4}
                  className="input-field resize-none mt-1"
                  placeholder="Patient condition at discharge, follow-up instructions..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDischargeModal(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDischarge}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black hover:bg-rose-700 transition-colors"
                >
                  Confirm Discharge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {transferModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setTransferModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-6 h-6 text-purple-500" />{" "}
                  Transfer Patient
                </h3>
                <button
                  onClick={() => setTransferModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-5">
                <p className="font-bold text-purple-800">
                  Transferring:{" "}
                  <span className="font-black">
                    {transferModal.patientName}
                  </span>
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  from {transferModal.ward} · Bed {transferModal.bed}
                </p>
              </div>
              <div className="space-y-4 mb-5">
                <div>
                  <label className="label-xs">New Ward</label>
                  <select
                    value={transferData.ward}
                    onChange={(e) =>
                      setTransferData({ ...transferData, ward: e.target.value })
                    }
                    className="input-field mt-1"
                  >
                    <option value="">Select New Ward...</option>
                    {[
                      "General Ward",
                      "Female Ward",
                      "Male Ward",
                      "ICU",
                      "Oncology Ward",
                      "Pediatric Ward",
                      "Post-Op Ward",
                    ].map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-xs">New Bed</label>
                  <select
                    value={transferData.bed}
                    onChange={(e) =>
                      setTransferData({ ...transferData, bed: e.target.value })
                    }
                    className="input-field mt-1"
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
              <div className="flex gap-3">
                <button
                  onClick={() => setTransferModal(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .input-field { @apply w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white font-medium text-slate-900 text-sm transition-all; }
        .label-xs { @apply text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1; }
      `}</style>
    </div>
  );
}
