import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    GraduationCap, Brain, Search, ChevronRight, ChevronLeft,
    Loader2, CheckCircle, AlertCircle, Sparkles, RotateCcw,
    Star, BookOpen, Briefcase, Trophy, Target, Zap,
} from "lucide-react";

// ── Axios instance pointing at the ai-service ────────────────────────────────
const aiApi = axios.create({ baseURL: "http://localhost:8000" });

// ── All 58 interest features grouped for better UX ───────────────────────────
const INTEREST_GROUPS = [
    {
        label: "🎨 Arts & Creativity",
        color: "from-pink-500 to-rose-500",
        bg: "bg-pink-50",
        border: "border-pink-200",
        tag: "text-pink-700 bg-pink-100",
        items: ["Drawing", "Cartooning", "Designing", "Crafting", "Makeup", "Knitting"],
    },
    {
        label: "🎵 Performing Arts",
        color: "from-purple-500 to-violet-500",
        bg: "bg-purple-50",
        border: "border-purple-200",
        tag: "text-purple-700 bg-purple-100",
        items: ["Dancing", "Singing", "Acting", "Director", "Listening Music"],
    },
    {
        label: "💻 Technology",
        color: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50",
        border: "border-blue-200",
        tag: "text-blue-700 bg-blue-100",
        items: ["Coding", "Electricity Components", "Mechanic Parts", "Computer Parts", "Engeeniering", "Architecture"],
    },
    {
        label: "📚 Academic & Science",
        color: "from-indigo-500 to-blue-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        tag: "text-indigo-700 bg-indigo-100",
        items: ["Physics", "Chemistry", "Mathematics", "Biology", "Science", "Botany", "Zoology", "Researching"],
    },
    {
        label: "📖 Humanities & Languages",
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        tag: "text-amber-700 bg-amber-100",
        items: ["History", "Geography", "Sociology", "Hindi", "French", "English", "Urdu", "Other Language", "Literature", "Reading", "Asrtology"],
    },
    {
        label: "💼 Business & Finance",
        color: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        tag: "text-emerald-700 bg-emerald-100",
        items: ["Accounting", "Economics", "Bussiness", "Bussiness Education", "Journalism", "Content writing", "Debating"],
    },
    {
        label: "⚕️ Health & Medicine",
        color: "from-rose-500 to-pink-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        tag: "text-rose-700 bg-rose-100",
        items: ["Doctor", "Pharmisist", "Psycology", "Teaching"],
    },
    {
        label: "🏃 Sports & Lifestyle",
        color: "from-lime-500 to-green-500",
        bg: "bg-lime-50",
        border: "border-lime-200",
        tag: "text-lime-700 bg-lime-100",
        items: ["Sports", "Exercise", "Gymnastics", "Yoga", "Cycling", "Travelling", "Gardening", "Animals", "Photography", "Video Game", "Solving Puzzles", "Historic Collection"],
    },
];

