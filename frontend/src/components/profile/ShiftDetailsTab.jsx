import React, { useState } from "react";
import { CalendarClock, ClipboardList, MapPin, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ShiftDetailsTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    shift: "Morning Shift",
    dutyArea: "General Ward - Block A",
    supervisor: "Nurse Supervisor",
    handoverTime: "02:00 PM",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success("Shift details updated");
    setEditing(false);
  };

  const fields = [
    { key: "shift", label: "Assigned Shift", icon: CalendarClock },
    { key: "dutyArea", label: "Duty Area", icon: MapPin },
    { key: "supervisor", label: "Supervisor", icon: UserCheck },
    { key: "handoverTime", label: "Handover Time", icon: ClipboardList },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex justify-between mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-black flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-blue-500" /> Shift & Duties
        </h3>
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold transition-colors"
        >
          {editing ? "Save Changes" : "Edit Details"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ key, label, icon: Icon }) => (
          <div key={key}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              <Icon className="w-3 h-3 inline mr-1" /> {label}
            </label>
            {editing ? (
              <input
                className="border border-slate-300 p-2.5 w-full rounded-xl bg-slate-50 font-bold"
                value={form[key]}
                onChange={(event) => handleChange(key, event.target.value)}
              />
            ) : (
              <p className="font-bold text-slate-800">{form[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
