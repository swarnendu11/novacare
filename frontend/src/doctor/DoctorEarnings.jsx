import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  IndianRupee,
  PieChart,
  Activity,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatINR } from "../utils/formatIndian";
import { useAuth } from "../context/AuthContext";

export default function DoctorEarnings() {
  const { user } = useAuth();

  const weeklyData = [
    { name: "Mon", earnings: 4500 },
    { name: "Tue", earnings: 8000 },
    { name: "Wed", earnings: 5600 },
    { name: "Thu", earnings: 9500 },
    { name: "Fri", earnings: 11200 },
    { name: "Sat", earnings: 15600 },
    { name: "Sun", earnings: 4000 },
  ];

  const totalWeeklyEarnings = weeklyData.reduce(
    (acc, obj) => acc + obj.earnings,
    0,
  );
  const platformFee = totalWeeklyEarnings * 0.1; // Assuming 10% platform fee
  const netEarnings = totalWeeklyEarnings - platformFee;

  return (
    <div className="font-sans max-w-7xl mx-auto pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Earnings Dashboard
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Track your consultation revenue and platform settlements.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-5 h-5" /> Download Tax Report
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Total Earned Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <IndianRupee className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-extrabold text-slate-300 text-sm uppercase tracking-widest">
              Total Earned (This Week)
            </h3>
          </div>
          <p className="text-4xl font-black text-white">
            {formatINR(totalWeeklyEarnings)}
          </p>
          <p className="text-green-400 font-bold text-sm mt-4 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +14% from last week
          </p>
        </motion.div>

        {/* Net Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center border border-green-100 placeholder-teal-500">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest">
                Net Payable
              </h3>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {formatINR(netEarnings)}
            </p>
          </div>
          <p className="text-slate-500 font-bold text-sm mt-4">
            Platform Fee Deducted:{" "}
            <span className="text-red-500">{formatINR(platformFee)}</span>
          </p>
        </motion.div>

        {/* Pending Settlement Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center border border-orange-100">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-widest">
                Pending Settlement
              </h3>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {formatINR(4500)}
            </p>
          </div>
          <p className="text-orange-500 font-bold text-sm mt-4 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg w-fit">
            Processing transfers...
          </p>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 p-8"
      >
        <div className="mb-8">
          <h3 className="text-xl font-extrabold text-slate-900">
            Revenue Overview
          </h3>
          <p className="text-slate-500 font-medium">
            Daily breakdowns for the current week.
          </p>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontWeight: 700 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
                formatter={(value) => [formatINR(value), "Earnings"]}
              />
              <Bar dataKey="earnings" radius={[8, 8, 8, 8]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.earnings > 10000 ? "#2563eb" : "#93c5fd"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
