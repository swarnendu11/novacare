/**
 * POSBilling — Point of Sale fulfillment for Medicines.
 * Features clinical-grade checkout, split layout, and real-time total calculation.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  CreditCard,
  CheckCircle2,
  User,
  Stethoscope,
  Pill,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";

const MOCK_CART = [
  { id: 1, name: "Paracetamol 500mg", price: 45, qty: 2, brand: "Calpol" },
  { id: 2, name: "Amoxicillin 250mg", price: 120, qty: 1, brand: "Mox" },
];

const BillingItem = ({ item, i, onUpdate }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05 }}
    className="flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
        <Pill size={18} />
      </div>
      <div>
        <p className="text-sm font-black text-slate-800">{item.name}</p>
        <p className="text-[10px] font-bold text-slate-400">{item.brand}</p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3 p-1 bg-slate-50 rounded-xl">
        <button
          className="p-1.5 hover:bg-white rounded-lg transition-all"
          onClick={() => onUpdate(item.id, -1)}
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-black text-slate-700 w-4 text-center">
          {item.qty}
        </span>
        <button
          className="p-1.5 hover:bg-white rounded-lg transition-all"
          onClick={() => onUpdate(item.id, 1)}
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="flex flex-col items-end min-w-[60px]">
        <span className="text-[10px] font-black text-slate-300">
          ₹{item.price * item.qty}
        </span>
        <button
          onClick={() => onUpdate(item.id, -item.qty)}
          className="text-rose-400 hover:text-rose-600 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function POSBilling() {
  const [activePatient, setActivePatient] = useState("John Doe (IPD7412)");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = MOCK_CART.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Transaction Finished! Billing sync in progress.", {
        icon: "✅",
        style: {
          borderRadius: "24px",
          background: "#0F172A",
          color: "#fff",
          fontWeight: 800,
        },
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-140px)] animate-fade-in">
      {/* Search & Selection Area (Left) */}
      <div className="xl:col-span-7 flex flex-col space-y-8 overflow-hidden">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            POS Terminal
          </h1>
          <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] shadow-premium border border-black/5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Active Patient
              </p>
              <h3 className="text-lg font-black text-slate-800">
                {activePatient}
              </h3>
            </div>
            <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[40px] shadow-heavy border border-black/5 p-8 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Plus size={18} />
              </span>{" "}
              Add Items
            </h2>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name or batch..."
                className="pl-12 pr-6 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {/* Recommendations or common medicines */}
            {[
              { id: 10, name: "Dolo 650mg", price: 28, stock: 450 },
              { id: 11, name: "Allegra 120mg", price: 180, stock: 120 },
              { id: 12, name: "Omez 20mg", price: 90, stock: 340 },
              { id: 13, name: "Saridon", price: 15, stock: 890 },
            ].map((m) => (
              <button
                key={m.id}
                className="w-full text-left p-4 rounded-3xl border border-dashed border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/20 transition-all flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700">
                      {m.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      Stock: {m.stock} Units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800">
                    ₹{m.price}
                  </p>
                  <p className="text-[9px] font-black uppercase text-blue-500">
                    + Click to Add
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Billing Summary (Right) */}
      <div className="xl:col-span-5 flex flex-col h-full space-y-6">
        <div className="flex-1 flex flex-col bg-slate-900 rounded-[48px] shadow-heavy border border-white/5 p-10 text-white overflow-hidden relative">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-1" />

          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
              <span className="p-2.5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/40">
                <CreditCard size={20} />
              </span>{" "}
              Order Summary
            </h2>
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
              {MOCK_CART.length} Products
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-8">
            {MOCK_CART.map((item, i) => (
              <BillingItem
                key={item.id}
                item={item}
                i={i}
                onUpdate={() => {}}
              />
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-8 space-y-6 border border-white/5 shadow-2xl">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Subtotal
                </span>
                <span className="text-sm font-black text-white">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Total GST (12%)
                </span>
                <span className="text-sm font-bold text-blue-400">
                  + ₹{tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-base font-black text-white">
                  Total Amount
                </span>
                <span className="text-3xl font-black text-gradient from-blue-400 via-white to-blue-400">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02] transition-all active:scale-95 text-xs flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                "Synchronizing..."
              ) : (
                <>
                  Proceed to Checkout <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-8 opacity-40">
              <CreditCard size={24} />
              <TrendingUp size={24} />
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
