/**
 * NovaCare — Reusable Modal Component
 * Premium glassmorphic modal with backdrop blur and smooth animations.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  titleIcon: TitleIcon,
  children,
  maxWidth = "max-w-lg",
  danger = false,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full ${maxWidth} max-h-[90vh] overflow-y-auto custom-scrollbar`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                  {TitleIcon && (
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${danger ? "bg-red-50" : "bg-blue-50"}`}
                    >
                      <TitleIcon
                        className={`w-5 h-5 ${danger ? "text-red-500" : "text-blue-600"}`}
                      />
                    </div>
                  )}
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-8 py-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
