import React from "react";
import { MapPin, Radio, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

export default function EmergencyAvailabilityTab({ isOnline, setIsOnline }) {
  const toggleOnline = () => {
    const nextValue = !isOnline;
    setIsOnline(nextValue);
    toast.success(nextValue ? "Ambulance is now online" : "Ambulance is now offline");
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="flex justify-between mb-8 pb-4 border-b border-slate-100">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-500" /> Availability & Tracking
        </h3>
        <button
          onClick={toggleOnline}
          className={`px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 ${
            isOnline
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isOnline ? (
            <ToggleRight className="w-5 h-5" />
          ) : (
            <ToggleLeft className="w-5 h-5" />
          )}
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <MapPin className="w-5 h-5 text-blue-500 mb-3" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Current Location
          </p>
          <p className="font-black text-slate-900 mt-1">
            Emergency Bay, NovaCare Hospital
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <Radio className="w-5 h-5 text-blue-500 mb-3" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Dispatch Status
          </p>
          <p className="font-black text-slate-900 mt-1">
            {isOnline ? "Ready for emergency dispatch" : "Unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}
