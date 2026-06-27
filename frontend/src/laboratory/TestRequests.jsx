import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  X,
} from "lucide-react";
import { mockLabReports } from "../services/mockData";
import toast from "react-hot-toast";

export default function TestRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const all = mockLabReports.getAll();
    setRequests(all.filter((r) => r.status !== "completed"));
  };

  const handleUpdateStatus = (id, newStatus) => {
    mockLabReports.update(id, { status: newStatus });
    toast.success(`Request marked as ${newStatus}`);
    loadRequests();
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2 text-white">
            <ClipboardList className="w-8 h-8 text-teal-300" /> Test Requests
          </h2>
          <p className="text-teal-100 font-medium text-lg">
            Manage incoming test orders from doctors and wards.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or test name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          {["all", "pending", "in-progress"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((req) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={req.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {req.type === "Urgent" && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> URGENT
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{req.testName}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    Req: #{req.id}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    req.status === "in-progress" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {req.status === "in-progress" ? <Activity className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Patient</span>
                  <span className="font-bold text-slate-800">{req.patientName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="font-bold text-slate-800">{req.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Doctor</span>
                  <span className="font-bold text-slate-800">Dr. Smith</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {req.status === "pending" && (
                  <button
                    onClick={() => handleUpdateStatus(req.id, "in-progress")}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    Start Processing
                  </button>
                )}
                {req.status === "in-progress" && (
                  <button
                    onClick={() => handleUpdateStatus(req.id, "completed")}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Finalize
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-800 mb-2">All Caught Up!</h3>
          <p className="text-slate-500 font-medium">
            No pending test requests match your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
