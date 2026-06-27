/**
 * NovaCare — Data Table Component
 * Reusable table with built-in search, filter, sort, and pagination.
 */

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  filters = [], // [{ key, label, options: [{ value, label }] }]
  defaultPageSize = 10,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search or filters.",
  emptyIcon,
  onRowClick,
  rowClassName,
  stickyHeader = false,
}) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [showFilters, setShowFilters] = useState(false);

  // Filter data
  const filtered = useMemo(() => {
    let result = [...data];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.accessor
            ? typeof col.accessor === "function"
              ? col.accessor(row)
              : row[col.accessor]
            : "";
          return val && String(val).toLowerCase().includes(q);
        }),
      );
    }

    // Active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((row) => {
          const val = row[key];
          return String(val).toLowerCase() === String(value).toLowerCase();
        });
      }
    });

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const col = columns.find((c) => c.key === sortKey);
        const aVal = col?.accessor
          ? typeof col.accessor === "function"
            ? col.accessor(a)
            : a[col.accessor]
          : a[sortKey];
        const bVal = col?.accessor
          ? typeof col.accessor === "function"
            ? col.accessor(b)
            : b[col.accessor]
          : b[sortKey];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const cmp =
          typeof aVal === "number"
            ? aVal - bVal
            : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, activeFilters, sortKey, sortDir, columns]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Object.values(activeFilters).some((v) => v && v !== "all") || search.trim();

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(searchable || filters.length > 0) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {filters.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-black">
                    {Object.values(activeFilters).filter(
                      (v) => v && v !== "all",
                    ).length + (search.trim() ? 1 : 0)}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filter Pills */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {filters.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || "all"}
              onChange={(e) => handleFilterChange(f.key, e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">{f.label}: All</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* Table */}
      {paginated.length > 0 ? (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() =>
                        col.sortable !== false && handleSort(col.key)
                      }
                      className={
                        col.sortable !== false
                          ? "cursor-pointer select-none hover:text-blue-600 transition-colors"
                          : ""
                      }
                      style={{ width: col.width }}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.header}
                        {col.sortable !== false &&
                          sortKey === col.key &&
                          (sortDir === "asc" ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr
                    key={row.id || i}
                    onClick={() => onRowClick?.(row)}
                    className={`${onRowClick ? "cursor-pointer" : ""} ${rowClassName?.(row) || ""}`}
                  >
                    {columns.map((col) => {
                      const value = col.accessor
                        ? typeof col.accessor === "function"
                          ? col.accessor(row)
                          : row[col.accessor]
                        : row[col.key];

                      if (col.render) {
                        return <td key={col.key}>{col.render(row, value)}</td>;
                      }

                      if (col.type === "status") {
                        return (
                          <td key={col.key}>
                            <StatusBadge status={value} />
                          </td>
                        );
                      }

                      return <td key={col.key}>{value ?? "—"}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        totalItems={filtered.length}
      />
    </div>
  );
}
