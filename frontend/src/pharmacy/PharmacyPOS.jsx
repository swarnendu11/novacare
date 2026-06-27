import React, { useState } from "react";
import {
  useGetInventoryQuery,
  useProcessSaleMutation,
} from "../services/pharmacyApi";
import { showToast } from "../shared/utils/notifications";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  IndianRupee,
  Package,
  CreditCard,
  ShieldCheck,
  Activity,
  User,
  ArrowRight,
} from "lucide-react";

export default function PharmacyPOS() {
  const { data: inventory, isLoading } = useGetInventoryQuery();
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [processSale] = useProcessSaleMutation();
  const [patient, setPatient] = useState({ name: "", id: "" });

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      if (existing.qty >= item.stock) {
        showToast("Insufficient stock available", "error");
        return;
      }
      setCart(
        cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((c) => c.id !== id));

  const updateQty = (id, delta) => {
    setCart(
      cart.map((c) => {
        if (c.id === id) {
          const newQty = Math.max(1, Math.min(c.qty + delta, c.stock));
          if (newQty === c.stock && delta > 0)
            showToast("Max stock reached", "info");
          return { ...c, qty: newQty };
        }
        return c;
      }),
    );
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const tax = subtotal * 0.12; // 12% GST
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!patient.name) return showToast("Please enter patient name", "error");
    if (cart.length === 0) return showToast("Cart is empty", "error");

    try {
      await processSale({ patient, cart, total }).unwrap();
      showToast("Transaction completed successfully", "success");
      setCart([]);
      setPatient({ name: "", id: "" });
    } catch (err) {
      showToast("Payment processing failed", "error");
    }
  };

  const filtered = (inventory || []).filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) && i.stock > 0,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-10 pb-20 animate-fade-in relative min-h-[calc(100vh-140px)]">
      {/* ── POS Selection (Left) ── */}
      <div className="flex-1 flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Point of Sale
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Dispensing and revenue collection.
            </p>
          </div>

          <div className="relative group overflow-hidden bg-white/50 backdrop-blur-xl border border-slate-200 rounded-2xl flex items-center px-4 w-72 focus-within:w-80 transition-all duration-300 shadow-sm focus-within:ring-4 focus-within:ring-indigo-100">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-indigo-600 shrink-0"
            />
            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 bg-transparent text-sm font-bold text-slate-800 focus:outline-none placeholder-slate-400 px-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all text-left flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 mb-6 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Package size={22} />
              </div>
              <h3 className="text-sm font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">
                {item.name}
              </h3>
              <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">
                {item.category}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">
                  ₹{item.price.toLocaleString()}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                    item.stock < 20
                      ? "text-amber-600 bg-amber-50 border-amber-100"
                      : "text-slate-400 bg-slate-50 border-slate-100"
                  }`}
                >
                  {item.stock} in stock
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Transaction Details (Right Side Fixed Panel) ── */}
      <div className="w-full lg:w-[450px] flex flex-col gap-6">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 sticky top-28">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Active Cart
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {cart.length} items staged
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex flex-col gap-4 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              <User size={14} className="text-indigo-500" /> Patient Target
            </div>
            <input
              type="text"
              placeholder="Patient Name / PID..."
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              className="w-full bg-white rounded-2xl border-none px-5 py-4 text-sm font-black text-slate-800 placeholder-slate-300 shadow-sm focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Cart Items */}
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto mb-10 pr-2 scrollbar-hide">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    ₹{item.price} / unit
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-black text-slate-900 w-6 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-10 h-10 rounded-xl hover:bg-rose-50 text-slate-200 hover:text-rose-500 transition-all flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center grayscale opacity-40">
                <Activity size={32} className="text-slate-200 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Cart is empty
                </p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-4 pt-10 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-900">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-400">
              <span>GST (12%)</span>
              <span className="text-slate-900">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-base font-black text-slate-900 uppercase tracking-widest">
                Final Total
              </span>
              <span className="text-3xl font-black text-indigo-600">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] mt-10 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
          >
            <div className="flex items-center justify-center gap-3">
              <CreditCard size={18} /> Complete Fulfillment{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </button>

          <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-40">
            <ShieldCheck size={14} />{" "}
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Authorized Transaction Vector
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
