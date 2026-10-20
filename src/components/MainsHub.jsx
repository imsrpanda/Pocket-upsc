import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { formatContentHtml } from '../utils/formatContent';

// Official UPSC Mains Paper to Topic mapping
const MAINS_PAPER_TOPICS = {
  GS1: [
    "Indian Art, Culture and Heritage",
    "Modern History and Freedom Struggle",
    "Post Independence India",
    "World History",
    "Indian Society and Social Diversity",
    "Physical and World Geography"
  ],
  GS2: [
    "Indian Constitution and Historical Underpinnings",
    "Union and State Governance Functions",
    "Separation of Powers and Dispute Redressal",
    "Statutory, Regulatory and Quasi-Judicial Bodies",
    "Government Policies and Development Interventions",
    "Welfare Schemes and Vulnerable Sections",
    "Health, Education and Human Resources",
    "Governance, Transparency and E-Governance",
    "Role of Civil Services in Democracy",
    "India and its Neighborhood Relations",
    "Bilateral, Regional and Global Groupings",
    "Important International Institutions"
  ],
  GS3: [
    "Indian Economy and Issues Relating to Planning",
    "Inclusive Growth and Employment",
    "Government Budgeting and Fiscal Architecture",
    "Major Crops and Cropping Patterns",
    "Agricultural Direct/Indirect Subsidies and MSP",
    "Food Processing and Supply Chain Management",
    "Land Reforms in India",
    "Science and Technology Developments",
    "Information Technology, Space, Computers and Robotics",
    "Environmental Conservation and Pollution",
    "Disaster and Disaster Management",
    "Linkages between Development and Spread of Extremism",
    "Internal Security Challenges and Border Areas"
  ],
  GS4: [
    "Ethics and Human Interface",
    "Human Values and Role of Family/Society",
    "Attitude: Content, Structure and Function",
    "Aptitude and Foundational Values for Civil Services",
    "Emotional Intelligence in Administration",
    "Contributions of Moral Thinkers and Philosophers",
    "Public/Civil Service Values and Ethics in Administration",
    "Probity in Governance and Citizens Charters",
    "Case Studies on Ethical Dilemmas"
  ]
};

const PAPERS = [
  { id: 'GS1', name: 'General Studies I', desc: 'Heritage, Culture, History, Society & Geography', icon: '🏛️' },
  { id: 'GS2', name: 'General Studies II', desc: 'Governance, Constitution, Polity, Social Justice & IR', icon: '⚖️' },
  { id: 'GS3', name: 'General Studies III', desc: 'Technology, Economic Development, Bio-diversity, Security', icon: '📈' },
  { id: 'GS4', name: 'General Studies IV', desc: 'Ethics, Integrity and Aptitude & Case Studies', icon: '🧠' }
];

