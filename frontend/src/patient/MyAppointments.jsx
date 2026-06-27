/**
 * My Appointments - Patient (filtered by own patientId)
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { appointmentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { formatDateIndian } from "../utils/formatIndian";

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Filter by logged-in patient's ID
        const res = await appointmentsApi.getAll({ patientId: user?.id });
        setAppointments(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } catch (err) {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="font-sans">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">
        My Appointments
      </h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden"
      >
        {appointments.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5 text-sm font-semibold text-slate-900">
                      {formatDateIndian(a.date)}
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">
                      {a.time}
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">
                      {a.doctorName}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${statusColors[a.status] || "bg-slate-100"}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium mb-6">
              No appointments yet. Book your first visit.
            </p>
            <Link
              to="/patient/book"
              className="inline-block px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              Book Appointment
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
