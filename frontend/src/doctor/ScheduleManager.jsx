import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Save, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function ScheduleManager() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [schedule, setSchedule] = useState(
    days.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          isAvailable: day !== "Sunday",
          startTime: "09:00",
          endTime: "18:00",
          slotDuration: 30,
        },
      }),
      {},
    ),
  );

  const handleToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], isAvailable: !prev[day].isAvailable },
    }));
  };

  const handleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = () => {
    toast.success("Schedule updated successfully!");
  };

  const copyMondayToAll = () => {
    const mondayConf = schedule["Monday"];
    setSchedule((prev) => {
      const next = { ...prev };
      days.forEach((d) => {
        if (d !== "Sunday") next[d] = { ...mondayConf };
      });
      return next;
    });
    toast.success("Monday schedule copied to weekdays");
  };

  return (
    <div className="font-sans max-w-5xl mx-auto pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Manage Schedule
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Set your availability and appointment length.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={copyMondayToAll}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Copy className="w-4 h-4" /> Copy Mon to All
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" /> Save Schedule
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden divide-y divide-slate-100"
      >
        <div className="grid grid-cols-12 gap-4 p-6 bg-slate-50/50">
          <div className="col-span-4 lg:col-span-3 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Day
          </div>
          <div className="col-span-8 lg:col-span-9 grid grid-cols-3 gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div>
              <Clock className="w-4 h-4 inline mr-1" /> Start Time
            </div>
            <div>
              <Clock className="w-4 h-4 inline mr-1" /> End Time
            </div>
            <div className="hidden lg:block">Slot Duration</div>
          </div>
        </div>

        {days.map((day) => (
          <div
            key={day}
            className={`grid grid-cols-12 gap-4 p-6 items-center transition-colors ${schedule[day].isAvailable ? "bg-white" : "bg-slate-50/50"}`}
          >
            <div className="col-span-4 lg:col-span-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={schedule[day].isAvailable}
                    onChange={() => handleToggle(day)}
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${schedule[day].isAvailable ? "bg-blue-500" : "bg-slate-300"}`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${schedule[day].isAvailable ? "transform translate-x-4" : ""}`}
                  ></div>
                </div>
                <span
                  className={`font-extrabold text-lg ${day === "Sunday" || day === "Saturday" ? "text-red-500" : "text-slate-900"}`}
                >
                  {day}
                </span>
              </label>
            </div>

            <div
              className={`col-span-8 lg:col-span-9 grid grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${schedule[day].isAvailable ? "opacity-100" : "opacity-40 pointer-events-none"}`}
            >
              <input
                type="time"
                value={schedule[day].startTime}
                onChange={(e) => handleChange(day, "startTime", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                type="time"
                value={schedule[day].endTime}
                onChange={(e) => handleChange(day, "endTime", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <select
                value={schedule[day].slotDuration}
                onChange={(e) =>
                  handleChange(day, "slotDuration", e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 hidden lg:block cursor-pointer"
              >
                <option value={15}>15 mins</option>
                <option value={20}>20 mins</option>
                <option value={30}>30 mins</option>
                <option value={60}>60 mins</option>
              </select>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
