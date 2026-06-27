/**
 * NovaCare — Dashboard Layout
 * Dark sidebar with gradient, glassmorphic top-bar, notification bell, global search
 */

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGreeting } from "../hooks/useGreeting";
import { mockNotifications, mockSearch } from "../services/mockData";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Clock,
  User,
  Users,
  Building2,
  LogOut,
  Activity,
  CreditCard,
  Pill,
  FlaskConical,
  Bed,
  Settings,
  IndianRupee,
  Heart,
  Menu,
  Bell,
  Search,
  ClipboardList,
  Stethoscope,
  ChevronRight,
  X,
  Shield,
  Ambulance,
  ArrowRight,
  Package,
  Wrench,
  Microscope,
  Siren,
  MapPin,
} from "lucide-react";

/* ─── Nav Config ─────────────────────────────────────────────────────────── */
function getNavForRole(role) {
  const groups = {
    patient: [
      { header: "Overview" },
      { path: "/patient", label: "Dashboard", icon: LayoutDashboard },
      { header: "Health" },
      { path: "/patient/book", label: "Book Appointment", icon: Calendar },
      { path: "/patient/appointments", label: "My Appointments", icon: Clock },
      { path: "/patient/history", label: "Medical History", icon: Heart },
      { path: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
      {
        path: "/patient/lab-reports",
        label: "Lab Reports",
        icon: FlaskConical,
      },
      { header: "Account" },
      { path: "/patient/billing", label: "Billing", icon: CreditCard },
      { path: "/patient/profile", label: "My Profile", icon: User },
    ],
    admin: [
      { header: "Overview" },
      { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { header: "Hospital" },
      { path: "/admin/doctors", label: "Doctors", icon: Stethoscope },
      { path: "/admin/patients", label: "Patients", icon: Users },
      { path: "/admin/staff", label: "Staff", icon: Activity },
      { path: "/admin/departments", label: "Departments", icon: Building2 },
      { header: "In-Patient" },
      { path: "/admin/ipd", label: "IPD Management", icon: Bed },
      { path: "/admin/wards", label: "Ward & Beds", icon: Building2 },
      { header: "Services" },
      { path: "/admin/billing", label: "Billing", icon: IndianRupee },
      { path: "/admin/pharmacy", label: "Pharmacy", icon: Pill },
      { path: "/admin/lab", label: "Laboratory", icon: FlaskConical },
      { path: "/admin/rooms", label: "Rooms", icon: Bed },
      { path: "/admin/ambulance", label: "Ambulance", icon: Activity },
      { header: "System" },
      { path: "/admin/settings", label: "Settings", icon: Settings },
      { path: "/admin/profile", label: "My Profile", icon: User },
    ],
    doctor: [
      { header: "Overview" },
      { path: "/doctor", label: "Dashboard", icon: LayoutDashboard },
      { header: "Clinical" },
      { path: "/doctor/appointments", label: "Appointments", icon: Calendar },
      { path: "/doctor/prescriptions", label: "Write Rx", icon: Pill },
      { path: "/doctor/records", label: "Clinical Notes", icon: FileText },
      { path: "/doctor/emr", label: "EMR & Vitals", icon: Heart },
      { path: "/doctor/lab", label: "Lab Reports", icon: FlaskConical },
      { path: "/doctor/ipd-patients", label: "Admitted (IPD)", icon: Bed },
      { header: "Practice" },
      { path: "/doctor/schedule", label: "Schedule", icon: Clock },
      { path: "/doctor/earnings", label: "Earnings", icon: IndianRupee },
      { path: "/doctor/profile", label: "Profile", icon: User },
    ],
    receptionist: [
      { header: "Overview" },
      { path: "/receptionist", label: "Dashboard", icon: LayoutDashboard },
      { header: "Front Desk" },
      { path: "/receptionist/walkin", label: "Patient Directory", icon: Users },
      { path: "/receptionist/queue", label: "Live Queue", icon: Activity },
      {
        path: "/receptionist/appointments",
        label: "Appointments",
        icon: Calendar,
      },
      {
        path: "/receptionist/roster",
        label: "Doctor Roster",
        icon: Stethoscope,
      },
      { header: "In-Patient" },
      { path: "/receptionist/ipd", label: "IPD & Admissions", icon: Bed },
      { path: "/receptionist/ward", label: "Ward & Beds", icon: Building2 },
      { header: "Finance" },
      {
        path: "/receptionist/billing",
        label: "Billing & POS",
        icon: CreditCard,
      },
      { path: "/receptionist/profile", label: "Profile", icon: User },
    ],
    nurse: [
      { header: "Overview" },
      { path: "/nurse", label: "Dashboard", icon: LayoutDashboard },
      { header: "Patient Care" },
      { path: "/nurse/patients", label: "Assigned Patients", icon: Users },
      { path: "/nurse/tasks", label: "Treatment Tasks", icon: ClipboardList },
      { path: "/nurse/vitals", label: "Record Vitals", icon: Activity },
      { path: "/nurse/medication", label: "Meds Administration", icon: Pill },
      { header: "Duty" },
      { path: "/nurse/reports", label: "Clinical Notes", icon: FileText },
      { path: "/nurse/profile", label: "Profile", icon: User },
    ],
    wardboy: [
      { header: "Overview" },
      { path: "/wardboy", label: "Dashboard", icon: LayoutDashboard },
      { header: "Operations" },
      { path: "/wardboy/tasks", label: "My Tasks", icon: ClipboardList },
      { path: "/wardboy/movement", label: "Patient Transfers", icon: Activity },
      { path: "/wardboy/transport", label: "Supply Transport", icon: Package },
      { header: "Facilities" },
      { path: "/wardboy/ward-status", label: "Room Status", icon: Bed },
      { path: "/wardboy/maintenance", label: "Maintenance Log", icon: Wrench },
      { header: "Shift" },
      { path: "/wardboy/profile", label: "Profile", icon: User },
    ],
    pharmacy: [
      { header: "Overview" },
      { path: "/pharmacy", label: "Dashboard", icon: LayoutDashboard },
      { header: "Operations" },
      { path: "/pharmacy/prescriptions", label: "Prescriptions", icon: Pill },
      { path: "/pharmacy/inventory", label: "Inventory", icon: Package },
      { path: "/pharmacy/billing", label: "Billing", icon: CreditCard },
      { header: "Shift" },
      { path: "/pharmacy/profile", label: "Profile", icon: User },
    ],
    laboratory: [
      { header: "Overview" },
      { path: "/laboratory", label: "Dashboard", icon: LayoutDashboard },
      { header: "Operations" },
      { path: "/laboratory/requests", label: "Test Requests", icon: ClipboardList },
      { path: "/laboratory/reports", label: "Lab Reports", icon: Microscope },
      { header: "Shift" },
      { path: "/laboratory/profile", label: "Profile", icon: User },
    ],
    ambulance: [
      { header: "Overview" },
      { path: "/ambulance", label: "Dashboard", icon: LayoutDashboard },
      { header: "Operations" },
      { path: "/ambulance/requests", label: "Emergency Requests", icon: Siren },
      { path: "/ambulance/dispatch", label: "Live Dispatch", icon: Ambulance },
      { path: "/ambulance/tracking", label: "Fleet Tracking", icon: MapPin },
      { header: "Management" },
      { path: "/ambulance/vehicles", label: "Vehicles", icon: Package },
      { path: "/ambulance/drivers", label: "Drivers", icon: Users },
      { header: "System" },
      { path: "/ambulance/analytics", label: "Analytics", icon: Activity },
      { path: "/ambulance/settings", label: "Settings", icon: Settings },
      { path: "/ambulance/profile", label: "Profile", icon: User },
    ],
  };
  return groups[role] || [];
}

/* ─── Role Style Config ──────────────────────────────────────────────────── */
const ROLE_STYLE = {
  admin: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  doctor: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  patient: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  receptionist: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  nurse: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  wardboy: {
    dot: "#3B82F6",
    avatarBg: "linear-gradient(135deg, #3B82F6, #2563EB)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(59,130,246,0.15)",
    roleColor: "#DBEAFE",
    chipBg: "#2563EB",
    chipColor: "text-blue-400",
  },
  pharmacy: {
    dot: "#F59E0B",
    avatarBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(245,158,11,0.15)",
    roleColor: "#FEF3C7",
    chipBg: "#D97706",
    chipColor: "text-amber-400",
  },
  laboratory: {
    dot: "#10B981",
    avatarBg: "linear-gradient(135deg, #10B981, #059669)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(16,185,129,0.15)",
    roleColor: "#D1FAE5",
    chipBg: "#059669",
    chipColor: "text-emerald-400",
  },
  ambulance: {
    dot: "#EF4444",
    avatarBg: "linear-gradient(135deg, #EF4444, #DC2626)",
    cardBg: "linear-gradient(135deg, #0F172A, #1E293B)",
    cardBorder: "rgba(239,68,68,0.15)",
    roleColor: "#FEE2E2",
    chipBg: "#DC2626",
    chipColor: "text-red-400",
  },
};

/* ─── Notification Bell ──────────────────────────────────────────────────── */
function NotificationBell({ user }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (user)
      setNotifications(mockNotifications.getForUser(user.id, user.role));
  }, [user]);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const typeIcon = {
    appointment: "📅",
    lab: "🧪",
    prescription: "💊",
    payment: "💳",
    system: "⚙️",
    alert: "⚠️",
    doctor: "👨‍⚕️",
  };

  const markRead = (id) => {
    mockNotifications.markRead(user.id, user.role, id);
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };
  const markAll = () => {
    mockNotifications.markAllRead(user.id, user.role);
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 40,
          height: 40,
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative",
        }}
        className="hover:border-blue-400 hover:bg-blue-50 shadow-sm"
        aria-label="Notifications"
      >
        <Bell style={{ width: 17, height: 17, color: "#64748B" }} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              background: "#EF4444",
              color: "#fff",
              fontSize: 9,
              fontWeight: 900,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(239,68,68,0.5)",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 50,
            width: 320,
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
          }}
          className="animate-slide-up"
        >
          <div
            style={{
              padding: "14px 18px",
              background: "#F8FAFC",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 900, color: "#0F172A", fontSize: 14 }}>
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={markAll}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#2563EB",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div
            style={{ maxHeight: 320, overflowY: "auto" }}
            className="custom-scrollbar"
          >
            {notifications.length === 0 ? (
              <div style={{ padding: "36px 20px", textAlign: "center" }}>
                <Bell
                  style={{
                    width: 32,
                    height: 32,
                    color: "#CBD5E1",
                    margin: "0 auto 10px",
                  }}
                />
                <p style={{ fontWeight: 700, color: "#94A3B8", fontSize: 13 }}>
                  All caught up!
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid #F8FAFC",
                    cursor: "pointer",
                    background: !n.read ? "rgba(37,99,235,0.03)" : "#fff",
                    transition: "background 0.15s",
                  }}
                  className="hover:bg-slate-50"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                      {typeIcon[n.type] || "🔔"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: !n.read ? 700 : 500,
                          color: !n.read ? "#1E293B" : "#64748B",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94A3B8",
                          marginTop: 3,
                          lineHeight: 1.4,
                        }}
                      >
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          background: "#2563EB",
                          borderRadius: 999,
                          flexShrink: 0,
                          marginTop: 5,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


