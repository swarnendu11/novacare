/**
 * Unauthorized - 403 page with functional links
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Logo";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Logo className="w-12 h-12" />
          <span className="font-bold text-primary text-xl">NovaCare</span>
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Access Denied
        </h1>
        <p className="text-slate-600 mb-8">
          You don&apos;t have permission to view this page. Please log in with
          an account that has access, or go back to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
          >
            Login
          </Link>
          <Link
            to="/"
            className="inline-block px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
