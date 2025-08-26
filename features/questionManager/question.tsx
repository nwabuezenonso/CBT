// import React from 'react'

//   const renderQuestions = () => (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Question Bank</h2>
//         <button
//           onClick={() => setShowQuestionModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//         >
//           <Plus size={20} />
//           Add Question
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border">
//         <div className="p-4 border-b">
//           <div className="flex gap-4">
//             <div className="relative flex-1">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search questions..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
//               <Filter size={20} />
//               Filter
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left p-4 font-medium text-gray-700">Question</th>
//                 <th className="text-left p-4 font-medium text-gray-700">Type</th>
//                 <th className="text-left p-4 font-medium text-gray-700">Subject</th>
//                 <th className="text-left p-4 font-medium text-gray-700">Difficulty</th>
//                 <th className="text-left p-4 font-medium text-gray-700">Points</th>
//                 <th className="text-left p-4 font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {questions
//                 .filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))
//                 .map((question) => (
//                   <tr key={question.id} className="border-b hover:bg-gray-50">
//                     <td className="p-4">
//                       <div className="max-w-md">
//                         <p className="font-medium">{question.question}</p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {question.tags.map((tag) => `#${tag}`).join(" ")}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           question.type === "multiple-choice"
//                             ? "bg-blue-100 text-blue-800"
//                             : question.type === "true-false"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-purple-100 text-purple-800"
//                         }`}
//                       >
//                         {question.type}
//                       </span>
//                     </td>
//                     <td className="p-4 text-gray-700">{question.subject}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           question.difficulty === "easy"
//                             ? "bg-green-100 text-green-800"
//                             : question.difficulty === "medium"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {question.difficulty}
//                       </span>
//                     </td>
//                     <td className="p-4 font-medium">{question.points}</td>
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <button className="p-1 text-gray-500 hover:text-blue-600">
//                           <Eye size={16} />
//                         </button>
//                         <button className="p-1 text-gray-500 hover:text-blue-600">
//                           <Edit size={16} />
//                         </button>
//                         <button className="p-1 text-gray-500 hover:text-red-600">
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

// export default renderQuestions