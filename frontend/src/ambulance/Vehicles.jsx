/**
 * NovaCare Ambulance — Vehicles
 * Ambulance fleet management with status, maintenance, and assignments
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Ambulance,
  CheckCircle2,
  Droplets,
  Filter,
  Fuel,
  Gauge,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { ambulanceApi } from "../services/mockData";
import Spinner from "../components/Spinner";

// Status Badge
function StatusBadge({ status }) {
  const styles = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "on-call": "bg-blue-100 text-blue-700 border-blue-200",
    "en-route": "bg-blue-100 text-blue-700 border-blue-200",
    maintenance: "bg-amber-100 text-amber-700 border-amber-200",
    offline: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const labels = {
    available: "Available",
    "on-call": "On Call",
    "en-route": "En Route",
    maintenance: "Maintenance",
    offline: "Offline",
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[status] || styles.offline}`}>
      {labels[status] || status}
    </span>
  );
}

// Ambulance Card
function AmbulanceCard({ ambulance, onClick }) {
  const fuelColor = ambulance.fuel < 25 ? "text-red-500" : ambulance.fuel < 50 ? "text-amber-500" : "text-emerald-500";

  return (
    <motion.div
      layout
      onClick={() => onClick(ambulance)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Ambulance className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900">{ambulance.id}</h4>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600">
              {ambulance.type}
            </span>
          </div>
        </div>
        <StatusBadge status={ambulance.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 truncate">{ambulance.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{ambulance.plate}</span>
        </div>
      </div>

      {/* Fuel Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-slate-500 uppercase flex items-center gap-1">
            <Fuel className="w-3 h-3" /> Fuel Level
          </span>
          <span className={`font-black ${fuelColor}`}>{ambulance.fuel}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              ambulance.fuel < 25 ? "bg-red-500" : ambulance.fuel < 50 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${ambulance.fuel}%` }}
          />
        </div>
      </div>

      {ambulance.driver && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">{ambulance.driver}</span>
        </div>
      )}
    </motion.div>
  );
}

// Vehicle Detail Modal
function VehicleModal({ ambulance, onClose }) {
  if (!ambulance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Ambulance className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">{ambulance.id}</h3>
              <p className="text-sm text-slate-500">{ambulance.type} Ambulance</p>
            </div>
            <StatusBadge status={ambulance.status} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">License Plate</p>
              <p className="font-bold text-slate-900">{ambulance.plate}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Location</p>
              <p className="font-bold text-slate-900">{ambulance.location}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Odometer</p>
              <p className="font-bold text-slate-900">{ambulance.odometer?.toLocaleString() || "N/A"} km</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Condition</p>
              <p className="font-bold text-slate-900 capitalize">{ambulance.condition}</p>
            </div>
          </div>

          {/* Fuel Level */}
          <div className="p-4 bg-slate-50 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-4 h-4" /> Fuel Level
              </p>
              <span className={`font-black ${ambulance.fuel < 25 ? "text-red-500" : "text-slate-900"}`}>
                {ambulance.fuel}%
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${ambulance.fuel < 25 ? "bg-red-500" : ambulance.fuel < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${ambulance.fuel}%` }}
              />
            </div>
          </div>

          {/* Maintenance Info */}
          <div className="space-y-3 mb-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-500" />
              Maintenance Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Last Service</p>
                <p className="font-bold text-slate-900">{ambulance.lastService || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Insurance Expiry</p>
                <p className="font-bold text-slate-900">{ambulance.insurance || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Driver Assignment */}
          {ambulance.driver && (
            <div className="p-4 bg-blue-50 rounded-xl mb-6">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Assigned Driver
              </h4>
              <p className="font-bold text-blue-700">{ambulance.driver}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => toast.info("Edit vehicle functionality")}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
            >
              Edit Vehicle
            </button>
            <button
              onClick={() => toast.info("Schedule maintenance")}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-colors"
            >
              Schedule Service
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Vehicles() {
  const [loading, setLoading] = useState(true);
  const [ambulances, setAmbulances] = useState([]);
  const [filteredAmbulances, setFilteredAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ambulanceApi.getAll();
        setAmbulances(data);
        setFilteredAmbulances(data);
      } catch {
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = ambulances;

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.driver?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }

    setFilteredAmbulances(filtered);
  }, [ambulances, searchQuery, statusFilter, typeFilter]);

  const stats = {
    total: ambulances.length,
    available: ambulances.filter((a) => a.status === "available").length,
    onCall: ambulances.filter((a) => a.status === "on-call" || a.status === "en-route").length,
    maintenance: ambulances.filter((a) => a.status === "maintenance" || a.status === "offline").length,
    lowFuel: ambulances.filter((a) => a.fuel < 25).length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Fleet...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10 animate-fade-in font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-500" />
            Ambulance Fleet
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Manage ambulance vehicles, maintenance, and assignments
          </p>
        </div>
        <button
          onClick={() => toast.info("Add vehicle form would open")}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          {
            label: "Total Fleet",
            value: stats.total,
            icon: Truck,
            color: "blue",
          },
          {
            label: "Available",
            value: stats.available,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "On Call",
            value: stats.onCall,
            icon: Ambulance,
            color: "blue",
          },
          {
            label: "Maintenance",
            value: stats.maintenance,
            icon: Wrench,
            color: "amber",
          },
          {
            label: "Low Fuel",
            value: stats.lowFuel,
            icon: Fuel,
            color: "rose",
          },
        ].map((s, i) => {
          const themes = {
            blue: { bg: "#EFF6FF", color: "#3B82F6" },
            emerald: { bg: "#ECFDF5", color: "#10B981" },
            amber: { bg: "#FFF7ED", color: "#F59E0B" },
            rose: { bg: "#FFF1F2", color: "#F43F5E" },
          };
          const theme = themes[s.color] || themes.blue;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-white/50"
                  style={{ background: theme.bg }}
                >
                  <s.icon size={24} style={{ color: theme.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
                    {s.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, plate, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="on-call">On Call</option>
                <option value="en-route">En Route</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="ALS">ALS</option>
                <option value="BLS">BLS</option>
                <option value="NICU">NICU</option>
                <option value="MICU">MICU</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredAmbulances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAmbulances.map((ambulance) => (
            <AmbulanceCard key={ambulance.id} ambulance={ambulance} onClick={setSelectedAmbulance} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="font-black text-slate-900 text-lg">No vehicles found</p>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      {selectedAmbulance && (
        <VehicleModal ambulance={selectedAmbulance} onClose={() => setSelectedAmbulance(null)} />
      )}
    </div>
  );
}
