import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const useClerk = clerkKey && clerkKey !== "YOUR_PUBLISHABLE_KEY";
const signUpPath = useClerk ? "/sign-up" : "/register";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "services", label: "Services", href: "/#services" },
    { id: "doctors", label: "Departments", href: "/#doctors" },
    { id: "about", label: "About", href: "/#about" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  const handleNavClick = (href, id) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname === "/") {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
      if (href === "/") {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      }
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-slate-200/80 shadow-sm"
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2"
          >
            <Logo variant="full" className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className="text-slate-700 hover:text-primary font-medium transition"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {useClerk ? (
              <>
                <SignedOut>
                  <SignInButton mode="redirect" redirectUrl="/sign-in">
                    <button
                      type="button"
                      className="hidden sm:inline-flex btn-ghost"
                    >
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="redirect" redirectUrl="/sign-up">
                    <button type="button" className="btn-primary">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`/${user.role}`}
                  className="hidden sm:inline-flex btn-primary shadow-sm hover:shadow-md transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-ghost text-slate-500 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex btn-ghost">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary shadow-sm hover:shadow-md transition"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href, item.id)}
                  className="block w-full text-left py-2 text-slate-700 hover:text-primary font-medium"
                >
                  {item.label}
                </button>
              ))}
              {useClerk ? (
                <>
                  <SignedOut>
                    <SignInButton mode="redirect" redirectUrl="/sign-in">
                      <button
                        type="button"
                        className="block w-full text-left py-2 text-slate-700 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </button>
                    </SignInButton>
                    <SignUpButton mode="redirect" redirectUrl="/sign-up">
                      <button
                        type="button"
                        className="block w-full text-left py-2 text-slate-700 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div
                      className="pt-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </>
              ) : user ? (
                <>
                  <Link
                    to={`/${user.role}`}
                    className="block py-2 text-primary font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-500 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-slate-700 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-slate-700 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
