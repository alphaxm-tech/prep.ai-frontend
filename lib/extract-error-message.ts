/**
 * Safely pulls a human-readable string out of an axios error's response
 * body, regardless of which of the backend's two error envelope shapes it
 * used (internal/http/middleware/error.middleware.go emits both):
 *
 *   - known/business errors:  { "error": { "code": "...", "message": "..." } }
 *   - unhandled/internal errors: { "success": false, "error": "...", "message": "..." }
 *
 * Naively reading `err.response.data.error` and rendering it directly
 * assumes it's always a string — for the first shape it's an object, and
 * handing an object to React as a child throws "Objects are not valid as a
 * React child" and crashes the whole page. This always returns a string.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data as
    | { error?: unknown; message?: unknown }
    | undefined;

  if (!data) return fallback;

  if (typeof data.error === "string") return data.error;
  if (
    data.error &&
    typeof data.error === "object" &&
    typeof (data.error as { message?: unknown }).message === "string"
  ) {
    return (data.error as { message: string }).message;
  }
  if (typeof data.message === "string") return data.message;

  return fallback;
}
