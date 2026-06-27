/**
 * Ward Inventory — NovaCare Nurse
 * Request restocks for IV fluids, medicines, and bandages from the pharmacy.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  AlertCircle,
  Thermometer,
  Pill,
  Droplets,
  Bandage
} from "lucide-react";

const INITIAL_INVENTORY = [
  { id: 1, name: "Normal Saline (0.9%) 500ml", category: "Fluids", stock: 12, minStock: 20, icon: Droplets, unit: "bags" },
  { id: 2, name: "Paracetamol 500mg Tablets", category: "Medicine", stock: 140, minStock: 100, icon: Pill, unit: "strips" },
  { id: 3, name: "Disposable Syringes 5ml", category: "Supplies", stock: 45, minStock: 50, icon: Thermometer, unit: "pcs" },
  { id: 4, name: "Sterile Gauze Pads 4x4", category: "Supplies", stock: 15, minStock: 30, icon: Bandage, unit: "packs" },
  { id: 5, name: "Ringer's Lactate 500ml", category: "Fluids", stock: 8, minStock: 15, icon: Droplets, unit: "bags" },
  { id: 6, name: "Amoxicillin 250mg Capsules", category: "Medicine", stock: 85, minStock: 50, icon: Pill, unit: "strips" },
];

export default function WardInventory() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [cart, setCart] = useState({});

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const submitRequest = () => {
    if (Object.keys(cart).length === 0) {
      toast.error("Please add items to request first.");
      return;
    }
    
    // Simulate updating stock after request approved (for demo purposes)
    setInventory(prev => prev.map(item => {
      if (cart[item.id]) {
        return { ...item, stock: item.stock + cart[item.id] };
      }
      return item;
    }));
    
    setCart({});
    toast.success("Restock request sent to Pharmacy! 🚚");
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-800 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl text-white font-black tracking-tight flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-emerald-300" /> Ward Inventory
            </h2>
            <p className="text-emerald-200 font-medium">
              Monitor ward stock levels and request supplies from Central Pharmacy.
            </p>
          </div>
          
          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Pending Request</p>
              <p className="text-xl font-black">{totalItems} Items</p>
            </div>
            {totalItems > 0 && (
              <button onClick={submitRequest} className="ml-4 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Request
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {inventory.map((item, i) => {
          const isLow = item.stock < item.minStock;
          const Icon = item.icon;
          const requestedCount = cart[item.id] || 0;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-3xl p-6 border transition-all ${isLow ? 'border-red-200 shadow-md shadow-red-500/5' : 'border-slate-100 hover:shadow-md hover:border-emerald-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isLow ? 'bg-red-50 border-red-200 text-red-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${isLow ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {item.category}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.name}</h3>
              
              <div className="flex items-center gap-2 mb-5">
                <p className={`text-2xl font-black ${isLow ? 'text-red-600' : 'text-slate-700'}`}>{item.stock}</p>
                <p className="text-sm text-slate-500 font-medium">/ {item.minStock} {item.unit} min.</p>
                {isLow && <AlertCircle className="w-4 h-4 text-red-500 ml-1" />}
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wide">Request</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button onClick={() => removeFromCart(item.id)} disabled={requestedCount === 0} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${requestedCount > 0 ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'text-slate-300'}`}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-4 text-center font-black text-slate-800">{requestedCount}</span>
                  <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
