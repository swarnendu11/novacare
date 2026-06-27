import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { allDepartments } from "../../data/departments";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerk = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";
const signUpPath = useClerk ? "/sign-up" : "/register";

export default function DepartmentsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-shell bg-slate-50 min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            All Departments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Explore our comprehensive range of specialized medical departments,
            staffed by expert doctors ready to provide the best care.
          </motion.p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allDepartments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 + 0.1, duration: 0.3 }}
                className="bg-white p-6 rounded-xl text-center shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-blue/30 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-brand-blue/10 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-brand-blue/20 transition-transform">
                  {dept.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{dept.name}</h3>
                <p className="text-xs text-slate-500 mb-4 flex-grow">
                  {dept.desc}
                </p>
                <Link
                  to={signUpPath}
                  className="text-brand-blue font-semibold text-sm hover:text-brand-teal transition-colors mt-auto inline-flex items-center justify-center gap-1"
                >
                  Book now <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} NovaCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
