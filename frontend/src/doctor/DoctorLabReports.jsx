/**
 * Lab Reports – Doctor View
 * Order lab tests, view results, update status
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { labReportsApi } from "../services/api";
import { mockLabReports } from "../services/mockData";
import { useAuth } from "../context/AuthContext";
import {
  FlaskConical,
  Plus,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Download,
  Search,
} from "lucide-react";

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

const PATIENTS = [
  { id: 3, name: "John Patient" },
  { id: 5, name: "Alice Brown" },
  { id: 7, name: "Carol Davis" },
  { id: 6, name: "Bob Wilson" },
];

const LAB_TESTS = [
  "Complete Blood Count (CBC)",
  "Lipid Profile",
  "Blood Sugar Fasting",
  "HbA1c – Glycated Hemoglobin",
  "Thyroid Profile (TSH, T3, T4)",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Urine Routine",
  "Chest X-Ray",
  "ECG",
  "MRI Brain",
  "CT Scan Abdomen",
  "Coagulation Profile",
  "Vitamin D & B12",
  "COVID-19 RT-PCR",
];

export default function DoctorLabReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState(() => mockLabReports.getAll());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderModal, setOrderModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);
  const [orderForm, setOrderForm] = useState({
    patientId: 3,
    patientName: "John Patient",
    testName: "",
    testCategory: "Hematology",
  });
  const [resultForm, setResultForm] = useState({
    result: "",
    interpretation: "",
  });

  const filtered = reports.filter((r) => {
    const matchSearch =
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOrder = (e) => {
    e.preventDefault();
    const report = mockLabReports.create({
      ...orderForm,
      doctorId: user?.doctorId || 1,
      doctorName: user?.name || "Dr. Arjun Mehta",
    });
    setReports(mockLabReports.getAll());
    toast.success(`Lab test ordered for ${orderForm.patientName}!`);
    setOrderModal(false);
    setOrderForm({
      patientId: 3,
      patientName: "John Patient",
      testName: "",
      testCategory: "Hematology",
    });
  };

  const handleUpdateResult = async () => {
    if (!resultForm.result.trim()) {
      toast.error("Enter result.");
      return;
    }
    // Uses labReportsApi which fires workflowEvents.labReportReady → notifies patient + doctor
    await labReportsApi.updateResult(
      updateModal.id,
      resultForm.result,
      resultForm.interpretation,
    );
    setReports(mockLabReports.getAll());
    toast.success("✅ Lab result updated! Patient has been notified.");
    setUpdateModal(null);
    setResultForm({ result: "", interpretation: "" });
  };

  const CategoryBadge = ({ cat }) => (
    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-black uppercase tracking-wide">
      {cat}
    </span>
  );

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <FlaskConical className="w-8 h-8 text-purple-400" /> Lab Reports
            </h2>
            <p className="text-purple-200 font-medium">
              Order tests, view reports, and update results.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {["completed", "pending", "processing"].map((s) => (
              <div
                key={s}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5 text-center"
              >
                <p className="text-xl font-black">
                  {reports.filter((r) => r.status === s).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-purple-200 capitalize">
                  {s}
                </p>
              </div>
            ))}
            <button
              onClick={() => setOrderModal(true)}
              className="flex items-center gap-2 bg-white text-purple-900 font-black px-5 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" /> Order Test
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
            placeholder="Search patient, test, ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/30 font-medium text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "processing", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === f ? "bg-purple-600 text-white shadow-md" : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
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
                  "Lab ID",
                  "Patient",
                  "Test Name",
                  "Category",
                  "Ordered",
                  "Result Date",
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
                {filtered.map((r) => {
                  const S = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
                  const SIcon = S.icon;
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-black text-purple-600 text-sm">
                          {r.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {r.patientName}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800 max-w-[200px] truncate">
                          {r.testName}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <CategoryBadge cat={r.testCategory} />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-500">
                          {r.orderedDate}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-500">
                          {r.resultDate || "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${S.cls}`}
                        >
                          <SIcon className="w-3 h-3" /> {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewModal(r)}
                            className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg"
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {r.status !== "completed" && (
                            <button
                              onClick={() => {
                                setUpdateModal(r);
                                setResultForm({
                                  result: r.result || "",
                                  interpretation: r.interpretation || "",
                                });
                              }}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                              title="Update Result"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-16 text-center">
                    <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-500">
                      No lab reports found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {orderModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setOrderModal(false)}
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
                  <FlaskConical className="w-5 h-5 text-purple-500" /> Order Lab
                  Test
                </h3>
                <button
                  onClick={() => setOrderModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleOrder} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Patient
                  </label>
                  <select
                    value={orderForm.patientId}
                    onChange={(e) => {
                      const p = PATIENTS.find(
                        (p) => p.id === Number(e.target.value),
                      );
                      setOrderForm({
                        ...orderForm,
                        patientId: p.id,
                        patientName: p.name,
                      });
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    {PATIENTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Lab Test
                  </label>
                  <select
                    value={orderForm.testName}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, testName: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="">Select Test...</option>
                    {LAB_TESTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Category
                  </label>
                  <select
                    value={orderForm.testCategory}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        testCategory: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    {[
                      "Hematology",
                      "Biochemistry",
                      "Pathology",
                      "Radiology",
                      "Endocrinology",
                      "Microbiology",
                      "Oncology Markers",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOrderModal(false)}
                    className="flex-1 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700"
                  >
                    Order Test
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
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
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" /> Lab Report
                </h3>
                <button
                  onClick={() => setViewModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  ["Report ID", viewModal.id],
                  ["Patient", viewModal.patientName],
                  ["Doctor", viewModal.doctorName],
                  ["Test", viewModal.testName],
                  ["Category", viewModal.testCategory],
                  ["Ordered", viewModal.orderedDate],
                  ["Result Date", viewModal.resultDate || "—"],
                  ["Status", viewModal.status.toUpperCase()],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {k}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {v}
                    </span>
                  </div>
                ))}
                {viewModal.result && (
                  <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">
                      Result
                    </p>
                    <p className="text-sm font-medium text-emerald-900">
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
              </div>
              <button className="w-full mt-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Download PDF Report
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Update Result Modal */}
      <AnimatePresence>
        {updateModal && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setUpdateModal(null)}
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
                  <Upload className="w-5 h-5 text-emerald-500" /> Update Result
                </h3>
                <button
                  onClick={() => setUpdateModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 mb-4 border border-slate-200">
                <p className="text-sm font-bold text-slate-700">
                  {updateModal.testName}
                </p>
                <p className="text-xs text-slate-400">
                  {updateModal.patientName}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Test Result
                  </label>
                  <textarea
                    value={resultForm.result}
                    onChange={(e) =>
                      setResultForm({ ...resultForm, result: e.target.value })
                    }
                    rows={3}
                    placeholder="Enter test result values..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Clinical Interpretation
                  </label>
                  <textarea
                    value={resultForm.interpretation}
                    onChange={(e) =>
                      setResultForm({
                        ...resultForm,
                        interpretation: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Clinical notes and interpretation..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setUpdateModal(null)}
                  className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateResult}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700"
                >
                  Mark Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
