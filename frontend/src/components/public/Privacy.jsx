/**
 * Privacy Policy - Static content, linked from footer
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Logo";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-primary text-lg">NovaCare</span>
          </Link>
          <Link to="/" className="text-sm text-slate-600 hover:text-primary">
            Back to Home
          </Link>
        </div>
      </nav>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-12"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>
        <div className="prose prose-gray max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              1. Information we collect
            </h2>
            <p>
              We collect information you provide when registering (name, email,
              role), appointment and prescription data, and usage information to
              run the NovaCare platform and improve our services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              2. How we use it
            </h2>
            <p>
              Your data is used to manage appointments, prescriptions, and
              medical records; to communicate with you; and to comply with
              applicable laws. We do not sell your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              3. Security
            </h2>
            <p>
              We use industry-standard measures to protect your data. Access is
              role-based and authenticated. Passwords are hashed and never
              stored in plain text.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              4. Your rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data by contacting us at contact@novacare.com.
            </p>
          </section>
        </div>
        <p className="mt-10">
          <Link to="/" className="text-primary font-medium hover:underline">
            ← Back to Home
          </Link>
        </p>
      </motion.main>
    </div>
  );
}
