/**
 * NovaCare — LoginRole
 * Features: Email/Password · Phone + OTP · Google Sign-In · Email OTP verify
 * All mock-wired (frontend-only). Existing design preserved.
 */

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Stethoscope,
  ShieldCheck,
  ClipboardList,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Activity,
  Heart,
  Zap,
  Smartphone,
  RotateCw,
  CheckCircle2,
  Pill,
  Microscope,
  Ambulance,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

/* ─── Role Config ─────────────────────────────────────────────────────────── */
const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    subtitle: "Your health journey starts here",
    icon: Heart,
    panel: "/patient",
    mesh: ["#06b6d4", "#3b82f6", "#8b5cf6"],
    accent: "#06b6d4",
    accentDark: "#0891b2",
    glow: "rgba(6,182,212,0.35)",
    badge: "Patient",
  },
  doctor: {
    label: "Doctor",
    subtitle: "Clinical excellence, elevated",
    icon: Stethoscope,
    panel: "/doctor",
    mesh: ["#3b82f6", "#6366f1", "#0ea5e9"],
    accent: "#3b82f6",
    accentDark: "#2563eb",
    glow: "rgba(59,130,246,0.35)",
    badge: "Doctor",
  },
  admin: {
    label: "Admin",
    subtitle: "Command the entire ecosystem",
    icon: ShieldCheck,
    panel: "/admin",
    mesh: ["#8b5cf6", "#6d28d9", "#4f46e5"],
    accent: "#8b5cf6",
    accentDark: "#7c3aed",
    glow: "rgba(139,92,246,0.35)",
    badge: "Admin",
  },
  receptionist: {
    label: "Receptionist",
    subtitle: "Managing the front line with precision",
    icon: ClipboardList,
    panel: "/receptionist",
    mesh: ["#10b981", "#059669", "#34d399"],
    accent: "#10b981",
    accentDark: "#059669",
    glow: "rgba(16,185,129,0.35)",
    badge: "Receptionist",
  },
  nurse: {
    label: "Nurse",
    subtitle: "Care that goes beyond the ordinary",
    icon: Activity,
    panel: "/nurse",
    mesh: ["#f43f5e", "#e11d48", "#fb7185"],
    accent: "#f43f5e",
    accentDark: "#e11d48",
    glow: "rgba(244,63,94,0.35)",
    badge: "Nurse",
  },
  wardboy: {
    label: "Wardboy",
    subtitle: "The backbone of patient operations",
    icon: Zap,
    panel: "/wardboy",
    mesh: ["#f59e0b", "#d97706", "#fbbf24"],
    accent: "#f59e0b",
    accentDark: "#d97706",
    glow: "rgba(245,158,11,0.35)",
    badge: "Wardboy",
  },
  pharmacy: {
    label: "Pharmacy",
    subtitle: "Manage prescriptions and inventory",
    icon: Pill,
    panel: "/pharmacy",
    mesh: ["#14b8a6", "#0d9488", "#2dd4bf"],
    accent: "#14b8a6",
    accentDark: "#0d9488",
    glow: "rgba(20,184,166,0.35)",
    badge: "Pharmacy",
  },
  laboratory: {
    label: "Laboratory",
    subtitle: "Manage diagnostic tests and reports",
    icon: Microscope,
    panel: "/laboratory",
    mesh: ["#8b5cf6", "#7c3aed", "#a78bfa"],
    accent: "#8b5cf6",
    accentDark: "#7c3aed",
    glow: "rgba(139,92,246,0.35)",
    badge: "Laboratory",
  },
  ambulance: {
    label: "Ambulance",
    subtitle: "Coordinate emergency dispatch and tracking",
    icon: Ambulance,
    panel: "/ambulance",
    mesh: ["#ef4444", "#dc2626", "#f87171"],
    accent: "#ef4444",
    accentDark: "#dc2626",
    glow: "rgba(239,68,68,0.35)",
    badge: "Ambulance",
  },
};

const DEMO_CREDS = {
  patient: { email: "patient@novacare.com", password: "patient123" },
  doctor: { email: "arjun.mehta@novacare.com", password: "doctor123" },
  admin: { email: "admin@novacare.com", password: "admin123" },
  receptionist: { email: "reception@novacare.com", password: "recept123" },
  nurse: { email: "nurse@novacare.com", password: "nurse123" },
  wardboy: { email: "wardboy@novacare.com", password: "wardboy123" },
  pharmacy: { email: "pharmacy@novacare.com", password: "pharmacy123" },
  laboratory: { email: "laboratory@novacare.com", password: "lab123" },
  ambulance: { email: "ambulance@novacare.com", password: "ambulance123" },
};

