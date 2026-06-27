import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

const ROOM_TYPES = [
  "General",
  "Private",
  "Semi-Private",
  "ICU",
  "Emergency",
  "OT",
];

const INITIAL_ROOMS = [
  {
    id: 1,
    roomNumber: "101",
    type: "General",
    beds: 4,
    occupied: 3,
    dailyCharge: 800,
    floor: 1,
  },
  {
    id: 2,
    roomNumber: "102",
    type: "General",
    beds: 4,
    occupied: 4,
    dailyCharge: 800,
    floor: 1,
  },
  {
    id: 3,
    roomNumber: "201",
    type: "Private",
    beds: 1,
    occupied: 1,
    dailyCharge: 3000,
    floor: 2,
  },
  {
    id: 4,
    roomNumber: "202",
    type: "Private",
    beds: 1,
    occupied: 0,
    dailyCharge: 3000,
    floor: 2,
  },
  {
    id: 5,
    roomNumber: "ICU-01",
    type: "ICU",
    beds: 6,
    occupied: 4,
    dailyCharge: 8000,
    floor: 3,
  },
  {
    id: 6,
    roomNumber: "ICU-02",
    type: "ICU",
    beds: 6,
    occupied: 2,
    dailyCharge: 8000,
    floor: 3,
  },
  {
    id: 7,
    roomNumber: "301",
    type: "Semi-Private",
    beds: 2,
    occupied: 1,
    dailyCharge: 1500,
    floor: 3,
  },
  {
    id: 8,
    roomNumber: "EM-01",
    type: "Emergency",
    beds: 8,
    occupied: 5,
    dailyCharge: 5000,
    floor: 0,
  },
];

const TYPE_COLORS = {
  General: "bg-blue-50 text-blue-700 border-blue-200",
  Private: "bg-purple-50 text-purple-700 border-purple-200",
  "Semi-Private": "bg-teal-50 text-teal-700 border-teal-200",
  ICU: "bg-red-50 text-red-700 border-red-200",
  Emergency: "bg-orange-50 text-orange-700 border-orange-200",
  OT: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    roomNumber: "",
    type: "General",
    beds: 1,
    occupied: 0,
    dailyCharge: 1000,
    floor: 1,
  });

  const totalBeds = rooms.reduce((a, r) => a + r.beds, 0);
  const occupiedBeds = rooms.reduce((a, r) => a + r.occupied, 0);
  const availableBeds = totalBeds - occupiedBeds;

  const filtered = rooms.filter((r) => {
    const matchSearch =
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || r.type === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      roomNumber: "",
      type: "General",
      beds: 1,
      occupied: 0,
      dailyCharge: 1000,
      floor: 1,
    });
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      roomNumber: r.roomNumber,
      type: r.type,
      beds: r.beds,
      occupied: r.occupied,
      dailyCharge: r.dailyCharge,
      floor: r.floor,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      beds: Number(form.beds),
      occupied: Number(form.occupied),
      dailyCharge: Number(form.dailyCharge),
      floor: Number(form.floor),
    };
    if (data.occupied > data.beds) {
      toast.error("Occupied cannot exceed total beds!");
      return;
    }
    if (editing) {
      setRooms((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)),
      );
      toast.success("Room updated!");
    } else {
      setRooms((prev) => [...prev, { id: Date.now(), ...data }]);
      toast.success("Room added!");
    }
    setModalOpen(false);
  };

  const handleDelete = (id, num) => {
    if (!window.confirm(`Delete Room ${num}?`)) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast.success("Room removed");
  };

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-rose-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <BedDouble className="w-8 h-8 text-rose-400" /> Rooms & Beds
          </h2>
          <p className="text-rose-200 font-medium">
            Track hospital rooms, bed occupancy, and availability.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          {[
            { label: "Total Beds", value: totalBeds, color: "text-white" },
            { label: "Occupied", value: occupiedBeds, color: "text-rose-300" },
            {
              label: "Available",
              value: availableBeds,
              color: "text-emerald-300",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[90px]"
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-rose-200 uppercase tracking-widest mt-1">
                {s.label}
              </p>
            </div>
          ))}
          {/* Occupancy bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px]">
            <p className="text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-2">
              Occupancy Rate
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 mb-1">
              <div
                className="bg-rose-400 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.round((occupiedBeds / totalBeds) * 100)}%`,
                }}
              />
            </div>
            <p className="text-lg font-black text-white">
              {Math.round((occupiedBeds / totalBeds) * 100)}%
            </p>
          </div>
          <button
            onClick={openAdd}
            className="px-6 py-3 bg-white text-rose-900 font-black rounded-xl hover:bg-rose-50 shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Room
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room number or type..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/50 font-bold transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...ROOM_TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${filterType === t ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filtered.map((r) => {
            const pct =
              r.beds > 0 ? Math.round((r.occupied / r.beds) * 100) : 0;
            const isFull = r.occupied >= r.beds;
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Room {r.roomNumber}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      Floor {r.floor}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${TYPE_COLORS[r.type]}`}
                  >
                    {r.type}
                  </span>
                </div>

                {/* Bed occupancy bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>
                      {r.occupied} / {r.beds} beds
                    </span>
                    <span
                      className={isFull ? "text-rose-600" : "text-emerald-600"}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-orange-400" : "bg-emerald-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5 flex-1">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Beds
                    </p>
                    <p className="font-black text-lg text-slate-900 mt-0.5">
                      {r.beds}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Daily Rate
                    </p>
                    <p className="font-black text-lg text-slate-900 mt-0.5">
                      ₹{r.dailyCharge.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl mb-4 ${isFull ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
                >
                  {isFull ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="text-xs font-black">
                    {isFull
                      ? "Fully Occupied"
                      : `${r.beds - r.occupied} bed(s) available`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.roomNumber)}
                    className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <BedDouble className="w-6 h-6 text-rose-500" />{" "}
                  {editing ? "Edit Room" : "Add Room"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={form.roomNumber}
                      onChange={(e) =>
                        setForm({ ...form, roomNumber: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/30 outline-none font-bold text-slate-900 transition-all"
                      placeholder="e.g. 201"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Room Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/30 outline-none font-bold text-slate-900 transition-all"
                    >
                      {ROOM_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Beds", field: "beds" },
                    { label: "Occupied", field: "occupied" },
                    { label: "Floor", field: "floor" },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                        {label}
                      </label>
                      <input
                        type="number"
                        value={form[field]}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/30 outline-none font-bold text-slate-900 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Daily Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={form.dailyCharge}
                    onChange={(e) =>
                      setForm({ ...form, dailyCharge: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/30 outline-none font-bold text-slate-900 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black hover:bg-rose-700 transition-colors shadow-lg"
                  >
                    {editing ? "Save Changes" : "Add Room"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
