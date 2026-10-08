import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

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
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-3xs">
        <button 
          onClick={handleBack}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          ⬅ {selectedYear ? 'Years' : selectedTopic ? selectedPaper : selectedPaper ? 'Papers' : 'Hub'}
        </button>
        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <span>✍️</span> Mains Answer Desk
        </h2>
        <div className="w-10"></div>
      </div>

      {/* STAGE 1: Paper Selector (GS1 to GS4) */}
      {!selectedPaper && (
        <div className="space-y-3 overflow-y-auto flex-1 pb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center space-y-1 shadow-3xs">
            <span className="text-3xl block">📚</span>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">UPSC Mains Examination Papers</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-normal">
              Select a General Studies paper to explore topic-wise descriptive questions and structured answers.
            </p>
          </div>

          <div className="space-y-2.5">
            {PAPERS.map((paper) => {
              const count = allMainsQuestions.filter(q => q.paper.toUpperCase() === paper.id).length;
              return (
                <div 
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper.id)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 shadow-3xs transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/60 shadow-4xs">
                      {paper.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">{paper.name} ({paper.id})</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 line-clamp-1">{paper.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/40 dark:border-indigo-900/40 shrink-0">
                    {count} Qs
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 2: Topics under the selected Paper */}
      {selectedPaper && !selectedTopic && (
        <div className="space-y-2 overflow-y-auto flex-1 pb-12">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              Selected Paper: {selectedPaper}
            </span>
            <button onClick={() => setSelectedPaper(null)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Paper
            </button>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1 font-medium">
            Select a syllabus topic under {selectedPaper}:
          </p>

          {(MAINS_PAPER_TOPICS[selectedPaper] || []).map((topic, idx) => {
            const count = allMainsQuestions.filter(
              q => q.paper.toUpperCase() === selectedPaper && q.topicCategory === topic
            ).length;

            return (
              <div 
                key={idx}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 shadow-3xs transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">📂</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{topic}</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/40 dark:border-indigo-900/40">
                  {count} Qs
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* STAGE 3: Year Selector */}
      {selectedPaper && selectedTopic && !selectedYear && (
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
            <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{selectedPaper}</span>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedTopic}</h3>
          </div>
          
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-1 font-medium">Filter questions by examination year:</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setSelectedYear('ALL')}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-3xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              All Years ({allMainsQuestions.filter(q => q.paper.toUpperCase() === selectedPaper && q.topicCategory === selectedTopic).length})
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
      )}

      {/* STAGE 4: Questions List & Model Answer Accordions */}
      {selectedPaper && selectedTopic && selectedYear && (
        <div className="space-y-3 overflow-y-auto flex-1 pb-12">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{selectedPaper} • {selectedTopic}</span>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {selectedYear === 'ALL' ? 'All Years' : `Year ${selectedYear}`}
              </h3>
            </div>
            <button onClick={() => setSelectedYear(null)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
              Change Year
            </button>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 font-medium">
              No questions found for this topic and year combination.
            </div>
          ) : (
            filteredQuestions.map(item => {
              const isAnswerOpen = expandedQuestionId === item.id;
              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-3xs transition-all">
                  
                  {/* Question Card */}
                  <div 
                    onClick={() => setExpandedQuestionId(isAnswerOpen ? null : item.id)}
                    className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
                      <span>{item.paper} • Year {item.year}</span>
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
                      <div className="font-extrabold text-[11px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Structured Model Answer:
                      </div>
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