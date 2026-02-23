import React, { useState } from "react";
import api from "../services/api";
import {
  TrendingUp, Zap, BookOpen, Target, Rocket, Code, Lightbulb,
  ArrowLeft, Loader2, CheckCircle, Clock, Plus, AlertCircle
} from "lucide-react";

const COURSES = [
  { id: "web-development", name: "Web Development", icon: Code, color: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50" },
  { id: "data-science", name: "Data Science", icon: TrendingUp, color: "from-indigo-500 to-blue-600", bg: "from-indigo-50 to-blue-50" },
  { id: "cloud-computing", name: "Cloud Computing", icon: Zap, color: "from-sky-500 to-indigo-500", bg: "from-sky-50 to-indigo-50" },
  { id: "ai-ml", name: "AI & Machine Learning", icon: Lightbulb, color: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50" },
  { id: "devops", name: "DevOps", icon: Rocket, color: "from-rose-500 to-orange-500", bg: "from-rose-50 to-orange-50" },
  { id: "cybersecurity", name: "Cybersecurity", icon: Target, color: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50" },
];

const Trends = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [customDomain, setCustomDomain] = useState("");
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrends = async (courseName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/ai/latest-trends", { course: courseName });
      let data;
      try { data = JSON.parse(response.data.trends); }
      catch { setError("Failed to parse trends data."); return; }
      if (!data.trending_domains || !data.technologies || !data.roadmap) {
        setError("Invalid response structure."); return;
      }
      setTrendsData(data);
    } catch {
      setError("Failed to fetch trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setCustomDomain("");
    const courseName = COURSES.find((c) => c.id === courseId)?.name || courseId;
    fetchTrends(courseName);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customDomain.trim()) return;
    setSelectedCourse(null);
    fetchTrends(customDomain.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={22} className="text-indigo-500" />
              Latest Trends
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Explore trends, technologies, and roadmaps for any domain</p>
          </div>
          {trendsData && (
            <button
              onClick={() => { setTrendsData(null); setSelectedCourse(null); setError(null); }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all"
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200 animate-pulse-ring">
              <Loader2 size={28} className="text-white animate-spin" />
            </div>
            <p className="text-slate-600 font-semibold">Analyzing trends for you…</p>
            <p className="text-slate-400 text-sm">This may take a few seconds</p>
            {/* Skeleton shimmer */}
            <div className="w-full max-w-4xl grid md:grid-cols-3 gap-4 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {!loading && !trendsData && (
          <div className="animate-fade-up">
            {/* Course grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {COURSES.map(({ id, name, icon: Icon, color, bg }) => (
                <button
                  key={id}
                  onClick={() => handleCourseSelect(id)}
                  disabled={loading}
                  className={`group bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-transparent hover:-translate-y-1 transition-all duration-200 text-left ${selectedCourse === id ? "ring-2 ring-indigo-500" : ""}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                    Explore trends <ArrowLeft size={12} className="rotate-180" />
                  </p>
                </button>
              ))}
            </div>

            {/* Custom domain */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 mb-1">Custom Domain</h3>
              <p className="text-sm text-slate-400 mb-4">Enter any domain not listed above</p>
              <form onSubmit={handleCustomSubmit} className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g., Blockchain, Robotics, Game Development…"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all"
                >
                  <Plus size={16} /> Explore
                </button>
              </form>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </div>
        )}

        {!loading && trendsData && (
          <div className="space-y-8 animate-fade-up">
            {/* Domains */}
            <section>
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" /> Trending Domains
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendsData.trending_domains?.map((domain, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">{i + 1}</div>
                      <h3 className="font-bold text-slate-900 text-sm">{domain.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{domain.description}</p>
                    {domain.growth && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold">
                        <TrendingUp size={11} /> {domain.growth}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Technologies */}
            <section>
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-purple-500" /> Key Technologies
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {trendsData.technologies?.map((tech, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full text-sm text-slate-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-default">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                    {typeof tech === 'object' ? tech.name : tech}
                  </div>
                ))}
              </div>
            </section>

            {/* Roadmap */}
            <section>
              <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-500" /> Learning Roadmap
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 to-purple-300" />
                <div className="space-y-4 pl-12">
                  {trendsData.roadmap?.map((step, i) => (
                    <div key={i} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      {/* Dot */}
                      <div className="absolute -left-9 top-5 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[11px] font-black shadow-md">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{step.step || step.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.description || step.details}</p>
                      {step.timeframe && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                          <Clock size={11} /> {step.timeframe}
                        </div>
                      )}
                      {step.skills && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {step.skills.map((s, j) => (
                            <span key={j} className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-semibold">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Career Paths */}
            {trendsData.career_paths && (
              <section>
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-rose-500" /> Career Paths
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {trendsData.career_paths.map((path, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                        <Target size={18} className="text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1">{path.title || path.name}</h3>
                        <p className="text-xs text-slate-500">{path.description}</p>
                        {path.avg_salary && (
                          <p className="mt-2 text-xs text-emerald-600 font-bold">{path.avg_salary}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;
