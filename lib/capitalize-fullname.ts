export function capitalizeFullName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/) // handles multiple spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
