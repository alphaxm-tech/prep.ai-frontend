type TemplateKey = "modern" | "classic" | "creative" | "minimal";

export default function TemplateCard({
  id,
  title,
  active,
  onSelect,
}: {
  id: TemplateKey;
  title: string;
  active: boolean;
  onSelect: (id: TemplateKey) => void;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`relative rounded-xl border p-4 flex flex-col gap-3 w-full text-left transition-shadow ${
        active ? "shadow-lg border-yellow-300" : "shadow-sm border-gray-100"
      } bg-white hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-800">{title}</div>
        {active && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Selected
          </span>
        )}
      </div>

      <div className="flex gap-3">
        {/* small visual mockup of the template */}
        <div className="w-1/3 h-20 bg-gray-50 border rounded-sm p-2 text-xs text-gray-500 flex flex-col justify-between">
          <div className="font-semibold text-gray-700 truncate">John Doe</div>
          <div className="text-[11px]">Summary • Experience</div>
        </div>
        <div className="w-2/3">
          <p className="text-sm text-gray-600 line-clamp-2">
            Clean layout with readable spacing and student-friendly sections.
          </p>
        </div>
      </div>
    </button>
  );
}
