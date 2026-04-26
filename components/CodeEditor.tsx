"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const templates: Record<string, string> = {
  javascript: `// JavaScript
function main() {
  console.log("Hello World");
}

main();`,

  python: `# Python
def main():
    print("Hello World")

if __name__ == "__main__":
    main()`,

  java: `// Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

  cpp: `// C++
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
};

const languageMap: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

interface CodeEditorProps {
  onCodeChange?: (code: string, language: string) => void;
}

export default function CodeEditor({ onCodeChange }: CodeEditorProps) {
  const [language, setLanguage] = useState("javascript");
  const [codeMap, setCodeMap] = useState(templates);

  const currentCode = codeMap[language];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    onCodeChange?.(codeMap[lang] ?? "", lang);
  };

  const handleCodeChange = (value: string | undefined) => {
    const code = value || "";
    setCodeMap((prev) => ({ ...prev, [language]: code }));
    onCodeChange?.(code, language);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 🔹 HEADER (Aligned + Clean) */}
      <div className="h-10 flex items-center justify-between px-3 bg-gray-50/70 text-xs text-gray-600">
        {/* LEFT */}
        <span className="font-medium text-gray-700">
          {language.toUpperCase()}
        </span>

        {/* RIGHT */}
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-xs bg-transparent outline-none cursor-pointer text-gray-600 hover:text-gray-900 transition"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* 🔥 DIVIDER */}
      <div className="h-px w-full bg-gray-200/70" />

      {/* 🔹 MONACO EDITOR (FULL HEIGHT, NO PADDING) */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={languageMap[language]}
          value={currentCode}
          onChange={handleCodeChange}
          theme="vs-light"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    </div>
  );
}
