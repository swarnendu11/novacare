/**
 * NovaCare Admin — Ambulance Management
 * Fleet tracking, dispatch management, and ambulance status monitoring.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Ambulance,
  MapPin,
  Phone,
  Clock,
  User,
  Plus,
  Search,
  Fuel,
  Shield,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/Spinner";

/* Mock ambulance data */
const SEED_AMBULANCES = [
  {
    id: "AMB-001",
    vehicleNumber: "MH-12-AB-1234",
    type: "Advanced Life Support",
    driver: "Ramesh Kumar",
    driverPhone: "9876543210",
    status: "standby",
    lastLocation: "NovaCare Hospital",
    fuel: 85,
    lastService: "2026-02-15",
    equipment: ["Defibrillator", "Ventilator", "Oxygen"],
    mileage: 45200,
  },
  {
    id: "AMB-002",
    vehicleNumber: "MH-12-CD-5678",
    type: "Basic Life Support",
    driver: "Suresh Patil",
    driverPhone: "9876543211",
    status: "en-route",
    lastLocation: "Sector 18, Noida",
    fuel: 62,
    lastService: "2026-01-28",
    equipment: ["First Aid", "Stretcher", "Oxygen"],
    mileage: 67800,
    destination: "City Hospital, Ward B",
    patient: "Arun Sharma",
    eta: "12 min",
  },
  {
    id: "AMB-003",
    vehicleNumber: "MH-12-EF-9012",
    type: "Patient Transport",
    driver: "Mahesh Yadav",
    driverPhone: "9876543212",
    status: "standby",
    lastLocation: "NovaCare Hospital",
    fuel: 90,
    lastService: "2026-03-01",
    equipment: ["Stretcher", "Wheelchair", "First Aid"],
    mileage: 32100,
  },
  {
    id: "AMB-004",
    vehicleNumber: "MH-12-GH-3456",
    type: "Advanced Life Support",
    driver: "Dinesh Verma",
    driverPhone: "9876543213",
    status: "out-of-service",
    lastLocation: "Service Center",
    fuel: 40,
    lastService: "2026-03-18",
    equipment: ["Defibrillator", "Ventilator", "Oxygen", "Cardiac Monitor"],
    mileage: 89500,
    serviceNote: "Engine maintenance – ETA 2 days",
  },
  {
    id: "AMB-005",
    vehicleNumber: "MH-12-IJ-7890",
    type: "Neonatal",
    driver: "Vikash Singh",
    driverPhone: "9876543214",
    status: "en-route",
    lastLocation: "Maternity Wing, Sector 5",
    fuel: 75,
    lastService: "2026-02-20",
    equipment: ["Incubator", "Infant Ventilator", "Cardiac Monitor"],
    mileage: 18300,
    destination: "NovaCare NICU",
    patient: "Baby Priya",
    eta: "8 min",
  },
  {
    id: "AMB-006",
    vehicleNumber: "MH-12-KL-2345",
    type: "Basic Life Support",
    driver: "Ajay Mishra",
    driverPhone: "9876543215",
    status: "standby",
    lastLocation: "NovaCare Hospital",
    fuel: 95,
    lastService: "2026-03-10",
    equipment: ["First Aid", "Stretcher", "Oxygen", "BP Monitor"],
    mileage: 51200,
  },
];

const AMBULANCE_TYPES = [
  "Advanced Life Support",
  "Basic Life Support",
  "Patient Transport",
  "Neonatal",
];
const STATUS_OPTIONS = ["standby", "en-route", "out-of-service"];

