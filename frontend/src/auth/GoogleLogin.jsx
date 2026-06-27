/**
 * Google Login - Dedicated Google authentication page
 * White card design matching Patient Login style
 */

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerkAuth = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";

export default function GoogleLogin() {
  const navigate = useNavigate();

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
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo className="w-12 h-12" />
            <span className="font-bold text-primary text-2xl">NovaCare</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Google Login
          </h1>
          <p className="text-slate-600 text-center text-sm mb-8">
            Sign in with your Google account
          </p>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => navigate(useClerkAuth ? "/sign-in" : "/login")}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-slate-300 rounded-xl hover:border-slate-400 hover:shadow-md transition-all duration-200 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-slate-700 font-medium">
              Continue with Google
            </span>
          </button>

          {/* Other Login Options Link */}
          <div className="text-center mb-6">
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center gap-1"
            >
              <span>←</span>
              <span>Other login options</span>
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center pt-4 border-t border-slate-200">
            <p className="text-slate-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/google-signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up with Google
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
