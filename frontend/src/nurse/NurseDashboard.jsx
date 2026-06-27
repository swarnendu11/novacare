/**
 * Nurse Dashboard — NovaCare
 * Main overview with stats, assigned patient summary, and task overview
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { mockAdmissions, mockBeds } from "../services/mockData";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import {
  Heart,
  Users,
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Pill,
  Activity,
  FileBarChart,
  Thermometer,
  User,
} from "lucide-react";
import { useGreeting } from "../hooks/useGreeting";

const MOCK_TASKS = [
  {
    id: 1,
    patient: "John Patient",
    room: "G-101",
    task: "Administer Amlodipine 5mg",
    time: "10:00 AM",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    patient: "Alice Brown",
    room: "F-204",
    task: "IV Drip Change – Saline",
    time: "10:30 AM",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    patient: "Bob Wilson",
    room: "ICU-01",
    task: "Monitor Vitals – Hourly",
    time: "11:00 AM",
    status: "pending",
    priority: "critical",
  },
  {
    id: 4,
    patient: "John Patient",
    room: "G-101",
    task: "Record Blood Pressure",
    time: "09:00 AM",
    status: "completed",
    priority: "medium",
  },
  {
    id: 5,
    patient: "Alice Brown",
    room: "F-204",
    task: "Wound Dressing",
    time: "08:30 AM",
    status: "completed",
    priority: "high",
  },
];

const PRIORITY_STYLE = {
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  medium: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  low: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

export default function NurseDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const admissions = mockAdmissions.getAll({ status: "admitted" });
  const pendingTasks = MOCK_TASKS.filter((t) => t.status === "pending");
  const completedTasks = MOCK_TASKS.filter((t) => t.status === "completed");
  const criticalCount = admissions.filter(
    (a) =>
      a.reason?.toLowerCase().includes("acute") ||
      a.reason?.toLowerCase().includes("icu"),
  ).length;

  return (
    <div
      className="space-y-8 font-sans"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Hero Header */}
      <HeroSection
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Nurse"} 👋`}
        subtitle={`${salutation} Monitor patients, manage treatments, and deliver care.`}
        badge="Patient Care Hub"
        icon={Heart}
        gradient="linear-gradient(135deg, #9F1239 0%, #E11D48 50%, #FB7185 100%)"
        stats={[
          { label: "Assigned", value: admissions.length },
          { label: "Pending Tasks", value: pendingTasks.length },
          { label: "Critical", value: criticalCount },
        ]}
      />

      {/* Stats Cards */}
      <StatsCards
        stats={[
          {
            label: "Active Patients",
            value: admissions.length,
            icon: Users,
            gradient: "linear-gradient(135deg, #E11D48, #FB7185)",
            trend: "+2 today",
          },
          {
            label: "Pending Tasks",
            value: pendingTasks.length,
            icon: ClipboardList,
            gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
            trend: "3 urgent",
          },
          {
            label: "Completed Today",
            value: completedTasks.length,
            icon: CheckCircle2,
            gradient: "linear-gradient(135deg, #10B981, #34D399)",
            trend: "On track",
          },
          {
            label: "Critical Alerts",
            value: criticalCount,
            icon: AlertTriangle,
            gradient: "linear-gradient(135deg, #EF4444, #F87171)",
            trend: "Active monitoring",
          },
        ]}
        columns={4}
      />

      {/* Quick Actions */}
      <QuickActions
        title="Nurse Quick Actions"
        actions={[
          {
            label: "View Patients",
            desc: "Assigned ward patients",
            icon: Users,
            color: "rose",
            to: "/nurse/patients",
          },
          {
            label: "Tasks",
            desc: "Treatments & meds",
            icon: ClipboardList,
            color: "amber",
            to: "/nurse/tasks",
          },
          {
            label: "Vitals",
            desc: "Record patient vitals",
            icon: Thermometer,
            color: "blue",
            to: "/nurse/patients",
          },
          {
            label: "Clinical Notes",
            desc: "Patient documentation",
            icon: FileBarChart,
            color: "green",
            to: "/nurse/reports",
          },
        ]}
        columns={4}
      />

      {/* Upcoming Tasks Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-rose-500" /> Upcoming Tasks
            </h3>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase tracking-widest">
              {pendingTasks.length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((t, i) => {
              const ps = PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.medium;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border ${ps.border} ${ps.bg} flex items-center gap-4`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${ps.dot} flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">{t.task}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.patient} · Room {t.room}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black ${ps.text} uppercase tracking-widest`}
                  >
                    {t.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Patient Overview */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" /> My Patients
            </h3>
            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest">
              {admissions.length} Admitted
            </span>
          </div>
          <div className="space-y-3">
            {admissions.slice(0, 4).map((a, i) => {
              const isCritical =
                a.reason?.toLowerCase().includes("acute") || a.ward === "ICU";
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl border border-slate-100 hover:border-rose-200 hover:shadow-sm transition-all flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm ${isCritical ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-rose-400 to-pink-500"}`}
                  >
                    {a.patientName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">
                      {a.patientName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {a.ward} · Bed {a.bed}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${isCritical ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
                  >
                    {isCritical ? "Critical" : "Stable"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
