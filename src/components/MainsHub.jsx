import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

const MAINS_TOPICS = [
  "Indian Art, Culture and Heritage",
  "Modern History and Freedom Struggle",
  "Post Independence India",
  "World History",
  "Indian Society and Social Justice",
  "Geography and Environment",
  "Governance, Constitution and Polity",
  "International Relations",
  "Economic Development and Science & Tech",
  "Internal Security and Disaster Management",
  "Ethics, Integrity and Aptitude"
];

export default function MainsHub({ onBack }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Fetch all mains papers live from Dexie
  const allMainsQuestions = useLiveQuery(() => db.mainsPapers.toArray()) || [];

  // Filter logic based on user selections
  const filteredQuestions = allMainsQuestions.filter(q => {
    if (selectedTopic && q.topicCategory !== selectedTopic) return false;
    if (selectedYear && selectedYear !== 'ALL' && q.year !== selectedYear) return false;
    return true;
  });

  const availableYears = [...new Set(
    allMainsQuestions
      .filter(q => !selectedTopic || q.topicCategory === selectedTopic)
      .map(q => q.year)
  )].sort((a, b) => b - a);

  return (
    <div className="flex flex-col flex-1 pb-16 animate-fadeIn space-y-4 select-none">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-3xs">
        <button 
          onClick={() => {
            if (selectedYear) setSelectedYear(null);
            else if (selectedTopic) setSelectedTopic(null);
            else onBack();
          }}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          ⬅ {selectedYear ? 'Change Year' : selectedTopic ? 'Topics' : 'Hub'}
        </button>
        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <span>✍️</span> Mains Answer Desk
        </h2>
        <div className="w-10"></div>
      </div>

      {/* STEP 1: Topic Categories View */}
      {!selectedTopic ? (
        <div className="space-y-2 overflow-y-auto flex-1 pb-12">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1 font-medium">
            Select a core syllabus module to browse descriptive questions:
          </p>
          {MAINS_TOPICS.map((topic, idx) => {
            const count = allMainsQuestions.filter(q => q.topicCategory === topic).length;
            return (
              <div 
                key={idx}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 shadow-3xs transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md border border-slate-100 dark:border-slate-700/60 shadow-4xs">
                    📂
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{topic}</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/40 dark:border-indigo-900/40">
                  {count} Qs
                </span>
              </div>
            );
          })}
        </div>
      ) : !selectedYear ? (
        /* STEP 2: Year Selector View for Chosen Topic */
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
            <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Selected Topic</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedTopic}</h3>
          </div>
          
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1 font-medium">Filter questions by examination year:</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setSelectedYear('ALL')}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-3xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              All Years ({allMainsQuestions.filter(q => q.topicCategory === selectedTopic).length})
            </button>
            {availableYears.map(year => (
              <button 
                key={year}
                onClick={() => setSelectedYear(year)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-3xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Year {year}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* STEP 3: Question List & Model Answer Accordion View */
        <div className="space-y-3 overflow-y-auto flex-1 pb-12">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{selectedTopic}</span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                Filter: {selectedYear === 'ALL' ? 'All Years' : `Year ${selectedYear}`}
              </h3>
            </div>
            <button onClick={() => setSelectedYear(null)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Year
            </button>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-medium">
              No descriptive mains questions found for this specific criteria yet.
            </div>
          ) : (
            filteredQuestions.map(item => {
              const isAnswerOpen = expandedQuestionId === item.id;
              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-3xs transition-all">
                  
                  {/* Question Accordion Header Card */}
                  <div 
                    onClick={() => setExpandedQuestionId(isAnswerOpen ? null : item.id)}
                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
                      <span>{item.paper} • {item.year}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-100/40 dark:border-emerald-900/30">
                        {item.marks} Marks • {item.wordLimit} Words
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {item.question}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                        {isAnswerOpen ? 'Hide Model Answer ▲' : 'View Model Answer ▼'}
                      </span>
                    </div>
                  </div>

                  {/* Model Answer Drawer */}
                  {isAnswerOpen && (
                    <div className="p-4 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 animate-fadeIn">
                      <div className="font-bold text-[11px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Structured Model Answer:</div>
                      <div dangerouslySetInnerHTML={{ __html: item.modelAnswer }} className="space-y-2 font-medium" />
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}