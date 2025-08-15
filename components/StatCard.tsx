export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-yellow-100/40 shadow rounded-lg text-center py-6">
      <div className="text-3xl font-bold text-yellow-700">{value}</div>
      <div className="mt-2 text-yellow-900">{label}</div>
    </div>
  );
}
