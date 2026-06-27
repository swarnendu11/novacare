/**
 * NovaCare Ambulance — Emergency Requests
 * Emergency request management with table, filters, and actions
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Ambulance,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  Phone,
  Search,
  Siren,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { emergencyApi, ambulanceApi, driverApi } from "../services/mockData";
import Spinner from "../components/Spinner";

// Priority Badge
function PriorityBadge({ priority }) {
  const styles = {
    critical: "bg-blue-600 text-white",
    high: "bg-amber-500 text-white",
    medium: "bg-blue-500 text-white",
    low: "bg-slate-500 text-white",
  };

  const labels = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    dispatched: "bg-blue-100 text-blue-700 border border-blue-200",
    "en-route": "bg-violet-100 text-violet-700 border border-violet-200",
    "on-scene": "bg-emerald-100 text-emerald-700 border border-emerald-200",
    completed: "bg-slate-100 text-slate-700 border border-slate-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles[status] || styles.pending}`}>
      {status.replace("-", " ").toUpperCase()}
    </span>
  );
}

// Emergency Detail Modal
function EmergencyModal({ emergency, onClose, onAssign }) {
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ambs = await ambulanceApi.getAvailable();
      setAvailableAmbulances(ambs);
      setLoading(false);
    };
    load();
  }, []);

  if (!emergency) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PriorityBadge priority={emergency.priority} />
            <span className="font-black text-slate-900">{emergency.id}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Emergency Info */}
          <div>
            <h3 className="text-xl font-black text-slate-900">{emergency.type}</h3>
            <p className="text-sm text-slate-500 mt-1">Reported {new Date(emergency.createdAt).toLocaleString()}</p>
          </div>

          {/* Patient Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              Patient Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-bold text-slate-900">{emergency.patient}</p>
              </div>
              <div>
                <p className="text-slate-500">Age</p>
                <p className="font-bold text-slate-900">{emergency.age} years</p>
              </div>
              <div>
                <p className="text-slate-500">Contact</p>
                <p className="font-bold text-slate-900">{emergency.phone}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Pickup Location</p>
              <p className="text-sm text-slate-500">{emergency.pickup}</p>
              <p className="text-sm text-slate-500 mt-1">Destination: {emergency.hospital}</p>
            </div>
          </div>

          {/* Vital Signs */}
          {emergency.vitalSigns && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-3">Vital Signs</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-blue-600 uppercase">BP</p>
                  <p className="font-black text-blue-900">{emergency.vitalSigns.bp}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 uppercase">Pulse</p>
                  <p className="font-black text-blue-900">{emergency.vitalSigns.pulse}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-blue-600 uppercase">SpO2</p>
                  <p className="font-black text-blue-900">{emergency.vitalSigns.spo2}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {emergency.notes && (
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="font-bold text-amber-900 mb-1">Emergency Notes</h4>
              <p className="text-sm text-amber-800">{emergency.notes}</p>
            </div>
          )}

          {/* Assign Ambulance */}
          {emergency.status === "pending" && (
            <div>
              <h4 className="font-bold text-slate-900 mb-3">Assign Ambulance</h4>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : availableAmbulances.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableAmbulances.map((amb) => (
                    <button
                      key={amb.id}
                      onClick={() => onAssign(emergency, amb)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                    >
                      <Ambulance className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{amb.id}</p>
                        <p className="text-xs text-slate-500">{amb.type} • {amb.location}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-xl">
                  <p className="text-slate-500 font-bold">No ambulances available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function EmergencyRequests() {
  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState([]);
  const [filteredEmergencies, setFilteredEmergencies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await emergencyApi.getAll();
        setEmergencies(data);
        setFilteredEmergencies(data);
      } catch {
        toast.error("Failed to load emergency requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = emergencies;

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((e) => e.priority === priorityFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    setFilteredEmergencies(filtered);
  }, [emergencies, searchQuery, priorityFilter, statusFilter]);

  const handleAssign = async (emergency, ambulance) => {
    try {
      await emergencyApi.assign(emergency.id, ambulance.id, ambulance.driver, ambulance.driverPhone, 8);
      toast.success(`Ambulance ${ambulance.id} dispatched to ${emergency.type}`);
      setSelectedEmergency(null);
      // Refresh data
      const data = await emergencyApi.getAll();
      setEmergencies(data);
    } catch {
      toast.error("Failed to assign ambulance");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await emergencyApi.updateStatus(id, newStatus);
      toast.success(`Emergency status updated to ${newStatus}`);
      const data = await emergencyApi.getAll();
      setEmergencies(data);
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Emergency Requests...
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
            Emergency Requests
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-black">
              {filteredEmergencies.length}
            </span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Manage and dispatch emergency medical requests
          </p>
        </div>
        <button
          onClick={() => toast.info("New emergency form would open")}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
        >
          <Siren className="w-4 h-4" />
          New Emergency
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, patient name, or emergency type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-300 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="en-route">En Route</option>
                <option value="on-scene">On Scene</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Emergency ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Type / Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Assigned Unit
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmergencies.length > 0 ? (
                filteredEmergencies.map((emergency) => (
                  <tr
                    key={emergency.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedEmergency(emergency)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{emergency.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{emergency.type}</p>
                        <p className="text-sm text-slate-500">
                          {emergency.patient}, {emergency.age} yrs
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={emergency.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emergency.status} />
                    </td>
                    <td className="px-6 py-4">
                      {emergency.assignedAmbulance ? (
                        <div className="flex items-center gap-2">
                          <Ambulance className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-900">{emergency.assignedAmbulance}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {new Date(emergency.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmergency(emergency);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="font-bold text-slate-500">No emergency requests found</p>
                      <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedEmergency && (
        <EmergencyModal
          emergency={selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}
