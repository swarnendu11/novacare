/**
 * Ward Boy Dashboard — NovaCare
 * Task overview, room allocation, and support logistics dashboard
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { mockAdmissions, mockWards, mockBeds } from "../services/mockData";
import HeroSection from "../components/dashboard/HeroSection";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import {
  Wrench,
  ClipboardList,
  ArrowRightLeft,
  Building2,
  Bed,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Package,
} from "lucide-react";
import { useGreeting } from "../hooks/useGreeting";

const MOCK_TASKS = [
  {
    id: 1,
    task: "Wheelchair transfer — John Patient → Radiology",
    room: "G-101",
    time: "10:15 AM",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    task: "Clean & sanitize Room F-205",
    room: "F-205",
    time: "10:45 AM",
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    task: "Deliver medical supplies — ICU Ward",
    room: "ICU",
    time: "11:00 AM",
    status: "pending",
    priority: "high",
  },
  {
    id: 4,
    task: "Assist patient transfer — Alice Brown → X-Ray",
    room: "F-204",
    time: "11:30 AM",
    status: "pending",
    priority: "medium",
  },
  {
    id: 5,
    task: "Bed change — General Ward G-102",
    room: "G-102",
    time: "09:00 AM",
    status: "completed",
    priority: "low",
  },
  {
    id: 6,
    task: "Collect lab samples — Oncology Ward",
    room: "O-301",
    time: "09:30 AM",
    status: "completed",
    priority: "medium",
  },
];

const PRIORITY_STYLE = {
  high: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  medium: {
    bg: "bg-blue-50",
    text: "text-blue-600",
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

export default function WardBoyDashboard() {
  const { user } = useAuth();
  const { greeting, salutation } = useGreeting();
  const wards = mockWards.getAll();
  const beds = mockBeds.getAll();
  const admissions = mockAdmissions.getAll({ status: "admitted" });
  const pendingTasks = MOCK_TASKS.filter((t) => t.status === "pending");
  const completedTasks = MOCK_TASKS.filter((t) => t.status === "completed");
  const availableBeds = beds.filter((b) => b.status === "available").length;

  return (
    <div
      className="space-y-8 font-sans"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Hero */}
      <HeroSection
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Team member"} 👋`}
        subtitle={`${salutation} Manage tasks, assist movement, and keep operations running.`}
        badge="Ward Boy Station"
        icon={Wrench}
        gradient="linear-gradient(135deg, #92400E 0%, #D97706 50%, #FBBF24 100%)"
        stats={[
          { label: "Pending Tasks", value: pendingTasks.length },
          { label: "Available Beds", value: availableBeds },
          { label: "Active Wards", value: wards.length },
        ]}
      />

      {/* Stats */}
      <StatsCards
        stats={[
          {
            label: "Pending Tasks",
            value: pendingTasks.length,
            icon: ClipboardList,
            gradient: "linear-gradient(135deg, #D97706, #FBBF24)",
            trend: `${pendingTasks.filter((t) => t.priority === "high").length} urgent`,
          },
          {
            label: "Completed Today",
            value: completedTasks.length,
            icon: CheckCircle2,
            gradient: "linear-gradient(135deg, #10B981, #34D399)",
            trend: "Good progress",
          },
          {
            label: "Active Patients",
            value: admissions.length,
            icon: Users,
            gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
            trend: `${wards.length} wards`,
          },
          {
            label: "Available Beds",
            value: availableBeds,
            icon: Bed,
            gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
            trend: `of ${beds.length} total`,
          },
        ]}
        columns={4}
      />

      {/* Quick Actions */}
      <QuickActions
        title="Quick Actions"
        actions={[
          {
            label: "My Tasks",
            desc: "Pending work items",
            icon: ClipboardList,
            color: "amber",
            to: "/wardboy/tasks",
          },
          {
            label: "Transfers",
            desc: "Patient movement",
            icon: ArrowRightLeft,
            color: "blue",
            to: "/wardboy/movement",
          },
          {
            label: "Room Info",
            desc: "Ward & bed status",
            icon: Building2,
            color: "purple",
            to: "/wardboy/rooms",
          },
          {
            label: "Profile",
            desc: "My details",
            icon: Users,
            color: "green",
            to: "/wardboy/profile",
          },
        ]}
        columns={4}
      />

      {/* Tasks & Room overview grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-500" /> My Tasks
            </h3>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
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
                      Room {t.room}
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

        {/* Ward Overview */}
        <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" /> Ward Overview
            </h3>
          </div>
          <div className="space-y-3">
            {wards.slice(0, 5).map((w, i) => {
              const occupancy = Math.round(
                (w.occupiedBeds / w.totalBeds) * 100,
              );
              const isHigh = occupancy > 80;
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-slate-900">{w.name}</p>
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border ${isHigh ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}
                    >
                      {occupancy}% Full
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>Floor: {w.floor}</span>
                    <span>·</span>
                    <span>
                      {w.occupiedBeds}/{w.totalBeds} beds occupied
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${isHigh ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
}
