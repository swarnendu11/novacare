import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { usersApi } from "../services/api";
import Spinner from "../components/Spinner";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  UserX,
  UserCheck,
  Shield,
} from "lucide-react";
import { formatDateIndian } from "../utils/formatIndian";

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Active");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "receptionist",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await usersApi.getAll();
      setStaff(res.data);
    } catch {
      toast.error("Failed to load personnel");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await usersApi.create({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
      });
      toast.success("User account created");
      setModalOpen(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "receptionist",
        phone: "",
      });
      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Email may already be registered",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await usersApi.updateStatus(id, status);
      toast.success(`User ${status.toLowerCase()} successfully`);
      load();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredStaff = staff.filter((s) => {
    if (activeTab === "Pending" && s.status !== "Pending") return false;
    if (activeTab === "Active" && (s.status === "Pending" || s.status === "Rejected")) return false;

    const term = search.toLowerCase();
    return s.name.toLowerCase().includes(term) ||
           s.email.toLowerCase().includes(term) ||
           s.role.toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header Array */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-amber-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" /> Staff Management
          </h2>
          <p className="text-amber-200 font-medium">
            Manage hospital administrators, receptionists, and general staff
            accounts.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="relative z-10 px-6 py-3 bg-white text-amber-900 font-black rounded-xl hover:bg-amber-50 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("Active")}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "Active" ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"}`}
          >
            Active Staff
          </button>
          <button
            onClick={() => setActiveTab("Pending")}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "Pending" ? "bg-white text-amber-600 shadow" : "text-slate-500 hover:text-slate-700"}`}
          >
            Pending Approvals
          </button>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 font-bold transition-all"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredStaff.map((s) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={s._id || s.id}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 group relative flex flex-col"
            >
              {/* Role Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    s.role === "admin"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : s.role === "doctor"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : s.role === "patient"
                          ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                          : s.role === "receptionist"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : s.role === "nurse"
                              ? "bg-pink-50 text-pink-700 border-pink-200"
                              : s.role === "wardboy"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {s.role}
                </span>
              </div>

              {/* Profile Header */}
              <div className="flex flex-col items-center text-center mt-4 mb-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-3 border-4 shadow-sm ${
                    s.role === "admin"
                      ? "bg-indigo-100 text-indigo-600 border-white"
                      : s.role === "doctor"
                        ? "bg-emerald-100 text-emerald-600 border-white"
                        : s.role === "patient"
                          ? "bg-cyan-100 text-cyan-600 border-white"
                          : s.role === "receptionist"
                            ? "bg-purple-100 text-purple-600 border-white"
                            : s.role === "nurse"
                              ? "bg-pink-100 text-pink-600 border-white"
                              : s.role === "wardboy"
                                ? "bg-orange-100 text-orange-600 border-white"
                                : "bg-slate-100 text-slate-600 border-white"
                  }`}
                >
                  {s.name.charAt(0)}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                  {s.name}
                </h3>
              </div>

              {/* Details Flex */}
              <div className="flex-1 space-y-2 mb-6">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {s.email}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-xs font-bold text-slate-800">
                    {s.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Lockout Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                {activeTab === "Pending" ? (
                  <>
                    <button 
                      onClick={() => handleStatus(s._id, "Approved")}
                      className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatus(s._id, "Rejected")}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <UserX className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  s.role !== "admin" ? (
                    <>
                      <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                        <UserX className="w-3.5 h-3.5" /> Suspend
                      </button>
                      <button className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                        Terminate
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-2 bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Full Admin Access
                    </div>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStaff.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Staff Found
            </h3>
            <p className="text-slate-500 font-medium mt-1">
              Try adjusting your search criteria.
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
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-amber-500" /> Add New Staff
                </h3>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/30 outline-none font-bold text-slate-900 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/30 outline-none font-bold text-slate-900 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Temporary Password
                    </label>
                    <input
                      type="text"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/30 outline-none font-bold text-slate-900 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Staff Role
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/30 outline-none font-bold text-slate-900 transition-all"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="nurse">Nurse</option>
                      <option value="wardboy">Ward Boy</option>
                    </select>
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
                    className="flex-1 py-4 bg-amber-600 text-white rounded-xl font-black hover:bg-amber-700 disabled:opacity-60 transition-colors shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" /> Add Staff
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
