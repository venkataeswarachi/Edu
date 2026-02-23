import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [req, setReq] = useState({ name: '', username: '', email: '', password: '', role: 'STUDENT' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/signup', req);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1800);
        } catch {
            setError('Registration failed. Email or username may already be taken.');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ icon: Icon, type = 'text', placeholder, value, onChange, required = true }) => (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon size={16} />
            </span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all"
            />
        </div>
    );

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center max-w-sm animate-fade-up">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={30} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Account Created!</h2>
                    <p className="text-sm text-slate-400">Redirecting you to sign in…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">

            {/* Decorative blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
                <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>

            <div className="relative w-full max-w-md animate-fade-up">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src="/logo.jpg"
                                alt="EduPortal"
                                className="h-14 w-auto object-contain rounded-2xl shadow-md"
                            />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Create account</h1>
                        <p className="text-slate-400 text-sm mt-1">Join the EduPortal community</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-6">
                            <AlertCircle size={15} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                            <InputField icon={User} placeholder="Your full name" value={req.name} onChange={(e) => setReq({ ...req, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
                            <InputField icon={User} placeholder="Choose a username" value={req.username} onChange={(e) => setReq({ ...req, username: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                            <InputField icon={Mail} type="email" placeholder="you@example.com" value={req.email} onChange={(e) => setReq({ ...req, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                            <InputField icon={Lock} type="password" placeholder="Create a password" value={req.password} onChange={(e) => setReq({ ...req, password: e.target.value })} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;