import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Users, Zap, Star, TrendingUp,
  Brain, Target, Sparkles, ChevronRight
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/feed');
  }, [navigate]);

  const features = [
    {
      icon: BookOpen, color: 'from-indigo-500 to-indigo-600',
      bg: 'from-indigo-50 to-indigo-100',
      title: 'Learn & Grow',
      desc: 'Access AI-generated study materials, practice questions, and personalized learning paths tailored to your goals.'
    },
    {
      icon: Users, color: 'from-cyan-500 to-cyan-600',
      bg: 'from-cyan-50 to-cyan-100',
      title: 'Connect & Collaborate',
      desc: 'Share knowledge, discuss topics, and build your network with fellow learners in an interactive community feed.'
    },
    {
      icon: Zap, color: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
      title: 'AI-Powered Tools',
      desc: 'Leverage cutting-edge AI for personalized recommendations, instant answers, and smart career insights.'
    },
    {
      icon: TrendingUp, color: 'from-emerald-500 to-emerald-600',
      bg: 'from-emerald-50 to-emerald-100',
      title: 'Stay on Trend',
      desc: 'Explore real-time career trends, in-demand technologies, and learning roadmaps for any domain.'
    },
    {
      icon: Brain, color: 'from-rose-500 to-rose-600',
      bg: 'from-rose-50 to-rose-100',
      title: 'Exam Preparation',
      desc: 'Practice with AI-generated questions for JEE, EAMCET, GATE and more. Test yourself with timed quizzes.'
    },
    {
      icon: Target, color: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100',
      title: 'Career Screener',
      desc: 'Upload your resume and a job description to instantly discover your skill match score and gaps to bridge.'
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Learners', color: 'text-indigo-600' },
    { value: '500+', label: 'Study Resources', color: 'text-purple-600' },
    { value: '24/7', label: 'AI Support', color: 'text-pink-600' },
    { value: '98%', label: 'Satisfaction', color: 'text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 overflow-hidden">

      {/* ── Animated Blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center">
          <a href="/">
            <img
              src="/logo.jpg"
              alt="EduPortal"
              className="h-10 w-auto object-contain rounded-lg hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
          >
            Get started →
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-8">

        {/* ── Hero ── */}
        <section className="text-center pt-16 pb-24">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 shadow-sm text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-up">
            <Star size={13} className="fill-indigo-500 text-indigo-500" />
            AI-Powered Education Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6 animate-fade-up stagger-1">
            Learn Smarter,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-text">
              Grow Faster
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up stagger-2">
            Your all-in-one platform for AI-powered learning, career guidance, community collaboration, and exam preparation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-3">
            <button
              onClick={() => navigate('/signup')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-base border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all"
            >
              <BookOpen size={18} />
              Learn more
            </button>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 animate-fade-up stagger-4">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="glass-card text-center py-6 px-4 hover:shadow-md transition-shadow">
              <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <section className="pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">excel</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From AI chat to career screening — all the tools a modern student needs, in one seamless platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <div
                key={title}
                className={`group bg-white rounded-2xl p-6 border border-slate-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up stagger-${Math.min(i + 1, 5)}`}
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${bg} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-7 h-7 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <Icon size={15} className="text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <div className="mb-24 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-px shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 rounded-3xl" />
            <div className="relative">
              <Sparkles size={32} className="mx-auto mb-4 text-indigo-200" />
              <h2 className="text-3xl font-black mb-3">
                Join thousands of students learning smarter
              </h2>
              <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                Sign up in seconds and unlock AI-powered tools, community learning, and personalized career guidance.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all"
              >
                Create free account
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;