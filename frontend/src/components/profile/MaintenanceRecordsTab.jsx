import React from "react";
import { CheckCircle2, ClipboardCheck, Wrench } from "lucide-react";

export default function MaintenanceRecordsTab() {
  const records = [
    { task: "Engine inspection", date: "2026-06-20", status: "Completed" },
    { task: "Medical equipment audit", date: "2026-06-18", status: "Completed" },
    { task: "Next service", date: "2026-07-05", status: "Scheduled" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-black flex items-center gap-2 mb-6">
        <Wrench className="w-5 h-5 text-blue-500" /> Maintenance Records
      </h3>
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={`${record.task}-${record.date}`}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-black text-slate-900">{record.task}</p>
              <p className="text-sm text-slate-500">{record.date}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 flex items-center gap-1">
              {record.status === "Completed" ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <ClipboardCheck className="w-3 h-3" />
              )}
              {record.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
