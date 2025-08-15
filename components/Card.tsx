type Variant = "yellow" | "green" | "purple" | "blue";

const variantStyles: Record<Variant, { bg: string; border: string }> = {
  yellow: {
    bg: "bg-yellow-100/40",
    border: "border-yellow-200",
  },
  green: {
    bg: "bg-green-100/40",
    border: "border-green-200",
  },
  purple: {
    bg: "bg-purple-100/40",
    border: "border-purple-200",
  },
  blue: {
    bg: "bg-blue-100/40",
    border: "border-blue-200",
  },
};

export default function Card({
  title,
  description,
  icon,
  variant = "yellow",
  onClick,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: Variant;
  onClick?: () => void; // Add this prop
}) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`p-6 rounded-xl ${styles.bg} ${styles.border} backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300`}
      onClick={onClick}
    >
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-700 mb-3">{description}</p>
      <a
        href="#"
        className="text-sm font-semibold text-yellow-600 hover:underline"
      >
        Get Started →
      </a>
    </div>
  );
}
