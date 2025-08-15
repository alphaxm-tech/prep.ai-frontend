type Variant = "yellow" | "green" | "purple" | "blue";

const variantStyles: Record<
  Variant,
  { bg: string; border: string; text: string }
> = {
  yellow: {
    bg: "bg-yellow-100/40",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
  green: {
    bg: "bg-green-100/40",
    border: "border-green-200",
    text: "text-green-700",
  },
  purple: {
    bg: "bg-purple-100/40",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  blue: {
    bg: "bg-blue-100/40",
    border: "border-blue-200",
    text: "text-blue-700",
  },
};

type StatCardProps = {
  label: string;
  value: string | number;
  variant?: Variant; // optional, default to yellow
};

export function StatCard({ label, value, variant = "yellow" }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg text-center py-6`}
    >
      <div className={`text-3xl font-bold ${styles.text}`}>{value}</div>
      <div className={`mt-2 ${styles.text}`}>{label}</div>
    </div>
  );
}
