import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Clock, Calendar as CalendarIcon } from "lucide-react";
import { doctorsApi } from "../services/api";

export default function DoctorRoster() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    doctorsApi.getAll().then((res) => setDoctors(res.data));
  }, []);

  const getStatusColor = (doc) => {
    if (!doc.available)
      return {
        bg: "bg-slate-100",
        text: "text-slate-500",
        dot: "bg-slate-400",
        label: "Off Duty",
      };
    // Mocking some internal logic where even ID doctors are busy
    if (doc.id % 2 === 0)
      return {
        bg: "bg-orange-50",
        text: "text-orange-600",
        dot: "bg-orange-500",
        label: "In Consultation",
      };
    return {
      bg: "bg-green-50",
      text: "text-green-600",
      dot: "bg-green-500",
      label: "Available Now",
    };
  };

  return (
    <div className="font-sans max-w-7xl mx-auto pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Doctor Roster
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Real-time availability and cabin status of all specialists.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((doc) => {
          const status = getStatusColor(doc);

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden relative group"
            >
              {/* Top Status Bar */}
              <div
                className={`px-5 py-3 border-b border-slate-100 flex items-center justify-between ${status.bg}`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest ${status.text}`}
                >
                  {status.label}
                </span>
                <div className="flex gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.label === "Available Now" ? "animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" : ""}`}
                  ></span>
                </div>
              </div>

              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center font-extrabold text-2xl text-slate-400">
                  {doc.name.charAt(4)}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {doc.name}
                </h3>
                <p className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full inline-block mt-2 text-xs border border-blue-100">
                  {doc.department}
                </p>

                <div className="mt-6 flex justify-center gap-6 border-t border-slate-100 pt-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> Cabin
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      C-{100 + doc.id}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-1">
                      <CalendarIcon className="w-3 h-3" /> Queue
                    </p>
                    <p className="font-bold text-slate-800 text-sm">
                      {Math.floor(doc.appointments / 20)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover Action Sheet */}
              <div className="absolute inset-x-0 bottom-0 bg-slate-900 p-4 translate-y-full group-hover:translate-y-0 transition-transform flex gap-2">
                <button className="flex-1 bg-white text-slate-900 font-bold py-2.5 rounded-xl hover:bg-blue-50 text-sm transition-colors">
                  Book Fast Track
                </button>
                <button className="flex-1 bg-white/10 text-white border border-white/20 font-bold py-2.5 rounded-xl hover:bg-white/20 text-sm transition-colors">
                  Intercom
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
