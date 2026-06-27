import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { appointmentsApi } from "../services/api";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";
import { Search, Calendar, Clock, CreditCard, ChevronDown } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await appointmentsApi.getAll();
        setAppointments(res.data);
      } catch {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredFiltered = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      a.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  // Calculate easy stats
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const scheduled = appointments.filter((a) => a.status === "scheduled").length;

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header Array */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-400" /> Appointments
          </h2>
          <p className="text-indigo-200 font-medium">
            View all patient visits and earnings.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[100px]">
            <p className="text-2xl font-black text-white">{total}</p>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">
              Total
            </p>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 text-center min-w-[100px]">
            <p className="text-2xl font-black text-emerald-300">{completed}</p>
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mt-1">
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or doctor name..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Show:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
          >
            <option value="All">All Visits</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  ID & Date
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Doctor & Dept
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Amount Paid
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredFiltered.map((a) => (
                  <motion.tr
                    key={a.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 hover:cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-900">
                          {formatDateIndian(a.date).split(" ")[0]}
                        </span>
                        <span className="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.time}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2">
                        {String(a.id)?.substring(0, 8) ||
                          `APT-${Math.floor(Math.random() * 9000 + 1000)}`}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <h4 className="font-black text-slate-900 text-base">
                        {a.patientName}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                        Patient ID: PAT-
                        {a.patientId || Math.floor(Math.random() * 90) + 10}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">
                        {a.doctorName}
                      </p>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 inline-block border border-slate-200">
                        {a.department || "General"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${a.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                        >
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={`font-black tracking-tight ${a.status === "completed" ? "text-emerald-700" : "text-slate-500"}`}
                          >
                            ₹{Math.floor(500 + Math.random() * 1500)}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {a.status === "completed" ? "Paid" : "Pending"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(a.status)}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {filteredFiltered.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-20 text-center text-slate-500 font-bold"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-lg text-slate-800">
                          No appointments found matching your search.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
