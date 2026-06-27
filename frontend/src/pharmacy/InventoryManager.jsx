/**
 * InventoryManager — Real-time medicine stock and logistics tracking.
 * Features medicine cards, expiry tracking, and category filtering.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Layers,
  FilterIcon,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import toast from "react-hot-toast";

const MOCK_INVENTORY = [
  {
    id: 1,
    name: "Paracetamol",
    brand: "Calpol",
    dosage: "500mg",
    category: "Analgesic",
    stock: 124,
    min: 100,
    expiry: "2025-12-10",
    price: 45,
    status: "healthy",
  },
  {
    id: 2,
    name: "Amoxicillin",
    brand: "Mox",
    dosage: "250mg",
    category: "Antibiotic",
    stock: 45,
    min: 50,
    expiry: "2024-08-15",
    price: 120,
    status: "low",
  },
  {
    id: 3,
    name: "Azithromycin",
    brand: "Azee",
    dosage: "500mg",
    category: "Antibiotic",
    stock: 8,
    min: 20,
    expiry: "2024-06-20",
    price: 85,
    status: "critical",
  },
  {
    id: 4,
    name: "Cetrizine",
    brand: "Zyrtec",
    dosage: "10mg",
    category: "Antihistamine",
    stock: 320,
    min: 100,
    expiry: "2026-03-12",
    price: 30,
    status: "healthy",
  },
  {
    id: 5,
    name: "Metformin",
    brand: "Glycomet",
    dosage: "500mg",
    category: "Antidiabetic",
    stock: 540,
    min: 200,
    expiry: "2025-05-30",
    price: 75,
    status: "healthy",
  },
  {
    id: 6,
    name: "Amlodipine",
    brand: "Amlokind",
    dosage: "5mg",
    category: "Antihypertensive",
    stock: 15,
    min: 80,
    expiry: "2024-05-10",
    price: 60,
    status: "low",
  },
];

const CategoryChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
        : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
    }`}
  >
    {label}
  </button>
);

const MedicineCard = ({ med, i }) => {
  const isExpiring =
    new Date(med.expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const statusColor =
    med.status === "critical"
      ? "rose"
      : med.status === "low"
        ? "amber"
        : "emerald";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      whileHover={{ y: -5 }}
      className={`card-premium p-6 group ${med.status === "critical" ? "glow-rose" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl bg-${statusColor}-50 text-${statusColor}-600 group-hover:bg-${statusColor}-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-${statusColor}-500/10`}
        >
          <Package size={20} />
        </div>
        <div className="flex flex-col items-end gap-2">
          {isExpiring && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold uppercase border border-amber-100 animate-pulse">
              <Calendar size={10} /> Near Expiry
            </span>
          )}
          <span
            className={`badge-premium badge-premium-${med.status === "healthy" ? "success" : med.status === "low" ? "pending" : "pending"} !text-xs !py-1`}
          >
            {med.stock} Left
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-black tracking-tight text-slate-800">
            {med.name}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {med.category}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-400">
          {med.brand} • {med.dosage}
        </p>
      </div>

      <div className="space-y-4">
        {/* Progress Bar for Stock */}
        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((med.stock / med.min) * 100, 100)}%`,
            }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className={`h-full bg-${statusColor}-500`}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
              Unit Price
            </span>
            <span className="text-sm font-black text-slate-800">
              ₹{med.price}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Edit2 size={16} />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function InventoryManager() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Analgesic",
    "Antibiotic",
    "Antihistamine",
    "Antidiabetic",
    "Antihypertensive",
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Medicine Inventory
          </h1>
          <p className="text-slate-500 font-bold">
            Ensuring{" "}
            <span className="text-amber-600">continuous clinical supply</span>{" "}
            across 12,402 SKUs.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter by name, brand or batch..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[28px] text-sm font-bold shadow-sm focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <button className="btn-premium whitespace-nowrap">
            <Plus size={18} /> New Medicine
          </button>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
        <CategoryChip
          label="All"
          active={activeCategory === "All"}
          onClick={() => setActiveCategory("All")}
        />
        {categories.slice(1).map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {MOCK_INVENTORY.map((med, i) => (
          <MedicineCard key={med.id} med={med} i={i} />
        ))}
      </div>

      {/* Pagination Container (Mock) */}
      <div className="flex justify-center pt-10">
        <button className="px-10 py-4 bg-white border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest rounded-3xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
          Load 24 More Meds
        </button>
      </div>
    </div>
  );
}
