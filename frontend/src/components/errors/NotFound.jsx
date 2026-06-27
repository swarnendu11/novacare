/**
 * 404 Page
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Logo className="w-12 h-12" />
          <span className="font-bold text-primary text-xl">NovaCare</span>
        </Link>
        <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
