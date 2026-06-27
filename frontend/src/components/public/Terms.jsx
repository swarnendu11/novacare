/**
 * Terms of Use - Static content, linked from footer
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Logo";

export default function Terms() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Use</h1>
        <p className="text-slate-500 text-sm mb-8">
          Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>
        <div className="prose prose-gray max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              1. Acceptance
            </h2>
            <p>
              By using the NovaCare platform, you agree to these terms. If you
              do not agree, please do not use our services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              2. Use of service
            </h2>
            <p>
              You must use the platform only for lawful purposes—booking
              appointments, viewing prescriptions, and managing health records.
              You are responsible for keeping your login credentials secure.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              3. Payments
            </h2>
            <p>
              Consultation and other fees are displayed in Indian Rupees (INR).
              Payment is as per the hospital&apos;s policy (e.g. at the time of
              visit). Refunds are subject to the hospital&apos;s terms.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              4. Limitation of liability
            </h2>
            <p>
              NovaCare provides a management platform. Medical advice and
              treatment are the responsibility of the treating doctors and the
              hospital. We are not liable for clinical outcomes.
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
