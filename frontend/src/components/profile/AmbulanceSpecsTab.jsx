import React from "react";
import { Activity, BatteryCharging, Gauge, HeartPulse } from "lucide-react";

export default function AmbulanceSpecsTab() {
  const specs = [
    { label: "Oxygen Support", value: "Dual cylinder ready", icon: Activity },
    { label: "Cardiac Monitor", value: "Operational", icon: HeartPulse },
    { label: "Fuel Level", value: "82%", icon: Gauge },
    { label: "Backup Power", value: "Charged", icon: BatteryCharging },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-black flex items-center gap-2 mb-6">
        <AmbulanceIcon /> Specifications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
          >
            <Icon className="w-5 h-5 text-blue-500 mb-3" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {label}
            </p>
            <p className="font-black text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AmbulanceIcon() {
  return <Activity className="w-5 h-5 text-blue-500" />;
}
