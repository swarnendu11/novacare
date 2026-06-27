/**
 * Landing Page - NovaCare
 * Hero, Stats, Features, Departments, About, Contact, Footer
 */

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Logo";
import Navbar from "../Navbar";
import { allDepartments } from "../../data/departments";
import { useAuth } from "../../context/AuthContext";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerk = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";
const signUpPath = useClerk ? "/sign-up" : "/register";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const BG = {
  hero: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
  services:
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1920&q=80",
  about:
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80",
  contact:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80",
};

export default function Landing() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const features = [
    {
      title: "Book Appointments",
      desc: "Book appointments 24/7 from anywhere. Choose your doctor and time slot instantly.",
      icon: "📅",
      cta: "Book now",
      to: signUpPath,
    },
    {
      title: "Digital Prescriptions",
      desc: "Access and download prescriptions anytime. All records in one secure place.",
      icon: "📋",
      cta: "Get started",
      to: signUpPath,
    },
    {
      title: "Medical Records",
      desc: "Secure health records and visit history. Share with doctors when needed.",
      icon: "🗂️",
      cta: "Learn more",
      to: signUpPath,
    },
    {
      title: "Talk to Doctors",
      desc: "Consult qualified doctors across Cardiology, General Medicine, and Pediatrics.",
      icon: "👨‍⚕️",
      cta: "Find a doctor",
      to: signUpPath,
    },
  ];

  const stats = [
    { value: "50,000+", label: "Patients Served", icon: "❤️" },
    { value: "100+", label: "Expert Doctors", icon: "👨‍⚕️" },
    { value: "24/7", label: "Support", icon: "🕒" },
    { value: "15+", label: "Specialities", icon: "🏥" },
  ];

  const featuredDepartments = allDepartments.slice(0, 6);

  return (
    <div className="page-shell">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 40%), linear-gradient(135deg,#2563EB,#1E40AF)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                Manage appointments online, access digital prescriptions, and
                keep your medical records secure—all in one place. Trusted by
                thousands across India.
              </p>
              <div className="flex flex-wrap gap-4">

                <Link
                  to={user ? `/${user.role}/appointments` : "/register"}
                  className="px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition"
                >
                  Book Appointment
                </Link>
                <button
                  onClick={() => scrollTo("contact")}
                  className="px-6 py-3 bg-red-500/20 text-red-100 border border-red-500/50 font-semibold rounded-xl hover:bg-red-500/40 transition"
                >
                  Emergency Contact
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div
                className="w-full h-[400px] bg-white/10 rounded-3xl backdrop-blur-md flex items-end justify-center overflow-hidden relative"
                style={{
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* Decorative glowing orb behind the doctor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/40 rounded-full blur-3xl pointer-events-none"></div>

                {/* Image of modern doctor */}
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="Professional Doctor"
                  className="w-full h-full object-cover object-top relative z-10"
                />

                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md shadow-xl border border-white/40 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl shadow-inner shadow-green-200">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm">
                      Expert Doctors
                    </p>
                    <p className="text-gray-500 text-xs font-medium">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="section-light border-y border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center flex flex-col items-center justify-center p-5 rounded-xl border border-slate-100 transition-all"
                style={{ background: "#F8FAFC" }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {s.value}
                </p>
                <p className="text-sm font-bold tracking-wide text-slate-500 mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Services */}
      <section
        id="services"
        className="py-20 relative scroll-mt-20 overflow-hidden bg-gray-900"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${BG.services})`,
            filter: "brightness(0.4) contrast(1.25)",
          }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-white mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
          >
            Everything you need for hassle-free healthcare, from booking to
            prescriptions.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={f.to}
                  className="block bg-white p-6 rounded-xl shadow-soft border border-gray-100 hover:shadow-card hover:border-primary/20 transition h-full group"
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{f.desc}</p>
                  <span className="text-primary font-medium text-sm inline-flex items-center gap-1">
                    {f.cta}
                    <span>→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments / Doctors */}
      <section id="doctors" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-4"
          >
            Our Departments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 max-w-2xl mx-auto mb-12"
          >
            Qualified specialists across multiple departments ready to provide
            the best care.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredDepartments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl text-center border border-slate-200 hover:border-brand-blue/30 hover:shadow-md transition-all group flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-brand-blue/20 transition-transform">
                  {dept.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {dept.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow">
                  {dept.desc}
                </p>
                <Link
                  to={signUpPath}
                  className="text-brand-blue font-medium text-sm hover:underline mt-auto inline-flex items-center justify-center gap-1"
                >
                  Book appointment <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
            >
              View All 50 Departments
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 text-3xl font-bold animate-pulse">
              +
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">24/7 Emergency Care</h2>
              <p className="text-red-100">Our emergency department is always open and ready to assist you.</p>
            </div>
          </div>
          <a href="tel:+911234567890" className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:bg-red-50 transition text-lg flex items-center gap-2">
            <span>📞</span> +91 123 456 7890
          </a>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-20 relative scroll-mt-20 overflow-hidden section-light"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${BG.about})`,
            filter: "brightness(0.85) contrast(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                About NovaCare
              </h2>
              <p className="text-slate-600 mb-4">
                NovaCare is a modern hospital management platform designed to
                simplify healthcare for patients, doctors, and staff. We bring
                appointments, prescriptions, and medical records into one
                secure, easy-to-use system.
              </p>
              <p className="text-slate-600 mb-6">
                Our mission is to make quality healthcare accessible and
                stress-free. Whether you need to book a consultation, view your
                prescriptions, or manage your health records—we have you covered
                with Indian Rupee (INR) pricing and local support.
              </p>
              <Link to={signUpPath} className="btn-primary">
                Join us
                <span>→</span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="surface-dark p-8"
            >
              <h3 className="font-semibold mb-4">Why choose us?</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-2">
                  ✓ 24/7 online appointment booking
                </li>
                <li className="flex items-center gap-2">
                  ✓ Digital prescriptions & PDF download
                </li>
                <li className="flex items-center gap-2">
                  ✓ Transparent pricing in INR
                </li>
                <li className="flex items-center gap-2">
                  ✓ Secure, role-based access
                </li>
                <li className="flex items-center gap-2">
                  ✓ Medical history at your fingertips
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-slate-900 mb-12"
          >
            Patient Testimonials
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Verma", text: "The doctors at NovaCare saved my life. Their quick response during my emergency was remarkable.", rating: 5 },
              { name: "Priya Sharma", text: "Booking appointments is so easy! I love how I can view all my digital prescriptions in one place.", rating: 5 },
              { name: "Arvind Singh", text: "Very clean hospital with state-of-the-art facilities. The staff is extremely polite and helpful.", rating: 4 }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex text-amber-400 mb-4">{"★".repeat(t.rating)}</div>
                <p className="text-slate-600 italic mb-4">"{t.text}"</p>
                <p className="font-bold text-slate-900">- {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-slate-900 mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "How do I book an appointment?", a: "You can click on the 'Sign Up' or 'Book Appointment' buttons to create an account and schedule a visit from your dashboard." },
              { q: "Do you offer emergency services?", a: "Yes! Our emergency department and ambulance dispatch operate 24/7." },
              { q: "Can I access my lab reports online?", a: "Absolutely. All patients have access to a secure portal where they can view lab reports, bills, and prescriptions." }
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-20 relative scroll-mt-20 overflow-hidden bg-gray-900"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${BG.contact})`,
            filter: "brightness(0.4) contrast(1.25)",
          }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-white mb-4"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-300 max-w-xl mx-auto mb-12"
          >
            Have questions? Reach out to our team.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.a
              href="mailto:contact@novacare.com"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-xl bg-gray-800/90 border border-gray-700 hover:border-primary/40 transition text-center"
            >
              <span className="text-2xl mb-2">📧</span>
              <span className="font-medium text-white">Email</span>
              <span className="text-sm text-gray-400">
                contact@novacare.com
              </span>
            </motion.a>
            <motion.a
              href="tel:+911234567890"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-xl bg-gray-800/90 border border-gray-700 hover:border-primary/40 transition text-center"
            >
              <span className="text-2xl mb-2">📞</span>
              <span className="font-medium text-white">Phone</span>
              <span className="text-sm text-gray-400">+91 123 456 7890</span>
            </motion.a>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-xl bg-gray-800/90 border border-gray-700 text-center"
            >
              <span className="text-2xl mb-2">📍</span>
              <span className="font-medium text-white">Address</span>
              <span className="text-sm text-gray-400">
                NovaCare Hospital, City Centre, India
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Logo variant="full-dark" className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-gray-400 max-w-md">
                Smart Healthcare. Simplified. Book appointments, manage
                prescriptions, and access your medical records—all in one place.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => scrollTo("home")}
                  className="block text-left text-sm hover:text-white transition"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="block text-left text-sm hover:text-white transition"
                >
                  Services
                </button>
                <Link
                  to="/contact"
                  className="block text-sm hover:text-white transition"
                >
                  Contact
                </Link>
                {user ? (
                  <Link
                    to={`/${user.role}`}
                    className="block text-sm hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to={useClerk ? "/sign-in" : "/login"}
                      className="block text-sm hover:text-white transition"
                    >
                      Login
                    </Link>
                    <Link
                      to={signUpPath}
                      className="block text-sm hover:text-white transition"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <div className="space-y-2">
                <Link
                  to="/privacy"
                  className="block text-sm hover:text-white transition"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="block text-sm hover:text-white transition"
                >
                  Terms of Use
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} NovaCare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
