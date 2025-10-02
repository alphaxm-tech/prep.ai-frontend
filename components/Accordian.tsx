import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface AccordionProps {
  isOpenProp: boolean;
  title: string;
  children: React.ReactNode;
}

const VerticalAccordion: React.FC<AccordionProps> = ({
  isOpenProp,
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isOpenProp);
  }, []);

  return (
    <div className="rounded-lg shadow-md bg-white">
      {/* Accordion Header */}
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-700 hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Accordion Content (slides vertically) */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-8 py-3 text-gray-600">{children}</div>
      </div>
    </div>
  );
};

export default VerticalAccordion;
