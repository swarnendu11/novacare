/**
 * NovaCare Ambulance — Live Dispatch
 * Real-time dispatch queue and ambulance assignment
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Siren,
  Users,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { emergencyApi, ambulanceApi, driverApi } from "../services/mockData";
import Spinner from "../components/Spinner";

// Dispatch Queue Card
function DispatchQueueCard({ emergency, position, onDispatch }) {
  const priorityColors = {
    critical: "border-blue-500 bg-blue-50",
    high: "border-amber-500 bg-amber-50",
    medium: "border-blue-500 bg-blue-50",
    low: "border-slate-400 bg-slate-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.1 }}
      className={`rounded-xl border-l-4 p-4 ${priorityColors[emergency.priority]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center font-black text-slate-700 text-sm">
            {position + 1}
          </div>
          <div>
            <p className="font-bold text-slate-900">{emergency.type}</p>
            <p className="text-sm text-slate-500">
              {emergency.patient}, {emergency.age} yrs
            </p>
          </div>
        </div>
        <span className="px-2 py-1 bg-white rounded-lg text-xs font-black text-slate-600 shadow-sm">
          {new Date(emergency.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
        <MapPin className="w-4 h-4" />
        <span className="truncate">{emergency.pickup}</span>
      </div>
      <button
        onClick={() => onDispatch(emergency)}
        className="w-full mt-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-sm text-slate-700 transition-colors flex items-center justify-center gap-2"
      >
        <Siren className="w-4 h-4" />
        Dispatch Ambulance
      </button>
    </motion.div>
  );
}

// Active Dispatch Card
function ActiveDispatchCard({ emergency, onStatusUpdate }) {
  const statusSteps = [
    { key: "dispatched", label: "Dispatched", icon: Radio },
    { key: "en-route", label: "En Route", icon: Navigation },
    { key: "on-scene", label: "On Scene", icon: MapPin },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === emergency.status);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Siren className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-black text-slate-900">{emergency.type}</p>
              <p className="text-sm text-slate-500">{emergency.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600">ETA {emergency.eta} min</p>
            <p className="text-xs text-slate-400">Live Tracking Active</p>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? isCurrent
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isActive ? (isCurrent ? "text-blue-600" : "text-emerald-600") : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Ambulance</p>
            <div className="flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900">{emergency.assignedAmbulance}</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Driver</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900">{emergency.driver}</span>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-slate-700">From: {emergency.pickup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-700">To: {emergency.hospital}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {emergency.status !== "completed" && (
            <button
              onClick={() => onStatusUpdate(emergency.id, getNextStatus(emergency.status))}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Update to {getNextStatusLabel(emergency.status)}
            </button>
          )}
          <a
            href={`tel:${emergency.driverPhone || emergency.phone}`}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function getNextStatus(current) {
  const flow = { dispatched: "en-route", "en-route": "on-scene", "on-scene": "completed" };
  return flow[current] || current;
}

function getNextStatusLabel(current) {
  const labels = { dispatched: "En Route", "en-route": "On Scene", "on-scene": "Complete" };
  return labels[current] || current;
}

// Dispatch Modal
function DispatchModal({ emergency, onClose, onConfirm }) {
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ambs = await ambulanceApi.getAvailable();
      setAvailableAmbulances(ambs);
      if (ambs.length > 0) setSelectedAmbulance(ambs[0]);
      setLoading(false);
    };
    load();
  }, []);

  const handleConfirm = () => {
    if (selectedAmbulance) {
      onConfirm(emergency, selectedAmbulance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-xl text-slate-900">Dispatch Ambulance</h3>
          <p className="text-slate-500 mt-1">Select an available unit for {emergency.type}</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : availableAmbulances.length > 0 ? (
            <div className="space-y-3">
              {availableAmbulances.map((amb) => (
                <button
                  key={amb.id}
                  onClick={() => setSelectedAmbulance(amb)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedAmbulance?.id === amb.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Ambulance className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-slate-900">{amb.id}</p>
                    <p className="text-sm text-slate-500">{amb.type} • {amb.location}</p>
                    <p className="text-xs text-slate-400 mt-1">Driver: {amb.driver}</p>
                  </div>
                   {selectedAmbulance?.id === amb.id && (
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="font-bold text-slate-900">No Ambulances Available</p>
              <p className="text-sm text-slate-500">All units are currently deployed</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAmbulance}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-colors"
          >
            Confirm Dispatch
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function LiveDispatch() {
  const [loading, setLoading] = useState(true);
  const [pendingEmergencies, setPendingEmergencies] = useState([]);
  const [activeDispatches, setActiveDispatches] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [pending, active] = await Promise.all([
          emergencyApi.getPending(),
          emergencyApi.getActive(),
        ]);
        setPendingEmergencies(pending);
        setActiveDispatches(active.filter((e) => e.status !== "pending"));
      } catch {
        toast.error("Failed to load dispatch data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDispatch = (emergency, ambulance) => {
    emergencyApi
      .assign(emergency.id, ambulance.id, ambulance.driver, ambulance.driverPhone, 8)
      .then(() => {
        toast.success(`Ambulance ${ambulance.id} dispatched to ${emergency.type}`);
        setSelectedEmergency(null);
        // Refresh data
        Promise.all([emergencyApi.getPending(), emergencyApi.getActive()]).then(
          ([pending, active]) => {
            setPendingEmergencies(pending);
            setActiveDispatches(active.filter((e) => e.status !== "pending"));
          }
        );
      })
      .catch(() => toast.error("Failed to dispatch ambulance"));
  };

  const handleStatusUpdate = (id, newStatus) => {
    emergencyApi
      .updateStatus(id, newStatus)
      .then(() => {
        toast.success(`Status updated to ${newStatus}`);
        Promise.all([emergencyApi.getPending(), emergencyApi.getActive()]).then(
          ([pending, active]) => {
            setPendingEmergencies(pending);
            setActiveDispatches(active.filter((e) => e.status !== "pending"));
          }
        );
      })
      .catch(() => toast.error("Failed to update status"));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Dispatch Queue...
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
            <Radio className="w-8 h-8 text-blue-500" />
            Live Dispatch
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Real-time ambulance dispatch and tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            System Online
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Queue */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Dispatch Queue
                <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs">
                  {pendingEmergencies.length} pending
                </span>
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {pendingEmergencies.length > 0 ? (
                pendingEmergencies.map((emergency, index) => (
                  <DispatchQueueCard
                    key={emergency.id}
                    emergency={emergency}
                    position={index}
                    onDispatch={setSelectedEmergency}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-900">Queue Empty</p>
                  <p className="text-sm text-slate-500">All emergencies dispatched</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Dispatches */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Siren className="w-5 h-5 text-blue-500" />
                Active Dispatches
                <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs">
                  {activeDispatches.length} active
                </span>
              </h3>
            </div>
            <div className="p-5">
              {activeDispatches.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {activeDispatches.map((emergency) => (
                    <ActiveDispatchCard
                      key={emergency.id}
                      emergency={emergency}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <p className="font-black text-slate-900 text-lg">No Active Dispatches</p>
                  <p className="text-slate-500 mt-1">All emergencies have been resolved</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEmergency && (
        <DispatchModal
          emergency={selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          onConfirm={handleDispatch}
        />
      )}
    </div>
  );
}
