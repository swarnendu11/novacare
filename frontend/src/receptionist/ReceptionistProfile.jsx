import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Phone,
  Edit2,
  Check,
  UserCircle2,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Lock,
  Key,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { formatDateIndian } from "../utils/formatIndian";

export default function ReceptionistProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    staffId: "REC-24090",
    fullName: "",
    email: "",
    phone: "+91 98000 00004",
    gender: "Female",
    dob: "1995-12-10",
    address: "45 Blue Street, Horizon City, Ind 40001",
    shift: "Morning (08:00 AM - 04:00 PM)",
    department: "Front Desk / Admissions",
    joinDate: "2023-05-15",
    languages: "English, Hindi, Marathi",
    username: "riya_recept23",
    accountStatus: "Active",
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        fullName: user.name || "Riya Reception",
        email: user.email || "reception@novacare.com",
      }));
    }
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Staff profile details updated successfully");
  };

  const handlePasswordChange = () => {
    toast.success("Password reset link sent to registered email");
  };

  return (
    <div className="space-y-8 font-sans pb-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Staff Profile
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your professional information and credentials.
          </p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${
            isEditing
              ? "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20 hover:shadow-green-600/40"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-5 h-5" /> Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden text-center pb-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl"></div>
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white font-mono text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> ID: {profileData.staffId}
              </div>
            </div>

            <div className="relative -top-16 mb-[-3rem] flex justify-center">
              <div className="w-32 h-32 bg-slate-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center relative group overflow-hidden">
                <UserCircle2 className="w-20 h-20 text-slate-300" />
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">
                    Change
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="px-6 mt-6">
                <input
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  className="w-full text-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-slate-900 text-xl outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            ) : (
              <h3 className="text-2xl font-black text-slate-900 mt-6">
                {profileData.fullName}
              </h3>
            )}

            <div className="mt-3 flex justify-center gap-2">
              <p className="text-orange-600 font-bold bg-orange-50 px-4 py-1.5 rounded-full text-[10px] border border-orange-100 uppercase tracking-wider">
                {user?.role}
              </p>
              <p
                className={`font-bold px-4 py-1.5 rounded-full text-[10px] border tracking-wider uppercase ${profileData.accountStatus === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
              >
                {profileData.accountStatus} A/C
              </p>
            </div>

            <div className="mt-8 px-6 space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Gender
                  </p>
                  {isEditing ? (
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          gender: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">
                      {profileData.gender}
                    </p>
                  )}
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    DOB
                  </p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) =>
                        setProfileData({ ...profileData, dob: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">
                      {formatDateIndian(profileData.dob).split(" ")[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Phone Number
                </p>
                {isEditing ? (
                  <input
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 outline-none text-sm focus:ring-2 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-sm">
                    {profileData.phone}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Address
                </p>
                {isEditing ? (
                  <textarea
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 outline-none text-sm resize-none focus:ring-2 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-sm leading-relaxed">
                    {profileData.address}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Professional & Auth Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl">
                Employment Details
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Assigned Shift
                </label>
                {isEditing ? (
                  <select
                    value={profileData.shift}
                    onChange={(e) =>
                      setProfileData({ ...profileData, shift: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option>Morning (08:00 AM - 04:00 PM)</option>
                    <option>Evening (04:00 PM - 12:00 AM)</option>
                    <option>Night (12:00 AM - 08:00 AM)</option>
                  </select>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profileData.shift}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Department
                </label>
                {isEditing ? (
                  <input
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        department: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profileData.department}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date of Joining
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 opacity-80 cursor-not-allowed text-center sm:text-left">
                  {formatDateIndian(profileData.joinDate).split(" ")[0]}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Spoken Languages
                </label>
                {isEditing ? (
                  <input
                    value={profileData.languages}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        languages: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. English, Hindi..."
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profileData.languages}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Credentials Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                System Credentials
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> System Email (Login ID)
                  </p>
                  <p className="font-extrabold text-slate-800 font-mono text-sm">
                    {profileData.email}
                  </p>
                </div>
                {isEditing && (
                  <span className="text-xs font-bold text-red-500">
                    Contact Admin
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <UserCircle2 className="w-3 h-3" /> Username
                  </p>
                  <p className="font-extrabold text-slate-800 font-mono text-sm">
                    {profileData.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Key className="w-3 h-3" /> Master Password
                  </p>
                  <p className="font-extrabold text-slate-800 text-sm">
                    ••••••••••••
                  </p>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
