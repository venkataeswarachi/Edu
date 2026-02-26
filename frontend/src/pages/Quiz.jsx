import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { aiApi } from "../services/api";
import {
  Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home,
  ArrowRight, ArrowLeft, Brain, BookOpen, GraduationCap,
  Loader2, Play, Target, Zap
} from "lucide-react";

const EXAMS = [
  { name: "EAMCET", icon: BookOpen, desc: "Engineering & Medical CET", color: "from-emerald-500 to-teal-500" },
  { name: "JEE_MAINS", icon: Brain, desc: "Joint Entrance — Main", color: "from-indigo-500 to-blue-500" },
  { name: "JEE_ADVANCED", icon: GraduationCap, desc: "Joint Entrance — Advanced", color: "from-purple-500 to-pink-500" },
  { name: "GATE", icon: Target, desc: "Graduate Aptitude Test in Engineering", color: "from-orange-500 to-red-500" },
];

const TOPICS = {
  EAMCET: ["Physics", "Chemistry", "Mathematics", "Biology"],
  JEE_MAINS: ["Physics", "Chemistry", "Mathematics"],
  JEE_ADVANCED: ["Physics", "Chemistry", "Mathematics"],
  GATE: ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical"],
};

// ── Setup Screen ──────────────────────────────────────────────────────────────
const SetupScreen = ({ onStart }) => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [topic, setTopic] = useState("");
  const [numQs, setNumQs] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!selectedExam || !topic) { setError("Please select an exam and a topic."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await aiApi.post("/generate-questions", {
        exam_type: selectedExam, topic, num_questions: numQs, difficulty,
      });
      let data;
      try { data = JSON.parse(res.data.questions); } catch { setError("Failed to parse questions. Please retry."); return; }
      if (!data.quiz_questions?.length) { setError("No questions received. Please retry."); return; }
      onStart(data.quiz_questions, selectedExam, topic);
    } catch {
      setError("Failed to generate questions. Make sure the AI service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Brain size={22} className="text-indigo-500" /> Quiz
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-generated timed quiz — test yourself under real exam pressure</p>
        </div>

        {/* Exam cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {EXAMS.map(({ name, icon: Icon, desc, color }) => (
            <button
              key={name}
              onClick={() => { setSelectedExam(name); setTopic(""); setError(""); }}
              className={`group bg-white p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg ${selectedExam === name ? "border-indigo-500 shadow-lg" : "border-slate-100 hover:border-indigo-200"
                }`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-1">{name.replace("_", " ")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>

        {/* Config panel */}
        {selectedExam && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl mx-auto">
            <h2 className="text-base font-black text-slate-900 mb-5">Configure Quiz</h2>
            <div className="space-y-5">

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topic</label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS[selectedExam]?.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${topic === t
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-100 hover:border-indigo-200 text-slate-600"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Num Questions */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Number of Questions</label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((n) => (
                    <button
                      key={n}
                      onClick={() => setNumQs(n)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${numQs === n ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-100 hover:border-indigo-200 text-slate-600"
                        }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => {
                    const colors = {
                      easy: "border-emerald-400 bg-emerald-50 text-emerald-700",
                      medium: "border-amber-400 bg-amber-50 text-amber-700",
                      hard: "border-rose-400 bg-rose-50 text-rose-700",
                    };
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold capitalize transition-all ${difficulty === d ? colors[d] : "border-slate-100 hover:border-slate-200 text-slate-500"
                          }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-rose-600 text-sm font-medium">{error}</p>}

              <button
                onClick={handleStart}
                disabled={loading || !topic}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Generating Quiz…</>
                  : <><Zap size={16} /> Start Quiz</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Quiz Active Screen ────────────────────────────────────────────────────────
const QuizActive = ({ quizQuestions, examType, topic, onFinish }) => {
  const timerRef = useRef(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizQuestions.length * 60); // 1 min per question

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); onFinish(selectedAnswers); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => { clearInterval(timerRef.current); onFinish(selectedAnswers); };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timerWarning = timeLeft < 120;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (qIdx, answer) =>
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: answer }));

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
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <p className="text-base font-bold text-slate-900 leading-relaxed mb-6">{currentQuestion.question}</p>
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, i) => {
              const letter = String.fromCharCode(65 + i);
              // Store by letter for result comparison
              const isSelected = selectedAnswers[currentQuestionIndex] === letter;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, letter)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                    }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${isSelected ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}>{letter}</span>
                  <span className={`text-sm font-medium ${isSelected ? "text-indigo-800" : "text-slate-700"}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestionIndex((i) => i - 1)}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft size={15} /> Prev
            </button>
            {currentQuestionIndex === quizQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 shadow-md transition-all"
              >
                <CheckCircle size={15} /> Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
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
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${i === currentQuestionIndex
                  ? "bg-indigo-600 text-white shadow-sm"
                  : selectedAnswers[i]
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Results Screen ────────────────────────────────────────────────────────────
const ResultsScreen = ({ quizQuestions, selectedAnswers, examType, topic, onRetry, onHome }) => {
  const score = quizQuestions.filter((q, i) => selectedAnswers[i] === q.correct_answer).length;
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
                strokeDasharray={`${(pct / 100) * circ} ${circ - (pct / 100) * circ}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
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
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: `${color}15`, color }}>
            {pct >= 80 ? "🏆 Excellent!" : pct >= 60 ? "👍 Good effort!" : "💪 Keep practising!"}
          </div>
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
                  {!ok && user && (
                    <p className="text-xs text-slate-400 mt-1 pl-1">
                      Your answer: <span className="text-rose-600 font-bold">{user}</span>
                      &nbsp;·&nbsp;Correct: <span className="text-emerald-600 font-bold">{q.correct_answer}</span>
                    </p>
                  )}
                  {!ok && !user && (
                    <p className="text-xs text-amber-600 font-semibold mt-1 pl-1">⚠ Not answered · Correct: {q.correct_answer}</p>
                  )}
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
          <button onClick={onRetry}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all">
            <RotateCcw size={15} /> New Quiz
          </button>
          <button onClick={onHome}
            className="flex items-center gap-2 bg-white text-slate-600 px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <Home size={15} /> Home
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Quiz Orchestrator ────────────────────────────────────────────────────
const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Allow both: direct access from sidebar OR being passed state from Preparation
  const stateData = location.state || {};
  const [phase, setPhase] = useState(
    stateData.quizQuestions?.length ? "active" : "setup"
  );
  const [quizQuestions, setQuizQuestions] = useState(stateData.quizQuestions || []);
  const [examType, setExamType] = useState(stateData.examType || "");
  const [topic, setTopic] = useState(stateData.topic || "");
  const [finalAnswers, setFinalAnswers] = useState({});

  const handleSetupDone = (questions, exam, t) => {
    setQuizQuestions(questions);
    setExamType(exam);
    setTopic(t);
    setPhase("active");
  };

  const handleFinish = (answers) => {
    setFinalAnswers(answers);
    setPhase("results");
  };

  const handleRetry = () => {
    setPhase("setup");
    setQuizQuestions([]);
    setExamType("");
    setTopic("");
    setFinalAnswers({});
  };

  if (phase === "setup") return <SetupScreen onStart={handleSetupDone} />;
  if (phase === "active") return <QuizActive quizQuestions={quizQuestions} examType={examType} topic={topic} onFinish={handleFinish} />;
  if (phase === "results") return <ResultsScreen quizQuestions={quizQuestions} selectedAnswers={finalAnswers} examType={examType} topic={topic} onRetry={handleRetry} onHome={() => navigate("/feed")} />;
  return null;
};

export default Quiz;
