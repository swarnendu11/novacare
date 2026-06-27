/**
 * Register - Choose role (separate register page per role)
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Stethoscope, ClipboardList, ShieldCheck, Syringe, Pill, Microscope, UserCog, Ambulance } from "lucide-react";
import Logo from "../components/Logo";

const ROLES = [
  {
    role: "patient",
    label: "Patient",
    desc: "Book appointments, manage health records",
    path: "/register/patient",
    icon: User,
  },
  {
    role: "doctor",
    label: "Doctor",
    desc: "Manage appointments & write prescriptions",
    path: "/register/doctor",
    icon: Stethoscope,
  },
  {
    role: "receptionist",
    label: "Receptionist",
    desc: "Book appointments, manage schedule",
    path: "/register/receptionist",
    icon: ClipboardList,
  },
  {
    role: "admin",
    label: "Admin",
    desc: "Manage doctors, departments & system",
    path: "/register/admin",
    icon: ShieldCheck,
  },
  {
    role: "nurse",
    label: "Nurse",
    desc: "Manage patients & ward inventory",
    path: "/register/nurse",
    icon: Syringe,
  },
  {
    role: "pharmacy",
    label: "Pharmacy",
    desc: "Manage prescriptions & inventory",
    path: "/register/pharmacy",
    icon: Pill,
  },
  {
    role: "laboratory",
    label: "Laboratory",
    desc: "Manage test results & reports",
    path: "/register/laboratory",
    icon: Microscope,
  },
  {
    role: "wardboy",
    label: "Wardboy",
    desc: "Patient movement & maintenance",
    path: "/register/wardboy",
    icon: UserCog,
  },
  {
    role: "ambulance",
    label: "Ambulance",
    desc: "Emergency requests & dispatch",
    path: "/register/ambulance",
    icon: Ambulance,
  },
];

export default function RegisterSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=80)`,
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
          <h1 className="text-2xl font-bold text-white">Register</h1>
          <p className="text-slate-300 mt-1">
            Choose your role to create an account
          </p>
        </div>

        {/* Google Signup Option Removed - Role based only */}

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
                <h2 className="font-semibold text-white">
                  Register as {r.label}
                </h2>
                <p className="text-sm text-slate-400 mt-1">{r.desc}</p>
                <span className="inline-block mt-3 text-[#2563EB] font-medium text-sm">
                  Sign up →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-slate-300 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
