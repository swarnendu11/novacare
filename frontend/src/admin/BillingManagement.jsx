import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  IndianRupee,
  Search,
  Eye,
  X,
  CreditCard,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";
import { billingApi } from "../services/api";
import Spinner from "../components/Spinner";

const STATUS_STYLE = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-orange-50 text-orange-700 border-orange-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

export default function BillingManagement() {
  const [allBilling, setAllBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await billingApi.getAll();
        setAllBilling(res.data);
      } catch {
        toast.error("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = allBilling
    .filter((b) => b.status === "paid")
    .reduce((a, b) => a + (b.totalAmount || 0), 0);
  const pending = allBilling
    .filter((b) => b.status === "pending")
    .reduce((a, b) => a + (b.totalAmount || 0), 0);

  const filtered = allBilling.filter((b) => {
    const matchSearch =
      (b.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.id || "").includes(search);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const fmt = (n) => `₹${(n || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-emerald-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <IndianRupee className="w-8 h-8 text-emerald-400" /> Billing &
            Payments
          </h2>
          <p className="text-emerald-200 font-medium">
            Monitor all invoices, payments, and refunds.
          </p>
        </div>
        <div className="relative z-10 flex gap-4 flex-wrap">
          {[
            {
              label: "Total Collected",
              value: fmt(totalRevenue),
              color: "text-emerald-300",
            },
            { label: "Pending", value: fmt(pending), color: "text-orange-300" },
            {
              label: "Total Invoices",
              value: allBilling.length,
              color: "text-blue-300",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[110px]"
            >
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                {s.label}
              </p>
            </div>
          ))}
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
            placeholder="Search by patient or invoice ID..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {[
                  "Invoice ID",
                  "Patient",
                  "Services",
                  "Amount",
                  "Method",
                  "Date",
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
              {filtered.map((b) => (
                <motion.tr
                  key={b.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-black text-indigo-600 text-sm">
                      {b.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{b.patientName}</p>
                    <p className="text-xs text-slate-400 font-bold">
                      {b.patientId}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 max-w-[180px] truncate">
                      {(b.items || []).map((i) => i.description).join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900 text-base">
                      {fmt(b.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                      {b.paymentMethod || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">
                      {b.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelected(b)}
                      className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-black text-slate-700">
                      No records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" /> Invoice
                  Details
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
                  ["Invoice ID", selected.id],
                  ["Patient", selected.patientName],
                  ["Department", selected.department],
                  [
                    "Services",
                    (selected.items || []).map((i) => i.description).join(", "),
                  ],
                  ["Amount", fmt(selected.totalAmount)],
                  ["Payment Method", selected.paymentMethod || "—"],
                  ["Date", selected.date],
                  ["Status", selected.status],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {k}
                    </span>
                    <span
                      className={`font-bold text-sm ${k === "Status" ? (v === "paid" ? "text-emerald-600" : "text-orange-600") : "text-slate-900"}`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    toast.success("Invoice downloaded!");
                  }}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                {selected.status === "pending" && (
                  <button
                    onClick={() => {
                      toast.success("Refund initiated!");
                      setSelected(null);
                    }}
                    className="flex-1 py-3 bg-red-50 text-red-700 rounded-xl font-black hover:bg-red-100 border border-red-200"
                  >
                    Refund
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
