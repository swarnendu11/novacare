import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Settings,
  Hospital,
  Mail,
  Bell,
  IndianRupee,
  Database,
  Save,
  ToggleLeft,
  ToggleRight,
  Shield,
  Palette,
} from "lucide-react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    hospitalName: "NovaCare Hospital",
    hospitalAddress: "City Centre, Mumbai, Maharashtra, India",
    contactEmail: "contact@novacare.com",
    contactPhone: "+91 98765 43210",
    website: "https://novacare.com",
    defaultConsultationFee: 500,
    taxRate: 18,
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST)",
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    labReportAlerts: true,
    billingAlerts: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "Daily",
    primaryColor: "#4F46E5",
    accentColor: "#10B981",
  });

  const [saved, setSaved] = useState(false);

  const update = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved successfully!");
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ settingKey, label, desc }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div>
        <p className="font-bold text-slate-900 text-sm">{label}</p>
        {desc && (
          <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
        )}
      </div>
      <button
        onClick={() => update(settingKey, !settings[settingKey])}
        className={`transition-colors ${settings[settingKey] ? "text-indigo-600" : "text-slate-300"}`}
      >
        {settings[settingKey] ? (
          <ToggleRight className="w-9 h-9" />
        ) : (
          <ToggleLeft className="w-9 h-9" />
        )}
      </button>
    </div>
  );

  const Section = ({ icon, title, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200"
    >
      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        {icon} {title}
      </h3>
      {children}
    </motion.div>
  );

  const Field = ({ label, settingKey, type = "text", placeholder }) => (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={settings[settingKey]}
        onChange={(e) =>
          update(
            settingKey,
            type === "number" ? Number(e.target.value) : e.target.value,
          )
        }
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/30 font-bold text-slate-900 transition-all"
      />
    </div>
  );

  return (
    <div className="font-sans max-w-4xl mx-auto pb-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-400" /> System Settings
          </h2>
          <p className="text-slate-400 font-medium">
            Configure hospital details, notifications, and system options.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="relative z-10 px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Save className="w-5 h-5" /> {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      {/* Hospital Info */}
      <Section
        icon={<Hospital className="w-5 h-5 text-indigo-500" />}
        title="Hospital Information"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Hospital Name" settingKey="hospitalName" />
          <Field label="Website" settingKey="website" />
          <div className="md:col-span-2">
            <Field label="Hospital Address" settingKey="hospitalAddress" />
          </div>
          <Field label="Contact Email" settingKey="contactEmail" type="email" />
          <Field label="Contact Phone" settingKey="contactPhone" />
        </div>
      </Section>

      {/* Billing Settings */}
      <Section
        icon={<IndianRupee className="w-5 h-5 text-emerald-500" />}
        title="Billing & Fees"
      >
        <div className="grid md:grid-cols-3 gap-5">
          <Field
            label="Default Consultation Fee (₹)"
            settingKey="defaultConsultationFee"
            type="number"
          />
          <Field
            label="Tax / GST Rate (%)"
            settingKey="taxRate"
            type="number"
          />
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/30 font-bold text-slate-900"
            >
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm font-medium text-indigo-700">
          ℹ️ Default consultation fee applies when no custom fee is set for a
          doctor.
        </div>
      </Section>

      {/* Notifications */}
      <Section
        icon={<Bell className="w-5 h-5 text-orange-500" />}
        title="Notifications"
      >
        <div className="space-y-3">
          <Toggle
            settingKey="emailNotifications"
            label="Email Notifications"
            desc="Send confirmations and updates via email"
          />
          <Toggle
            settingKey="smsNotifications"
            label="SMS Notifications"
            desc="Send text messages for important alerts"
          />
          <Toggle
            settingKey="appointmentReminders"
            label="Appointment Reminders"
            desc="Remind patients 24 hours before appointment"
          />
          <Toggle
            settingKey="labReportAlerts"
            label="Lab Report Alerts"
            desc="Notify patients when reports are ready"
          />
          <Toggle
            settingKey="billingAlerts"
            label="Billing Alerts"
            desc="Send payment confirmations and due reminders"
          />
        </div>
      </Section>

      {/* Security  */}
      <Section
        icon={<Shield className="w-5 h-5 text-red-500" />}
        title="Security & Access"
      >
        <div className="space-y-3">
          <Toggle
            settingKey="maintenanceMode"
            label="Maintenance Mode"
            desc="Disable patient logins for system updates"
          />
        </div>
        <div
          className={`mt-4 p-4 rounded-2xl border text-sm font-bold ${settings.maintenanceMode ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-100 text-slate-600"}`}
        >
          {settings.maintenanceMode
            ? "⚠️ Maintenance mode is ON. Patients cannot log in right now."
            : "✅ System is running normally. All users can log in."}
        </div>
      </Section>

      {/* Backup */}
      <Section
        icon={<Database className="w-5 h-5 text-blue-500" />}
        title="Backup & Data"
      >
        <div className="space-y-3 mb-5">
          <Toggle
            settingKey="autoBackup"
            label="Automatic Backup"
            desc="Back up the database automatically"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => update("backupFrequency", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/30 font-bold text-slate-900"
            >
              <option>Hourly</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/30 font-bold text-slate-900"
            >
              <option>Asia/Kolkata (IST)</option>
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => toast.success("Manual backup started!")}
          className="mt-4 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <Database className="w-4 h-4" /> Backup Now
        </button>
      </Section>

      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-lg"
        >
          <Save className="w-5 h-5" />{" "}
          {saved ? "✓ All Changes Saved!" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
