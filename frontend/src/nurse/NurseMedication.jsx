import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Syringe, ClipboardCheck, Clock, User, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const mockPatients = [
  { id: "P-1001", name: "John Patient", room: "G-101", status: "admitted" },
  { id: "P-1002", name: "Alice Brown", room: "F-204", status: "admitted" },
  { id: "P-1003", name: "Bob Wilson", room: "ICU-01", status: "admitted" },
];

const mockMeds = [
  { id: 1, name: "Amlodipine 5mg", type: "Oral", route: "PO", freq: "Once daily" },
  { id: 2, name: "Paracetamol 500mg", type: "Oral", route: "PO", freq: "PRN" },
  { id: 3, name: "Ceftriaxone 1g", type: "Injection", route: "IV", freq: "BD" },
];

export default function NurseMedication() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedMed, setSelectedMed] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdminister = () => {
    if (!selectedPatient || !selectedMed) {
      toast.error("Please select both a patient and medication.");
      return;
    }
    toast.success("Medication administered and logged successfully.");
    setSelectedPatient("");
    setSelectedMed("");
    setNotes("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Meds Administration</h1>
            <p className="text-teal-100 font-medium text-lg mt-1">Safely administer and log patient medications.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-500" /> Patient
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-teal-500 appearance-none"
            >
              <option value="">-- Choose a Patient --</option>
              {mockPatients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.room})</option>
              ))}
            </select>
          </div>

          {/* Medication Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-teal-500" /> Prescribed Medication
            </label>
            <select
              value={selectedMed}
              onChange={(e) => setSelectedMed(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-teal-500 appearance-none"
              disabled={!selectedPatient}
            >
              <option value="">-- Select Medication --</option>
              {mockMeds.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.route}) - {m.freq}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Administration Details */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-teal-500" /> Administration Notes
          </label>
          <textarea
            rows="3"
            placeholder="Add any observations, adverse reactions, or context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-teal-500 resize-none"
          ></textarea>
        </div>

        {/* Five Rights Reminder */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 mb-8">
          <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" /> Verify the 5 Rights of Medication
          </h4>
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm font-bold text-teal-700">
            <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">1. Right Patient</li>
            <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">2. Right Drug</li>
            <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">3. Right Dose</li>
            <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">4. Right Route</li>
            <li className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">5. Right Time</li>
          </ul>
        </div>

        <button
          onClick={handleAdminister}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Pill className="w-5 h-5" /> Administer Medication
        </button>
      </div>
    </div>
  );
}
