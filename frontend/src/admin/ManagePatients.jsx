import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { usersApi } from "../services/api";
import Spinner from "../components/Spinner";
import {
  Users,
  Search,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Droplets,
  AlertCircle,
  Calendar,
  Eye,
  Trash2,
  Edit2,
  X,
  UserPlus,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    bloodGroup: "O+",
    dob: "",
    allergies: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await usersApi.getAll();
      const p = res.data.filter((u) => u.role === "patient");
      setPatients(p);
    } catch {
      toast.error("Could not load patients. Showing sample data.");
      setPatients([
        {
          id: 1,
          name: "Aarav Sharma",
          email: "aarav@example.com",
          phone: "9876543210",
          gender: "Male",
          bloodGroup: "O+",
          allergies: "None",
          dob: "1990-05-12",
          address: "Mumbai, MH",
          role: "patient",
        },
        {
          id: 2,
          name: "Priya Mehta",
          email: "priya@example.com",
          phone: "9812345678",
          gender: "Female",
          bloodGroup: "A-",
          allergies: "Penicillin",
          dob: "1995-08-22",
          address: "Delhi, India",
          role: "patient",
        },
        {
          id: 3,
          name: "Rohan Verma",
          email: "rohan@example.com",
          phone: "9765432109",
          gender: "Male",
          bloodGroup: "B+",
          allergies: "Sulfa",
          dob: "1988-03-01",
          address: "Pune, MH",
          role: "patient",
        },
        {
          id: 4,
          name: "Sneha Kapoor",
          email: "sneha@example.com",
          phone: "9898765432",
          gender: "Female",
          bloodGroup: "AB+",
          allergies: "None",
          dob: "2000-12-15",
          address: "Bengaluru, KA",
          role: "patient",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await usersApi.create({ ...form, role: "patient" });
      toast.success("Patient registered successfully!");
      setAddModalOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "Male",
        bloodGroup: "O+",
        dob: "",
        allergies: "",
        password: "",
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove patient "${name}"? This cannot be undone.`))
      return;
    try {
      await usersApi.delete(id);
      toast.success("Patient removed");
      load();
    } catch {
      toast.error("Failed to remove patient");
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
      </div>
    );

  const calcAge = (dob) => {
    if (!dob) return "N/A";
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)) + " yrs";
  };

  return (
    <div className="font-sans max-w-[1600px] mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="grad-blue p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tight mb-3 flex items-center gap-4">
            <Users className="w-10 h-10 text-blue-200" /> Patients Directory
          </h2>
          <p className="text-blue-100 font-semibold text-lg max-w-lg">
            Manage medical records, contact information, and health profiles of
            all registered patients.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-6">
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: 16,
              padding: "16px 24px",
              textAlign: "center",
              minWidth: 120,
            }}
          >
            <p
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1,
                textShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              {patients.length}
            </p>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginTop: 6,
                textShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              Registered
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-primary !bg-white !text-blue-700 !px-8 !py-4 transition-all !text-lg !shadow-2xl"
          >
            <UserPlus className="w-6 h-6" /> Add Patient
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="dashboard-card p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone identifier..."
            className="input-field pl-12"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="btn-outline flex-1 md:flex-none">Filter</button>
          <button className="btn-outline flex-1 md:flex-none">
            Export CSV
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="table-container">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Contact Information</th>
                <th>Age / Gender</th>
                <th>Blood Group</th>
                <th>Clinical Alerts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm border border-blue-100 flex-shrink-0">
                          {p.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">
                            {p.name}
                          </h4>
                          <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                            PAT-{String(p.id).padStart(4, "0")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" /> {p.email}
                        </p>
                        {p.phone && (
                          <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />{" "}
                            {p.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {calcAge(p.dob)}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                        {p.gender || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-red">
                        <Droplets className="w-3 h-3" /> {p.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          p.allergies && p.allergies !== "None"
                            ? "badge-amber"
                            : "badge-slate"
                        }
                      >
                        {p.allergies && p.allergies !== "None" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {p.allergies || "None"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-300"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-black text-slate-700">
                          No patients found
                        </p>
                        <p className="text-slate-500 font-medium mt-1">
                          Try a different search or add a new patient.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* View Patient Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPatient(null)}
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
                  <UserCheck className="w-6 h-6 text-indigo-600" /> Patient
                  Details
                </h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-4xl font-black shadow-lg">
                  {selectedPatient.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">
                    ID: PAT-{String(selectedPatient.id).padStart(4, "0")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Email",
                    value: selectedPatient.email,
                    icon: <Mail className="w-4 h-4 text-slate-400" />,
                  },
                  {
                    label: "Phone",
                    value: selectedPatient.phone || "N/A",
                    icon: <Phone className="w-4 h-4 text-slate-400" />,
                  },
                  {
                    label: "Gender",
                    value: selectedPatient.gender || "N/A",
                    icon: <UserCheck className="w-4 h-4 text-slate-400" />,
                  },
                  {
                    label: "Age",
                    value: calcAge(selectedPatient.dob),
                    icon: <Calendar className="w-4 h-4 text-slate-400" />,
                  },
                  {
                    label: "Blood Group",
                    value: selectedPatient.bloodGroup || "N/A",
                    icon: <Droplets className="w-4 h-4 text-red-400" />,
                  },
                  {
                    label: "Allergies",
                    value: selectedPatient.allergies || "None",
                    icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
                  },
                  {
                    label: "Address",
                    value: selectedPatient.address || "N/A",
                    icon: <MapPin className="w-4 h-4 text-slate-400" />,
                    col: "col-span-2",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-slate-50 rounded-xl p-4 border border-slate-100 ${item.col || ""}`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                      {item.icon} {item.label}
                    </p>
                    <p className="font-bold text-slate-900 text-sm">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <UserPlus className="w-6 h-6 text-indigo-600" /> Add New
                  Patient
                </h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) =>
                        setForm({ ...form, dob: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Blood Group
                    </label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) =>
                        setForm({ ...form, bloodGroup: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    >
                      {BLOOD_GROUPS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={form.allergies}
                      onChange={(e) =>
                        setForm({ ...form, allergies: e.target.value })
                      }
                      placeholder="e.g. Penicillin, None"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="City, State"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 outline-none font-bold text-slate-900 transition-all"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" /> Add Patient
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
