export function getSupportRegion() {
  if (typeof window === "undefined") {
    return "United States";
  }

  return localStorage.getItem("judah_support_region") || "United States";
}