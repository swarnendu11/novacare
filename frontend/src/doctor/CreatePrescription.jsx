/**
 * CreatePrescription — Doctor Module
 * Connected to prescriptionsApi for real persistence + cross-role workflow notifications
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  Plus,
  Trash2,
  Printer,
  Search,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Pill,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { prescriptionsApi, appointmentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function CreatePrescription() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  // Load unique patients from doctor's appointments
  useEffect(() => {
    const load = async () => {
      try {
        const res = await appointmentsApi.getAll({
          doctorId: user?.doctorId || user?.id,
        });
        const uniquePatients = {};
        (res.data || []).forEach((a) => {
          if (!uniquePatients[a.patientId]) {
            uniquePatients[a.patientId] = {
              id: a.patientId,
              name: a.patientName,
            };
          }
        });
        setPatients(Object.values(uniquePatients));
      } catch {
        /* fallback */
      }
    };
    load();
  }, [user]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1)
      return toast.error("At least one medicine is required");
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const selectedPatient = patients.find(
    (p) => p.id === Number(selectedPatientId),
  );
  const filteredPatients = patients.filter(
    (p) =>
      !patientSearch ||
      p.name.toLowerCase().includes(patientSearch.toLowerCase()),
  );

  const handleSave = async () => {
    if (!selectedPatientId) return toast.error("Please select a patient");
    if (!diagnosis.trim()) return toast.error("Please enter a diagnosis");
    if (medicines.some((m) => !m.name.trim()))
      return toast.error("Please fill in all medicine names");

    setSubmitting(true);
    try {
      await prescriptionsApi.create({
        patientId: Number(selectedPatientId),
        patientName: selectedPatient?.name || "Patient",
        doctorId: user?.doctorId || user?.id || 1,
        doctorName: user?.name || "Doctor",
        diagnosis,
        medicines: medicines.filter((m) => m.name.trim()),
        notes,
        date: new Date().toISOString().split("T")[0],
      });
      toast.success("✅ Prescription created & sent to patient + pharmacy!");
      setSubmitted(true);
    } catch (err) {
      toast.error("Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPrescription = () => {
    setSelectedPatientId("");
    setDiagnosis("");
    setNotes("");
    setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
    setSubmitted(false);
    setPatientSearch("");
  };

  if (submitted) {
    return (
      <div className="font-sans max-w-2xl mx-auto pb-10 flex flex-col items-center justify-center min-h-[500px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Prescription Sent!
          </h2>
          <p className="text-slate-500 font-bold mb-2 text-lg">
            {selectedPatient?.name}
          </p>
          <p className="text-slate-400 font-medium mb-10">
            Diagnosis:{" "}
            <span className="text-slate-700 font-bold">{diagnosis}</span> ·{" "}
            {medicines.filter((m) => m.name).length} medication(s)
          </p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-10 max-w-sm mx-auto">
            <p className="text-emerald-700 font-bold text-sm">
              ✅ Patient has been notified
            </p>
            <p className="text-emerald-600 font-medium text-xs mt-1">
              Prescription is now visible in patient's dashboard and pending in
              pharmacy.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleNewPrescription}
              className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> New Prescription
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-7xl mx-auto pb-10 flex flex-col xl:flex-row gap-6">
      {/* Left Column: Patient Details */}
      <div className="xl:w-1/3 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8"
        >
          <h3 className="font-extrabold text-slate-900 text-xl mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" /> Patient Details
          </h3>

          {/* Patient selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Select Patient
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setSelectedPatientId("");
                }}
                placeholder="Search patient name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 custom-scrollbar">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(String(p.id));
                    setPatientSearch(p.name);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedPatientId === String(p.id)
                      ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100/50"
                      : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm ${
                      selectedPatientId === String(p.id)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800">{p.name}</span>
                  {selectedPatientId === String(p.id) && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <p className="text-center text-slate-400 font-bold text-sm py-4">
                  No patients found from your appointments.
                </p>
              )}
            </div>
          </div>

          {/* Selected patient card */}
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-100 p-5 rounded-2xl mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-lg">
                    {selectedPatient.name}
                  </p>
                  <p className="font-bold text-blue-600 text-xs uppercase tracking-widest mt-0.5">
                    PID-{selectedPatient.id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <p className="text-slate-400 font-bold text-[10px] uppercase">
                    Blood Group
                  </p>
                  <p className="font-black text-red-500 mt-0.5">O+</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <p className="text-slate-400 font-bold text-[10px] uppercase">
                    Allergies
                  </p>
                  <p className="font-black text-orange-500 mt-0.5">
                    Penicillin
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Diagnosis *
            </label>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl border border-slate-700 p-8 text-white relative overflow-hidden flex-1"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-extrabold text-xl mb-6 flex items-center gap-2 text-white">
            <Stethoscope className="w-5 h-5 text-blue-400" /> Clinical Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Write dietary advice, rest recommendations, or follow-up instructions..."
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 resize-none h-[calc(100%-3rem)]"
          />
        </motion.div>
      </div>

      {/* Right Column: Medicine Builder */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="xl:w-2/3 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col overflow-hidden h-full min-h-[700px]"
      >
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-extrabold text-slate-900 text-2xl flex items-center gap-3">
            <FileSignature className="w-7 h-7 text-blue-600" /> Digital
            Prescription
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="flex gap-2 items-center bg-blue-600 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 disabled:opacity-60"
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Generate & Send
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {/* Medicines list */}
          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {medicines.map((med, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-12 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl relative group items-center hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="col-span-12 md:col-span-5 relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      <Pill className="w-3 h-3 inline mr-1 mb-px" /> Medicine
                      Name *
                    </label>
                    <input
                      value={med.name}
                      onChange={(e) =>
                        updateMedicine(index, "name", e.target.value)
                      }
                      placeholder="e.g. Paracetamol"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Dosage
                    </label>
                    <input
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedicine(index, "dosage", e.target.value)
                      }
                      placeholder="e.g. 500mg"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-3 relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Frequency
                    </label>
                    <select
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedicine(index, "frequency", e.target.value)
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="">Select...</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="1-1-1 (TID)">1-1-1 (TID)</option>
                      <option value="1-0-1 (BID)">1-0-1 (BID)</option>
                      <option value="1-0-0 (OD)">1-0-0 (OD)</option>
                      <option value="0-0-1 (HS)">0-0-1 (HS)</option>
                      <option value="As needed">As needed (SOS)</option>
                    </select>
                  </div>
                  <div className="col-span-4 md:col-span-2 relative pr-8 md:pr-0">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Duration
                    </label>
                    <input
                      value={med.duration}
                      onChange={(e) =>
                        updateMedicine(index, "duration", e.target.value)
                      }
                      placeholder="5 days"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  {medicines.length > 1 && (
                    <button
                      onClick={() => removeMedicine(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={addMedicine}
            className="w-full py-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 font-extrabold flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors active:scale-[0.99]"
          >
            <Plus className="w-5 h-5" /> Add Another Medicine
          </button>

          {/* Validation hint */}
          <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">
                Before submitting
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Ensure patient is selected, diagnosis is entered, and at least
                one medicine is filled. The prescription will be visible in the
                patient's dashboard and queued in pharmacy.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
