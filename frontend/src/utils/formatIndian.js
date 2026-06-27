/**
 * Indian locale formatting – currency (INR), dates, numbers
 */

const INDIAN_LOCALE = "en-IN";

/**
 * Format amount in Indian Rupees (₹)
 * e.g. 1500 -> "₹1,500.00" (Indian number grouping: 1,50,000 for lakhs)
 */
export function formatINR(amount) {
  if (amount == null || isNaN(Number(amount))) return "₹0.00";
  return new Intl.NumberFormat(INDIAN_LOCALE, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

/**
 * Format number in Indian style (lakhs/crores comma)
 */
export function formatNumberIndian(num) {
  if (num == null || isNaN(Number(num))) return "0";
  return new Intl.NumberFormat(INDIAN_LOCALE).format(Number(num));
}

/**
 * Format date in Indian format (DD/MM/YYYY)
 */
export function formatDateIndian(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(INDIAN_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Default consultation fee in INR (for display)
 */
export const DEFAULT_CONSULTATION_FEE_INR = 500;
