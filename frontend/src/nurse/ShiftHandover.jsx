/**
 * Shift Handover — NovaCare Nurse
 * Facilitates the transfer of crucial patient information and pending tasks between shifts.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Users,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle2,
  Plus,
  Send,
  MessageSquare
} from "lucide-react";

const INITIAL_HANDOVERS = [
  {
    id: 1,
    patient: "John Patient",
    room: "G-101",
    note: "BP was slightly elevated in the morning. Keep an eye on his SpO2 levels. Last dose of Amlodipine given at 10 AM.",
    priority: "high",
    from: "Nurse Sarah (Morning)",
    time: "02:00 PM",
    read: false,
  },
  {
    id: 2,
    patient: "Alice Brown",
    room: "F-204",
    note: "IV line changed at 11 AM. Patient complained of mild nausea after lunch, informed Dr. Kiran. Pending wound dressing.",
    priority: "medium",
    from: "Nurse Sarah (Morning)",
    time: "02:15 PM",
    read: true,
  },
  {
    id: 3,
    patient: "Bob Wilson",
    room: "ICU-01",
    note: "Stable overnight. Family visited at 1 PM. Scheduled for a CT scan at 4 PM, please ensure transport is ready.",
    priority: "critical",
    from: "Nurse Mike (Night)",
    time: "08:00 AM",
    read: true,
  }
];

const PRIORITY_CONFIG = {
  critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", badge: "bg-red-500" },
  high: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-500" },
  medium: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", badge: "bg-blue-500" },
  low: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", badge: "bg-slate-500" },
};

export default function ShiftHandover() {
  const [handovers, setHandovers] = useState(INITIAL_HANDOVERS);
  const [filter, setFilter] = useState("unread");
  const [showNew, setShowNew] = useState(false);
  const [newNote, setNewNote] = useState({ patient: "", room: "", note: "", priority: "medium" });

  const unread = handovers.filter((h) => !h.read);
  const read = handovers.filter((h) => h.read);
  const filtered = filter === "unread" ? unread : filter === "read" ? read : handovers;

  const markAsRead = (id) => {
    setHandovers((prev) => prev.map((h) => (h.id === id ? { ...h, read: true } : h)));
    toast.success("Handover acknowledged ✅");
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newNote.patient || !newNote.note) {
      toast.error("Please fill required fields.");
      return;
    }
    const created = {
      id: Date.now(),
      ...newNote,
      from: "Nurse (You)",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      read: true // Assuming notes you create are acknowledged
    };
    setHandovers([created, ...handovers]);
    setShowNew(false);
    setNewNote({ patient: "", room: "", note: "", priority: "medium" });
    toast.success("Handover note added!");
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl text-white font-black tracking-tight flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-indigo-300" /> Shift Handover
            </h2>
            <p className="text-indigo-200 font-medium">
              Review notes from the previous shift and pass on info to the next.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowNew(!showNew)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-500/30"
            >
              {showNew ? <MessageSquare className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showNew ? "View Notes" : "New Note"}
            </button>
          </div>
        </div>
      </div>

      {showNew ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Create Handover Note
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Name</label>
                <input required value={newNote.patient} onChange={e => setNewNote({...newNote, patient: e.target.value})} type="text" placeholder="e.g. Michael Scott" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Room / Bed</label>
                <input required value={newNote.room} onChange={e => setNewNote({...newNote, room: e.target.value})} type="text" placeholder="e.g. ICU-04" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
              <div className="flex gap-3 flex-wrap">
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <button key={p} type="button" onClick={() => setNewNote({...newNote, priority: p})} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${newNote.priority === p ? PRIORITY_CONFIG[p].bg + ' ' + PRIORITY_CONFIG[p].border + ' ' + PRIORITY_CONFIG[p].text : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Handover Details</label>
              <textarea required value={newNote.note} onChange={e => setNewNote({...newNote, note: e.target.value})} rows="4" placeholder="Detail the pending treatments, vitals trends, and patient requests..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm resize-none"></textarea>
            </div>

            <div className="pt-2">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all w-full md:w-auto justify-center shadow-lg shadow-indigo-600/30">
                <Send className="w-4 h-4" /> Submit Handover
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
            {[
              { key: "unread", label: "Needs Acknowledgment", count: unread.length },
              { key: "read", label: "Acknowledged", count: read.length },
              { key: "all", label: "All Notes", count: handovers.length },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${filter === f.key ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
              >
                {f.label} <span className={`ml-1 px-1.5 py-0.5 rounded-md ${filter === f.key ? 'bg-indigo-100' : 'bg-slate-100'}`}>{f.count}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((h, i) => {
              const pc = PRIORITY_CONFIG[h.priority] || PRIORITY_CONFIG.medium;
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-2xl border p-6 transition-all relative overflow-hidden ${h.read ? "border-slate-200 opacity-80" : "border-indigo-100 shadow-lg shadow-indigo-500/5 hover:-translate-y-1"}`}
                >
                  {!h.read && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-lg text-slate-800">{h.patient}</span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{h.room}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${pc.bg} ${pc.text} ${pc.border}`}>
                          {h.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        "{h.note}"
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5 text-slate-500"><UserIcon /> {h.from}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {h.time}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center md:items-end flex-col gap-3 justify-center md:h-full">
                      {!h.read ? (
                        <button onClick={() => markAsRead(h.id)} className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-black transition-all w-full md:w-auto justify-center">
                          <CheckCircle2 className="w-4 h-4" /> Acknowledge
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4" /> Acknowledged
                        </span>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="font-black text-slate-500">
                  No handover notes found in this category.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function UserIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
