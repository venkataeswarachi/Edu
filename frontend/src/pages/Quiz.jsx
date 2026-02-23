import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home, ArrowRight, ArrowLeft } from "lucide-react";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizQuestions, examType, topic } = location.state || {};
  const timerRef = useRef(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (!quizQuestions?.length) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); setShowResults(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizQuestions]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerWarning = timeLeft < 300; // < 5 min

  const handleAnswerSelect = (qIdx, answer) => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: answer }));
  const handleSubmitQuiz = () => { clearInterval(timerRef.current); setShowResults(true); };

  const calculateScore = () => quizQuestions.filter((q, i) => selectedAnswers[i] === q.correct_answer).length;

  if (!quizQuestions?.length) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-sm">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={28} className="text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">No Quiz Data</h2>
        <p className="text-slate-400 mb-6 text-sm">Please complete the practice session first.</p>
        <button onClick={() => navigate("/prepare")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all">
          Go to Preparation
        </button>
      </div>
    </div>
  );

  if (showResults) {
    const score = calculateScore();
    const pct = Math.round((score / quizQuestions.length) * 100);
    const r = 52; const circ = 2 * Math.PI * r;
    const color = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#f43f5e";

    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 mb-6 text-center">
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
                  strokeDasharray={`${(pct / 100) * circ} ${circ - (pct / 100) * circ}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Trophy size={22} style={{ color }} />
                <span className="text-2xl font-black mt-1" style={{ color }}>{pct}%</span>
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Quiz Complete!</h1>
            <p className="text-slate-400 text-sm">{examType?.replace("_", " ")} · {topic}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 font-bold" style={{ color }}>
              <span className="text-3xl">{score}</span>
              <span className="text-slate-300 text-2xl">/</span>
              <span className="text-3xl text-slate-400">{quizQuestions.length}</span>
            </div>
            <p className="text-slate-400 text-xs mt-1">correct answers</p>
          </div>

          {/* Detailed results */}
          <div className="space-y-4 mb-8">
            {quizQuestions.map((q, i) => {
              const user = selectedAnswers[i];
              const ok = user === q.correct_answer;
              return (
                <div key={i} className={`bg-white rounded-2xl border shadow-sm p-5 ${ok ? "border-emerald-100" : "border-rose-100"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${ok ? "bg-emerald-500" : "bg-rose-500"}`}>
                      {ok ? <CheckCircle size={14} className="text-white" /> : <XCircle size={14} className="text-white" />}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-relaxed">Q{i + 1}: {q.question}</h3>
                  </div>
                  <div className="pl-10 space-y-1.5">
                    {q.options.map((opt, j) => {
                      const letter = String.fromCharCode(65 + j);
                      const isCorrect = letter === q.correct_answer;
                      const isUserWrong = user === letter && !ok;
                      return (
                        <div key={j} className={`text-xs font-medium px-3 py-2 rounded-lg border ${isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : isUserWrong ? "border-rose-300 bg-rose-50 text-rose-800"
                              : "border-slate-100 text-slate-500"
                          }`}>
                          {letter}. {opt}
                        </div>
                      );
                    })}
                    {!ok && q.solution && (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700 leading-relaxed">
                        <span className="font-bold">Explanation: </span>{q.solution}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/prepare")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all">
              <RotateCcw size={15} /> Practice Again
            </button>
            <button onClick={() => navigate("/feed")}
              className="flex items-center gap-2 bg-white text-slate-600 px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <Home size={15} /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-black text-slate-900">{examType?.replace("_", " ")} Quiz</h1>
              <p className="text-xs text-slate-400">{topic} · Q{currentQuestionIndex + 1}/{quizQuestions.length}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm border transition-colors ${timerWarning ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <p className="text-base font-bold text-slate-900 leading-relaxed mb-6">{currentQuestion.question}</p>
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = selectedAnswers[currentQuestionIndex] === option;
              return (
                <button key={i} onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                    }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${selected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}>{letter}</span>
                  <span className={`text-sm font-medium ${selected ? "text-indigo-800" : "text-slate-700"}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            <button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <ArrowLeft size={15} /> Prev
            </button>
            {currentQuestionIndex === quizQuestions.length - 1 ? (
              <button onClick={handleSubmitQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 shadow-md transition-all">
                <CheckCircle size={15} /> Submit Quiz
              </button>
            ) : (
              <button onClick={() => setCurrentQuestionIndex(i => i + 1)}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">
                Next <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Navigate</p>
          <div className="flex flex-wrap gap-2">
            {quizQuestions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQuestionIndex(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${i === currentQuestionIndex ? "bg-indigo-600 text-white shadow-sm"
                    : selectedAnswers[i] ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
