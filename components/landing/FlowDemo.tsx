import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, Edit3, Eye, Play, Plus, Clock, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FlowDemo = () => {
  const [activeTab, setActiveTab] = useState<"examiner" | "examinee">("examiner");
  const [questionText, setQuestionText] = useState("What is the capital of France?");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Auto-toggle demo
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === "examiner" ? "examinee" : "examiner"));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const options = [
    { id: 1, text: "London", correct: false },
    { id: 2, text: "Berlin", correct: false },
    { id: 3, text: "Paris", correct: true },
    { id: 4, text: "Madrid", correct: false },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 max-w-lg mx-auto transform transition-all hover:scale-[1.02] duration-300">
      {/* Header Toggle */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("examiner")}
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "examiner"
              ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Edit3 size={16} />
          Examiner View
        </button>
        <button
          onClick={() => setActiveTab("examinee")}
          className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === "examinee"
              ? "bg-green-50 text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Eye size={16} />
          Student View
        </button>
      </div>

      <div className="p-6 relative min-h-[320px]">
        <AnimatePresence mode="wait">
          {activeTab === "examiner" ? (
            <motion.div
              key="examiner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Question
                </label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Options
                </label>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${opt.correct ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                         {opt.correct && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <input
                         readOnly
                         value={opt.text}
                         className="flex-1 p-2 text-sm border border-gray-100 rounded bg-gray-50 text-gray-600"
                      />
                    </div>
                  ))}
                  <button className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1 hover:underline">
                    <Plus size={12} /> Add Option
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-gray-100 mt-4">
                 <div className="flex items-center text-xs text-gray-500 gap-1">
                    <Clock size={12} /> 30s limit
                 </div>
                 <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-700 transition">
                    <Save size={12} /> Save Question
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="examinee"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
               <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{questionText}</h3>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-red-500 flex items-center gap-1">
                     <Clock size={10} /> 00:24
                  </span>
               </div>

              <div className="space-y-3">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-all duration-200 flex items-center justify-between group ${
                      selectedOption === opt.id
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-sm ${selectedOption === opt.id ? "text-blue-900 font-medium" : "text-gray-700"}`}>
                        {opt.text}
                    </span>
                    {selectedOption === opt.id ? (
                        <CheckCircle2 size={18} className="text-blue-600" />
                    ) : (
                        <Circle size={18} className="text-gray-300 group-hover:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                 <button className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium shadow-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    Submit Answer <ArrowRightIcon />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)

export default FlowDemo;
