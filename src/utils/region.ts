export function getSupportRegion() {
  if (!import.meta.env.DEV) return "United States";

  return localStorage.getItem("judah_support_region") || "United States";
}