/** Single source of truth for money formatting. Prices are always integers. */
export function peso(amount: number): string {
  return `₱${Math.round(amount).toLocaleString("en-PH")}`;
}
