import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  Bed,
  CreditCard,
  Activity,
  ArrowRight,
  CornerRightDown,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_STAGES = [
  { id: "checked-in", name: "Checked In", color: "orange", icon: Clock },
  { id: "vitals", name: "Vitals Taken", color: "blue", icon: UserCheck },
  {
    id: "consultation",
    name: "In Consultation",
    color: "purple",
    icon: Stethoscope,
  },
  { id: "billing", name: "To Bill", color: "green", icon: CreditCard },
  { id: "admitted", name: "IPD Wards", color: "red", icon: Bed },
];

export default function QueueManager() {
  const [patients, setPatients] = useState([
    {
      id: 101,
      name: "Alice Brown",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      timeWait: "15m",
      status: "checked-in",
    },
    {
      id: 102,
      name: "Mark Evans",
      doctor: "Dr. Priya Sharma",
      dept: "Neurology",
      timeWait: "30m",
      status: "checked-in",
    },
    {
      id: 103,
      name: "John Patient",
      doctor: "Dr. Vikram Nair",
      dept: "General Medicine",
      timeWait: "5m",
      status: "vitals",
    },
    {
      id: 104,
      name: "Carol Davis",
      doctor: "Dr. Sneha Patel",
      dept: "Pediatrics",
      timeWait: "0m",
      status: "consultation",
    },
    {
      id: 105,
      name: "Bob Wilson",
      doctor: "Dr. Arjun Mehta",
      dept: "Cardiology",
      timeWait: "12m",
      status: "billing",
    },
    {
      id: 106,
      name: "Eve Hospitalized",
      doctor: "Dr. Priya Sharma",
      dept: "Neurology",
      admissionId: "ADM-8291",
      room: "204",
      bed: "A",
      status: "admitted",
    },
  ]);

  const movePatient = (id, newStatus) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, status: newStatus };
          if (newStatus === "admitted" && !p.admissionId) {
            updated.admissionId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
            updated.room = Math.floor(100 + Math.random() * 200).toString();
            updated.bed = ["A", "B", "C"][Math.floor(Math.random() * 3)];
            updated.admissionDate = new Date().toLocaleDateString();
          }
          return updated;
        }
        return p;
      }),
    );
    toast.success(
      `Patient moved to ${STATUS_STAGES.find((s) => s.id === newStatus).name}`,
    );
  };

  const dischargePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast.success("Patient discharged from hospital.");
  };

  const completeVisit = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast.success("Visit completed. Patient left facility.");
  };

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Patient Pipeline & Admissions
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Manage OPD wait times and IPD room assignments dynamically.
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto snap-x custom-scrollbar pb-4 pr-10">
        {STATUS_STAGES.map((stage) => {
          const stagePatients = patients.filter((p) => p.status === stage.id);
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className="snap-start min-w-[320px] max-w-[350px] w-full flex flex-col bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"
            >
              {/* Stage Header */}
              <div
                className={`p-4 border-b border-slate-200 bg-${stage.color}-50 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-${stage.color}-100 text-${stage.color}-600 flex items-center justify-center shadow-sm`}
                  >
                    <StageIcon className="w-4 h-4" />
                  </div>
                  <h3 className={`font-extrabold text-${stage.color}-900`}>
                    {stage.name}
                  </h3>
                </div>
                <span
                  className={`bg-${stage.color}-200 text-${stage.color}-800 font-bold px-2 py-0.5 rounded text-xs`}
                >
                  {stagePatients.length}
                </span>
              </div>

              {/* Stage Body */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <AnimatePresence>
                  {stagePatients.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-extrabold text-slate-900 leading-tight">
                            {p.name}
                          </h4>
                          {p.status !== "admitted" && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              Wait:{" "}
                              <span className="text-orange-500">
                                {p.timeWait}
                              </span>
                            </p>
                          )}
                          {p.status === "admitted" && (
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
                              ID: {p.admissionId}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 mb-4">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                          {p.doctor.charAt(4)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {p.doctor}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {p.dept}
                          </p>
                        </div>
                      </div>

                      {p.status === "admitted" && (
                        <div className="flex justify-between items-center bg-red-50 px-3 py-2 rounded-xl border border-red-100 mb-4">
                          <div>
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                              Room
                            </p>
                            <p className="font-black text-red-700">{p.room}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                              Bed
                            </p>
                            <p className="font-black text-red-700 text-right">
                              {p.bed}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {stage.id === "checked-in" && (
                          <button
                            onClick={() => movePatient(p.id, "vitals")}
                            className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors border border-blue-200 flex items-center justify-center gap-1"
                          >
                            Take Vitals <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {stage.id === "vitals" && (
                          <button
                            onClick={() => movePatient(p.id, "consultation")}
                            className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors border border-purple-200 flex items-center justify-center gap-1"
                          >
                            To Doctor <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {stage.id === "consultation" && (
                          <button
                            onClick={() => movePatient(p.id, "billing")}
                            className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs rounded-xl transition-colors border border-green-200 flex items-center justify-center gap-1"
                          >
                            To Bill <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {stage.id === "billing" && (
                          <>
                            <button
                              onClick={() => completeVisit(p.id)}
                              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Complete
                            </button>
                            <button
                              onClick={() => movePatient(p.id, "admitted")}
                              className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors border border-red-200 flex items-center justify-center gap-1"
                            >
                              <CornerRightDown className="w-3 h-3" /> Admit IPD
                            </button>
                          </>
                        )}
                        {stage.id === "admitted" && (
                          <button
                            onClick={() => dischargePatient(p.id)}
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1"
                          >
                            Discharge Patient
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {stagePatients.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-400 font-bold text-sm">
                      Zone Empty
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
