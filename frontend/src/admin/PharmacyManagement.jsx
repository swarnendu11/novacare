import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Pill,
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  Package,
} from "lucide-react";
import Spinner from "../components/Spinner";

const categoriesList = [
  "Analgesic",
  "Antibiotic",
  "Antidiabetic",
  "Antihypertensive",
  "Antacid",
  "Antidepressant",
  "Antifungal",
  "Antiviral",
  "Multivitamin",
  "Gastrointestinal",
];
const manufacturersList = [
  "Cipla",
  "Sun Pharma",
  "Lupin",
  "Zydus",
  "Abbott",
  "Pfizer",
  "Novartis",
  "GSK",
  "Roche",
  "Sanofi",
];
const medsList = [
  "Paracetamol",
  "Amoxicillin",
  "Metformin",
  "Amlodipine",
  "Pantoprazole",
  "Sertraline",
  "Ibuprofen",
  "Omeprazole",
  "Gabapentin",
  "Metoprolol",
  "Lisinopril",
  "Simvastatin",
  "Clopidogrel",
  "Furosemide",
  "Hydralazine",
  "Warfarin",
  "Diazepam",
  "Levothyroxine",
  "Prednisone",
  "Alprazolam",
];
const strengthsList = [
  "5mg",
  "10mg",
  "20mg",
  "50mg",
  "100mg",
  "250mg",
  "500mg",
];

const generateInitialMedicines = (count) => {
  const list = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const name =
      medsList[i % medsList.length] +
      " " +
      strengthsList[i % strengthsList.length];
    const expMonth = Math.floor(Math.random() * 12) + 1;
    const expYear =
      now.getFullYear() +
      (Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 3) + 1);
    list.push({
      id: i,
      name: name,
      manufacturer: manufacturersList[i % manufacturersList.length],
      expiry: `${expYear}-${String(expMonth).padStart(2, "0")}`,
      stock: Math.floor(Math.random() * 1200),
      price: Math.floor(Math.random() * 150) + 5,
      category: categoriesList[i % categoriesList.length],
    });
  }
  return list;
};

const INITIAL_MEDICINES = generateInitialMedicines(500);

export default function PharmacyManagement() {
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    expiry: "",
    stock: "",
    price: "",
    category: "",
  });

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      manufacturer: "",
      expiry: "",
      stock: "",
      price: "",
      category: "",
    });
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      name: m.name,
      manufacturer: m.manufacturer,
      expiry: m.expiry,
      stock: m.stock,
      price: m.price,
      category: m.category,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      if (editing) {
        setMedicines((prev) =>
          prev.map((m) =>
            m.id === editing.id
              ? {
                  ...m,
                  ...form,
                  stock: Number(form.stock),
                  price: Number(form.price),
                }
              : m,
          ),
        );
        toast.success("Medicine updated!");
      } else {
        setMedicines((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...form,
            stock: Number(form.stock),
            price: Number(form.price),
          },
        ]);
        toast.success("Medicine added to inventory!");
      }
      setModalOpen(false);
      setSubmitting(false);
    }, 500);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Remove "${name}" from inventory?`)) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    toast.success("Medicine removed");
  };

  const now = new Date();
  const isExpired = (expiry) => new Date(expiry + "-01") < now;
  const isLowStock = (stock) => stock > 0 && stock < 100;
  const isOutOfStock = (stock) => stock === 0;

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-teal-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Pill className="w-8 h-8 text-teal-400" /> Pharmacy
          </h2>
          <p className="text-teal-200 font-medium">
            Manage medicine inventory, stock levels, and expiry dates.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-2xl font-black text-white">{medicines.length}</p>
            <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest mt-1">
              Total Medicines
            </p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-md rounded-2xl p-4 border border-orange-500/30 text-center">
            <p className="text-2xl font-black text-orange-300">
              {
                medicines.filter(
                  (m) =>
                    isLowStock(m.stock) ||
                    isOutOfStock(m.stock) ||
                    isExpired(m.expiry),
                ).length
              }
            </p>
            <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mt-1">
              Need Attention
            </p>
          </div>
          <button
            onClick={openAdd}
            className="px-6 py-3 bg-white text-teal-900 font-black rounded-xl hover:bg-teal-50 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine, manufacturer, category..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50 font-bold transition-all"
          />
        </div>
      </div>

      {/* Medicine Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filtered.map((m) => {
            const expired = isExpired(m.expiry);
            const outOfStock = isOutOfStock(m.stock);
            const lowStock = isLowStock(m.stock);
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-3xl p-6 border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative flex flex-col ${expired ? "border-red-200" : lowStock || outOfStock ? "border-orange-200" : "border-slate-200"}`}
              >
                {/* Status badge */}
                {(expired || outOfStock || lowStock) && (
                  <div
                    className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${expired ? "bg-red-50 text-red-700 border border-red-200" : outOfStock ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {expired
                      ? "Expired"
                      : outOfStock
                        ? "Out of Stock"
                        : "Low Stock"}
                  </div>
                )}

                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 border border-teal-100">
                  <Pill className="w-6 h-6 text-teal-600" />
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                  {m.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 mb-4">
                  {m.manufacturer} · {m.category}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5 flex-1">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Stock
                    </p>
                    <p
                      className={`font-black text-lg mt-0.5 ${outOfStock ? "text-slate-400" : lowStock ? "text-orange-600" : "text-teal-700"}`}
                    >
                      {m.stock}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Price
                    </p>
                    <p className="font-black text-lg mt-0.5 text-slate-900">
                      ₹{m.price}
                    </p>
                  </div>
                </div>

                <div
                  className={`text-xs font-bold py-2 px-3 rounded-xl mb-4 ${expired ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-slate-500 border border-slate-100"}`}
                >
                  Expiry: {m.expiry}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEdit(m)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.name)}
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

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-black text-slate-700 text-lg">
            No medicines found
          </p>
        </div>
      )}

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
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Pill className="w-6 h-6 text-teal-500" />{" "}
                  {editing ? "Edit Medicine" : "Add Medicine"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                    placeholder="e.g. Paracetamol 500mg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={form.manufacturer}
                      onChange={(e) =>
                        setForm({ ...form, manufacturer: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                      placeholder="e.g. Antibiotic"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Expiry (YYYY-MM)
                    </label>
                    <input
                      type="month"
                      value={form.expiry}
                      onChange={(e) =>
                        setForm({ ...form, expiry: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                      min="0"
                      step="0.5"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-black hover:bg-teal-700 disabled:opacity-60 transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : editing ? (
                      "Save Changes"
                    ) : (
                      "Add Medicine"
                    )}
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
