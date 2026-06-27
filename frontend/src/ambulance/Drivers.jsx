/**
 * NovaCare Ambulance — Drivers
 * Driver management with profiles, assignments, and performance
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Ambulance,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { driverApi, ambulanceApi } from "../services/mockData";
import Spinner from "../components/Spinner";

// Driver Card
function DriverCard({ driver, onClick }) {
  const statusColors = {
    "on-duty": "bg-emerald-500",
    "on-call": "bg-amber-500",
    "en-route": "bg-blue-500",
    available: "bg-emerald-400",
    "off-duty": "bg-slate-400",
  };

  return (
    <motion.div
      layout
      onClick={() => onClick(driver)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-black text-blue-700 text-xl flex-shrink-0">
          {driver.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-slate-900 truncate">{driver.name}</h4>
            <div className={`w-2 h-2 rounded-full ${statusColors[driver.status]} ${driver.status !== "off-duty" ? "animate-pulse" : ""}`} />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-700">{driver.rating}</span>
            <span className="text-xs text-slate-400">({driver.totalTrips} trips)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{driver.shift} Shift</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 truncate">{driver.currentLocation}</span>
        </div>
      </div>

      {driver.assignedAmbulance ? (
        <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded-lg">
          <Ambulance className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-blue-700">{driver.assignedAmbulance}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-500">No vehicle assigned</span>
        </div>
      )}
    </motion.div>
  );
}

// Driver Detail Modal
function DriverModal({ driver, onClose }) {
  if (!driver) return null;

  const statusLabels = {
    "on-duty": "On Duty",
    "on-call": "On Call",
    "en-route": "En Route",
    available: "Available",
    "off-duty": "Off Duty",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center font-black text-blue-600 text-2xl">
              {driver.avatar}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">{driver.name}</h3>
            <p className="text-sm text-slate-500">{statusLabels[driver.status]}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-2xl font-black text-slate-900">{driver.rating}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Rating</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-2xl font-black text-slate-900">{driver.totalTrips}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Trips</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-2xl font-black text-slate-900">{driver.experience}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Years</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Phone</p>
                <p className="font-bold text-slate-900">{driver.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">License</p>
                <p className="font-bold text-slate-900">{driver.license}</p>
                <p className="text-xs text-slate-500">Expires: {driver.licenseExpiry}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Shift</p>
                <p className="font-bold text-slate-900">{driver.shift}</p>
              </div>
            </div>

            {driver.assignedAmbulance && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Ambulance className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Assigned Vehicle</p>
                  <p className="font-bold text-slate-900">{driver.assignedAmbulance}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
            <a
              href={`tel:${driver.phone}`}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <button
              onClick={() => toast.info("Edit driver functionality")}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Drivers() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await driverApi.getAll();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch {
        toast.error("Failed to load drivers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = drivers;

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.phone.includes(searchQuery)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchQuery, statusFilter]);

  const stats = {
    total: drivers.length,
    onDuty: drivers.filter((d) => d.status === "on-duty" || d.status === "en-route" || d.status === "on-call").length,
    available: drivers.filter((d) => d.status === "available").length,
    offDuty: drivers.filter((d) => d.status === "off-duty").length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Drivers...
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
            <Users className="w-8 h-8 text-blue-500" />
            Driver Management
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Manage ambulance drivers, assignments, and performance
          </p>
        </div>
        <button
          onClick={() => toast.info("Add driver form would open")}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.total}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Total Drivers</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.onDuty}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">On Duty</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.available}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Available</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.offDuty}</p>
              <p className="text-xs font-bold text-slate-500 uppercase">Off Duty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-300 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="on-duty">On Duty</option>
              <option value="available">Available</option>
              <option value="en-route">En Route</option>
              <option value="off-duty">Off Duty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Driver Grid */}
      {filteredDrivers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} onClick={setSelectedDriver} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="font-black text-slate-900 text-lg">No drivers found</p>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      {selectedDriver && (
        <DriverModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      )}
    </div>
  );
}
