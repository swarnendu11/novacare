import React, { useState, useRef } from "react";
import { Camera, ShieldCheck, Star, Activity, Calendar, Power } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfileHeader({ user, isOnline }) {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setAvatar(reader.result); toast.success("Profile photo updated!"); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-950 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-white/20 overflow-hidden">
            {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : (user?.name || "S").charAt(0).toUpperCase()}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-3 -right-3 bg-white text-slate-900 p-2.5 rounded-2xl shadow-xl hover:scale-110 transition-transform border-2 border-white/20" title="Change Photo">
            <Camera className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              {user?.name || "System Administrator"}
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </h2>
            <span className="inline-block bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border">
              ID: ADM-{String(user?.id || 101).padStart(4, "0")}
            </span>
          </div>
          <p className="text-purple-200 font-bold flex items-center justify-center md:justify-start gap-2 mb-6">
            <Activity className="w-4 h-4" /> System Administrator
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-xl"><Star className="w-5 h-5 text-amber-400 fill-amber-400" /></div>
              <div><p className="text-xs text-purple-200 font-bold uppercase tracking-wider">System Uptime</p><p className="font-black text-lg">99.9%</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-xl"><Activity className="w-5 h-5 text-emerald-400" /></div>
              <div><p className="text-xs text-purple-200 font-bold uppercase tracking-wider">Admins Online</p><p className="font-black text-lg">4</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-xl"><Calendar className="w-5 h-5 text-purple-400" /></div>
              <div><p className="text-xs text-purple-200 font-bold uppercase tracking-wider">Last Audit</p><p className="font-black text-lg">Today, 02:00 AM</p></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-xl"><Power className={`w-5 h-5 ${isOnline !== false ? 'text-emerald-400' : 'text-slate-400'}`} /></div>
              <div>
                <p className="text-xs text-purple-200 font-bold uppercase tracking-wider">Status</p>
                <p className={`font-black text-lg ${isOnline !== false ? 'text-emerald-400' : 'text-slate-400'}`}>{isOnline !== false ? 'Active' : 'Offline'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
