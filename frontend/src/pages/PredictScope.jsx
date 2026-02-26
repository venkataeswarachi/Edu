import React, { useState } from "react";
import { aiApi } from "../services/api";
import {
    Upload, CheckCircle, XCircle, FileText, Search, BookOpen,
    Lightbulb, ChevronRight, Loader2, BarChart3, AlertCircle
} from "lucide-react";

const SkillChip = ({ skill, type }) => {
    const styles = {
        matched: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        missing: "bg-rose-50 text-rose-700 border border-rose-200",
        resume: "bg-slate-50 text-slate-700 border border-slate-200",
        job: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    };
    const dots = {
        matched: "bg-emerald-500", missing: "bg-rose-500",
        resume: "bg-slate-400", job: "bg-indigo-500",
    };
    return (
        <div className={`skill-chip inline-flex items-center gap-1.5 ${styles[type]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dots[type]}`} />
            {skill}
        </div>
    );
};

const UploadZone = ({ label, icon, file, onChange }) => (
    <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-white cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
        <input type="file" className="sr-only" onChange={(e) => onChange(e.target.files[0])} />
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${file ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"}`}>
            {file ? <CheckCircle size={26} /> : React.createElement(icon, { size: 26 })}
        </div>
        <p className="text-sm font-bold text-slate-700 mb-1">{label}</p>
        {file ? (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle size={11} /> {file.name}
            </p>
        ) : (
            <p className="text-xs text-slate-400">Click to upload PDF or DOCX</p>
        )}
    </label>
);

const ScoreRing = ({ score }) => {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const filled = (score / 100) * circ;
    const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#f43f5e";

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
                <circle
                    cx="80" cy="80" r={r} fill="none"
                    stroke={color} strokeWidth="14"
                    strokeDasharray={`${filled} ${circ - filled}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color }}>{score.toFixed(0)}%</span>
                <span className="text-xs text-slate-400 font-semibold">Match</span>
            </div>
        </div>
    );
};

const PredictScope = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobFile, setJobFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFiles = async () => {
        if (!resumeFile || !jobFile) return;
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("job_description", jobFile);
        setLoading(true);
        setError(null);
        try {
            const res = await aiApi.post("/full-analysis", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 90000,
            });
            setResult(res.data);
        } catch (err) {
            const status = err.response?.status;
            setError(
                status === 422
                    ? "Could not read one of your files. Please upload a valid PDF, DOCX, or TXT file."
                    : status === 503
                        ? "AI service is unavailable. Make sure ai-service is running on port 8000."
                        : "Analysis failed. Please check your files and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <BarChart3 size={22} className="text-indigo-500" />
                        Career Screener
                    </h1>
                    <p className="text-sm text-slate-400 mt-0.5">Upload your resume and job description to get a detailed skill match analysis</p>
                </div>

                {/* Upload section */}
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <UploadZone label="Your Resume" icon={FileText} file={resumeFile} onChange={setResumeFile} />
                    <UploadZone label="Job Description" icon={Search} file={jobFile} onChange={setJobFile} />
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-5">
                        <AlertCircle size={15} /> {error}
                    </div>
                )}

                <button
                    onClick={uploadFiles}
                    disabled={loading || !resumeFile || !jobFile}
                    className="w-full py-4 rounded-2xl font-bold text-white text-sm shadow-lg transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> Analyzing your files…</>
                    ) : (
                        <><Search size={18} /> Run Deep Analysis</>
                    )}
                </button>

                {result && (
                    <div className="mt-10 space-y-6 animate-fade-up">
                        {/* Score banner */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center">
                                    <ScoreRing score={result.match_score} />
                                </div>
                                <div className="p-8 flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Recommendation</p>
                                    <h2 className="text-3xl font-black text-slate-900 mb-3">{result.prediction?.prediction}</h2>
                                    {result.prediction?.confidence && (
                                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-sm font-bold">
                                            <CheckCircle size={14} />
                                            Confidence: {(result.prediction.confidence * 100).toFixed(1)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills extraction */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={14} /> Resume Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.resume_skills?.map((s) => <SkillChip key={s} skill={s} type="resume" />)}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Search size={14} /> Job Requirements
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.job_skills?.map((s) => <SkillChip key={s} skill={s} type="job" />)}
                                </div>
                            </div>
                        </div>

                        {/* Match vs Gap */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="bg-emerald-50/60 rounded-2xl border border-emerald-100 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle size={14} /> Matched Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.matched_skills?.map((s) => <SkillChip key={s} skill={s} type="matched" />)}
                                </div>
                            </div>
                            <div className="bg-rose-50/60 rounded-2xl border border-rose-100 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <XCircle size={14} /> Skills to Bridge
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missing_skills?.map((s) => <SkillChip key={s} skill={s} type="missing" />)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <BookOpen size={17} className="text-indigo-600" /> Learning Roadmap
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(result.learning_resources || {}).map(([skill, link]) => (
                                        <a key={skill} href={link} target="_blank" rel="noreferrer"
                                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                                            <span className="font-semibold text-sm text-slate-700">{skill}</span>
                                            <ChevronRight size={15} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Lightbulb size={17} className="text-amber-500" /> Project Ideas
                                </h3>
                                <div className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-400 text-slate-600 text-sm leading-relaxed italic">
                                    {result.project_ideas}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictScope;