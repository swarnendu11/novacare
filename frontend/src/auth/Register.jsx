/**
 * Register Page - Versatile registration for any role
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import GoogleSignIn from "../components/GoogleSignIn";

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

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    phone: "",
    gender: "Unspecified",
    dob: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googlePending, setGooglePending] = useState(null);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  useEffect(() => {
    if (state.googleComplete && state.email) {
      setFormData((prev) => ({
        ...prev,
        email: state.email,
        name: state.name || "",
      }));
      toast("Choose your role to complete signup", { icon: "ℹ️" });
    }
  }, [state.googleComplete, state.email, state.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { user } = await register(formData);
      toast.success(`Account created! Your ID is: ${user.customId}`);
      const target = ROLE_PANELS[user?.role] || "/patient";
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    setGoogleLoading(true);
    setGooglePending(null);
    try {
      const data = await loginWithGoogle(idToken);
      if (data?.needRole) {
        setGooglePending({ idToken, email: data.email, name: data.name });
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
          name: data.name || "",
        }));
        toast("Choose your role to complete signup", { icon: "ℹ️" });
        return;
      }
      toast.success("Account created!");
      const target = ROLE_PANELS[data?.user?.role] || "/";
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCompleteGoogleSignup = async () => {
    if (!googlePending?.idToken || !formData.role) {
      toast.error("Select a role");
      return;
    }
    setGoogleLoading(true);
    try {
      const data = await loginWithGoogle(googlePending.idToken, formData.role);
      if (data?.needRole) {
        toast.error("Something went wrong. Try again.");
        return;
      }
      toast.success("Account created!");
      const target = ROLE_PANELS[data?.user?.role] || "/";
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign-up failed");
    } finally {
      setGoogleLoading(false);
      setGooglePending(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=60)`,
          filter: "brightness(0.45) contrast(1.2)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-soft p-8 border border-slate-100 relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-12 h-12" />
            <span className="font-bold text-primary text-xl">NovaCare</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Versatile Registration
          </h1>
          <p className="text-slate-500 mt-1">Create your unique identity</p>
        </div>

        {googlePending ? (
          <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/20 mb-6">
            <p className="text-sm text-slate-700 text-center">
              Signed in with Google as <strong>{googlePending.email}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select your Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
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
                onClick={() => setGooglePending(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <GoogleSignIn
            type="signup"
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Sign-In could not load")}
            className="mb-6"
          />
        )}

        {!googlePending && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">
                  or complete profile below
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  >
                    <option value="Unspecified">Unspecified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Register as
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none h-20"
                  placeholder="Your residential address"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                {loading ? <Spinner size="sm" /> : "Create Account"}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
