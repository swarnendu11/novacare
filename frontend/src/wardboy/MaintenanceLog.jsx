/**
 * Maintenance & Repairs — NovaCare Wardboy
 * Log broken beds, faulty ACs, or plumbing issues in rooms so that facilities team can fix them.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Send,
  Building2,
  Clock,
  Settings
} from "lucide-react";

const INITIAL_TICKETS = [
  {
    id: "TKT-101",
    room: "F-204",
    issue: "Air Conditioning not cooling. Patient complaining of heat.",
    category: "Electrical",
    status: "pending",
    time: "10:30 AM",
    date: "Today"
  },
  {
    id: "TKT-102",
    room: "G-102",
    issue: "Bed motor jammed. Cannot raise the headrest.",
    category: "Furniture",
    status: "in-progress",
    time: "09:15 AM",
    date: "Today"
  },
  {
    id: "TKT-103",
    room: "ICU-03",
    issue: "Leaking faucet in the attached washroom.",
    category: "Plumbing",
    status: "resolved",
    time: "Yesterday",
    date: "Yesterday"
  }
];

const CATEGORY_COLORS = {
  "Electrical": "text-amber-600 bg-amber-50 border-amber-200",
  "Plumbing": "text-blue-600 bg-blue-50 border-blue-200",
  "Furniture": "text-indigo-600 bg-indigo-50 border-indigo-200",
  "Other": "text-slate-600 bg-slate-50 border-slate-200"
};

const STATUS_STYLE = {
  "pending": { text: "Pending", bg: "bg-red-50 text-red-600 border-red-200" },
  "in-progress": { text: "In Progress", bg: "bg-amber-50 text-amber-600 border-amber-200" },
  "resolved": { text: "Resolved", bg: "bg-emerald-50 text-emerald-600 border-emerald-200" }
};

export default function MaintenanceLog() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [showNew, setShowNew] = useState(false);
  const [newTicket, setNewTicket] = useState({ room: "", issue: "", category: "Electrical" });
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTicket.room || !newTicket.issue) {
      toast.error("Please fill all details.");
      return;
    }

    const created = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      ...newTicket,
      status: "pending",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      date: "Today"
    };

    setTickets([created, ...tickets]);
    setShowNew(false);
    setNewTicket({ room: "", issue: "", category: "Electrical" });
    toast.success("Maintenance ticket raised! 🛠️");
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-slate-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl text-white font-black tracking-tight flex items-center gap-3 mb-2">
              <Wrench className="w-8 h-8 text-slate-300" /> Maintenance & Repairs
            </h2>
            <p className="text-slate-300 font-medium">
              Log facility issues for the maintenance team to resolve.
            </p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-2 bg-white text-slate-800 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg"
          >
            {showNew ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showNew ? "View Tickets" : "Raise Ticket"}
          </button>
        </div>
      </div>

      {showNew ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Report an Issue
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Room / Ward Number</label>
                <input required value={newTicket.room} onChange={e => setNewTicket({...newTicket, room: e.target.value})} type="text" placeholder="e.g. F-205" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium text-slate-700">
                  <option value="Electrical">Electrical (AC, Lights, Plugs)</option>
                  <option value="Plumbing">Plumbing (Washroom, Leaks)</option>
                  <option value="Furniture">Furniture (Beds, Tables)</option>
                  <option value="Other">Other Facility Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Description</label>
              <textarea required value={newTicket.issue} onChange={e => setNewTicket({...newTicket, issue: e.target.value})} rows="3" placeholder="Describe the problem clearly..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all bg-slate-50 focus:bg-white text-sm resize-none"></textarea>
            </div>

            <div className="pt-2">
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all w-full md:w-auto justify-center shadow-lg shadow-slate-800/20">
                <Send className="w-4 h-4" /> Submit Ticket
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
            {[
              { key: "all", label: "All Tickets" },
              { key: "pending", label: "Pending" },
              { key: "in-progress", label: "In Progress" },
              { key: "resolved", label: "Resolved" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide ${filter === f.key ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => {
              const catStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS["Other"];
              const statStyle = STATUS_STYLE[t.status];
              
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{t.id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statStyle.bg}`}>
                      {statStyle.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="font-black text-lg text-slate-800">{t.room}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5 min-h-[40px]">
                    {t.issue}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${catStyle}`}>
                      {t.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {t.time}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="font-black text-slate-500">
                No tickets found for this filter.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
