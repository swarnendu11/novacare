import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { departmentsApi } from "../services/api";
import Spinner from "../components/Spinner";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  HeartPulse,
  Activity,
  Brain,
  Bone,
  Baby,
  Eye,
  ShieldPlus,
  Dna,
} from "lucide-react";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    active: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await departmentsApi.getAll();
      // Add mock static fields for styling since mock db only has name
      const mapped = res.data.map((d) => ({
        ...d,
        status: "Operational",
        beds: Math.floor(20 + Math.random() * 80),
      }));
      setDepartments(mapped);
    } catch {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("cardio"))
      return <HeartPulse className="w-6 h-6 text-rose-500" />;
    if (n.includes("neuro"))
      return <Brain className="w-6 h-6 text-purple-500" />;
    if (n.includes("ortho")) return <Bone className="w-6 h-6 text-amber-500" />;
    if (n.includes("pedia")) return <Baby className="w-6 h-6 text-sky-500" />;
    if (n.includes("ophth") || n.includes("eye"))
      return <Eye className="w-6 h-6 text-blue-500" />;
    if (n.includes("onco")) return <Dna className="w-6 h-6 text-emerald-500" />;
    return <Activity className="w-6 h-6 text-indigo-500" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await departmentsApi.update(editing.id, {
          name: form.name,
          description: form.description,
        });
        toast.success(`${form.name} updated successfully`);
      } else {
        await departmentsApi.create({
          name: form.name,
          description: form.description,
        });
        toast.success(`New wing ${form.name} constructed!`);
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed processing request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !confirm(
        `CRITICAL WARNING: Demolishing the ${name} department will flag assigned doctors as "Unassigned". Proceed?`,
      )
    )
      return;
    try {
      await departmentsApi.delete(id);
      toast.success(`${name} Department removed from facility`);
      load();
    } catch {
      toast.error("Failed to delete department");
    }
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({ name: d.name, description: d.description || "" });
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="font-sans max-w-[1400px] mx-auto pb-10 space-y-8">
      {/* Header Array */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-teal-400" /> Departments
          </h2>
          <p className="text-teal-100 font-medium">
            Manage medical departments, IPD capacities, and operational status.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", description: "" });
            setModalOpen(true);
          }}
          className="relative z-10 px-6 py-3 bg-white text-emerald-900 font-black rounded-xl hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Department
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {departments.map((d) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={d.id}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 group flex flex-col hover:border-teal-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100">
                  {getDepartmentIcon(d.name)}
                </div>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>{" "}
                  {d.status}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">
                  {d.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  {d.description ||
                    "No specialized description provided for this department wing."}
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex-1 text-center border-r border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    IPD Capacity
                  </p>
                  <p className="font-black text-slate-800 text-lg">
                    {d.beds} Beds
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    Base Room Rate
                  </p>
                  <p className="font-black text-slate-800 text-lg">
                    ₹{Math.floor(2500 + Math.random() * 2500)}/d
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(d)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit config
                </button>
                <button
                  onClick={() => handleDelete(d.id, d.name)}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {departments.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Departments Configured
            </h3>
            <p className="text-slate-500 font-medium mt-1">
              Begin expanding your hospital infrastructure.
            </p>
          </div>
        )}
      </div>

      {/* Infrastructure Config Modal */}
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
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  {editing ? (
                    <Edit2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <ShieldPlus className="w-6 h-6 text-emerald-600" />
                  )}
                  {editing ? "Edit Department Details" : "Add New Department"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 outline-none font-bold text-slate-900 transition-all"
                    placeholder="e.g. Cardiology"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Department Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/30 outline-none font-bold text-slate-900 transition-all resize-none"
                    placeholder="Information about this department..."
                  />
                </div>

                {!editing && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <Activity className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                      This department will be immediately available. You can
                      assign doctors to it from the Doctors List.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
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
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : editing ? (
                      "Save Changes"
                    ) : (
                      "Add Department"
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
