/**
 * EMR – Electronic Medical Records
 * Doctor view: add notes, vitals, diagnoses per patient
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mockEMR, mockUsers } from "../services/mockData";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  Heart,
  FileText,
  Plus,
  Save,
  ChevronDown,
  Thermometer,
  Droplets,
  Stethoscope,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";

const PATIENTS = [
  { id: 3, name: "John Patient", age: 34, gender: "Male", bloodGroup: "O+" },
  { id: 5, name: "Alice Brown", age: 28, gender: "Female", bloodGroup: "A+" },
  { id: 7, name: "Carol Davis", age: 52, gender: "Female", bloodGroup: "B-" },
  { id: 6, name: "Bob Wilson", age: 41, gender: "Male", bloodGroup: "AB+" },
];

const VitalCard = ({ label, value, unit, icon: Icon, color }) => (
  <div className={`bg-white rounded-2xl p-4 border shadow-sm`}>
    <div
      className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-2`}
    >
      <Icon className="w-4.5 h-4.5" />
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="font-black text-xl text-slate-900">
      {value || "—"}{" "}
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </p>
  </div>
);

export default function EMRInterface() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [emr, setEmr] = useState(
    () =>
      mockEMR.getByPatient(PATIENTS[0].id) || {
        vitals: [],
        doctorNotes: [],
        diagnoses: [],
        allergies: [],
        bloodGroup: "",
        chronicConditions: [],
      },
  );
  const [activeTab, setActiveTab] = useState("vitals");
  const [vitalForm, setVitalForm] = useState({
    bp: "",
    temp: "",
    pulse: "",
    spo2: "",
    weight: "",
    height: "",
  });
  const [noteText, setNoteText] = useState("");
  const [diagnosisForm, setDiagnosisForm] = useState({
    diagnosis: "",
    status: "ongoing",
  });
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);

  const loadPatient = (patient) => {
    setSelectedPatient(patient);
    const e = mockEMR.getByPatient(patient.id) || {
      vitals: [],
      doctorNotes: [],
      diagnoses: [],
      allergies: [],
      bloodGroup: "",
      chronicConditions: [],
    };
    setEmr(e);
  };

  const addVitals = () => {
    if (!vitalForm.bp && !vitalForm.pulse) {
      toast.error("Enter at least BP and pulse.");
      return;
    }
    mockEMR.addVitals(selectedPatient.id, vitalForm);
    const updated = mockEMR.getByPatient(selectedPatient.id);
    setEmr(updated);
    setVitalForm({
      bp: "",
      temp: "",
      pulse: "",
      spo2: "",
      weight: "",
      height: "",
    });
    setShowVitalForm(false);
    toast.success("Vitals recorded!");
  };

  const addNote = () => {
    if (!noteText.trim()) {
      toast.error("Please write a note.");
      return;
    }
    mockEMR.addDoctorNote(selectedPatient.id, noteText, user?.name || "Doctor");
    const updated = mockEMR.getByPatient(selectedPatient.id);
    setEmr(updated);
    setNoteText("");
    toast.success("Doctor note saved!");
  };

  const addDiagnosis = () => {
    if (!diagnosisForm.diagnosis.trim()) {
      toast.error("Enter diagnosis.");
      return;
    }
    mockEMR.addDiagnosis(selectedPatient.id, {
      ...diagnosisForm,
      doctor: user?.name || "Doctor",
    });
    const updated = mockEMR.getByPatient(selectedPatient.id);
    setEmr(updated);
    setDiagnosisForm({ diagnosis: "", status: "ongoing" });
    setShowDiagnosisForm(false);
    toast.success("Diagnosis added!");
  };

  const latestVitals = emr.vitals?.[0] || {};
  const tabs = ["vitals", "notes", "diagnosis", "history"];

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 inset-y-0 w-64 bg-gradient-to-l from-violet-600/20 to-transparent" />
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-2 relative">
          <Heart className="w-8 h-8 text-violet-400" /> Electronic Medical
          Records
        </h2>
        <p className="text-violet-200 font-medium relative">
          View and update patient vitals, diagnoses, and clinical notes.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Patient Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Select Patient
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {PATIENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPatient(p)}
                  className={`w-full px-4 py-4 text-left flex items-center gap-3 transition-colors ${selectedPatient.id === p.id ? "bg-violet-50 border-r-2 border-violet-500" : "hover:bg-slate-50"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${selectedPatient.id === p.id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                    <p className="text-xs text-slate-400">
                      {p.age}y · {p.gender} · {p.bloodGroup}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Summary */}
          <div className="mt-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-lg">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-slate-900">
                  {selectedPatient.name}
                </p>
                <p className="text-xs text-violet-600 font-bold">
                  {selectedPatient.age} yrs · {selectedPatient.gender}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                [
                  "Blood Group",
                  emr.bloodGroup || selectedPatient.bloodGroup || "—",
                ],
                ["Allergies", emr.allergies?.join(", ") || "None recorded"],
                [
                  "Conditions",
                  emr.chronicConditions?.join(", ") || "None recorded",
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                >
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {k}
                  </p>
                  <p className="font-bold text-sm text-slate-800 mt-0.5 truncate">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Latest Vitals Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <VitalCard
              label="Blood Pressure"
              value={latestVitals.bp}
              unit="mmHg"
              icon={Activity}
              color="bg-red-50 text-red-600"
            />
            <VitalCard
              label="Temperature"
              value={latestVitals.temp}
              unit="°F"
              icon={Thermometer}
              color="bg-orange-50 text-orange-600"
            />
            <VitalCard
              label="Heart Rate"
              value={latestVitals.pulse}
              unit="bpm"
              icon={Heart}
              color="bg-pink-50 text-pink-600"
            />
            <VitalCard
              label="SpO₂"
              value={latestVitals.spo2}
              unit="%"
              icon={Droplets}
              color="bg-blue-50 text-blue-600"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-4 text-sm font-bold capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? "border-violet-600 text-violet-700 bg-violet-50/50" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                >
                  {tab === "vitals"
                    ? "📊 Vitals"
                    : tab === "notes"
                      ? "📝 Notes"
                      : tab === "diagnosis"
                        ? "🩺 Diagnoses"
                        : "📋 Timeline"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Vitals Tab */}
              {activeTab === "vitals" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900">
                      Vitals History
                    </h4>
                    <button
                      onClick={() => setShowVitalForm(!showVitalForm)}
                      className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Vitals
                    </button>
                  </div>

                  <AnimatePresence>
                    {showVitalForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-violet-50 border border-violet-200 rounded-2xl p-4"
                      >
                        <p className="text-xs font-black text-violet-600 uppercase tracking-widest mb-3">
                          Record New Vitals
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { label: "BP (e.g. 120/80)", field: "bp" },
                            { label: "Temp (°F)", field: "temp" },
                            { label: "Pulse (bpm)", field: "pulse" },
                            { label: "SpO₂ (%)", field: "spo2" },
                            { label: "Weight (kg)", field: "weight" },
                            { label: "Height (cm)", field: "height" },
                          ].map(({ label, field }) => (
                            <div key={field}>
                              <label className="text-[10px] font-bold text-violet-700 uppercase tracking-widest block mb-1">
                                {label}
                              </label>
                              <input
                                type="text"
                                value={vitalForm[field]}
                                onChange={(e) =>
                                  setVitalForm({
                                    ...vitalForm,
                                    [field]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addVitals}
                          className="mt-3 bg-violet-600 text-white px-5 py-2 rounded-xl font-black text-sm hover:bg-violet-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Vitals
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {emr.vitals?.length === 0 ? (
                      <div className="py-10 text-center text-slate-400">
                        <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="font-bold">No vitals recorded yet.</p>
                      </div>
                    ) : (
                      emr.vitals.map((v, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-4 md:grid-cols-6 gap-3"
                        >
                          <div className="col-span-4 md:col-span-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              Date
                            </p>
                            <p className="font-black text-sm text-slate-800">
                              {v.date}
                            </p>
                          </div>
                          {[
                            ["BP", v.bp, "mmHg"],
                            ["Temp", v.temp, "°F"],
                            ["Pulse", v.pulse, "bpm"],
                            ["SpO₂", v.spo2, "%"],
                          ].map(([label, val, unit]) => (
                            <div key={label}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                {label}
                              </p>
                              <p className="font-black text-sm text-slate-800">
                                {val || "—"}{" "}
                                <span className="text-[10px] text-slate-400">
                                  {val ? unit : ""}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900">
                      Clinical Notes
                    </h4>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">
                      Add Note
                    </label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={4}
                      placeholder="Write clinical observation, treatment plan, or patient notes..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none text-sm"
                    />
                    <button
                      onClick={addNote}
                      className="mt-2 bg-violet-600 text-white px-5 py-2 rounded-xl font-black text-sm hover:bg-violet-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Note
                    </button>
                  </div>

                  <div className="space-y-3">
                    {emr.doctorNotes?.length === 0 ? (
                      <div className="py-10 text-center text-slate-400">
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="font-bold">No notes yet.</p>
                      </div>
                    ) : (
                      emr.doctorNotes.map((n, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center font-black text-xs">
                              {(n.doctorName || "D").charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800 text-sm">
                              {n.doctorName}
                            </span>
                            <span className="text-xs text-slate-400 ml-auto">
                              {n.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {n.note}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Diagnoses Tab */}
              {activeTab === "diagnosis" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900">Diagnoses</h4>
                    <button
                      onClick={() => setShowDiagnosisForm(!showDiagnosisForm)}
                      className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-violet-700"
                    >
                      <Plus className="w-4 h-4" /> Add Diagnosis
                    </button>
                  </div>

                  <AnimatePresence>
                    {showDiagnosisForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-violet-50 border border-violet-200 rounded-2xl p-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-violet-700 uppercase tracking-widest block mb-1">
                              Diagnosis
                            </label>
                            <input
                              value={diagnosisForm.diagnosis}
                              onChange={(e) =>
                                setDiagnosisForm({
                                  ...diagnosisForm,
                                  diagnosis: e.target.value,
                                })
                              }
                              placeholder="e.g. Type 2 Diabetes Mellitus"
                              className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-violet-700 uppercase tracking-widest block mb-1">
                              Status
                            </label>
                            <select
                              value={diagnosisForm.status}
                              onChange={(e) =>
                                setDiagnosisForm({
                                  ...diagnosisForm,
                                  status: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl font-bold text-sm outline-none"
                            >
                              <option value="ongoing">Ongoing</option>
                              <option value="resolved">Resolved</option>
                              <option value="chronic">Chronic</option>
                              <option value="monitoring">Monitoring</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={addDiagnosis}
                          className="mt-3 bg-violet-600 text-white px-5 py-2 rounded-xl font-black text-sm hover:bg-violet-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Add
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    {emr.diagnoses?.length === 0 ? (
                      <div className="py-10 text-center text-slate-400">
                        <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="font-bold">No diagnoses on record.</p>
                      </div>
                    ) : (
                      emr.diagnoses.map((d, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-black text-slate-900">
                              {d.diagnosis}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {d.doctor} · {d.date}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === "ongoing" ? "bg-amber-50 text-amber-700 border border-amber-200" : d.status === "resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                          >
                            {d.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* History/Timeline Tab */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900">
                    Treatment Timeline
                  </h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                    <div className="space-y-4 pl-10">
                      {[
                        ...(emr.doctorNotes || []).map((n) => ({
                          type: "note",
                          date: n.date,
                          label: "Doctor Note",
                          desc: n.note,
                          by: n.doctorName,
                          color: "bg-violet-500",
                        })),
                        ...(emr.diagnoses || []).map((d) => ({
                          type: "diagnosis",
                          date: d.date,
                          label: "New Diagnosis",
                          desc: d.diagnosis,
                          by: d.doctor,
                          color: "bg-blue-500",
                        })),
                        ...(emr.vitals || []).map((v) => ({
                          type: "vitals",
                          date: v.date,
                          label: "Vitals Recorded",
                          desc: `BP: ${v.bp} | Pulse: ${v.pulse} bpm | Temp: ${v.temp}°F`,
                          by: "Clinical Staff",
                          color: "bg-emerald-500",
                        })),
                      ]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((item, i) => (
                          <div key={i} className="relative">
                            <div
                              className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${item.color} ring-4 ring-white shadow-sm`}
                            />
                            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.color === "bg-violet-500" ? "bg-violet-50 text-violet-700" : item.color === "bg-blue-500" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
                                >
                                  {item.label}
                                </span>
                                <span className="text-xs text-slate-400 font-bold">
                                  {item.date}
                                </span>
                              </div>
                              <p className="font-bold text-slate-800 text-sm">
                                {item.desc}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                by {item.by}
                              </p>
                            </div>
                          </div>
                        ))}
                      {!emr.doctorNotes?.length &&
                        !emr.diagnoses?.length &&
                        !emr.vitals?.length && (
                          <div className="py-10 text-center text-slate-400">
                            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="font-bold">No history yet.</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
