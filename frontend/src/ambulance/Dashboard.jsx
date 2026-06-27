/**
 * NovaCare Ambulance — Dashboard
 * Emergency overview with stats, alerts, and quick actions
 * Matches other roles' dashboard design
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Ambulance,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Phone,
  Siren,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Siren as SirenIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { emergencyApi, ambulanceApi, driverApi } from "../services/mockData";
import { analyticsApi } from "../services/api";
import Spinner from "../components/Spinner";

// Modern Colourful Stat Card component
const THEMES = {
  blue: {
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
    trendBg: "#ECFDF5",
    trendColor: "#10B981",
    trendBorder: "#D1FAE5",
  },
  green: {
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    trendBg: "#ECFDF5",
    trendColor: "#10B981",
    trendBorder: "#D1FAE5",
  },
  amber: {
    iconBg: "#FFF7ED",
    iconColor: "#F59E0B",
    trendBg: "#F0F9FF",
    trendColor: "#0EA5E9",
    trendBorder: "#E0F2FE",
  },
  purple: {
    iconBg: "#F5F3FF",
    iconColor: "#8B5CF6",
    trendBg: "#F5F3FF",
    trendColor: "#8B5CF6",
    trendBorder: "#EDE9FE",
  },
};

function StatCard({ icon: Icon, label, value, trend, trendUp, color = "blue", delay = 0 }) {
  const theme = THEMES[color] || THEMES.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.08)",
      }}
      className="bg-white rounded-[32px] border border-slate-100 p-8 relative overflow-hidden transition-all duration-300"
    >
      {/* Decorative background circle */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03]"
        style={{ background: theme.iconColor }}
      />
      
      <div className="flex items-start justify-between relative z-10 mb-8">
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            background: theme.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="shadow-sm border border-white/50"
        >
          {Icon && (
            <Icon
              size={30}
              style={{
                color: theme.iconColor,
              }}
            />
          )}
        </div>

        {trend && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{
              background: theme.trendBg,
              color: theme.trendColor,
              borderColor: theme.trendBorder,
            }}
          >
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h4 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
          {value}
        </h4>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// Emergency Alert Card
function EmergencyAlert({ emergency, onAssign }) {
  const priorityColors = {
    critical: "bg-red-500",
    high: "bg-amber-500",
    medium: "bg-blue-500",
    low: "bg-slate-500",
  };

  const priorityLabels = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MEDIUM",
    low: "LOW",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-2 h-2 rounded-full ${priorityColors[emergency.priority]} mt-2 animate-pulse`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${priorityColors[emergency.priority]}`}>
              {priorityLabels[emergency.priority]}
            </span>
            <span className="text-xs font-bold text-slate-400">{emergency.id}</span>
          </div>
          <h4 className="font-bold text-slate-900 mt-2 truncate">{emergency.type}</h4>
          <p className="text-sm text-slate-500 mt-1">{emergency.patient}, {emergency.age} yrs</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{emergency.pickup}</span>
          </div>
        </div>
        <button
          onClick={() => onAssign(emergency)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex-shrink-0"
        >
          Dispatch
        </button>
      </div>
    </div>
  );
}

// Active Dispatch Card
function ActiveDispatch({ emergency, onComplete }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SirenIcon className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider">Active Dispatch</span>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">{emergency.assignedAmbulance}</span>
      </div>
      <h4 className="font-bold text-lg mt-3">{emergency.type}</h4>
      <p className="text-sm text-white/80 mt-1">{emergency.patient}</p>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="text-sm font-bold">ETA: {emergency.eta} min</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-white/70" />
          <span className="text-sm font-bold">{emergency.driver}</span>
        </div>
      </div>
      <button
        onClick={() => onComplete(emergency)}
        className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all"
      >
        Mark Complete
      </button>
    </div>
  );
}

