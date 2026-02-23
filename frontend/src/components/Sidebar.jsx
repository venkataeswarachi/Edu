import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home, User, TrendingUp, MessageCircle, BarChart3,
    LogOut, LogIn, UserCircle, BookOpen, Brain, ChevronRight, GraduationCap
} from "lucide-react";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const update = () => {
            const token = localStorage.getItem("token");
            setIsAuth(!!token);
            setUsername(localStorage.getItem("username") || "");
        };
        update();
        window.addEventListener("authChange", update);
        return () => window.removeEventListener("authChange", update);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
    };

    const navItems = [
        { to: "/feed", icon: Home, label: "Explore" },
        { to: "/myposts", icon: User, label: "My Posts" },
        { to: "/trends", icon: TrendingUp, label: "Trends" },
        { to: "/chat-ai", icon: MessageCircle, label: "Chat AI" },
        { to: "/predict", icon: BarChart3, label: "Screener" },
        { to: "/career", icon: GraduationCap, label: "Career AI" },
        { to: "/prepare", icon: BookOpen, label: "Prepare" },
        { to: "/quiz", icon: Brain, label: "Quiz" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40">
            {/* Logo header */}
            <div className="h-16 flex items-center px-4 border-b border-slate-100">
                <Link to="/" className="group flex items-center">
                    <img
                        src="/logo.jpg"
                        alt="EduPortal"
                        className="h-9 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Brand strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {navItems.map(({ to, icon: Icon, label }) => {
                    const active = isActive(to);
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            {/* Active left bar */}
                            <span
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-indigo-600 transition-all duration-200 ${active ? "opacity-100" : "opacity-0"}`}
                            />
                            <span
                                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${active
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                    }`}
                            >
                                <Icon size={15} />
                            </span>
                            <span className="flex-1 leading-none">{label}</span>
                            {active && (
                                <ChevronRight size={14} className="text-indigo-400 flex-shrink-0" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom section */}
            <div className="px-3 pb-4 border-t border-slate-100 pt-3 space-y-1">
                {isAuth ? (
                    <>
                        {/* User avatar */}
                        <div className="flex items-center gap-3 px-3 py-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                                {username ? username[0].toUpperCase() : "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                    {username || "Student"}
                                </p>
                                <p className="text-[10px] text-slate-400">EduPortal Member</p>
                            </div>
                        </div>

                        <Link
                            to="/profile"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive("/profile")
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500">
                                <UserCircle size={15} />
                            </span>
                            Profile
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-500">
                                <LogOut size={15} />
                            </span>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                            <LogIn size={15} />
                        </span>
                        Sign In
                    </Link>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
