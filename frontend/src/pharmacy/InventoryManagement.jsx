import React, { useState } from "react";
import {
  useGetInventoryQuery,
  useAddMedicineMutation,
  useUpdateMedicineMutation,
} from "../services/pharmacyApi";
import { DashboardSkeleton } from "../shared/components/Loading";
import { showToast } from "../shared/utils/notifications";
import {
  Plus,
  Search,
  Package,
  AlertCircle,
  TrendingDown,
  ChevronRight,
  Calendar,
  Info,
  Layers,
  Boxes,
  Filter,
  Edit,
  ShieldCheck,
} from "lucide-react";

export default function InventoryManagement() {
  const { data: inventory, isLoading } = useGetInventoryQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (isLoading) return <DashboardSkeleton />;

  const filtered = (inventory || []).filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-10 pb-20 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Medicine Inventory
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Smart replenishment & logistics control.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group overflow-hidden bg-white/50 backdrop-blur-xl border border-slate-200 rounded-2xl flex items-center px-4 w-72 focus-within:w-80 transition-all duration-300 shadow-sm focus-within:ring-4 focus-within:ring-indigo-100">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-indigo-600 transition-colors shrink-0"
            />
            <input
              type="text"
              placeholder="Search SKU or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder-slate-400 px-3"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary no-underline flex items-center gap-2"
            style={{
              background: "#4F46E5",
              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)",
            }}
          >
            <Plus size={18} /> Add New SKU
          </button>
        </div>
      </div>

      {/* ── Status Banner ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Critical Stock",
            value: filtered.filter((i) => i.stock < 10).length,
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Expiring Soon",
            value: filtered.filter((i) => i.expiring).length,
            icon: Calendar,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Total SKUs",
            value: filtered.length,
            icon: Boxes,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Daily Outflow",
            value: "428",
            icon: TrendingDown,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-[32px] p-6 border border-white flex items-center justify-between shadow-sm`}
          >
            <div>
              <p className={`text-[28px] font-black leading-none ${s.color}`}>
                {s.value}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                {s.label}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <s.icon className={s.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Medical SKU
              </th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Category
              </th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Quantity
              </th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Standard Price
              </th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Status Check
              </th>
              <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Action Center
              </th>
            </tr>
          </thead>
          <tbody>
            {(filtered || []).map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
              >
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-white group-hover:text-indigo-600 shadow-sm">
                      <Package size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
                        {item.batchNo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-xs font-black text-slate-600 py-2.5 px-5 bg-slate-100 rounded-full border border-slate-200 uppercase tracking-widest">
                    {item.category}
                  </span>
                </td>
                <td className="p-8 text-sm font-black text-slate-900">
                  {item.stock} Units
                </td>
                <td className="p-8 text-sm font-black text-indigo-600">
                  ₹{item.price.toLocaleString()}
                </td>
                <td className="p-8">
                  {item.stock < 10 ? (
                    <span className="flex items-center gap-2 text-rose-600 font-black uppercase text-[10px] tracking-widest px-4 py-2 bg-rose-50 border border-rose-100 rounded-full w-fit animate-pulse">
                      <AlertCircle size={12} /> Critically Low
                    </span>
                  ) : item.stock < 50 ? (
                    <span className="flex items-center gap-2 text-amber-600 font-black uppercase text-[10px] tracking-widest px-4 py-2 bg-amber-50 border border-amber-100 rounded-full w-fit">
                      <Info size={12} /> Refill Soon
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full w-fit">
                      <ShieldCheck size={12} /> Optimal
                    </span>
                  )}
                </td>
                <td className="p-8">
                  <button className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg transition-all active:scale-90">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-40 flex flex-col items-center justify-center grayscale opacity-60">
            <Layers size={48} className="text-slate-200 mb-6" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              No medicine found matching criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