export default function MainsHub({ onBack }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Fetch all mains questions stored in IndexedDB
  const allMainsQuestions = useLiveQuery(() => db.mainsPapers.toArray()) || [];

  // Filter questions dynamically
  const filteredQuestions = allMainsQuestions.filter(q => {
    if (selectedPaper && q.paper.toUpperCase() !== selectedPaper) return false;
    if (selectedTopic && q.topicCategory !== selectedTopic) return false;
    if (selectedYear && selectedYear !== 'ALL' && q.year !== selectedYear) return false;
    return true;
  });

  const availableYears = [...new Set(
    allMainsQuestions
      .filter(q => q.paper.toUpperCase() === selectedPaper && q.topicCategory === selectedTopic)
      .map(q => q.year)
  )].sort((a, b) => b - a);

  const handleBack = () => {
    if (selectedYear) {
      setSelectedYear(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedPaper) {
      setSelectedPaper(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-16 animate-fadeIn space-y-4 select-none">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-3xs">
        <button 
          onClick={handleBack}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer flex items-center gap-1.5"
        >
          <span>⬅</span>
          <span>Back to {selectedYear ? 'Years' : selectedTopic ? selectedPaper : selectedPaper ? 'Papers' : 'Hub'}</span>
        </button>
        <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <span>✍️</span> Mains Answer Desk
        </h2>
        <div className="w-12"></div>
      </div>

      {/* STAGE 1: Paper Selector (GS1 to GS4) - Responsive 4 Columns */}
      {!selectedPaper && (
        <div className="space-y-4 overflow-y-auto flex-1 pb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-1.5 shadow-3xs">
            <span className="text-4xl block">📚</span>
            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white">UPSC Mains Examination Papers</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
              Select a General Studies paper to explore topic-wise descriptive questions and structured administrative model answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PAPERS.map((paper) => {
              const count = allMainsQuestions.filter(q => q.paper.toUpperCase() === paper.id).length;
              return (
                <div 
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 shadow-3xs transition-all active:scale-[0.99] group hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-4xs group-hover:scale-110 transition-transform">
                        {paper.icon}
                      </span>
                      <span className="text-[10px] font-black px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/40 dark:border-indigo-900/40">
                        {count} Qs
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {paper.name} ({paper.id})
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                        {paper.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>Explore Topics</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 2: Topics under the selected Paper - Responsive 2 Columns */}
      {selectedPaper && !selectedTopic && (
        <div className="space-y-3 overflow-y-auto flex-1 pb-12">
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              Selected Paper: {selectedPaper}
            </span>
            <button onClick={() => setSelectedPaper(null)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Paper
            </button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 pl-1 font-medium">
            Select a syllabus topic under {selectedPaper}:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(MAINS_PAPER_TOPICS[selectedPaper] || []).map((topic, idx) => {
              const count = allMainsQuestions.filter(
                q => q.paper.toUpperCase() === selectedPaper && q.topicCategory === topic
              ).length;

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedTopic(topic)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 shadow-3xs transition-all active:scale-[0.99] group hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="text-base shrink-0">📂</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/40 dark:border-indigo-900/40 shrink-0">
                    {count} Qs
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 3: Year Selector - Responsive Grid */}
      {selectedPaper && selectedTopic && !selectedYear && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider font-mono">{selectedPaper}</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedTopic}</h3>
            </div>
            <button onClick={() => setSelectedTopic(null)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Topic
            </button>
          </div>
          
          <p className="text-xs text-slate-400 dark:text-slate-500 pl-1 font-medium">Filter questions by examination year:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <button 
              onClick={() => setSelectedYear('ALL')}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 shadow-3xs cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-slate-800 hover:border-indigo-300 transition-all text-center"
            >
              All Years ({allMainsQuestions.filter(q => q.paper.toUpperCase() === selectedPaper && q.topicCategory === selectedTopic).length})
            </button>
            {availableYears.map(year => (
              <button 
                key={year}
                onClick={() => setSelectedYear(year)}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-3xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 transition-all text-center"
              >
                Year {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 4: Questions List & Model Answer Accordions */}
      {selectedPaper && selectedTopic && selectedYear && (
        <div className="space-y-4 overflow-y-auto flex-1 pb-12 max-w-4xl mx-auto w-full">
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider font-mono">{selectedPaper} • {selectedTopic}</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {selectedYear === 'ALL' ? 'All Examination Years' : `UPSC Mains ${selectedYear}`}
              </h3>
            </div>
            <button onClick={() => setSelectedYear(null)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Year
            </button>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 font-medium bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No questions found for this topic and year combination.
            </div>
          ) : (
            filteredQuestions.map(item => {
              const isAnswerOpen = expandedQuestionId === item.id;
              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-3xs transition-all">
                  
                  {/* Question Card */}
                  <div 
                    onClick={() => setExpandedQuestionId(isAnswerOpen ? null : item.id)}
                    className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase font-mono">
                      <span>{item.paper} • CSE Mains {item.year}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-200/50 dark:border-emerald-900/30">
                        {item.marks} Marks • {item.wordLimit} Words
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                      {item.question}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <span>{isAnswerOpen ? '▲ Hide Structured Model Answer' : '▼ View Structured Model Answer'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Model Answer Drawer */}
                  {isAnswerOpen && (
                    <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-950/70 border-t border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 animate-fadeIn">
                      <div className="font-black text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>✍️</span> Official Structured Model Answer & Value Addition:
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: formatContentHtml(item.modelAnswer) }} className="space-y-3 font-medium leading-relaxed" />
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