// Quick Action Button
function QuickAction({ icon: Icon, label, to, color = "blue", onClick }) {
  const colors = {
    red: "bg-red-50 border-red-100 text-red-600 hover:bg-red-100",
    blue: "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100",
    green: "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100",
    amber: "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100",
  };

  const content = (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${colors[color]}`}>
      <Icon className="w-8 h-8" />
      <span className="text-sm font-bold text-center">{label}</span>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full">{content}</button>;
  }

  return (
    <Link to={to} className="w-full">
      {content}
    </Link>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [pendingEmergencies, setPendingEmergencies] = useState([]);
  const [availableAmbulances, setAvailableAmbulances] = useState([]);
  const [onDutyDrivers, setOnDutyDrivers] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analytics, active, pending, ambulances, drivers] = await Promise.all([
          analyticsApi.getDashboard(),
          emergencyApi.getActive(),
          emergencyApi.getPending(),
          ambulanceApi.getAvailable(),
          driverApi.getAvailable(),
        ]);
        setStats(analytics);
        setActiveEmergencies(active.filter((e) => e.status !== "pending").slice(0, 3));
        setPendingEmergencies(pending.slice(0, 4));
        setAvailableAmbulances(ambulances.slice(0, 4));
        setOnDutyDrivers(drivers.filter((d) => d.status !== "off-duty").slice(0, 4));
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Real-time data simulation - update every 5 seconds
    const interval = setInterval(() => {
      loadData();
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAssign = (emergency) => {
    toast.success(`Dispatching ambulance for ${emergency.type}`);
    // Simulate moving from pending to active
    setPendingEmergencies(prev => prev.filter(e => e.id !== emergency.id));
    setActiveEmergencies(prev => [...prev, { ...emergency, status: "active", assignedAmbulance: "AMB-" + Math.floor(Math.random() * 100), eta: Math.floor(Math.random() * 15) + 5, driver: "Driver " + Math.floor(Math.random() * 10) }].slice(0, 3));
  };

  const handleComplete = (emergency) => {
    toast.success(`Emergency completed: ${emergency.type}`);
    setActiveEmergencies(prev => prev.filter(e => e.id !== emergency.id));
  };

  const handleNewEmergency = () => {
    toast.info("New Emergency form would open here");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="xl" />
        <p className="mt-8 text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Loading Emergency Data...
        </p>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col gap-8 pb-10 animate-fade-in font-['Outfit',sans-serif]">
      {/* ── Page Header (New Style) ── */}
      <div className="relative bg-gradient-to-r from-[#2B2A66] to-[#4A47A3] rounded-[32px] p-8 sm:p-10 text-white overflow-hidden shadow-sm mb-2">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
              <Shield className="w-3.5 h-3.5 text-blue-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">
                Ambulance Dispatch Center
              </span>
            </div>
            
            {/* Greeting */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 flex items-center gap-3 text-white">
              {greeting}, Dispatcher <span className="animate-bounce">👋</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl">
              Monitoring real-time emergencies. Fleet operations are synchronized and ready for deployment.
            </p>
          </div>
          
          {/* Glassmorphism Stats */}
          <div className="flex flex-wrap items-center gap-4 lg:justify-end shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[140px]">
              <div className="text-3xl font-black text-white mb-1">{stats?.activeEmergencies || 0}</div>
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Active Dispatches</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[140px]">
              <div className="text-3xl font-black text-white mb-1">{stats?.available || 0}</div>
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Available Units</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[140px]">
              <div className="text-3xl font-black text-white mb-1">{stats?.onDuty || 0}</div>
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">On-Duty Drivers</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={AlertCircle}
          label="Active Emergencies"
          value={stats?.activeEmergencies || 0}
          trend="Live"
          color="blue"
          delay={0}
        />
        <StatCard
          icon={Ambulance}
          label="Available Ambulances"
          value={stats?.available || 0}
          trend="Ready"
          trendUp={true}
          color="green"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          label="On-Duty Drivers"
          value={stats?.onDuty || 0}
          trend="Active"
          color="blue"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          label="Avg Response Time"
          value={`${stats?.avgResponseTime || 0}m`}
          trend="-12% vs last week"
          trendUp={true}
          color="purple"
          delay={0.3}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Dispatches */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Active Dispatches
              </h3>
              <Link
                to="/ambulance/dispatch"
                className="text-sm font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              {activeEmergencies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEmergencies.map((em) => (
                    <ActiveDispatch key={em.id} emergency={em} onComplete={handleComplete} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-900">No Active Dispatches</p>
                  <p className="text-sm text-slate-500 mt-1">All emergencies have been resolved</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Emergencies */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pending Emergency Requests
              </h3>
              <Link
                to="/ambulance/requests"
                className="text-sm font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {pendingEmergencies.length > 0 ? (
                pendingEmergencies.map((em) => (
                  <EmergencyAlert key={em.id} emergency={em} onAssign={handleAssign} />
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No Pending Emergencies</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Siren} label="New Emergency" color="blue" onClick={handleNewEmergency} />
              <QuickAction icon={Ambulance} label="Dispatch" to="/ambulance/dispatch" color="blue" />
              <QuickAction icon={MapPin} label="Track Fleet" to="/ambulance/tracking" color="green" />
              <QuickAction icon={Phone} label="Contact Driver" color="amber" onClick={() => toast.info("Driver contact list")} />
            </div>
          </div>

          {/* Available Ambulances */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-emerald-500" />
                Available Units
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {availableAmbulances.map((amb) => (
                <div
                  key={amb.id}
                  onClick={() => toast.info(`Ambulance ${amb.id} - ${amb.type} at ${amb.location}`)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Ambulance className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{amb.id}</p>
                    <p className="text-xs text-slate-500">{amb.type} • {amb.location}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* On-Duty Drivers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                On-Duty Drivers
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {onDutyDrivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => toast.info(`Driver ${driver.name} - ${driver.shift} at ${driver.currentLocation}`)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm">
                    {driver.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{driver.name}</p>
                    <p className="text-xs text-slate-500">{driver.shift} • {driver.currentLocation}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    driver.status === "en-route" ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
