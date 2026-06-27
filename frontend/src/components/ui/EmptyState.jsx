/**
 * NovaCare — Empty State Component
 * Used when a table, list, or page has no data to display.
 */

import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no items to display at the moment.",
  action,
  actionLabel = "Get Started",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Icon className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-black text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
