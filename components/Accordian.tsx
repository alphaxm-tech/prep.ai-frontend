import React, { useEffect, useState } from "react";

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
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
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

// Example usage
// export default function App() {
//   return (
//     <div className="p-10 space-y-4">
//       <VerticalAccordion title="User Info">
//         <p>Name: Sanket</p>
//         <p>Email: sanket@example.com</p>
//       </VerticalAccordion>

//       <VerticalAccordion title="Project Details">
//         <ul className="list-disc pl-5">
//           <li>Blockchain Resume Builder</li>
//           <li>Stack: React, Golang, Ethereum</li>
//           <li>Status: In Progress</li>
//         </ul>
//       </VerticalAccordion>
//     </div>
//   );
// }
