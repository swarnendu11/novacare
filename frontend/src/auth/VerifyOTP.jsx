import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck, Loader2, ArrowLeft, RotateCw } from "lucide-react";
import Logo from "../components/Logo";
import { authApi } from "../services/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const resetEmail = sessionStorage.getItem("reset_email");
  const resetTarget = sessionStorage.getItem("reset_target");
  const resetChannel = sessionStorage.getItem("reset_channel");

  useEffect(() => {
    if (!resetEmail) {
      toast.error("Session expired. Please start again.");
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resetEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("OTP is required");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp(otp);
      toast.success("OTP verified successfully!");
      navigate("/reset-password");
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const { data } = await authApi.forgotPassword(resetEmail);
      toast.success(data.message || "New OTP sent!");
      setTimer(30);
      setOtp("");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
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
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white">Verify OTP</h1>
          <p className="text-slate-400 mt-2 text-sm">
            We&apos;ve sent a security code via{" "}
            <span className="text-white font-medium">{resetChannel}</span> to{" "}
            <span className="text-white font-medium">{resetTarget}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-3">
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className={`w-full text-center tracking-[1em] text-2xl font-bold text-white placeholder-white/20 outline-none transition-all focus:border-[#2563EB] focus:ring-0 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] ${error ? "border-red-500" : "border-slate-700"}`}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: error
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "16px",
                }}
                placeholder="Enter OTP"
              />
            </div>
            {error ? (
              <p className="text-center text-xs text-red-500">{error}</p>
            ) : (
              <p className="text-center text-xs text-slate-500">
                Enter the 6-digit code received via SMS/Email
              </p>
            )}
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
              "Verify Code"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ color: timer > 0 ? "#64748b" : "#2563EB" }}
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCw
                  className={`w-4 h-4 ${timer > 0 ? "" : "animate-pulse"}`}
                />
              )}
              {timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Use a different method
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
