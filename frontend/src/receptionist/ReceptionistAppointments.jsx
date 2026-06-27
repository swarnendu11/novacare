import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { appointmentsApi } from "../services/api";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";
import {
  Search,
  Calendar,
  Clock,
  Ticket,
  XCircle,
  RefreshCw,
  User,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTokenAppt, setActiveTokenAppt] = useState(null);

  const load = async () => {
    try {
      const res = await appointmentsApi.getAll();
      setAppointments(
        res.data.sort((a, b) => new Date(b.date) - new Date(a.date)),
      );
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Persists to shared storage so doctor + admin also see updated status
  const handleCancel = async (id) => {
    try {
      await appointmentsApi.update(id, { status: "cancelled" });
      toast.success("Appointment cancelled");
      load();
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const generateToken = (appt) => {
    setActiveTokenAppt(appt);
    toast.success(`Token Q-${Math.floor(Math.random() * 90 + 10)} generated!`);
  };

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    no_show: "bg-slate-100 text-slate-800 border-slate-200",
  };

  const filteredFiltered = appointments.filter((a) => {
    const matchSearch =
      (a.patientName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.doctorName || "").toLowerCase().includes(search.toLowerCase()) ||
      String(a.id).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="font-sans max-w-7xl mx-auto pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Appointment Ledger
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Manage, reschedule, cancel, or generate tokens for visits.
          </p>
        </div>
        <Link
          to="/receptionist/book"
          className="px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" /> Book Appointment
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient ID, name, or doctor..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-bold transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold text-sm">
              Filter Status:
            </span>
            <select
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 text-sm outline-none cursor-pointer shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  ID & Patient
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Doctor & Dept
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Schedule
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">
                  Operations
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
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 leading-tight">
                            {a.patientName}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                            {String(a.id)?.substring(0, 8) ||
                              `APT-${Math.floor(Math.random() * 9000 + 1000)}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {a.doctorName}
                          </p>
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mt-0.5 inline-block">
                            {a.department || "General"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-400" />{" "}
                          {formatDateIndian(a.date).split(" ")[0]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" /> {a.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${statusColors[a.status] || statusColors.scheduled}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {a.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => generateToken(a)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 tooltip-trigger"
                              title="Generate Token"
                            >
                              <Ticket className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200 tooltip-trigger"
                              title="Reschedule"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(a.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200 tooltip-trigger"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredFiltered.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-500 font-bold"
                    >
                      No appointments found matching your criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini Token Notification Mockup if token generated */}
      <AnimatePresence>
        {activeTokenAppt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-10 right-10 bg-white p-6 rounded-3xl shadow-2xl border-2 border-dashed border-slate-300 w-72 z-50"
          >
            <button
              onClick={() => setActiveTokenAppt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="text-center mb-4">
              <h4 className="font-black text-slate-900 tracking-widest uppercase mb-1">
                Queue Token
              </h4>
              <p className="text-5xl font-black text-blue-600">Q-84</p>
            </div>
            <div className="space-y-2 border-t border-slate-200 pt-4 text-left">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Patient</span>
                <span className="text-slate-900">
                  {activeTokenAppt.patientName}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Doctor</span>
                <span className="text-slate-900">
                  {activeTokenAppt.doctorName}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Time</span>
                <span className="text-slate-900">{activeTokenAppt.time}</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Print Physical Token
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
