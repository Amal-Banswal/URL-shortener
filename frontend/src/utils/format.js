export function fmt(dt) {
  if (!dt) return "-";
  return new Date(dt).toLocaleString();
}
