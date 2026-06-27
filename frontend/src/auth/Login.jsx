/**
 * Login Page - Versatile login (Email, Username, or CustomID)
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import GoogleSignIn from "../components/GoogleSignIn";

const ROLE_PANELS = {
  patient: "/patient",
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/receptionist",
  nurse: "/nurse",
  pharmacy: "/pharmacy",
  laboratory: "/laboratory",
  wardboy: "/wardboy",
  ambulance: "/ambulance",
};

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "admin", label: "Administrator" },
  { value: "receptionist", label: "Receptionist" },
  { value: "nurse", label: "Nurse" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "laboratory", label: "Laboratory" },
  { value: "wardboy", label: "Wardboy" },
  { value: "ambulance", label: "Ambulance" },
];

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleNeedRole, setGoogleNeedRole] = useState(null);
  const [role, setRole] = useState("patient");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(identifier, password);
      if (user.role !== role) {
        toast.error(`Account found but role is not ${role}. Please select correct role.`);
        setLoading(false);
        return;
      }
      toast.success("Login successful!");
      const target = ROLE_PANELS[user?.role] || "/";
      navigate(target, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Cannot reach server. Is the backend running?"
          : "Login failed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    setGoogleLoading(true);
    setGoogleNeedRole(null);
    try {
      const data = await loginWithGoogle(idToken);
      if (data?.needRole) {
        setGoogleNeedRole({ idToken, email: data.email, name: data.name });
        toast("Choose your role to complete signup", { icon: "ℹ️" });
        return;
      }
      toast.success("Login successful!");
      const target = ROLE_PANELS[data?.user?.role] || "/";
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCompleteGoogleSignup = async () => {
    if (!googleNeedRole?.idToken) return;
    setGoogleLoading(true);
    try {
      const data = await loginWithGoogle(googleNeedRole.idToken, role);
      if (data?.needRole) {
        toast.error("Something went wrong. Try again.");
        return;
      }
      toast.success("Account created!");
      const target = ROLE_PANELS[data?.user?.role] || "/";
      navigate(target, { replace: true });
      setGoogleNeedRole(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=60)`,
          filter: "brightness(0.45) contrast(1.2)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8 border border-slate-100 relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-12 h-12" />
            <span className="font-bold text-primary text-xl">NovaCare</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="text-slate-500 mt-1">
            Sign in with Email, Username or Custom ID
          </p>
        </div>

        {googleNeedRole ? (
          <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20 mb-6">
            <p className="text-sm text-slate-700">
              Signed in with Google as <strong>{googleNeedRole.email}</strong>.
              Choose your role to finish registration.
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                I am a
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCompleteGoogleSignup}
                disabled={googleLoading}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {googleLoading ? (
                  <Spinner size="sm" />
                ) : (
                  "Complete registration"
                )}
              </button>
              <button
                type="button"
                onClick={() => setGoogleNeedRole(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <GoogleSignIn
              type="signin"
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Sign-In could not load")}
              className="mb-6"
            />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">
                  or continue with credentials
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email, Username or ID
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="name@example.com or DOC-1234"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Login As
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600">Remember Me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
