/**
 * Login - Choose role (separate login page per role)
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Stethoscope, ClipboardList, ShieldCheck, Syringe, Pill, Microscope, UserCog, Ambulance } from "lucide-react";
import Logo from "../components/Logo";

const ROLES = [
  {
    role: "patient",
    label: "Patient",
    desc: "Book appointments, view prescriptions",
    path: "/login/patient",
    icon: User,
  },
  {
    role: "doctor",
    label: "Doctor",
    desc: "Manage appointments & prescriptions",
    path: "/login/doctor",
    icon: Stethoscope,
  },
  {
    role: "receptionist",
    label: "Receptionist",
    desc: "Book appointments, view schedule",
    path: "/login/receptionist",
    icon: ClipboardList,
  },
  {
    role: "admin",
    label: "Admin",
    desc: "Manage doctors, departments & system",
    path: "/login/admin",
    icon: ShieldCheck,
  },
  {
    role: "nurse",
    label: "Nurse",
    desc: "Manage patients & ward inventory",
    path: "/login/nurse",
    icon: Syringe,
  },
  {
    role: "pharmacy",
    label: "Pharmacy",
    desc: "Manage prescriptions & inventory",
    path: "/login/pharmacy",
    icon: Pill,
  },
  {
    role: "laboratory",
    label: "Laboratory",
    desc: "Manage test results & reports",
    path: "/login/laboratory",
    icon: Microscope,
  },
  {
    role: "wardboy",
    label: "Wardboy",
    desc: "Patient movement & maintenance",
    path: "/login/wardboy",
    icon: UserCog,
  },
  {
    role: "ambulance",
    label: "Ambulance",
    desc: "Emergency requests & dispatch",
    path: "/login/ambulance",
    icon: Ambulance,
  },
];

export default function LoginSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80)`,
          filter: "blur(8px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.75), rgba(30,41,59,0.85))",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-12 h-12" />
            <span className="font-bold text-primary text-xl">NovaCare</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Login</h1>
          <p className="text-slate-300 mt-1">Choose your role to sign in</p>
        </div>

        {/* Google Login Option Removed - Role based only */}

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-white/15"></div>
          <span className="flex-shrink mx-3 text-[13px] font-medium tracking-[0.3px] text-[#94A3B8] uppercase">
            or choose a role
          </span>
          <div className="flex-grow border-t border-white/15"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={r.path}
                className="block text-left relative z-10"
                style={{
                  background: "rgba(15,23,42,0.7)",
                  borderRadius: "14px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.25)";
                  e.currentTarget.style.borderColor = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <span className="text-3xl mb-3 block text-white">
                  <r.icon size={32} />
                </span>
                <h2 className="font-semibold text-white">{r.label} Login</h2>
                <p className="text-sm text-slate-400 mt-1">{r.desc}</p>
                <span className="inline-block mt-3 text-[#2563EB] font-medium text-sm">
                  Sign in →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-slate-300 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