/* ─── Global Search ──────────────────────────────────────────────────────── */
function GlobalSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (q.length >= 2) setResults(mockSearch.search(q));
    else setResults([]);
  }, [q]);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const typeColor = {
    patient: "#10B981",
    doctor: "#2563EB",
    appointment: "#06B6D4",
  };
  const typeIcon = { patient: "🧑‍🤝‍🧑", doctor: "👨‍⚕️", appointment: "📅" };

  const select = (r) => {
    navigate(r.link);
    setQ("");
    setOpen(false);
  };

  return (
    <div
      style={{ position: "relative", display: "none" }}
      className="md:block"
      ref={ref}
    >
      <div style={{ position: "relative" }}>
        <Search
          style={{
            width: 15,
            height: 15,
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94A3B8",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            setOpen(true);
            setFocused(true);
          }}
          placeholder="Search patients, doctors, appointments…"
          style={{
            width: 280,
            paddingLeft: 36,
            paddingRight: q ? 32 : 14,
            paddingTop: 10,
            paddingBottom: 10,
            border: focused ? "1px solid #2563EB" : "1px solid #E2E8F0",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            color: "#334155",
            background: "#fff",
            outline: "none",
            boxShadow: focused
              ? "0 0 0 3px rgba(37,99,235,0.15)"
              : "0 1px 3px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
          }}
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setResults([]);
            }}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              display: "flex",
            }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 0,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow: "0 16px 32px rgba(0,0,0,0.10)",
            zIndex: 50,
            overflow: "hidden",
          }}
          className="animate-slide-up"
        >
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => select(r)}
              style={{
                width: "100%",
                padding: "11px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                borderBottom: "1px solid #F8FAFC",
                textAlign: "left",
                transition: "background 0.15s",
              }}
              className="hover:bg-slate-50"
            >
              <span style={{ fontSize: 15 }}>{typeIcon[r.type] || "🔍"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1E293B",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.label}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.subLabel}
                </p>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: typeColor[r.type] || "#64748B",
                }}
              >
                {r.type}
              </span>
            </button>
          ))}
        </div>
      )}
      {open && q.length >= 2 && results.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 0,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow: "0 16px 32px rgba(0,0,0,0.10)",
            zIndex: 50,
            padding: "18px 16px",
            textAlign: "center",
          }}
          className="animate-slide-up"
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8" }}>
            No results for "<span style={{ color: "#475569" }}>{q}</span>"
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar Nav Item ───────────────────────────────────────────────────── */
function SideNavItem({ item, collapsed, roleStyle }) {
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={item.path}
      end={/^\/(patient|admin|doctor|receptionist|pharmacy|nurse|wardboy)$/.test(
        item.path,
      )}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) =>
        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[14px] font-black transition-all duration-300 tracking-tight ${collapsed ? "justify-center !px-0" : ""} ${
          isActive 
            ? "text-white shadow-lg scale-[1.02]" 
            : hovered 
              ? "text-white bg-white/10" 
              : "text-slate-400"
        }`
      }
      style={({ isActive }) => ({
        marginBottom: 8,
        textDecoration: "none",
        background: isActive ? roleStyle.avatarBg : "transparent",
        boxShadow: isActive ? `0 10px 20px -5px ${roleStyle.dot}40` : "none",
      })}
    >
      {({ isActive }) => (
        <>
          <Icon
            style={{
              width: 19,
              height: 19,
              flexShrink: 0,
              color: isActive ? "#ffffff" : hovered ? "#ffffff" : "#64748B",
              transition: "all 0.3s ease",
            }}
          />
          {!collapsed && (
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
              }}
            >
              {item.label}
            </span>
          )}
          {!collapsed && isActive && (
            <motion.div
              layoutId="active-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#fff",
                marginLeft: "auto",
                boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

/* ─── Main Layout ────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { greeting } = useGreeting();
  const nav = getNavForRole(user?.role || "");
  const rs = ROLE_STYLE[user?.role] || ROLE_STYLE.patient;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#F8FAFC",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,12,32,0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 40,
          }}
          className="md:hidden"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          background: "linear-gradient(195deg, #0F172A 0%, #1E293B 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "20px 0 50px rgba(0,0,0,0.15)",
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 50,
          width: collapsed ? 88 : 280,
          transition:
            "width 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className={`${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            height: 80,
            padding: "0 24px",
            flexShrink: 0,
          }}
        >
          {!collapsed && (
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
                  flexShrink: 0,
                }}
              >
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: 18,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  NovaCare
                </p>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginTop: 4,
                  }}
                >
                  Health System
                </p>
              </div>
            </Link>
          )}
          <button
            onClick={() => {
              setCollapsed((c) => !c);
              setMobileOpen(false);
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all bg-white/5 border border-white/5 shadow-inner"
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>
        </div>

        {/* User mini card */}
        {!collapsed && (
          <div style={{ padding: "24px 20px 10px", flexShrink: 0 }}>
            <div
              className="relative p-5 rounded-2xl overflow-hidden shadow-2xl group border border-white/5"
              style={{ background: rs.cardBg }}
            >
              {/* Animated Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full transition-all group-hover:scale-150 duration-700" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-black text-white text-xl shadow-lg ring-4 ring-black/10">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white text-[15px] leading-tight truncate tracking-tight">
                    {user?.name?.split(" ").slice(0, 2).join(" ")}
                  </p>
                  <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mt-1">
                    {user?.role}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 14px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          className="custom-scrollbar pr-2"
        >
          {nav.map((item, i) => {
            if (item.header) {
              if (collapsed)
                return (
                  <div key={i} className="my-6 mx-4 border-t border-white/5" />
                );
              return (
                <p
                  key={i}
                  className="px-4 mt-8 mb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
                >
                  {item.header}
                </p>
              );
            }
            return (
              <SideNavItem
                key={item.path}
                item={item}
                collapsed={collapsed}
                roleStyle={rs}
              />
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "16px 14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 py-4 rounded-xl font-bold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all ${collapsed ? "justify-center px-0" : "px-4 text-sm"}`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut style={{ width: 22, height: 22 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          marginLeft: collapsed ? 88 : 280,
          transition: "margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="md:ml-auto"
      >
        {/* Top Navbar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px) saturate(200%)",
            borderBottom: "1px solid rgba(226,232,240,0.8)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.02)",
            flexShrink: 0,
            height: 80,
            display: "flex",
            alignItems: "center",
            padding: "0 40px",
            gap: 24,
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex md:hidden w-11 h-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200"
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>

          {/* Welcome */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {greeting}, {user?.name?.split(" ")[0] || "User"}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </p>
          </div>

          {/* Search */}
          <GlobalSearch />

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          <div className="flex items-center gap-4">
            <NotificationBell user={user} />

            {/* Profile Chip */}
            <Link
              to="/admin/profile"
              className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div
                className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-black text-white text-base transform group-hover:scale-105 transition-transform"
                style={{ background: rs.avatarBg }}
              >
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  {user?.name?.split(" ").slice(0, 2).join(" ") || "User"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ background: rs.dot }}
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {user?.role}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: "auto" }} className="bg-slate-50/30">
          <div
            style={{
              padding: "40px 48px 80px",
              maxWidth: 1600,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
