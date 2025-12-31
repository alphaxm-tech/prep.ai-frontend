"use client";

import React, { useState } from "react";

type Language = "javascript" | "java" | "python" | "cpp";

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `function twoSum(nums, target) {
  // write your code here
}`,
  java: `class Solution {
  public int[] twoSum(int[] nums, int target) {
    // write your code here
  }
}`,
  python: `def twoSum(nums, target):
    # write your code here
`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // write your code here
    }
};`,
};

export default function CodeEditorDemo() {
  const [language, setLanguage] = useState<Language>("java");
  const [code, setCode] = useState(DEFAULT_CODE["java"]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* LEFT — Problem Description */}
      <aside className="w-[42%] border-r bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              1. Two Sum
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                Easy
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                Arrays
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">
                Hash Table
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Given an array of integers <b>nums</b> and an integer <b>target</b>,
            return indices of the two numbers such that they add up to
            <b> target</b>.
          </p>

          <p className="text-gray-700">
            You may assume that each input would have exactly one solution, and
            you may not use the same element twice.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono">
            <div>
              <b>Input:</b> nums = [2,7,11,15], target = 9
            </div>
            <div className="mt-1">
              <b>Output:</b> [0,1]
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Constraints:</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* RIGHT — Code Editor */}
      <section className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="px-3 py-2 rounded-lg border bg-gray-50 text-sm font-medium"
            >
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200">
              Run
            </button>
            <button className="px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
              Submit
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 bg-[#0f172a] p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="
              w-full h-full resize-none outline-none
              bg-transparent text-gray-100
              font-mono text-sm leading-relaxed
              caret-yellow-400
            "
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-white text-xs text-gray-500">
          Prep Buddy editor • Execution disabled
        </div>
      </section>
    </div>
  );
}
