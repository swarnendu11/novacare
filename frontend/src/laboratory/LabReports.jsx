import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Microscope, Search, Filter, CheckCircle2, Download, Eye, FileText } from "lucide-react";
import { mockLabReports } from "../services/mockData";

export default function LabReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const all = mockLabReports.getAll();
    setReports(all.filter((r) => r.status === "completed"));
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto pb-10" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 mb-2 text-white">
              <Microscope className="w-8 h-8 text-teal-300" /> Completed Reports
            </h2>
            <p className="text-teal-100 font-medium text-lg">
              Archive of finalized diagnostic results.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 text-center">
              <p className="text-4xl font-black">{reports.length}</p>
              <p className="text-teal-200 text-sm font-bold uppercase tracking-wider">Total Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient or test name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
          />
        </div>
        <button className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 rounded-xl transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Patient</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Test Name</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Date Completed</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Priority</th>
                <th className="p-4 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                        {report.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{report.patientName}</p>
                        <p className="text-xs text-slate-500">#{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{report.testName}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {report.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        report.type === "Urgent" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500 font-medium">
                    No reports match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
