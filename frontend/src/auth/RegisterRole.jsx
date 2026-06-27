/**
 * NovaCare — RegisterRole
 * Features: Multi-step registration, Google Sign-In, Phone + OTP verify, Email OTP verify
 * All mock-wired (frontend-only). Existing premium design preserved.
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
  Phone,
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
    subtitle: "Join specialized care and wellness",
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
    subtitle: "Elevate your clinical practice",
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
    subtitle: "Centralize hospital administration",
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
    subtitle: "Organize front desk operations",
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
    subtitle: "Deliver compassionate clinical care",
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
    subtitle: "Support critical hospital support",
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
        opacity: 0.5,
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
        Register with Google
      </motion.button>
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function RegisterRole({ forcedRole }) {
  const { role: roleParam } = useParams();
  const role = (forcedRole || roleParam)?.toLowerCase();
  const cfg = ROLE_CONFIG[role];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Registration step flow: 'form' | 'otp_verify'
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  const startTimer = (seconds = 30) => {
    setTimer(seconds);
    const id = setInterval(
      () =>
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(id);
            return 0;
          }
          return t - 1;
        }),
      1000,
    );
  };

  console.log("DEBUG RegisterRole", { role, isValid: VALID_ROLES.includes(role), cfg });
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
        <p style={{ color: "#64748b" }}>Invalid registration endpoint.</p>
        <p style={{ color: "red", marginTop: 10 }}>DEBUG: role={role}</p>
      </div>
    );
  }

  const [c1, c2, c3] = cfg.mesh;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email address is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = "Invalid email format";
    if (formData.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(formData.phone))
      errs.phone = "Enter valid 10-digit mobile number";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleRegisterInput = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Mock: Send verification email first
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(`Verification code sent to ${formData.email}`);
      setStep("otp_verify");
      startTimer(60);
    } catch (err) {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCreate = async () => {
    if (otp !== MOCK_OTP) {
      toast.error("Invalid code. Use 123456");
      return;
    }
    setLoading(true);
    try {
      await register({ ...formData, role });
      toast.success("Successfully registered! Welcome to NovaCare.");
      navigate(cfg.panel || `/${role}`, { replace: true });
    } catch (e) {
      toast.error(e.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      try {
        await register({
          name: `${cfg.label} Google User`,
          email: `google_${Date.now()}@gmail.com`,
          password: "google_oauth_bypass",
          role: role,
        });
        
        if (role === "patient") {
          toast.success("Registration successful with Google!");
          navigate(cfg.panel || `/${role}`, { replace: true });
        } else {
          toast.success("Google account created! Waiting for Admin approval.");
          navigate("/");
        }
      } catch (err) {
         throw err;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Google registration failed in offline mode");
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
        style={{ width: 600, height: 600, top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
      />
      <Orb
        color={c2}
        style={{ width: 500, height: 500, bottom: "-5%", right: "-5%" }}
        animate={{ x: [0, -80, 0], y: [0, -100, 0] }}
      />
      <Orb
        color={c3}
        style={{ width: 350, height: 350, top: "30%", right: "10%" }}
        animate={{ x: [0, 50, 0], y: [0, -60, 0] }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 500,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "rgba(15,15,35,0.75)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 32,
            padding: "48px 40px",
            boxShadow: `0 40px 80px rgba(0,0,0,0.5)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
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
                  color: cfg.accent,
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginTop: 20,
                }}
              >
                Creating Professional Profile...
              </p>
            </div>
          )}

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
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
                  boxShadow: `0 8px 20px ${cfg.glow}`,
                }}
              >
                <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
              </div>
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>
                NovaCare
              </span>
            </Link>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  background: `${cfg.accent}15`,
                  border: `1px solid ${cfg.accent}30`,
                  color: cfg.accent,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "5px 14px",
                  borderRadius: 999,
                }}
              >
                {cfg.badge}
              </span>
            </div>
            <h1
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              {step === "form" ? "Create Account" : "Verify Email"}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              {step === "form"
                ? cfg.subtitle
                : `Enter verification code sent to ${formData.email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegisterInput}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <InputField
                  icon={User}
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full Name"
                  error={errors.name}
                  accent={cfg.accent}
                />
                <InputField
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email Address"
                  error={errors.email}
                  accent={cfg.accent}
                />

                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 0.4 }}>
                    <div
                      style={{
                        height: 54,
                        background: "rgba(255,255,255,0.06)",
                        border: "1.5px solid rgba(255,255,255,0.12)",
                        borderRadius: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      🇮🇳 +91
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <InputField
                      icon={Phone}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="Mobile Number"
                      error={errors.phone}
                      accent={cfg.accent}
                    />
                  </div>
                </div>

                <InputField
                  icon={Lock}
                  type={showPass ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
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
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <motion.button
                  type="submit"
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
                    gap: 10,
                    boxShadow: `0 16px 40px ${cfg.glow}`,
                    marginTop: 6,
                  }}
                >
                  Continue Registration <ArrowRight size={18} />
                </motion.button>

                <GoogleBtn
                  onClick={handleGoogle}
                  accent={cfg.accent}
                  glow={cfg.glow}
                />
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: 28 }}>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      textAlign: "center",
                      marginBottom: 18,
                    }}
                  >
                    Demo Code: <span style={{ color: cfg.accent }}>123456</span>
                  </p>
                  <OtpBoxes value={otp} onChange={setOtp} accent={cfg.accent} />
                </div>

                <motion.button
                  type="button"
                  onClick={verifyAndCreate}
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
                    gap: 10,
                    boxShadow: `0 16px 40px ${cfg.glow}`,
                    marginBottom: 16,
                  }}
                >
                  <CheckCircle2 size={18} /> Complete Registration
                </motion.button>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => timer === 0 && startTimer(60)}
                    disabled={timer > 0}
                    style={{
                      background: "none",
                      border: "none",
                      color: timer > 0 ? "rgba(255,255,255,0.2)" : cfg.accent,
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      margin: "0 auto",
                      cursor: timer > 0 ? "default" : "pointer",
                    }}
                  >
                    <RotateCw size={14} />{" "}
                    {timer > 0
                      ? `Resend in ${timer}s`
                      : "Resend Verification Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 12,
                      marginTop: 16,
                      cursor: "pointer",
                    }}
                  >
                    ← Back to details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
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
              Already registered?{" "}
              <Link
                to="/login"
                style={{
                  color: cfg.accent,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
