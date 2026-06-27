import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  UserPlus,
  FileSignature,
  Stethoscope,
  Droplets,
  Clock,
} from "lucide-react";

export default function PatientRecords() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const mockPatients = [
    {
      id: 3,
      name: "John Patient",
      age: 34,
      gender: "Male",
      bloodGroup: "O+",
      allergies: "Penicillin",
      lastVisit: "2023-10-15",
      condition: "Hypertension",
    },
    {
      id: 5,
      name: "Alice Brown",
      age: 28,
      gender: "Female",
      bloodGroup: "A-",
      allergies: "None",
      lastVisit: "2023-10-20",
      condition: "Acne Vulgaris",
    },
    {
      id: 7,
      name: "Carol Davis",
      age: 45,
      gender: "Female",
      bloodGroup: "B+",
      allergies: "Sulfa Drugs",
      lastVisit: "2023-10-22",
      condition: "Migraine",
    },
  ];

  const filtered = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="font-sans pb-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      {/* Patient List Sidebar */}
      <div className="lg:w-1/3 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-900 text-xl mb-4">
            Patient List
          </h3>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPatient(p)}
              className={`p-5 cursor-pointer transition-colors flex items-center gap-4 ${selectedPatient?.id === p.id ? "bg-blue-50/50 border-l-4 border-blue-600" : "hover:bg-slate-50 border-l-4 border-transparent"}`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
                {p.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{p.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  Last Visit: {p.lastVisit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Detail Panel */}
      <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedPatient ? (
            <motion.div
              key={selectedPatient.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-500/30">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                      {selectedPatient.age} yrs • {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <FileSignature className="w-4 h-4" /> New Rx
                </button>
              </div>

              {/* Body */}
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Blood Group
                    </p>
                    <p className="text-xl font-black text-red-600 mt-1">
                      {selectedPatient.bloodGroup}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> Allergies
                    </p>
                    <p className="text-lg font-black text-orange-600 mt-1 truncate">
                      {selectedPatient.allergies}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 col-span-2">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Main Health Issue
                    </p>
                    <p className="text-lg font-black text-blue-600 mt-1 truncate">
                      {selectedPatient.condition}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" /> Past Visits
                </h3>
                <div className="space-y-6 relative before:content-[''] before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
                  {[1, 2, 3].map((item, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600 z-10" />
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                          Oct {20 - idx}, 2023
                        </p>
                        <h4 className="font-extrabold text-slate-900 text-lg">
                          Follow-up Consultation
                        </h4>
                        <p className="text-slate-600 font-medium mt-2 leading-relaxed">
                          Patient reported improved symptoms. Blood pressure
                          stabilized. Continued current medication dosage for
                          another 30 days.
                        </p>
                        <button className="mt-4 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                          <FileText className="w-4 h-4" /> View Prescription
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                <UserPlus className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                Select a Patient
              </h3>
              <p className="text-slate-500 font-medium max-w-sm">
                Tap on a patient from the directory on the left to view their
                detailed medical timeline and vital records.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
