import React, { useState } from "react";
import { ShieldAlert, Key, Server, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function SystemAccessTab() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    roleLevel: "Super Administrator (Level 5)",
    assignedRegions: "All Regions (Global)",
    lastLogin: "Today, 08:30 AM (IP: 192.168.1.45)",
    securityClearance: "Maximum"
  });

  const handleSave = () => { toast.success("Access details updated"); setEditing(false); };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex justify-between mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-black flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-blue-500" /> System Access & Security</h3>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold">{editing ? "Save" : "Edit"}</button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2"><Key className="w-3 h-3 inline mr-1"/> Role Level</label>{editing ? <input className="border p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={profile.roleLevel} onChange={e=>setProfile({...profile, roleLevel: e.target.value})} /> : <p className="font-bold text-slate-800">{profile.roleLevel}</p>}</div>
        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2"><Server className="w-3 h-3 inline mr-1"/> Assigned Regions</label>{editing ? <input className="border p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={profile.assignedRegions} onChange={e=>setProfile({...profile, assignedRegions: e.target.value})} /> : <p className="font-bold text-slate-800">{profile.assignedRegions}</p>}</div>
        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2"><Lock className="w-3 h-3 inline mr-1"/> Security Clearance</label>{editing ? <input className="border p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={profile.securityClearance} onChange={e=>setProfile({...profile, securityClearance: e.target.value})} /> : <p className="font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg w-max">{profile.securityClearance}</p>}</div>
        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Last Login Activity</label> <p className="font-medium text-slate-500 text-sm">{profile.lastLogin}</p></div>
      </div>
    </div>
  );
}
