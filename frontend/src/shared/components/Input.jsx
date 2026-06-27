import React from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";

export const Input = ({
  name,
  label,
  type = "text",
  placeholder = "",
  className = "",
  required = false,
  ariaDescribedBy = `${name}-error`,
  disabled = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className={`flex flex-col gap-1.5 w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-700 select-none flex items-center justify-between"
        >
          {label}
          {required && (
            <span
              className="text-rose-500 ml-1 font-bold text-xs"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="relative group overflow-hidden rounded-xl bg-gray-50/50 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300">
        <input
          {...register(name, { required })}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? ariaDescribedBy : undefined}
          className={`w-full px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
        />
      </div>

      {error && (
        <p
          id={ariaDescribedBy}
          role="alert"
          className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1 transition-all animate-in slide-in-from-top-1 fade-in duration-300"
        >
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
};
