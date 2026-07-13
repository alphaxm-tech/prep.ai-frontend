"use client";

import { TagOption } from "@/server-api/api/types/question-bank-admin.types";

type TagPickerProps = {
  tags: TagOption[];
  selectedTagIds: number[];
  onChange: (ids: number[]) => void;
};

// Tags are a fixed vocabulary — this only ever picks from `tags`, never
// creates new ones (that happens separately, deliberately, via the
// Question Bank tab's "Add Tags" action).
export default function TagPicker({
  tags,
  selectedTagIds,
  onChange,
}: TagPickerProps) {
  const toggle = (id: number) => {
    if (selectedTagIds.includes(id)) {
      onChange(selectedTagIds.filter((t) => t !== id));
    } else {
      onChange([...selectedTagIds, id]);
    }
  };

  if (tags.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic">
        No tags exist yet — add some from the Question Bank tab first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const selected = selectedTagIds.includes(tag.tag_id);
        return (
          <button
            key={tag.tag_id}
            type="button"
            onClick={() => toggle(tag.tag_id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
              selected
                ? "bg-amber-500 border-amber-500 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
