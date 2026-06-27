import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, HeartPulse, Thermometer, Droplets, Save, Search, User } from "lucide-react";
import toast from "react-hot-toast";

const mockPatients = [
  { id: "P-1001", name: "John Patient", room: "G-101", status: "admitted" },
  { id: "P-1002", name: "Alice Brown", room: "F-204", status: "admitted" },
  { id: "P-1003", name: "Bob Wilson", room: "ICU-01", status: "admitted" },
];

export default function NurseVitals() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [vitals, setVitals] = useState({
    bpSystolic: "",
    bpDiastolic: "",
    heartRate: "",
    temperature: "",
    oxygen: "",
  });

  const handleSave = () => {
    if (!selectedPatient) {
      toast.error("Please select a patient first.");
      return;
    }
    toast.success("Vitals recorded successfully.");
    setVitals({ bpSystolic: "", bpDiastolic: "", heartRate: "", temperature: "", oxygen: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Record Vitals</h1>
            <p className="text-rose-100 font-medium text-lg mt-1">Log and monitor patient health metrics in real-time.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        {/* Patient Selection */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Patient</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all appearance-none"
            >
              <option value="">-- Choose a Patient --</option>
              {mockPatients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.room})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vitals Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" /> Blood Pressure (mmHg)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                placeholder="Systolic"
                value={vitals.bpSystolic}
                onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-rose-500"
              />
              <span className="text-slate-400 font-bold text-xl">/</span>
              <input
                type="number"
                placeholder="Diastolic"
                value={vitals.bpDiastolic}
                onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Heart Rate (bpm)
            </label>
            <input
              type="number"
              placeholder="e.g. 72"
              value={vitals.heartRate}
              onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-500" /> Temperature (°F)
            </label>
            <input
              type="number"
              placeholder="e.g. 98.6"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" /> Oxygen Saturation (%)
            </label>
            <input
              type="number"
              placeholder="e.g. 98"
              value={vitals.oxygen}
              onChange={(e) => setVitals({ ...vitals, oxygen: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Save Vitals Record
        </button>
      </div>
    </div>
  );
}
