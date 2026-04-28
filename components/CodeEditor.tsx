"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const defaultTemplates: Record<string, string> = {
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

const ALL_LANGUAGES = ["javascript", "python", "java", "cpp"];

interface CodeEditorProps {
  onCodeChange?: (code: string, language: string) => void;
  starterCode?: Record<string, string>;
  allowedLanguages?: string[];
}

export default function CodeEditor({
  onCodeChange,
  starterCode,
  allowedLanguages,
}: CodeEditorProps) {
  const languages = allowedLanguages?.length ? allowedLanguages : ALL_LANGUAGES;
  const [language, setLanguage] = useState(languages[0]);

  const getInitialCode = (lang: string) =>
    starterCode?.[lang] ?? defaultTemplates[lang] ?? "";

  const [codeMap, setCodeMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(languages.map((lang) => [lang, getInitialCode(lang)])),
  );

  // When starterCode or allowedLanguages change (question loaded), reset the editor
  useEffect(() => {
    const initial = languages[0];
    const newMap = Object.fromEntries(
      languages.map((lang) => [lang, getInitialCode(lang)]),
    );
    setCodeMap(newMap);
    setLanguage(initial);
    onCodeChange?.(newMap[initial] ?? "", initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starterCode, allowedLanguages?.join(",")]);

  const currentCode = codeMap[language] ?? "";

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    onCodeChange?.(codeMap[lang] ?? "", lang);
  };

  const handleCodeChange = (value: string | undefined) => {
    const code = value ?? "";
    setCodeMap((prev) => ({ ...prev, [language]: code }));
    onCodeChange?.(code, language);
  };

  const languageLabel: Record<string, string> = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="h-10 flex items-center justify-between px-3 bg-gray-50/70 text-xs text-gray-600">
        <span className="font-medium text-gray-700">
          {languageLabel[language] ?? language.toUpperCase()}
        </span>

        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-xs bg-transparent outline-none cursor-pointer text-gray-600 hover:text-gray-900 transition"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {languageLabel[lang] ?? lang}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px w-full bg-gray-200/70" />

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
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
