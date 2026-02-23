import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    BookOpen, Smartphone, Mail, User, Edit3, Award,
    TrendingUp, GraduationCap, Star, Loader2, CheckCircle
} from "lucide-react";

const Profile = () => {
    const [form, setForm] = useState({ name: "", stream: "", mobile: "", ssc: "", inter: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        api.get("/user/profile")
            .then((res) => { setForm(res.data); setLoading(false); })
            .catch(() => { setError("Failed to load profile"); setLoading(false); });
    }, [navigate]);

    const handleUpdate = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await api.put("/user/update-profile", form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError("Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const InputField = ({ label, type = "text", icon: Icon, value, onChange, placeholder }) => (
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 focus:bg-white transition-all"
                />
                {Icon && <Icon size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />}
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <Loader2 size={36} className="text-indigo-400 animate-spin" />
        </div>
    );

    if (error && !form.name) return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm border border-red-100">
                <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Oops!</h2>
                <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
        </div>
    );

    const initials = form.name ? form.name.slice(0, 2).toUpperCase() : "??";
    const sscScore = parseFloat(form.ssc) || 0;
    const interScore = parseFloat(form.inter) || 0;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Manage your academic information</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Profile Card */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Avatar card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black">
                                            {initials}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-6 px-5 text-center">
                                <h2 className="text-lg font-black text-slate-900">{form.name || "—"}</h2>
                                <div className="flex items-center justify-center gap-1.5 text-indigo-500 text-sm font-medium mt-1">
                                    <GraduationCap size={14} />
                                    {form.stream || "Student"}
                                </div>

                                <div className="mt-5 space-y-2 text-left">
                                    {form.email && (
                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                                            <div className="p-1.5 bg-indigo-100 rounded-lg">
                                                <Mail size={13} className="text-indigo-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
                                                <p className="text-xs font-semibold text-slate-700 truncate">{form.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {form.mobile && (
                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                                            <div className="p-1.5 bg-purple-100 rounded-lg">
                                                <Smartphone size={13} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone</p>
                                                <p className="text-xs font-semibold text-slate-700">{form.mobile}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scores card */}
                        {(sscScore > 0 || interScore > 0) && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Academic Scores</h3>
                                {sscScore > 0 && (
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                                            <span>SSC</span>
                                            <span className="text-emerald-600">{sscScore}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                                                style={{ width: `${Math.min(sscScore, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {interScore > 0 && (
                                    <div>
                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                                            <span>Intermediate</span>
                                            <span className="text-blue-600">{interScore}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700"
                                                style={{ width: `${Math.min(interScore, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
                                    <Edit3 size={18} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Academic Information</h2>
                                    <p className="text-xs text-slate-400">Update your educational details</p>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-5">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-5">
                                <InputField
                                    label="Full Name"
                                    icon={User}
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                />
                                <InputField
                                    label="Stream / Specialization"
                                    icon={BookOpen}
                                    value={form.stream}
                                    onChange={(e) => setForm({ ...form, stream: e.target.value })}
                                    placeholder="e.g., Computer Science"
                                />
                                <InputField
                                    label="Mobile Number"
                                    icon={Smartphone}
                                    value={form.mobile}
                                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                                <InputField
                                    label="Email"
                                    type="email"
                                    icon={Mail}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                />
                                <InputField
                                    label="SSC Percentage"
                                    type="number"
                                    icon={Award}
                                    value={form.ssc}
                                    onChange={(e) => setForm({ ...form, ssc: e.target.value })}
                                    placeholder="e.g., 89.5"
                                />
                                <InputField
                                    label="Intermediate Percentage"
                                    type="number"
                                    icon={TrendingUp}
                                    value={form.inter}
                                    onChange={(e) => setForm({ ...form, inter: e.target.value })}
                                    placeholder="e.g., 92.0"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className={`mt-6 group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${saved
                                        ? "bg-emerald-500 text-white shadow-emerald-200"
                                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                    }`}
                            >
                                {saving ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving…</>
                                ) : saved ? (
                                    <><CheckCircle size={16} /> Profile Updated!</>
                                ) : (
                                    <><Star size={16} /> Save Profile</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
