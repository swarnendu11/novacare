import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  Phone,
  MapPin,
  Activity,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function PatientDirectory() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // 'list' | 'register' | 'edit'

  const [patients, setPatients] = useState([
    {
      id: "PAT-1049",
      name: "John Patient",
      phone: "+91 98000 00003",
      lastVisit: "Today",
      status: "Registered",
    },
    {
      id: "PAT-1050",
      name: "Alice Brown",
      phone: "+91 98000 00005",
      lastVisit: "3 Days Ago",
      status: "Registered",
    },
    {
      id: "PAT-1051",
      name: "Bob Wilson",
      phone: "+91 98000 00006",
      lastVisit: "1 Week Ago",
      status: "Registered",
    },
    {
      id: "PAT-1052",
      name: "Carol Davis",
      phone: "+91 98000 00007",
      lastVisit: "2 Weeks Ago",
      status: "Registered",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    dob: "",
    phone: "",
    address: "",
    bloodGroup: "O+",
    emergencyName: "",
    emergencyPhone: "",
    allergies: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();
    setPatients([
      {
        id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        phone: formData.phone,
        lastVisit: "Today",
        status: "Registered",
      },
      ...patients,
    ]);
    toast.success(
      view === "edit" ? "Patient Details Updated" : "New Patient Registered!",
    );
    setView("list");
    setFormData({
      name: "",
      gender: "Male",
      dob: "",
      phone: "",
      address: "",
      bloodGroup: "O+",
      emergencyName: "",
      emergencyPhone: "",
      allergies: "",
    });
  };

  if (view === "register" || view === "edit") {
    return (
      <div className="font-sans max-w-4xl mx-auto pb-10 space-y-8">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            {view === "edit" ? "Edit Patient Details" : "Register New Patient"}
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            Enter all required demographic and medical information below.
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Full Name *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="+91 98000 00000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Date of Birth *
                </label>
                <input
                  required
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  Blood Group *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option>A+</option>
                  <option>B+</option>
                  <option>O+</option>
                  <option>AB+</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>O-</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Residential Address *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows="2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="123 Wellness Ave..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-orange-50/50 border border-orange-100 rounded-2xl">
              <div className="md:col-span-2">
                <h3 className="font-extrabold text-orange-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Emergency Contact
                </h3>
              </div>
              <div>
                <label className="text-xs font-bold text-orange-600/70 uppercase tracking-widest block mb-2">
                  Contact Name *
                </label>
                <input
                  required
                  value={formData.emergencyName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyName: e.target.value })
                  }
                  className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-orange-600/70 uppercase tracking-widest block mb-2">
                  Phone Number *
                </label>
                <input
                  required
                  value={formData.emergencyPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyPhone: e.target.value })
                  }
                  className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="+91 98000 00000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Known Allergies (Optional)
              </label>
              <input
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g. Penicillin, Peanuts"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Save Patient
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-7xl mx-auto pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Patient Directory
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Search existing records or fast-track new walk-in arrivals.
          </p>
        </div>
        <button
          onClick={() => setView("register")}
          className="px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Register Walk-In
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or phone..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 font-bold transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold text-sm">Sort By:</span>
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 text-sm outline-none cursor-pointer shadow-sm">
              <option>Recent First</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Contact
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Last Visit
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-lg">
                          {p.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">
                          {p.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-slate-700 font-bold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> {p.phone}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${p.lastVisit === "Today" ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}
                    >
                      <Activity className="w-3 h-3" /> {p.lastVisit}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: p.name,
                            phone: p.phone,
                          });
                          setView("edit");
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 font-bold text-sm rounded-lg transition-all shadow-sm"
                      >
                        Edit / View
                      </button>
                      <Link
                        to="/receptionist/book"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-all shadow-sm"
                      >
                        Book
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
