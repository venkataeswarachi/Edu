import React from "react";
import { Sparkles, Brain, TrendingUp, Users, Target, Zap, BookOpen } from "lucide-react";

const features = [
  { icon: Brain, color: "from-indigo-500 to-indigo-600", title: "AI Interaction", desc: "Get intelligent AI-generated responses to your questions and posts." },
  { icon: TrendingUp, color: "from-purple-500 to-purple-600", title: "Latest Trends", desc: "Stay updated on emerging technologies and career paths in real time." },
  { icon: Users, color: "from-cyan-500 to-cyan-600", title: "Community Feed", desc: "Share insights and collaborate with learners in an interactive community." },
  { icon: BookOpen, color: "from-emerald-500 to-teal-600", title: "Exam Preparation", desc: "Practice with AI-generated questions for JEE, GATE, EAMCET and more." },
  { icon: Zap, color: "from-orange-500 to-red-500", title: "Career Screener", desc: "Match your resume to job descriptions for instant gap analysis." },
  { icon: Target, color: "from-rose-500 to-pink-600", title: "Personalized Paths", desc: "AI-driven roadmaps tailored to your stream and career goals." },
];

const About = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Hero */}
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
          <Sparkles size={13} /> AI-Powered Education
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight">
          About{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            EduPortal
          </span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          An AI-powered collaborative learning platform designed to help students explore career paths, share knowledge, stay updated with trends, and make smarter academic decisions.
        </p>
      </div>

      {/* Mission */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch mb-16">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <Target size={18} />
            </div>
            <h2 className="text-xl font-black text-slate-900">Our Mission</h2>
          </div>
          <p className="text-slate-500 leading-relaxed text-sm mb-3">
            Bridge the gap between education and industry by providing students with real-time insights, AI-driven guidance, and a collaborative community where knowledge flows freely.
          </p>
          <p className="text-slate-500 leading-relaxed text-sm">
            We empower students to confidently choose career paths, improve technical skills, and make data-driven decisions about their future.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8">
          <h3 className="text-base font-black text-indigo-700 mb-5">Why EduPortal?</h3>
          <ul className="space-y-3">
            {[
              "AI-powered intelligent replies on posts",
              "ML-based career scope prediction model",
              "Community-driven interactive learning feed",
              "Real-time technology trend awareness",
              "Clean, scalable SaaS architecture",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-black">✓</span>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Features */}
      <h2 className="text-2xl font-black text-slate-900 text-center mb-8">Core Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {features.map(({ icon: Icon, color, title, desc }, i) => (
          <div key={title} className={`group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
              <Icon size={20} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Vision banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-center text-white">
        <Sparkles size={28} className="mx-auto mb-4 text-indigo-200" />
        <h2 className="text-2xl font-black mb-3">Our Vision</h2>
        <p className="max-w-2xl mx-auto text-indigo-100 leading-relaxed text-sm">
          We envision EduPortal becoming a next-generation educational ecosystem where AI, community collaboration, and predictive analytics work together to guide students toward successful and fulfilling careers.
        </p>
      </div>
    </div>
  </div>
);

export default About;
