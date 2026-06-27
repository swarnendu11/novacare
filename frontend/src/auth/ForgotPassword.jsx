import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Phone, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Logo from "../components/Logo";
import { authApi } from "../services/api";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isEmail = /^\S+@\S+\.\S+$/.test(identifier.trim());
    const isPhone = /^\d{10}$/.test(identifier.trim());

    if (!identifier.trim()) {
      setError("Email or phone number is required");
      return;
    }

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email or 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(identifier.trim());
      toast.success(data.message || "OTP sent successfully!");
      navigate("/verify-otp");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Background */}
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
        style={{
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 group transition-transform hover:scale-105"
          >
            <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors border border-slate-700">
              <Logo className="w-8 h-8 text-primary" />
            </div>
            <span className="font-bold text-white text-xl">NovaCare</span>
          </Link>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center border-4 border-slate-900 ring-1 ring-slate-700">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Enter your registered email or phone number and we&apos;ll send you
            a 6-digit OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-300 ml-1">
              Email or Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3.5 flex items-center gap-1.5 text-slate-500">
                <Mail className="w-4 h-4" />
                <span className="text-slate-600">/</span>
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError("");
                }}
                className={`w-full text-white placeholder-white/20 outline-none transition-all focus:border-[#2563EB] focus:ring-0 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] ${error ? "border-red-500" : "border-slate-700"}`}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: error
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "12px 14px 12px 72px",
                }}
                placeholder="Email or Phone"
              />
            </div>
            {error && <p className="text-xs text-red-500 ml-1 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-white font-bold rounded-xl disabled:opacity-70 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg,#2563EB,#06B6D4)",
              boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 20px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(37,99,235,0.2)";
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
