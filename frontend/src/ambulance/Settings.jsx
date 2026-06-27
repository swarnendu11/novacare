/**
 * NovaCare Ambulance — Settings
 * System settings and configuration
 */

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Mail,
  MapPin,
  Moon,
  Phone,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

// Toggle Component
function Toggle({ enabled, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-blue-500" : "bg-slate-300"}`}
        onClick={() => onChange(!enabled)}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? "left-7" : "left-1"}`}
        />
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}

// Setting Section
function SettingSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-black text-slate-900">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    smsAlerts: true,
    emailAlerts: false,
    autoDispatch: false,
    darkMode: false,
    locationTracking: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    driverCheckIn: true,
    emergencySound: true,
  });

  const [responseTimeTarget, setResponseTimeTarget] = useState("8");
  const [maxDispatchRadius, setMaxDispatchRadius] = useState("15");

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex flex-col gap-6 pb-10 animate-fade-in font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-bold mt-1">
            Configure ambulance dispatch system preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <Toggle
            enabled={settings.notifications}
            onChange={(v) => updateSetting("notifications", v)}
            label="Enable Push Notifications"
          />
          <Toggle
            enabled={settings.smsAlerts}
            onChange={(v) => updateSetting("smsAlerts", v)}
            label="SMS Alerts for Critical Emergencies"
          />
          <Toggle
            enabled={settings.emailAlerts}
            onChange={(v) => updateSetting("emailAlerts", v)}
            label="Email Summary Reports"
          />
          <Toggle
            enabled={settings.emergencySound}
            onChange={(v) => updateSetting("emergencySound", v)}
            label="Emergency Alert Sound"
          />
        </SettingSection>

        {/* Dispatch Settings */}
        <SettingSection title="Dispatch Configuration" icon={Clock}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Response Time Target (minutes)
            </label>
            <input
              type="number"
              value={responseTimeTarget}
              onChange={(e) => setResponseTimeTarget(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-red-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Maximum Dispatch Radius (km)
            </label>
            <input
              type="number"
              value={maxDispatchRadius}
              onChange={(e) => setMaxDispatchRadius(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-red-300"
            />
          </div>
          <Toggle
            enabled={settings.autoDispatch}
            onChange={(v) => updateSetting("autoDispatch", v)}
            label="Auto-Assign Nearest Ambulance"
          />
        </SettingSection>

        {/* Fleet Monitoring */}
        <SettingSection title="Fleet Monitoring" icon={MapPin}>
          <Toggle
            enabled={settings.locationTracking}
            onChange={(v) => updateSetting("locationTracking", v)}
            label="Real-time GPS Tracking"
          />
          <Toggle
            enabled={settings.maintenanceAlerts}
            onChange={(v) => updateSetting("maintenanceAlerts", v)}
            label="Maintenance Due Alerts"
          />
          <Toggle
            enabled={settings.fuelAlerts}
            onChange={(v) => updateSetting("fuelAlerts", v)}
            label="Low Fuel Alerts"
          />
          <Toggle
            enabled={settings.driverCheckIn}
            onChange={(v) => updateSetting("driverCheckIn", v)}
            label="Require Driver Check-in"
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={Sun}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateSetting("darkMode", false)}
               className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                !settings.darkMode ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Sun className={`w-5 h-5 ${!settings.darkMode ? "text-blue-500" : "text-slate-400"}`} />
              <span className={`font-bold ${!settings.darkMode ? "text-blue-700" : "text-slate-600"}`}>
                Light
              </span>
            </button>
            <button
              onClick={() => updateSetting("darkMode", true)}
               className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                settings.darkMode ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Moon className={`w-5 h-5 ${settings.darkMode ? "text-blue-500" : "text-slate-400"}`} />
              <span className={`font-bold ${settings.darkMode ? "text-blue-700" : "text-slate-600"}`}>
                Dark
              </span>
            </button>
          </div>
        </SettingSection>

        {/* Contact Info */}
        <SettingSection title="Emergency Contacts" icon={Phone}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Dispatch Center</label>
              <input
                type="tel"
                defaultValue="+91 1800-AMBULANCE"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hospital Hotline</label>
              <input
                type="tel"
                defaultValue="+91 1800-HOSPITAL"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Emergency Email</label>
              <input
                type="email"
                defaultValue="emergency@novacare.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-300"
              />
            </div>
          </div>
        </SettingSection>

        {/* System Info */}
        <SettingSection title="System Information" icon={Shield}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-bold text-slate-600">System Version</span>
              <span className="text-sm font-black text-slate-900">v2.4.1</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-bold text-slate-600">Last Updated</span>
              <span className="text-sm font-black text-slate-900">May 11, 2026</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-bold text-slate-600">Database Status</span>
              <span className="flex items-center gap-1.5 text-sm font-black text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-bold text-slate-600">GPS Service</span>
              <span className="flex items-center gap-1.5 text-sm font-black text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Active
              </span>
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="font-black text-red-900">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-700 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.error("Reset functionality requires confirmation")}
            className="px-4 py-2.5 border border-red-300 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
          >
            Reset All Data
          </button>
          <button
            onClick={() => toast.error("Export functionality would download data")}
            className="px-4 py-2.5 border border-red-300 text-red-700 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
          >
            Export System Logs
          </button>
        </div>
      </div>
    </div>
  );
}
