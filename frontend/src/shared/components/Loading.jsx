import React from "react";

export const Skeleton = ({
  className = "",
  count = 1,
  variant = "rectangular", // circle, rectangular, text
  width = "100%",
  height = "100%",
}) => {
  const baseClasses =
    "bg-gray-200 animate-pulse transition-all duration-300 relative overflow-hidden";

  const variants = {
    circle: "rounded-full shrink-0",
    rectangular: "rounded-lg",
    text: "rounded h-4 mb-2 last:mb-0",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variants[variant]} ${className}`}
          style={{ width, height }}
          aria-hidden="true"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>
      ))}
    </>
  );
};

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 overflow-hidden">
    <Skeleton height="140px" count={4} className="rounded-2xl" />
    <div className="col-span-1 lg:col-span-3">
      <Skeleton height="400px" className="rounded-2xl" />
    </div>
    <div className="col-span-1">
      <Skeleton height="400px" className="rounded-2xl" />
    </div>
  </div>
);