const VALID_ROLES = [
  "patient",
  "doctor",
  "admin",
  "receptionist",
  "nurse",
  "wardboy",
  "pharmacy",
  "laboratory",
  "ambulance",
];
const MOCK_OTP = "123456";

/* ─── Animated Orb ───────────────────────────────────────────────────────── */
function Orb({ color, style, animate: anim }) {
  return (
    <motion.div
      animate={anim}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        background: color,
        opacity: 0.55,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ─── Styled Input ───────────────────────────────────────────────────────── */
function InputField({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  error,
  right,
  accent,
}) {
  return (
    <div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: error ? "#f43f5e" : "#64748b",
            pointerEvents: "none",
          }}
        >
          <Icon style={{ width: 18, height: 18 }} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${error ? "#f43f5e55" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 16,
            padding: "15px 48px",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            outline: "none",
            transition: "all 0.2s ease",
            fontFamily: "Outfit, sans-serif",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.border = `1.5px solid ${accent}88`;
            e.target.style.background = "rgba(255,255,255,0.09)";
            e.target.style.boxShadow = `0 0 0 4px ${accent}18`;
          }}
          onBlur={(e) => {
            e.target.style.border = `1.5px solid ${error ? "#f43f5e55" : "rgba(255,255,255,0.12)"}`;
            e.target.style.background = "rgba(255,255,255,0.06)";
            e.target.style.boxShadow = "none";
          }}
        />
        {right && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {right}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              color: "#f87171",
              fontSize: 11,
              fontWeight: 700,
              marginTop: 6,
              marginLeft: 4,
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── OTP Boxes (6-digit) ────────────────────────────────────────────────── */
function OtpBoxes({ value, onChange, accent }) {
  const refs = useRef([]);
  const digits = value.split("");

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      next[i] = "";
      onChange(next.join(""));
      if (i > 0) refs.current[i - 1]?.focus();
    }
  };
  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits.map((d) => d || "")];
    next[i] = ch;
    onChange(next.join(""));
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            background: "rgba(255,255,255,0.07)",
            border: `1.5px solid ${digits[i] ? accent + "aa" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 14,
            outline: "none",
            transition: "all 0.15s ease",
            fontFamily: "Outfit, sans-serif",
            boxShadow: digits[i] ? `0 0 0 3px ${accent}22` : "none",
          }}
          onFocus={(e) => {
            e.target.style.border = `1.5px solid ${accent}88`;
            e.target.style.boxShadow = `0 0 0 4px ${accent}18`;
          }}
          onBlur={(e) => {
            e.target.style.border = `1.5px solid ${digits[i] ? accent + "aa" : "rgba(255,255,255,0.12)"}`;
            e.target.style.boxShadow = digits[i]
              ? `0 0 0 3px ${accent}22`
              : "none";
          }}
        />
      ))}
    </div>
  );
}

/* ─── Google Button ──────────────────────────────────────────────────────── */
function GoogleBtn({ onClick, accent, glow }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "4px 0",
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          or
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.07)",
          border: "1.5px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "14px 20px",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: "Outfit, sans-serif",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = `${accent}55`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        }}
      >
        {/* Google G SVG */}
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        Continue with Google
      </motion.button>
    </>
  );
}

/* ─── Method Tab ─────────────────────────────────────────────────────────── */
function MethodTab({ active, onClick, children, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 8px",
        border: "none",
        borderRadius: 12,
        cursor: "pointer",
        fontFamily: "Outfit, sans-serif",
        fontSize: 13,
        fontWeight: 700,
        background: active
          ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
          : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.4)",
        boxShadow: active ? `0 4px 16px ${accent}44` : "none",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function LoginRole({ forcedRole }) {
  const { role: roleParam } = useParams();
  const role = (forcedRole || roleParam)?.toLowerCase();
  const cfg = ROLE_CONFIG[role];
  const demo = DEMO_CREDS[role];

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // Login method: 'email' | 'phone'
  const [method, setMethod] = useState("email");

  // Phone state
  const [phone, setPhone] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneTimer, setPhoneTimer] = useState(0);

  // Email OTP step (after password auth)
  const [emailOtpStep, setEmailOtpStep] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Countdown helper
  const startTimer = (setter, seconds = 30) => {
    setter(seconds);
    const id = setInterval(
      () =>
        setter((t) => {
          if (t <= 1) {
            clearInterval(id);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
  };

  if (!role || !VALID_ROLES.includes(role) || !cfg) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#64748b" }}>Invalid login endpoint.</p>
      </div>
    );
  }

  const Icon = cfg.icon;
  const [c1, c2, c3] = cfg.mesh;

  /* ── Validate email form ── */
  const validateEmail = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  /* ── Submit email/password → trigger email OTP step ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    try {
      await login(email, password); // validate creds first
      toast.success(`OTP sent to ${email}`);
      setEmailOtpStep(true);
      startTimer(setEmailOtpTimer);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Access denied",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify email OTP → navigate ── */
  const handleEmailOtpVerify = async () => {
    if (emailOtp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    if (emailOtp !== MOCK_OTP) {
      toast.error("Invalid OTP. Try 123456");
      return;
    }
    setLoading(true);
    try {
      const { user } = await login(email, password);
      toast.success("Verified! Welcome back.");
      navigate(cfg.panel || `/${role}`, { replace: true });
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── Send phone OTP ── */
  const handleSendPhoneOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    toast.success(`OTP sent to +91 ${phone} (use 123456)`);
    setPhoneOtpSent(true);
    startTimer(setPhoneTimer);
  };

  /* ── Verify phone OTP → mock login ── */
  const handlePhoneOtpVerify = async () => {
    if (phoneOtp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    if (phoneOtp !== MOCK_OTP) {
      toast.error("Invalid OTP. Try 123456");
      return;
    }
    setLoading(true);
    try {
      // Mock: use demo creds for phone login or fallback
      const cred = demo || {
        email: `${role}@novacare.com`,
        password: `${role}123`,
      };
      const { user } = await login(cred.email, cred.password);
      toast.success("Phone verified! Welcome back.");
      navigate(cfg.panel || `/${role}`, { replace: true });
    } catch {
      toast.error("Phone login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── Google mock login ── */
  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate OAuth redirect delay
    try {
      const cred = demo || {
        email: `${role}@novacare.com`,
        password: `${role}123`,
      };
      const backendRole = role === "laboratory" ? "lab_technician" : role === "ambulance" ? "ambulance_staff" : role;
      
      try {
        await login(cred.email, cred.password);
        toast.success("Signed in with Google (Offline)!");
        navigate(cfg.panel || `/${role}`, { replace: true });
      } catch (err) {
        // If login fails because user doesn't exist, auto-register them
        if (err.response?.status === 401 || err.response?.status === 400 || err.response?.status === 404) {
           await register({
             name: `${cfg.label} Google User`,
             email: cred.email,
             password: cred.password,
             role: backendRole
           });
           
           if (role === "patient") {
             await login(cred.email, cred.password);
             toast.success("Signed in with Google (Offline)!");
             navigate(cfg.panel || `/${role}`, { replace: true });
           } else {
             toast.success("Google account linked! Waiting for Admin approval.");
             navigate("/");
           }
        } else {
           throw err;
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed in offline mode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#080818",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <Orb
        color={c1}
        style={{ width: 520, height: 520, top: "-15%", left: "-15%" }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
      />
      <Orb
        color={c2}
        style={{ width: 400, height: 400, bottom: "-10%", right: "-10%" }}
        animate={{ x: [0, -60, 0], y: [0, -80, 0], scale: [1.1, 1, 1.1] }}
      />
      <Orb
        color={c3}
        style={{ width: 300, height: 300, top: "40%", right: "20%" }}
        animate={{ x: [0, 40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: 460,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(15,15,35,0.75)",
            backdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            padding: "48px 40px",
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top glow line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: 1,
              background: `linear-gradient(90deg,transparent,${cfg.accent}88,transparent)`,
            }}
          />

          {/* Loading overlay */}
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
                background: "rgba(8,8,24,0.85)",
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 32,
              }}
            >
              <Spinner size="xl" />
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: 20,
                }}
              >
                Authenticating...
              </p>
            </div>
          )}

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: `linear-gradient(135deg,${cfg.accent},${cfg.accentDark})`,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 6px 20px ${cfg.glow}`,
                }}
              >
                <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <span
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                NovaCare
              </span>
            </Link>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: `${cfg.accent}20`,
                  border: `1px solid ${cfg.accent}40`,
                  color: cfg.accent,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  padding: "5px 14px",
                  borderRadius: 999,
                }}
              >
                <Icon style={{ width: 12, height: 12 }} /> {cfg.badge}
              </span>
            </div>
            <h1
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 6px",
                background: `linear-gradient(135deg,#fff 40%,${cfg.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {emailOtpStep ? "Verify Your Email" : "Welcome Back"}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                margin: 0,
              }}
            >
              {emailOtpStep
                ? `Enter the 6-digit code sent to ${email}`
                : cfg.subtitle}
            </p>
          </div>

          {/* ── EMAIL OTP STEP ── */}
          <AnimatePresence mode="wait">
            {emailOtpStep ? (
              <motion.div
                key="email-otp"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <div style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    Enter OTP · Demo code:{" "}
                    <span style={{ color: cfg.accent }}>123456</span>
                  </p>
                  <OtpBoxes
                    value={emailOtp}
                    onChange={setEmailOtp}
                    accent={cfg.accent}
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleEmailOtpVerify}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg,${cfg.accent},${cfg.accentDark})`,
                    border: "none",
                    borderRadius: 16,
                    padding: "16px 24px",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: `0 16px 40px ${cfg.glow}`,
                    fontFamily: "Outfit, sans-serif",
                    marginBottom: 12,
                  }}
                >
                  <CheckCircle2 style={{ width: 18, height: 18 }} /> Verify &
                  Sign In
                </motion.button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (emailOtpTimer > 0) return;
                      toast.success("OTP resent! Use 123456");
                      startTimer(setEmailOtpTimer);
                    }}
                    disabled={emailOtpTimer > 0}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: emailOtpTimer > 0 ? "default" : "pointer",
                      color:
                        emailOtpTimer > 0
                          ? "rgba(255,255,255,0.2)"
                          : cfg.accent,
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    <RotateCw style={{ width: 14, height: 14 }} />
                    {emailOtpTimer > 0
                      ? `Resend in ${emailOtpTimer}s`
                      : "Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailOtpStep(false);
                      setEmailOtp("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.25)",
                      fontSize: 12,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    ← Back to login
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                {/* Method tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 14,
                    padding: 5,
                    marginBottom: 24,
                  }}
                >
                  <MethodTab
                    active={method === "email"}
                    onClick={() => setMethod("email")}
                    accent={cfg.accent}
                  >
                    <Mail
                      style={{
                        width: 14,
                        height: 14,
                        display: "inline",
                        marginRight: 6,
                      }}
                    />
                    Email
                  </MethodTab>
                  <MethodTab
                    active={method === "phone"}
                    onClick={() => setMethod("phone")}
                    accent={cfg.accent}
                  >
                    <Smartphone
                      style={{
                        width: 14,
                        height: 14,
                        display: "inline",
                        marginRight: 6,
                      }}
                    />
                    Phone OTP
                  </MethodTab>
                </div>

                {/* ── EMAIL FORM ── */}
                {method === "email" && (
                  <form
                    onSubmit={handleEmailSubmit}
                    noValidate
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: 8,
                          marginLeft: 2,
                        }}
                      >
                        Email Address
                      </label>
                      <InputField
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((p) => ({ ...p, email: "" }));
                        }}
                        placeholder="your@email.com"
                        error={errors.email}
                        accent={cfg.accent}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                          marginLeft: 2,
                          marginRight: 2,
                        }}
                      >
                        <label
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                          }}
                        >
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          style={{
                            color: cfg.accent,
                            fontSize: 11,
                            fontWeight: 700,
                            textDecoration: "none",
                            opacity: 0.8,
                          }}
                        >
                          Forgot?
                        </Link>
                      </div>
                      <InputField
                        icon={Lock}
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPass(e.target.value);
                          setErrors((p) => ({ ...p, password: "" }));
                        }}
                        placeholder="Enter your password"
                        error={errors.password}
                        accent={cfg.accent}
                        right={
                          <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "rgba(255,255,255,0.3)",
                              padding: 0,
                              display: "flex",
                            }}
                          >
                            {showPass ? (
                              <EyeOff style={{ width: 18, height: 18 }} />
                            ) : (
                              <Eye style={{ width: 18, height: 18 }} />
                            )}
                          </button>
                        }
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        marginTop: 4,
                        width: "100%",
                        background: `linear-gradient(135deg,${cfg.accent},${cfg.accentDark})`,
                        border: "none",
                        borderRadius: 16,
                        padding: "16px 24px",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        boxShadow: `0 16px 40px ${cfg.glow}`,
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Sign In &amp; Verify OTP{" "}
                      <ArrowRight style={{ width: 18, height: 18 }} />
                    </motion.button>
                    {demo && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(demo.email);
                          setPass(demo.password);
                        }}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 12,
                          padding: "11px 16px",
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Outfit, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255,255,255,0.08)";
                          e.target.style.color = "rgba(255,255,255,0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255,255,255,0.04)";
                          e.target.style.color = "rgba(255,255,255,0.35)";
                        }}
                      >
                        ⚡ Fill demo credentials
                      </button>
                    )}
                  </form>
                )}

                {/* ── PHONE FORM ── */}
                {method === "phone" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "rgba(255,255,255,0.5)",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: 8,
                          marginLeft: 2,
                        }}
                      >
                        Mobile Number
                      </label>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 14,
                            padding: "15px 14px",
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 14,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>🇮🇳</span> +91
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          placeholder="10-digit mobile"
                          maxLength={10}
                          style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.06)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            borderRadius: 14,
                            padding: "15px 18px",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 500,
                            outline: "none",
                            fontFamily: "Outfit, sans-serif",
                          }}
                          onFocus={(e) => {
                            e.target.style.border = `1.5px solid ${cfg.accent}88`;
                            e.target.style.boxShadow = `0 0 0 4px ${cfg.accent}18`;
                          }}
                          onBlur={(e) => {
                            e.target.style.border =
                              "1.5px solid rgba(255,255,255,0.12)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    {!phoneOtpSent ? (
                      <motion.button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          background: `linear-gradient(135deg,${cfg.accent},${cfg.accentDark})`,
                          border: "none",
                          borderRadius: 16,
                          padding: "16px 24px",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          boxShadow: `0 16px 40px ${cfg.glow}`,
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        <Smartphone style={{ width: 18, height: 18 }} /> Send
                        OTP
                      </motion.button>
                    ) : (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,
                          }}
                        >
                          <div>
                            <p
                              style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 14,
                                textAlign: "center",
                              }}
                            >
                              OTP sent to +91 {phone} · Demo:{" "}
                              <span style={{ color: cfg.accent }}>123456</span>
                            </p>
                            <OtpBoxes
                              value={phoneOtp}
                              onChange={setPhoneOtp}
                              accent={cfg.accent}
                            />
                          </div>
                          <motion.button
                            type="button"
                            onClick={handlePhoneOtpVerify}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              width: "100%",
                              background: `linear-gradient(135deg,${cfg.accent},${cfg.accentDark})`,
                              border: "none",
                              borderRadius: 16,
                              padding: "16px",
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              boxShadow: `0 16px 40px ${cfg.glow}`,
                              fontFamily: "Outfit, sans-serif",
                            }}
                          >
                            <CheckCircle2 style={{ width: 18, height: 18 }} />{" "}
                            Verify & Sign In
                          </motion.button>
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneOtp("");
                              if (phoneTimer > 0) return;
                              toast.success("OTP resent! Use 123456");
                              startTimer(setPhoneTimer);
                            }}
                            disabled={phoneTimer > 0}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: phoneTimer > 0 ? "default" : "pointer",
                              color:
                                phoneTimer > 0
                                  ? "rgba(255,255,255,0.2)"
                                  : cfg.accent,
                              fontSize: 13,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              fontFamily: "Outfit, sans-serif",
                            }}
                          >
                            <RotateCw style={{ width: 14, height: 14 }} />
                            {phoneTimer > 0
                              ? `Resend in ${phoneTimer}s`
                              : "Resend OTP"}
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                )}

                {/* Google */}
                <GoogleBtn
                  onClick={handleGoogle}
                  accent={cfg.accent}
                  glow={cfg.glow}
                />

                {/* Footer */}
                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 13,
                      margin: 0,
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: cfg.accent,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "30%",
              right: "30%",
              height: 1,
              background: `linear-gradient(90deg,transparent,${cfg.accent}44,transparent)`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
