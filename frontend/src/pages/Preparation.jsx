import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Brain, GraduationCap, BookOpen, Play, CheckCircle, XCircle,
  ArrowRight, Target, Clock, Loader2
} from "lucide-react";

const EXAMS = [
  { name: "EAMCET", icon: BookOpen, desc: "Engineering, Agriculture & Medical Common Entrance Test", color: "from-emerald-500 to-teal-500" },
  { name: "JEE_MAINS", icon: Brain, desc: "Joint Entrance Examination - Main", color: "from-indigo-500 to-blue-500" },
  { name: "JEE_ADVANCED", icon: GraduationCap, desc: "Joint Entrance Examination - Advanced", color: "from-purple-500 to-pink-500" },
  { name: "GATE", icon: BookOpen, desc: "Graduate Aptitude Test in Engineering", color: "from-orange-500 to-red-500" },
];

const TOPICS = {
  EAMCET: ["Physics", "Chemistry", "Mathematics", "Biology"],
  JEE_MAINS: ["Physics", "Chemistry", "Mathematics"],
  JEE_ADVANCED: ["Physics", "Chemistry", "Mathematics"],
  GATE: ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical"],
};

const Preparation = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(null);
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  const handleStartPractice = async () => {
    if (!selectedExam || !topic) { setFormError("Please select an exam and a topic."); return; }
    setFormError("");
    const finalTopic = subtopic ? `${topic} - ${subtopic}` : topic;
    setLoading(true);
    try {
      const response = await api.post("/ai/generate-questions", {
        exam_type: selectedExam, topic: finalTopic, num_questions: numQuestions, difficulty,
      });
      let data;
      try { data = JSON.parse(response.data.questions); }
      catch { setFormError("Failed to parse questions. Please try again."); return; }
      if (!data.practice_questions?.length || !data.quiz_questions?.length) {
        setFormError("No questions received. Please try again."); return;
      }
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setPracticeCompleted(false);
    } catch {
      setFormError("Failed to generate questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => { setSelectedAnswer(answer); setShowAnswer(true); };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.practice_questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setPracticeCompleted(true);
    }
  };

  const handleTakeQuiz = () => navigate("/quiz", { state: { quizQuestions: questions.quiz_questions, examType: selectedExam, topic } });

  const currentQuestion = questions?.practice_questions?.[currentQuestionIndex];
  const total = questions?.practice_questions?.length || 0;
  const progress = total ? ((currentQuestionIndex + 1) / total) * 100 : 0;

  // — Practice completed screen —
  if (practiceCompleted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center max-w-md w-full animate-fade-up">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Practice Complete! 🎉</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Great job completing all practice questions. Now ace the timed quiz to test your real performance!
        </p>
        <button onClick={handleTakeQuiz}
          className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200 hover:shadow-xl transition-all">
          <Target size={18} /> Take Quiz <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  // — Practice mode —
  if (questions && currentQuestion) return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-slate-800">Practice — {selectedExam.replace("_", " ")}</h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 font-semibold">
              <Clock size={14} />
              {currentQuestionIndex + 1} / {total}
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <p className="text-base font-bold text-slate-900 leading-relaxed mb-6">
            {currentQuestion.question}
          </p>
          <div className="space-y-2.5">
            {currentQuestion.options?.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isCorrect = showAnswer && letter === currentQuestion.correct_answer;
              const isWrong = showAnswer && selectedAnswer === letter && letter !== currentQuestion.correct_answer;
              return (
                <button key={letter} onClick={() => !showAnswer && handleAnswerSelect(letter)} disabled={showAnswer}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : isWrong ? "border-rose-400 bg-rose-50 text-rose-800"
                        : showAnswer ? "border-slate-100 bg-slate-50 text-slate-500"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700"
                    }`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${isCorrect ? "bg-emerald-500 text-white"
                      : isWrong ? "bg-rose-500 text-white"
                        : showAnswer ? "bg-slate-200 text-slate-500"
                          : "bg-indigo-100 text-indigo-700"
                    }`}>{letter}</span>
                  <span className="flex-1 text-sm font-medium">{option}</span>
                  {isCorrect && <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />}
                  {isWrong && <XCircle size={18} className="text-rose-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {showAnswer && currentQuestion.solution && (
            <div className="mt-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen size={13} /> Explanation
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{currentQuestion.solution}</p>
            </div>
          )}

          {showAnswer && (
            <button onClick={handleNextQuestion}
              className="mt-5 group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
              {currentQuestionIndex < total - 1 ? (<>Next Question <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>)
                : (<><CheckCircle size={16} /> Complete Practice</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // — Selection screen —
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-500" /> Exam Preparation
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Practice with AI-generated questions for real exams</p>
        </div>

        {/* Exam cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {EXAMS.map(({ name, icon: Icon, desc, color }) => (
            <button key={name} onClick={() => { setSelectedExam(name); setTopic(""); setSubtopic(""); setFormError(""); }}
              className={`group bg-white p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg ${selectedExam === name ? "border-indigo-500 shadow-lg" : "border-slate-100 hover:border-indigo-200"
                }`}>
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
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl mx-auto animate-fade-up">
            <h2 className="text-base font-black text-slate-900 mb-5">Configure Session</h2>
            <div className="space-y-5">
              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Topic</label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS[selectedExam]?.map((t) => (
                    <button key={t} onClick={() => { setTopic(t); setSubtopic(""); }}
                      className={`py-2.5 px-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${topic === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-100 hover:border-indigo-200 text-slate-600"
                        }`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Subtopic */}
              {topic && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Sub-topic (optional)
                  </label>
                  <input type="text" value={subtopic} onChange={(e) => setSubtopic(e.target.value)}
                    placeholder={`e.g., Newton's Laws, Thermodynamics…`}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all" />
                  {subtopic && <p className="text-xs text-indigo-600 font-semibold mt-1.5">📚 Generating for: {topic} — {subtopic}</p>}
                </div>
              )}

              {/* Num Questions */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Questions</label>
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map((n) => (
                    <button key={n} onClick={() => setNumQuestions(n)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${numQuestions === n ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-100 hover:border-indigo-200 text-slate-600"
                        }`}>{n}</button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {["easy", "medium", "hard"].map((d) => {
                    const colors = { easy: "border-emerald-400 bg-emerald-50 text-emerald-700", medium: "border-amber-400 bg-amber-50 text-amber-700", hard: "border-rose-400 bg-rose-50 text-rose-700" };
                    return (
                      <button key={d} onClick={() => setDifficulty(d)}
                        className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold capitalize transition-all ${difficulty === d ? colors[d] : "border-slate-100 hover:border-slate-200 text-slate-500"
                          }`}>{d}</button>
                    );
                  })}
                </div>
              </div>

              {formError && <p className="text-rose-600 text-sm font-medium">{formError}</p>}

              <button onClick={handleStartPractice} disabled={loading || !topic}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? (<><Loader2 size={16} className="animate-spin" /> Generating Questions…</>) : (<><Play size={16} /> Start Practice</>)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preparation;