export default function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    vehicleNumber: "",
    type: "Basic Life Support",
    driver: "",
    driverPhone: "",
    status: "standby",
    fuel: 100,
    equipment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nc_ambulances");
    if (stored) {
      setAmbulances(JSON.parse(stored));
    } else {
      localStorage.setItem("nc_ambulances", JSON.stringify(SEED_AMBULANCES));
      setAmbulances(SEED_AMBULANCES);
    }
    setLoading(false);
  }, []);

  const persist = (data) => {
    localStorage.setItem("nc_ambulances", JSON.stringify(data));
    setAmbulances(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      if (editId) {
        const updated = ambulances.map((a) =>
          a.id === editId
            ? {
                ...a,
                vehicleNumber: form.vehicleNumber,
                type: form.type,
                driver: form.driver,
                driverPhone: form.driverPhone,
                status: form.status,
                fuel: Number(form.fuel),
                equipment: form.equipment
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : a,
        );
        persist(updated);
        toast.success("Ambulance updated successfully");
      } else {
        const newAmb = {
          id: `AMB-${String(ambulances.length + 1).padStart(3, "0")}`,
          vehicleNumber: form.vehicleNumber,
          type: form.type,
          driver: form.driver,
          driverPhone: form.driverPhone,
          status: form.status,
          fuel: Number(form.fuel),
          equipment: form.equipment
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          lastLocation: "NovaCare Hospital",
          lastService: new Date().toISOString().split("T")[0],
          mileage: 0,
        };
        persist([...ambulances, newAmb]);
        toast.success("Ambulance registered successfully");
      }

      setModalOpen(false);
      setEditId(null);
      setForm({
        vehicleNumber: "",
        type: "Basic Life Support",
        driver: "",
        driverPhone: "",
        status: "standby",
        fuel: 100,
        equipment: "",
      });
      setSubmitting(false);
    }, 600);
  };

  const handleEdit = (amb) => {
    setEditId(amb.id);
    setForm({
      vehicleNumber: amb.vehicleNumber,
      type: amb.type,
      driver: amb.driver,
      driverPhone: amb.driverPhone,
      status: amb.status,
      fuel: amb.fuel,
      equipment: amb.equipment?.join(", ") || "",
    });
    setModalOpen(true);
  };

  const handleDelete = () => {
    const updated = ambulances.filter((a) => a.id !== deleteConfirm);
    persist(updated);
    toast.success("Ambulance removed");
    setDeleteConfirm(null);
  };

  const handleDispatch = (id) => {
    const updated = ambulances.map((a) =>
      a.id === id
        ? { ...a, status: a.status === "en-route" ? "standby" : "en-route" }
        : a,
    );
    persist(updated);
    toast.success(
      updated.find((a) => a.id === id)?.status === "en-route"
        ? "Ambulance dispatched!"
        : "Ambulance returned to standby",
    );
  };

  // Filter & search
  const filtered = ambulances
    .filter((a) => filterStatus === "all" || a.status === filterStatus)
    .filter((a) => filterType === "all" || a.type === filterType)
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.vehicleNumber.toLowerCase().includes(q) ||
        a.driver.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    });

  // Stats
  const stats = {
    total: ambulances.length,
    standby: ambulances.filter((a) => a.status === "standby").length,
    enRoute: ambulances.filter((a) => a.status === "en-route").length,
    oos: ambulances.filter((a) => a.status === "out-of-service").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div
      className="space-y-8 pb-20 animate-fade-in"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Ambulance className="w-9 h-9 text-red-500" /> Ambulance Fleet
          </h1>
          <p className="section-subtitle mt-2">
            Monitor, dispatch, and manage emergency vehicles.
          </p>
        </div>
        <button
          onClick={() => {
            setEditId(null);
            setForm({
              vehicleNumber: "",
              type: "Basic Life Support",
              driver: "",
              driverPhone: "",
              status: "standby",
              fuel: 100,
              equipment: "",
            });
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Register Ambulance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          {
            label: "Total Fleet",
            value: stats.total,
            gradient: "linear-gradient(135deg, #0F172A, #334155)",
            icon: Ambulance,
          },
          {
            label: "Available",
            value: stats.standby,
            gradient: "linear-gradient(135deg, #065F46, #10B981)",
            icon: CheckCircle,
          },
          {
            label: "En Route",
            value: stats.enRoute,
            gradient: "linear-gradient(135deg, #9A3412, #F97316)",
            icon: MapPin,
          },
          {
            label: "Out of Service",
            value: stats.oos,
            gradient: "linear-gradient(135deg, #7F1D1D, #EF4444)",
            icon: AlertTriangle,
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group"
            style={{ background: s.gradient }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <s.icon className="w-8 h-8 text-white/40 mb-3" />
            <p className="text-3xl font-black leading-none">{s.value}</p>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mt-2">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, vehicle number, driver..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Status</option>
          <option value="standby">Standby</option>
          <option value="en-route">En Route</option>
          <option value="out-of-service">Out of Service</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Types</option>
          {AMBULANCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Ambulance Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((amb) => (
            <motion.div
              key={amb.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Status Bar */}
              <div
                className={`h-1.5 ${amb.status === "standby" ? "bg-emerald-500" : amb.status === "en-route" ? "bg-orange-500" : "bg-slate-400"}`}
              />

              <div className="p-6">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${amb.status === "standby" ? "bg-emerald-50" : amb.status === "en-route" ? "bg-orange-50" : "bg-slate-100"}`}
                      >
                        <Ambulance
                          className={`w-6 h-6 ${amb.status === "standby" ? "text-emerald-600" : amb.status === "en-route" ? "text-orange-600" : "text-slate-400"}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          {amb.id}
                        </h3>
                        <p className="text-xs font-bold text-slate-400">
                          {amb.vehicleNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={amb.status} />
                </div>

                {/* Type */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-black uppercase tracking-wide">
                    <Shield className="w-3 h-3" /> {amb.type}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700">
                      {amb.driver}
                    </span>
                    <a
                      href={`tel:${amb.driverPhone}`}
                      className="text-blue-500 hover:underline text-xs font-bold ml-auto flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {amb.driverPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500 truncate">
                      {amb.lastLocation}
                    </span>
                  </div>
                  {amb.destination && (
                    <div className="flex items-center gap-2 text-sm bg-orange-50 px-3 py-2 rounded-xl border border-orange-100">
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-700 truncate">
                        {amb.destination}
                      </span>
                      {amb.eta && (
                        <span className="ml-auto text-[10px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                          ETA: {amb.eta}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Fuel Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Fuel Level
                    </span>
                    <span
                      className={`text-xs font-black ${amb.fuel > 50 ? "text-emerald-600" : amb.fuel > 25 ? "text-amber-600" : "text-red-600"}`}
                    >
                      {amb.fuel}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${amb.fuel > 50 ? "bg-emerald-500" : amb.fuel > 25 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${amb.fuel}%` }}
                    />
                  </div>
                </div>

                {/* Equipment Tags */}
                {amb.equipment?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {amb.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleDispatch(amb.id)}
                    disabled={amb.status === "out-of-service"}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      amb.status === "en-route"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : amb.status === "out-of-service"
                          ? "bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                    }`}
                  >
                    {amb.status === "en-route"
                      ? "✓ Mark Standby"
                      : "🚨 Dispatch"}
                  </button>
                  <button
                    onClick={() => handleEdit(amb)}
                    className="w-9 h-9 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all border border-slate-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(amb.id)}
                    className="w-9 h-9 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl flex items-center justify-center transition-all border border-slate-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={Ambulance}
              title="No ambulances found"
              description="Try adjusting your search or filters, or register a new ambulance."
            />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditId(null);
        }}
        title={editId ? "Edit Ambulance" : "Register Ambulance"}
        titleIcon={Ambulance}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Vehicle Number
              </label>
              <input
                type="text"
                value={form.vehicleNumber}
                onChange={(e) =>
                  setForm({ ...form, vehicleNumber: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
                required
                placeholder="MH-12-XX-0000"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Ambulance Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
                required
              >
                {AMBULANCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Driver Name
              </label>
              <input
                type="text"
                value={form.driver}
                onChange={(e) => setForm({ ...form, driver: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
                required
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Driver Phone
              </label>
              <input
                type="tel"
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
                required
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Fuel Level (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.fuel}
                onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Equipment (comma-separated)
            </label>
            <input
              type="text"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-900 transition-all"
              placeholder="Defibrillator, Oxygen, Stretcher"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditId(null);
              }}
              className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : editId ? (
                "Update Ambulance"
              ) : (
                "Register Ambulance"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Remove Ambulance?"
        message="This will permanently remove this ambulance from the fleet registry. This action cannot be undone."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
