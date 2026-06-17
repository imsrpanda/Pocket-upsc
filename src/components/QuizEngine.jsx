import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

export default function QuizEngine() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // 🔄 DEXIE HOOK: Streams questions out of your local database table
  const quizQuestions = useLiveQuery(() => db.questions.toArray());

  if (!quizQuestions) return <div className="text-center text-xs text-slate-400">Loading Question Bank...</div>;
  if (quizQuestions.length === 0) return <div className="text-center text-xs text-slate-400">Question Bank is empty.</div>;

  const currentQuestion = quizQuestions[currentIndex];

  const handleOptionClick = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongAnswers(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const accuracy = Math.round((score / quizQuestions.length) * 100);
    const upscMarks = (score * 2) - (wrongAnswers * 0.66);

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center space-y-6">
        <div>
          <span className="text-4xl">🏆</span>
          <h3 className="text-xl font-black text-slate-800 mt-2">Practice Session Finished</h3>
          <p className="text-xs text-slate-400 mt-0.5">Performance Analysis</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accuracy</p>
            <p className="text-xl font-black text-indigo-600 mt-0.5">{accuracy}%</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Net UPSC Marks</p>
            <p className={`text-xl font-black mt-0.5 ${upscMarks >= 4 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {upscMarks.toFixed(2)} / 10
            </p>
          </div>
        </div>
        <div className="space-y-2 text-left text-xs text-slate-600 border-t border-slate-100 pt-4">
          <div className="flex justify-between">
            <span>Correct Answers (+2 Marks):</span>
            <span className="font-bold text-emerald-600">✓ {score}</span>
          </div>
          <div className="flex justify-between">
            <span>Incorrect Answers (-0.66 Penalty):</span>
            <span className="font-bold text-rose-500">✗ {wrongAnswers}</span>
          </div>
        </div>
        <button onClick={restartQuiz} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl shadow-sm transition-all">
          Retake Practice Set
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
      <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px]">
          {currentQuestion.subjectId.toUpperCase()}
        </span>
        <span>{currentIndex + 1} / {quizQuestions.length}</span>
      </div>

      <h3 className="text-sm font-semibold leading-relaxed text-slate-800 whitespace-pre-line">
        {currentQuestion.question}
      </h3>

      <div className="space-y-2.5">
        {currentQuestion.options.map((option, index) => {
          let optionStyles = "border-slate-200 bg-white hover:border-slate-300 text-slate-700";
          if (selectedOption === index && !isSubmitted) {
            optionStyles = "border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-500";
          } else if (isSubmitted) {
            if (index === currentQuestion.correctAnswer) {
              optionStyles = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
            } else if (selectedOption === index && index !== currentQuestion.correctAnswer) {
              optionStyles = "border-rose-400 bg-rose-50 text-rose-900";
            } else {
              optionStyles = "border-slate-100 bg-slate-50/30 text-slate-400 opacity-60";
            }
          }

          return (
            <button key={index} onClick={() => handleOptionClick(index)} disabled={isSubmitted} className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-left text-xs transition-all duration-150 ${optionStyles}`}>
              <span className={`h-5 w-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 ${selectedOption === index ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {!isSubmitted ? (
          <button onClick={handleSubmit} disabled={selectedOption === null} className={`w-full py-3 rounded-xl font-bold text-sm text-center shadow-sm ${selectedOption === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            Check Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs leading-relaxed text-slate-600">
              <strong className="text-slate-800 block font-bold mb-1">Explanation:</strong>
              {currentQuestion.explanation}
            </div>
            <button onClick={handleNext} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl text-center shadow-sm transition-all">
              {currentIndex === quizQuestions.length - 1 ? 'Finish Set & View Score' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}