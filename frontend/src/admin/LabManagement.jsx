import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FlaskConical,
  Search,
  Plus,
  Eye,
  X,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const INITIAL_TESTS = [
  {
    id: "LAB-001",
    patientName: "Aarav Sharma",
    patientId: "PAT-0001",
    doctorName: "Dr. Smith",
    testName: "Complete Blood Count (CBC)",
    result: "Normal",
    status: "Completed",
    date: "2024-03-08",
  },
  {
    id: "LAB-002",
    patientName: "Priya Mehta",
    patientId: "PAT-0002",
    doctorName: "Dr. Patel",
    testName: "Lipid Profile",
    result: "High LDL",
    status: "Completed",
    date: "2024-03-08",
  },
  {
    id: "LAB-003",
    patientName: "Rohan Verma",
    patientId: "PAT-0003",
    doctorName: "Dr. Rao",
    testName: "Blood Sugar Fasting",
    result: "",
    status: "Pending",
    date: "2024-03-09",
  },
  {
    id: "LAB-004",
    patientName: "Sneha Kapoor",
    patientId: "PAT-0004",
    doctorName: "Dr. Khan",
    testName: "Thyroid Profile (TSH, T3, T4)",
    result: "",
    status: "Processing",
    date: "2024-03-09",
  },
  {
    id: "LAB-005",
    patientName: "Karan Singh",
    patientId: "PAT-0005",
    doctorName: "Dr. Mehta",
    testName: "Urine Routine",
    result: "Normal",
    status: "Completed",
    date: "2024-03-07",
  },
];

const STATUS_STYLE = {
  Completed: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  Pending: {
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Processing: {
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

export default function LabManagement() {
  const [tests, setTests] = useState(INITIAL_TESTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    doctorName: "",
    testName: "",
    result: "",
    status: "Pending",
  });

  const filtered = tests.filter((t) => {
    const matchSearch =
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.testName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.includes(search);
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newTest = {
      id: `LAB-${String(tests.length + 1).padStart(3, "0")}`,
      ...form,
      date: new Date().toISOString().split("T")[0],
    };
    setTests((prev) => [newTest, ...prev]);
    toast.success("Lab test added!");
    setAddModal(false);
    setForm({
      patientName: "",
      patientId: "",
      doctorName: "",
      testName: "",
      result: "",
      status: "Pending",
    });
  };

  const updateResult = (id) => {
    const result = prompt("Enter test result:");
    if (!result) return;
    setTests((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, result, status: "Completed" } : t,
      ),
    );
    toast.success("Result updated!");
    setSelected(null);
  };

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-purple-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-purple-400" /> Laboratory
          </h2>
          <p className="text-purple-200 font-medium">
            Manage lab tests, upload reports, and track results.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          {["Completed", "Pending", "Processing"].map((s) => (
            <div
              key={s}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center"
            >
              <p className="text-2xl font-black text-white">
                {tests.filter((t) => t.status === s).length}
              </p>
              <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mt-1">
                {s}
              </p>
            </div>
          ))}
          <button
            onClick={() => setAddModal(true)}
            className="px-6 py-3 bg-white text-purple-900 font-black rounded-xl hover:bg-purple-50 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Test
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test, patient or ID..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 font-bold transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Processing</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {[
                  "Test ID",
                  "Patient",
                  "Doctor",
                  "Test Name",
                  "Date",
                  "Result",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filtered.map((t) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-purple-600 text-sm">
                        {t.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {t.patientName}
                      </p>
                      <p className="text-xs text-slate-400 font-bold">
                        {t.patientId}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">
                        {t.doctorName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800 max-w-[200px]">
                        {t.testName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-500">
                        {t.date}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {t.result ? (
                        <span className="text-sm font-bold text-slate-900">
                          {t.result}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 italic">
                          Awaiting...
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[t.status]?.cls}`}
                      >
                        {STATUS_STYLE[t.status]?.icon} {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(t)}
                          className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {t.status !== "Completed" && (
                          <button
                            onClick={() => updateResult(t.id)}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                            title="Update result"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="font-black text-slate-700">
                        No lab tests found
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-purple-500" /> Test
                  Report
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  ["Test ID", selected.id],
                  ["Patient", selected.patientName],
                  ["Doctor", selected.doctorName],
                  ["Test Name", selected.testName],
                  ["Date", selected.date],
                  ["Result", selected.result || "Awaiting..."],
                  ["Status", selected.status],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2.5 border-b border-slate-100 last:border-0"
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
              {selected.status !== "Completed" && (
                <button
                  onClick={() => updateResult(selected.id)}
                  className="w-full mt-6 py-3 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Update Result
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Test Modal */}
      <AnimatePresence>
        {addModal && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-purple-500" /> Add Lab Test
                </h3>
                <button
                  onClick={() => setAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                {[
                  {
                    label: "Patient Name",
                    field: "patientName",
                    placeholder: "e.g. Aarav Sharma",
                  },
                  {
                    label: "Patient ID",
                    field: "patientId",
                    placeholder: "PAT-XXXX",
                  },
                  {
                    label: "Doctor Name",
                    field: "doctorName",
                    placeholder: "e.g. Dr. Smith",
                  },
                  {
                    label: "Test Name",
                    field: "testName",
                    placeholder: "e.g. Blood Sugar Fasting",
                  },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) =>
                        setForm({ ...form, [field]: e.target.value })
                      }
                      placeholder={placeholder}
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddModal(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-black hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    Add Test
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
