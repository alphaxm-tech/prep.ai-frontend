export function formatFullName(name: string): string {
  let formattedName = name.trim();

  // Handle "LastName, FirstName" format
  if (formattedName.includes(",")) {
    formattedName = formattedName
      .split(",")
      .map((part) => part.trim())
      .reverse()
      .join(" ");
  }

  return formattedName
    .toLowerCase()
    .split(/\s+/) // Handles multiple spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
