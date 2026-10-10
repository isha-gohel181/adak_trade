// Safely coerce a value that may be a Decimal128 JSON object ({ $numberDecimal }),
// a string, or a number into a JS number. Returns 0 when the value is empty/invalid.
export const toNumber = (val: any): number => {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : 0;
  }
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof val === "object") {
    if (val.$numberDecimal != null) return toNumber(val.$numberDecimal);
    if (val.$numberInt != null) return toNumber(val.$numberInt);
    if (val.$numberLong != null) return toNumber(val.$numberLong);
    // Fallback: first non-null value
    const first = Object.values(val).find((v) => v != null);
    return toNumber(first);
  }
  return 0;
};
