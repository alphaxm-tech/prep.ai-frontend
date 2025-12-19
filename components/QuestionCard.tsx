import React from "react";

interface Props {
  question: string;
  index: number;
  total: number;
}

export default function QuestionCard({ question, index, total }: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <p className="text-sm text-gray-500">
        Question {index} of {total}
      </p>
      <h2 className="text-xl font-semibold mt-2">{question}</h2>
    </div>
  );
}
