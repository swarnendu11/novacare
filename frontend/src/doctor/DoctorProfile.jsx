import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, ShieldCheck, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function DoctorProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "Dr. Arjun Mehta",
    doctorId: "DOC-902341",
    specialization: "Interventional Cardiology",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: "14 Years",
    fee: "800",
    email: user?.email || "arjun.mehta@novacare.com",
    phone: "+91 98000 00002",
    bio: "Dedicated cardiologist with over a decade of experience in interventional procedures. Passionate about patient care and preventive cardiology. Fellowship from Royal College of Physicians.",
    hospital: "NovaCare Main Campus",
    days: "Mon - Sat",
    slots: "09:00 AM - 05:00 PM",
    status: "Active",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Doctor Profile updated successfully!");
  };

  return (
    <div className="space-y-8 font-sans pb-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Professional Profile
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your public information and consultation fees.
          </p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${
            isEditing
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/40"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-blue-600"
          }`}
        >
          {isEditing ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> Save Profile
            </>
          ) : (
            "Edit Profile"
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden text-center pb-8"
          >
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl"></div>
            </div>
            <div className="relative -top-16 mb-[-3rem] flex justify-center">
              <div className="w-32 h-32 bg-slate-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center relative group overflow-hidden">
                <span className="text-4xl font-extrabold text-slate-400">
                  {profile.name.charAt(4)}
                </span>
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Available Days
                </label>
                {isEditing ? (
                  <input
                    value={profile.days}
                    onChange={(e) =>
                      setProfile({ ...profile, days: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                    placeholder="e.g. Mon - Fri"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profile.days}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Available Time Slots
                </label>
                {isEditing ? (
                  <input
                    value={profile.slots}
                    onChange={(e) =>
                      setProfile({ ...profile, slots: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                    placeholder="e.g. 09:00 AM - 05:00 PM"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profile.slots}
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="px-6 mt-6">
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full text-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-slate-900 text-xl outline-none"
                />
              </div>
            ) : (
              <h3 className="text-2xl font-black text-slate-900 mt-6">
                {profile.name}
              </h3>
            )}

            <p className="text-blue-600 font-bold bg-blue-50 px-4 py-1.5 rounded-full inline-block mt-3 text-sm border border-blue-100">
              {profile.specialization}
            </p>

            <div className="mt-2">
              <p className="text-slate-500 font-bold text-sm">
                {profile.qualification}
              </p>
              <p className="text-slate-400 font-medium text-xs mt-1">
                ID: {profile.doctorId}
              </p>
            </div>

            <div className="mt-8 px-6 space-y-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-none flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 mt-1">
                      Status
                    </p>
                    {isEditing ? (
                      <select
                        value={profile.status}
                        onChange={(e) =>
                          setProfile({ ...profile, status: e.target.value })
                        }
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-900 text-sm outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <p className="font-bold text-slate-900 text-sm">
                        {profile.status}
                      </p>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <div
                    className={`w-3 h-3 rounded-full ${profile.status === "Active" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}
                  ></div>
                )}
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-none">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-1">
                  Consultation Fee
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.fee}
                    onChange={(e) =>
                      setProfile({ ...profile, fee: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-slate-900 text-2xl outline-none"
                  />
                ) : (
                  <p className="font-black text-slate-900 text-2xl">
                    ₹{profile.fee}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8"
          >
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              About Me
            </h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={5}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            ) : (
              <p className="text-slate-600 font-medium leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    value={profile.experience}
                    onChange={(e) =>
                      setProfile({ ...profile, experience: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profile.experience}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Hospital Affiliation
                </label>
                {isEditing ? (
                  <input
                    value={profile.hospital}
                    onChange={(e) =>
                      setProfile({ ...profile, hospital: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />{" "}
                    {profile.hospital}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8"
          >
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Primary Email
                </label>
                {isEditing ? (
                  <input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800">
                    {profile.email}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none"
                  />
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> {profile.phone}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
