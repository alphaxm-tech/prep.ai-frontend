type EmptyStateCardProps = {
  icon?: string;
  title: string;
  subtitle: string;
};

export default function EmptyStateCard({
  icon = "🔍",
  title,
  subtitle,
}: EmptyStateCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-xl">{icon}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
        {subtitle}
      </p>
    </div>
  );
}
