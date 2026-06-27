import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { doctorsApi, departmentsApi, usersApi } from "../services/api";
import Spinner from "../components/Spinner";
import {
  Stethoscope,
  UserPlus,
  Search,
  Building2,
  Clock,
  IndianRupee,
  Trash2,
  Edit2,
  ShieldAlert,
  Star,
  Activity,
} from "lucide-react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: 0,
    departmentId: "",
    fee: 500,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        doctorsApi.getAll(),
        departmentsApi.getAll(),
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await doctorsApi.create({
        name: form.name,
        email: form.email,
        specialization: form.specialization,
        experience: parseInt(form.experience) || 0,
        departmentId: parseInt(form.departmentId),
        department:
          departments.find((d) => d.id === parseInt(form.departmentId))?.name ||
          "General",
        fee: parseInt(form.fee) || 500,
        available: true,
        rating: 5.0,
        appointments: 0,
      });
      toast.success("Doctor added to system");
      setModalOpen(false);
      setForm({
        name: "",
        email: "",
        specialization: "",
        experience: 0,
        departmentId: "",
        fee: 500,
      });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "WARNING: Removing this doctor will delete all their historical appointment mappings. Proceed?",
      )
    )
      return;
    try {
      await doctorsApi.delete(id);
      toast.success("Doctor profile deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleStatus = async (doc) => {
    try {
      await doctorsApi.update(doc.id, { available: !doc.available });
      toast.success(
        `Doctor marked as ${!doc.available ? "Active" : "Inactive"}`,
      );
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.department || "").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-indigo-400" /> Doctors List
          </h2>
          <p className="text-indigo-200 font-medium">
            Manage hospital doctors, their fees, and status.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="relative z-10 px-6 py-3 bg-white text-indigo-900 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Add Doctor
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name or department..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((d) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={d.id}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 group relative flex flex-col"
            >
              {/* Status Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${d.available ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                >
                  {d.available ? (
                    <Activity className="w-3 h-3" />
                  ) : (
                    <ShieldAlert className="w-3 h-3" />
                  )}
                  {d.available ? "Active Duty" : "Off Duty"}
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6 pt-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl shadow-inner border border-indigo-50 shrink-0">
                  {d.name.replace("Dr. ", "").charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                    {d.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {d.email}
                  </p>
                </div>
              </div>

              {/* Details Flex */}
              <div className="flex-1 space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {d.department}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      {d.specialization}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-[10px] text-slate-500 block">
                        Experience
                      </span>
                      {d.experience} Years
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                    <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-xs font-bold text-slate-800">
                      <span className="text-[10px] text-slate-500 block">
                        Consult Fee
                      </span>
                      ₹{d.fee}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 font-black text-slate-900 text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
                      {d.rating}
                    </p>
                  </div>
                  <div className="text-center text-sm font-black text-slate-900">
                    {d.appointments}{" "}
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Visits
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleStatus(d)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                    title="Toggle Duty Status"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                    title="Edit Doctor"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Doctors Found
            </h3>
            <p className="text-slate-500 font-medium mt-1">
              Try adjusting your search filters.
            </p>
          </div>
        )}
      </div>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-slate-200 cursor-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-indigo-600" /> Add New
                  Doctor
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Admin action
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Display Name (incl. Dr.)
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                      placeholder="Dr. Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      System Email / Login ID
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                      placeholder="dr.jane@novacare.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="md:col-span-2">
                    <h4 className="font-black text-indigo-900 text-sm">
                      Doctor Details
                    </h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">
                      Department
                    </label>
                    <select
                      value={form.departmentId}
                      onChange={(e) =>
                        setForm({ ...form, departmentId: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900"
                      required
                    >
                      <option value="">Select a wing...</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">
                      Sub-Specialization
                    </label>
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) =>
                        setForm({ ...form, specialization: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900"
                      placeholder="e.g. Neonatology"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Experience
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={form.experience}
                        onChange={(e) =>
                          setForm({ ...form, experience: e.target.value })
                        }
                        className="w-full pl-4 pr-16 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-black text-slate-900"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        Years
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Standard Consult Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={form.fee}
                        onChange={(e) =>
                          setForm({ ...form, fee: e.target.value })
                        }
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-black text-slate-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Check /> Add Doctor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Missing lucid react icon import in the above replaced chunk, adding it directly via helper component to ensure build success without pulling extra imports.
const Check = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || "w-5 h-5"}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
