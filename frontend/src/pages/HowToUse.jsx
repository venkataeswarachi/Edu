import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, Rss, PenSquare, TrendingUp, MessageCircle,
  BarChart3, BookOpen, Brain, ArrowRight
} from "lucide-react";

const steps = [
  { icon: UserPlus, step: "01", title: "Create an Account", desc: "Sign up in seconds with your email. No credit card required.", cta: "/signup", ctaLabel: "Sign up free" },
  { icon: Rss, step: "02", title: "Explore the Community Feed", desc: "Browse posts from learners in your field. Comment and engage with the community.", cta: "/feed", ctaLabel: "Go to Feed" },
  { icon: PenSquare, step: "03", title: "Create Your First Post", desc: "Share insights, ask questions, or get an AI reply from DEVIKA on your post.", cta: "/myposts", ctaLabel: "My Posts" },
  { icon: TrendingUp, step: "04", title: "Discover Latest Trends", desc: "Select your domain or enter a custom one to explore trending tech and roadmaps.", cta: "/trends", ctaLabel: "View Trends" },
  { icon: MessageCircle, step: "05", title: "Chat with DEVIKA AI", desc: "Ask anything — career advice, coding help, study tips. DEVIKA is always online.", cta: "/chat-ai", ctaLabel: "Open Chat" },
  { icon: BarChart3, step: "06", title: "Run Career Screener", desc: "Upload your resume and a job description to get an instant skill match score.", cta: "/predict", ctaLabel: "Try Screener" },
  { icon: BookOpen, step: "07", title: "Prepare for Exams", desc: "Select JEE, GATE, EAMCET or another exam to practice with AI-generated questions.", cta: "/prepare", ctaLabel: "Start Prep" },
  { icon: Brain, step: "08", title: "Take Timed Quizzes", desc: "Test yourself under timed conditions and get a detailed performance breakdown.", cta: "/quiz", ctaLabel: "Take Quiz" },
];

const HowToUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            How to Use{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduPortal
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            From sign-up to career-ready — follow these steps to get the most out of the platform.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300" />

          <div className="space-y-5">
            {steps.map(({ icon: Icon, step, title, desc, cta, ctaLabel }, i) => (
              <div
                key={step}
                className={`relative flex gap-6 animate-fade-up stagger-${Math.min(i + 1, 5)}`}
              >
                {/* Step node */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                  <Icon size={22} />
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Step {step}</span>
                      </div>
                      <h2 className="text-base font-black text-slate-900 mb-1.5">{title}</h2>
                      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                    <button
                      onClick={() => navigate(cta)}
                      className="group flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl whitespace-nowrap hover:bg-indigo-100 transition-all flex-shrink-0"
                    >
                      {ctaLabel}
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-xl font-black mb-2">Ready to Get Started?</h3>
          <p className="text-indigo-100 text-sm mb-6">Join thousands of students learning smarter with EduPortal.</p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 shadow transition-all"
          >
            Create Free Account →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