const RIASEC_COLORS = {
    R: { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500", label: "Realistic" },
    I: { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500", label: "Investigative" },
    A: { bg: "bg-pink-100", text: "text-pink-700", bar: "bg-pink-500", label: "Artistic" },
    S: { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500", label: "Social" },
    E: { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-500", label: "Enterprising" },
    C: { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-500", label: "Conventional" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

const InterestToggle = ({ name, active, onToggle, tagClass }) => (
    <button
        onClick={() => onToggle(name)}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${active
                ? `${tagClass} border-transparent shadow-sm scale-105`
                : "text-slate-500 bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
    >
        {active && <CheckCircle size={10} className="flex-shrink-0" />}
        {name}
    </button>
);

const ScoreBar = ({ label, value, colorClass }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>{label}</span>
            <span>{value.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);

const RatingSlider = ({ value, onChange }) => (
    <div className="flex items-center gap-3 mt-2">
        {[0, 1, 2, 3, 4].map((n) => (
            <button
                key={n}
                onClick={() => onChange(n)}
                className={`w-8 h-8 rounded-lg text-xs font-bold border-2 transition-all duration-150 ${value === n
                        ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-md shadow-indigo-200"
                        : "border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
            >
                {n}
            </button>
        ))}
        <span className="text-[10px] text-slate-400 ml-1">
            {["Not at all", "Rarely", "Sometimes", "Often", "Always"][value]}
        </span>
    </div>
);

// ────────────────────────────────────────────────────────────────────────────
// TAB 1 — Course Predictor
// ────────────────────────────────────────────────────────────────────────────

const CoursePredictor = () => {
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const toggleInterest = useCallback((name) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
        setResult(null);
    }, []);

    const predict = async () => {
        if (selected.size === 0) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const interestsPayload = {};
            INTEREST_GROUPS.forEach(({ items }) => {
                items.forEach((item) => {
                    interestsPayload[item] = selected.has(item) ? 1 : 0;
                });
            });
            const res = await aiApi.post("/career/predict-course", { interests: interestsPayload });
            setResult(res.data);
        } catch (err) {
            setError("Prediction failed. Make sure the AI service is running on port 8001.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { setSelected(new Set()); setResult(null); setError(null); };

    const filteredGroups = INTEREST_GROUPS.map((g) => ({
        ...g,
        items: search
            ? g.items.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
            : g.items,
    })).filter((g) => g.items.length > 0);

    return (
        <div className="space-y-6">
            {/* Info banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">
                    Select <strong>all interests that genuinely excite you</strong>. Our trained ML model (RandomForest on 35 academic courses) will predict the best-fit degree for you.
                </p>
            </div>

            {/* Search + count */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search interests…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-100 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                    <CheckCircle size={14} className="text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-700">{selected.size} selected</span>
                </div>
                {selected.size > 0 && (
                    <button
                        onClick={reset}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-all"
                    >
                        <RotateCcw size={13} /> Reset
                    </button>
                )}
            </div>

            {/* Interest groups */}
            <div className="space-y-5">
                {filteredGroups.map(({ label, items, tag, bg, border }) => (
                    <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
                        <p className="text-xs font-bold text-slate-600 mb-3">{label}</p>
                        <div className="flex flex-wrap gap-2">
                            {items.map((name) => (
                                <InterestToggle
                                    key={name}
                                    name={name}
                                    active={selected.has(name)}
                                    onToggle={toggleInterest}
                                    tagClass={tag}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} /> {error}
                </div>
            )}

            {/* Predict button */}
            <button
                onClick={predict}
                disabled={loading || selected.size === 0}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
                {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Analysing your interests…</>
                ) : (
                    <><GraduationCap size={18} /> Predict My Course</>
                )}
            </button>

            {/* Result card */}
            {result && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-[2px] shadow-xl shadow-indigo-200">
                        <div className="bg-white rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                    <Trophy size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ML Prediction</p>
                                    <p className="text-sm font-semibold text-slate-600">Best-fit course for you</p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                                {result.predicted_course}
                            </h2>

                            {result.confidence !== null && result.confidence !== undefined && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
                                        <span>Model confidence</span>
                                        <span className="text-indigo-600">{(result.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                                            style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-2">
                                    <CheckCircle size={15} className="text-indigo-600" />
                                    <span className="text-xs font-semibold text-indigo-700">{selected.size} interests matched</span>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-2">
                                    <Star size={15} className="text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-700">AI-powered match</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// TAB 2 — Personality Test (RIASEC)
// ────────────────────────────────────────────────────────────────────────────

const PersonalityTest = () => {
    const [questions, setQuestions] = useState(null);
    const [loadingQ, setLoadingQ] = useState(true);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // which personality type

    useEffect(() => {
        aiApi.get("/career/personality-questions")
            .then((res) => {
                setQuestions(res.data);
                const initial = {};
                Object.keys(res.data).forEach((type) => {
                    initial[type] = res.data[type].map(() => 2); // default: "Sometimes"
                });
                setAnswers(initial);
            })
            .catch(() => setError("Could not load questions. Please ensure the AI service is running."))
            .finally(() => setLoadingQ(false));
    }, []);

    const setAnswer = (type, idx, val) => {
        setAnswers((prev) => ({
            ...prev,
            [type]: prev[type].map((v, i) => (i === idx ? val : v)),
        }));
    };

    const submit = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await aiApi.post("/career/personality-test", { answers });
            setResult(res.data);
        } catch {
            setError("Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setResult(null);
        setCurrentStep(0);
        if (questions) {
            const initial = {};
            Object.keys(questions).forEach((type) => {
                initial[type] = questions[type].map(() => 2);
            });
            setAnswers(initial);
        }
    };

    if (loadingQ) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl animate-pulse">
                    <Brain size={26} className="text-white" />
                </div>
                <p className="text-slate-500 font-semibold text-sm">Loading personality test…</p>
            </div>
        );
    }

    if (error && !questions) {
        return (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle size={15} /> {error}
            </div>
        );
    }

    const types = questions ? Object.keys(questions) : [];
    const currentType = types[currentStep];

    // ── Result view ─────────────────────────────────────────────────────────
    if (result) {
        const dominantKey = Object.keys(RIASEC_COLORS).find(
            (k) => RIASEC_COLORS[k].label === result.dominant_type
        ) || "I";
        const dc = RIASEC_COLORS[dominantKey];

        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Hero result */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-24 -translate-x-24" />
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Your Personality Type</p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl ${dc.bg} flex items-center justify-center shadow-lg`}>
                                <span className={`text-2xl font-black ${dc.text}`}>{dominantKey}</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black">{result.dominant_type}</h2>
                                <p className="text-indigo-200 text-sm mt-1">{result.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score bars */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target size={15} className="text-indigo-500" /> RIASEC Score Breakdown
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(result.scores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, score]) => (
                                <ScoreBar
                                    key={type}
                                    label={`${type} — ${RIASEC_COLORS[type]?.label || type}`}
                                    value={score}
                                    colorClass={RIASEC_COLORS[type]?.bar || "bg-indigo-500"}
                                />
                            ))}
                    </div>
                </div>

                {/* Career matches */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Briefcase size={15} className="text-purple-500" /> Matching Career Paths
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {result.careers.map((career, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                            >
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                    {i + 1}
                                </div>
                                <span className="text-xs font-semibold text-slate-700">{career}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={reset}
                    className="w-full py-3 rounded-xl font-bold text-sm text-slate-600 border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw size={14} /> Retake Test
                </button>
            </div>
        );
    }

    // ── Question stepper ─────────────────────────────────────────────────────
    const qList = questions[currentType] || [];
    const dc2 = RIASEC_COLORS[currentType] || {};
    const progress = ((currentStep + 1) / types.length) * 100;

    return (
        <div className="space-y-6">
            {/* Info */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 flex items-start gap-3">
                <Brain size={18} className="text-violet-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">
                    Rate each statement on a scale of <strong>0 (Not at all)</strong> to <strong>4 (Always)</strong>. Answer honestly for the most accurate result.
                </p>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                    <span>Section {currentStep + 1} of {types.length}</span>
                    <span className={dc2.text}>{dc2.label} ({currentType})</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${dc2.bar || "bg-indigo-500"} rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Type header */}
            <div className={`flex items-center gap-3 rounded-2xl p-4 ${dc2.bg} border ${dc2.text?.replace("text", "border") || ""}`}>
                <div className={`w-10 h-10 rounded-xl ${dc2.bg} border border-current/20 flex items-center justify-center`}>
                    <span className={`text-xl font-black ${dc2.text}`}>{currentType}</span>
                </div>
                <div>
                    <p className={`font-bold text-sm ${dc2.text}`}>{dc2.label}</p>
                    <p className="text-xs text-slate-500">Answer all 3 questions in this section</p>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
                {qList.map((q, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-1">
                            <span className="text-indigo-500 font-black mr-2">Q{idx + 1}.</span>
                            {q}
                        </p>
                        <RatingSlider
                            value={answers[currentType]?.[idx] ?? 2}
                            onChange={(val) => setAnswer(currentType, idx, val)}
                        />
                    </div>
                ))}
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                    <AlertCircle size={15} /> {error}
                </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
                {currentStep > 0 && (
                    <button
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-600 border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                )}
                {currentStep < types.length - 1 ? (
                    <button
                        onClick={() => setCurrentStep((s) => s + 1)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
                    >
                        Next Section <ChevronRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin" /> Analysing…</>
                        ) : (
                            <><Zap size={16} /> Get My Results</>
                        )}
                    </button>
                )}
            </div>

            {/* Section dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
                {types.map((t, i) => (
                    <button
                        key={t}
                        onClick={() => setCurrentStep(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === currentStep
                                ? `${RIASEC_COLORS[t]?.bar || "bg-indigo-500"} w-6`
                                : "bg-slate-200 hover:bg-slate-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

const CareerRecommend = () => {
    const [tab, setTab] = useState("course");

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Career AI</h1>
                    </div>
                    <p className="text-sm text-slate-400 ml-[52px]">
                        ML-powered course prediction & RIASEC personality assessment
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm mb-6">
                    <TabButton
                        active={tab === "course"}
                        onClick={() => setTab("course")}
                        icon={BookOpen}
                        label="Course Predictor"
                    />
                    <TabButton
                        active={tab === "personality"}
                        onClick={() => setTab("personality")}
                        icon={Brain}
                        label="Personality Test"
                    />
                </div>

                {/* Tab content */}
                <div key={tab}>
                    {tab === "course" ? <CoursePredictor /> : <PersonalityTest />}
                </div>
            </div>
        </div>
    );
};

export default CareerRecommend;
