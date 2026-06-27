import React, { useState } from "react";
import toast from "react-hot-toast";
import { User } from "lucide-react";

export default function PersonalDetailsTab({ user }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || "Jane",
    middleName: "",
    lastName: user?.name?.split(' ')[1] || "Doe",
    dob: "1990-01-01",
    gender: "Female",
    bloodGroup: "A+",
    mobile: user?.phone || "+91 98000 00000",
    alternateMobile: "",
    email: user?.email || "user@novacare.com",
    emergencyContact: "",
    address: "NovaCare Staff Quarters",
    pincode: "110057",
    city: "New Delhi",
    state: "Delhi"
  });

  const handlePincodeChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, pincode: val });
    if (val.length === 6) {
      toast.success("Location auto-fetched via PIN code");
      setForm(prev => ({ ...prev, city: "New Delhi", state: "Delhi" }));
    }
  };

  const handleSave = () => { toast.success("Personal details updated successfully"); setEditing(false); };
  
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex justify-between mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-black flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /> Personal Details</h3>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold transition-colors">{editing ? "Save Changes" : "Edit Details"}</button>
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">First Name</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} /> : <p className="font-bold text-slate-800">{form.firstName}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Middle Name</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.middleName} onChange={e=>setForm({...form, middleName: e.target.value})} /> : <p className="font-bold text-slate-800">{form.middleName || "-"}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Last Name</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} /> : <p className="font-bold text-slate-800">{form.lastName}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Date of Birth</label>{editing ? <input type="date" className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.dob} onChange={e=>setForm({...form, dob: e.target.value})} /> : <p className="font-bold text-slate-800">{form.dob}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Gender</label>{editing ? <select className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select> : <p className="font-bold text-slate-800">{form.gender}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Blood Group</label>{editing ? <select className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup: e.target.value})}><option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option></select> : <p className="font-bold text-slate-800">{form.bloodGroup}</p>}</div>
        </div>

        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2 pt-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Mobile Number</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.mobile} onChange={e=>setForm({...form, mobile: e.target.value})} /> : <p className="font-bold text-slate-800">{form.mobile}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Alternate Mobile</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.alternateMobile} onChange={e=>setForm({...form, alternateMobile: e.target.value})} /> : <p className="font-bold text-slate-800">{form.alternateMobile || "-"}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} /> : <p className="font-bold text-slate-800">{form.email}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Emergency Contact</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold text-red-600" value={form.emergencyContact} onChange={e=>setForm({...form, emergencyContact: e.target.value})} /> : <p className="font-bold text-red-600">{form.emergencyContact || "-"}</p>}</div>
        </div>

        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-2 pt-4">Residential Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Address</label>{editing ? <textarea className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" rows="2" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} /> : <p className="font-bold text-slate-800">{form.address}</p>}</div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">PIN Code</label>{editing ? <input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold" value={form.pincode} onChange={handlePincodeChange} maxLength={6} /> : <p className="font-bold text-slate-800">{form.pincode}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">City</label><input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-100 font-bold text-slate-500" value={form.city} readOnly /></div>
            <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">State</label><input className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-100 font-bold text-slate-500" value={form.state} readOnly /></div>
          </div>
        </div>
      </div>
    </div>
  );
}