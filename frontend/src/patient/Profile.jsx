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
  HeartPulse,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { formatDateIndian } from "../utils/formatIndian";

export default function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    patientId: "PT-" + Math.floor(Math.random() * 90000 + 10000),
    fullName: "",
    email: "",
    phone: "+91 98765 12345",
    gender: "Male",
    dob: "1985-06-15",
    address: "123 Health Street, Wellness City, Ind 40001",
    insuranceProvider: "BlueCross Health",
    policyNumber: "BCH-8472910-X",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "+91 98765 43210",
    bloodGroup: "O+",
    allergies: "Penicillin, Peanuts",
    medicalHistory: "Mild Hypertension (diagnosed 2021). No major surgeries.",
    registrationDate: "2025-01-10",
    patientType: "OPD",
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        fullName: user.name || "Patient Name",
        email: user.email || "patient@example.com",
      }));
    }
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile details updated successfully");
  };

  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Profile
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your personal and medical information.
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Main Identity & Demographic Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-32 bg-gradient-to-br from-blue-600 to-cyan-500 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
              <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 blur-2xl rounded-full" />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white font-mono text-xs font-bold shadow-sm flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> ID: {profileData.patientId}
              </div>
            </div>
            <div className="px-8 pb-8 flex flex-col items-center relative -top-16 mb-[-4rem]">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-slate-50 shadow-xl flex items-center justify-center border-4 border-white overflow-hidden relative group">
                  <UserCircle2 className="w-20 h-20 text-slate-300" />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      Change
                    </span>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <input
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  className="w-full mt-4 text-center bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-extrabold text-slate-900 text-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              ) : (
                <h3 className="text-2xl font-extrabold text-slate-900 mt-4 text-center">
                  {profileData.fullName}
                </h3>
              )}

              <div className="flex gap-2 mt-3">
                <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-blue-100">
                  {user?.role} Account
                </span>
                <span
                  className={`font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${profileData.patientType === "IPD" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
                >
                  {profileData.patientType} PATIENT
                </span>
              </div>

              <div className="w-full mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="font-bold text-slate-900 text-sm">
                        {profileData.gender}
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      DOB / Age
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dob}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            dob: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      />
                    ) : (
                      <p className="font-bold text-slate-900 text-sm">
                        {formatDateIndian(profileData.dob).split(" ")[0]}{" "}
                        <span className="text-slate-500 font-medium ml-1">
                          ({calculateAge(profileData.dob)}y)
                        </span>
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
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm">
                      {profileData.phone}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Email Address
                  </p>
                  {isEditing ? (
                    <input
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {profileData.email}
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
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm resize-none"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-sm leading-relaxed">
                      {profileData.address}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Registered
                  on: {formatDateIndian(profileData.registrationDate)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Info */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl">
                  Medical Profile
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-50/50 px-4 py-2 border border-red-100 rounded-xl flex items-center gap-3">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    Blood group
                  </p>
                  {isEditing ? (
                    <input
                      value={profileData.bloodGroup}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          bloodGroup: e.target.value,
                        })
                      }
                      className="w-16 bg-white border border-red-200 rounded-lg px-2 py-1 font-extrabold text-red-500 text-center outline-none focus:ring-2 focus:ring-red-500/30 transition-all text-lg"
                    />
                  ) : (
                    <p className="font-extrabold text-red-600 text-2xl">
                      {profileData.bloodGroup}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Known Allergies
                </label>
                {isEditing ? (
                  <input
                    value={profileData.allergies}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        allergies: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-medium text-slate-700">
                    {profileData.allergies || "None reported"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Medical History & Chronic Conditions
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.medicalHistory}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        medicalHistory: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="List any past surgeries, chronic illnesses, or ongoing treatments..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white resize-none"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 font-medium text-slate-700 leading-relaxed min-h-[6rem]">
                    {profileData.medicalHistory ||
                      "No significant medical history found."}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Insurance Information */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shadow-inner">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Insurance Info
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Provider
                  </label>
                  {isEditing ? (
                    <input
                      value={profileData.insuranceProvider}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          insuranceProvider: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white"
                    />
                  ) : (
                    <p className="font-bold text-slate-700">
                      {profileData.insuranceProvider}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Policy Number
                  </label>
                  {isEditing ? (
                    <input
                      value={profileData.policyNumber}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          policyNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white"
                    />
                  ) : (
                    <div className="font-mono font-bold tracking-wide text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 inline-block">
                      {profileData.policyNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-inner">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Emergency Contact
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Contact Name
                  </label>
                  {isEditing ? (
                    <input
                      value={profileData.emergencyContactName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyContactName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white"
                    />
                  ) : (
                    <p className="font-bold text-slate-700">
                      {profileData.emergencyContactName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      value={profileData.emergencyContactPhone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          emergencyContactPhone: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {profileData.emergencyContactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
