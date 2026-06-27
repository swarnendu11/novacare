/**
 * Contact Us page - Form + info columns (teal accent layout)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Logo from "../Logo";
import Navbar from "../Navbar";

const TEAL = "#14B8A6";
const BG_FORM =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80";
const BG_INFO =
  "https://images.unsplash.com/photo-1519494084650-711c2e6f567f?w=1920&q=80";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Message sent! We will get back to you soon.");
      setForm({ name: "", contact: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Top section - Form */}
      <section className="py-16 px-4 relative overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${BG_FORM})`,
            filter: "brightness(0.4) contrast(1.25)",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-slate-300 text-base mb-10"
          >
            Any questions or remarks? Just write us a message!
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your Name"
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Contact
                </label>
                <input
                  type="tel"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  placeholder="Enter your Contact Number"
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6]"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter a valid email address"
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message here..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-lg font-bold text-white uppercase tracking-wide transition opacity-90 hover:opacity-100 disabled:opacity-60"
              style={{ backgroundColor: TEAL }}
            >
              {submitting ? "Sending..." : "Submit"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Bottom section - Info columns with teal strip */}
      <section className="relative pt-16 pb-4 overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${BG_INFO})`,
            filter: "brightness(0.4) contrast(1.25)",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 text-center">
            {/* About NovaCare */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0"
                style={{ backgroundColor: TEAL }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white uppercase tracking-wide text-sm mb-2">
                About NovaCare
              </h3>
              <p className="text-slate-300 text-sm">Smart Healthcare</p>
              <p className="text-slate-300 text-sm">Simplified.</p>
            </motion.div>

            {/* Phone */}
            <motion.a
              href="tel:+91235678987"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center hover:opacity-90 transition"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0"
                style={{ backgroundColor: TEAL }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white uppercase tracking-wide text-sm mb-2">
                Phone (Landline)
              </h3>
              <p className="text-slate-300 text-sm">+ 91 23 567 8987</p>
              <p className="text-slate-300 text-sm">+ 91 25 252 3336</p>
            </motion.a>

            {/* Office Location */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0"
                style={{ backgroundColor: TEAL }}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white uppercase tracking-wide text-sm mb-2">
                Our Office Location
              </h3>
              <p className="text-slate-300 text-sm">NovaCare Hospital</p>
              <p className="text-slate-300 text-sm">
                The Courtyard, City Centre, India
              </p>
            </motion.div>
          </div>
        </div>
        <div className="h-1.5 w-full mt-12" style={{ backgroundColor: TEAL }} />
      </section>
    </div>
  );
}
