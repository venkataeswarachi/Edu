import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            localStorage.removeItem('token');
            const res = await api.post('/auth/login', creds);
            localStorage.setItem('token', res.data.token);
            if (res.data.username) localStorage.setItem('username', res.data.username);
            window.dispatchEvent(new Event('authChange'));
            navigate('/feed');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">

            {/* Decorative blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>

            <div className="relative w-full max-w-md animate-fade-up">

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src="/logo.jpg"
                                alt="EduPortal"
                                className="h-14 w-auto object-contain rounded-2xl shadow-md"
                            />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in to continue to EduPortal</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-6">
                            <AlertCircle size={15} className="flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={creds.email}
                                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={creds.password}
                                    onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                            Create one →
                        </Link>
                    </p>
                </div>

                {/* Bottom hint */}
                <p className="text-center text-xs text-slate-400 mt-4">
                    By signing in, you agree to our{' '}
                    <span className="underline cursor-pointer hover:text-indigo-600">Terms of Service</span>
                </p>
            </div>
        </div>
    );
};

export default Login;