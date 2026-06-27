/**
 * NovaCare — Skeleton Loading Component
 * Shimmer skeleton placeholders for premium loading states.
 */

export function SkeletonLine({
  width = "w-full",
  height = "h-4",
  className = "",
}) {
  return (
    <div
      className={`${width} ${height} bg-slate-200 rounded-lg animate-pulse ${className}`}
    />
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-3/4" />
          <SkeletonLine width="w-1/2" height="h-3" />
        </div>
      </div>
      <SkeletonLine />
      <SkeletonLine width="w-2/3" />
      <div className="flex gap-3 pt-2">
        <SkeletonLine width="w-1/3" height="h-8" />
        <SkeletonLine width="w-1/3" height="h-8" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = "" }) {
  return (
    <div className={`table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <SkeletonLine width={i === 0 ? "w-24" : "w-20"} height="h-3" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci}>
                  <SkeletonLine width={ci === 0 ? "w-36" : "w-24"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3"
          >
            <SkeletonLine width="w-10" height="h-10" className="rounded-xl" />
            <SkeletonLine width="w-1/2" height="h-6" />
            <SkeletonLine width="w-3/4" height="h-3" />
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
          <SkeletonLine width="w-1/3" height="h-6" />
          <SkeletonLine width="w-1/4" height="h-3" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse mt-4" />
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
          <SkeletonLine width="w-1/2" height="h-6" />
          <div className="h-48 bg-slate-100 rounded-full w-48 mx-auto animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}

export default { SkeletonLine, SkeletonCard, SkeletonTable, SkeletonDashboard };
