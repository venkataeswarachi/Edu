import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, UserCircle, Menu, X } from "lucide-react";

const Navbar = ({ sidebarVisible = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
    const handleAuth = () => setIsAuth(!!localStorage.getItem("token"));
    window.addEventListener("authChange", handleAuth);
    return () => window.removeEventListener("authChange", handleAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/how-to-use", label: "How To Use" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
        : "bg-white/70 backdrop-blur-md border-b border-transparent"
        }`}
    >
      {/*
        When sidebar is visible push the navbar content right by 256px (w-64)
        so the logo starts at the left edge of the main content area.
      */}
      <div className="flex justify-between items-center h-16 px-6">
        {/* ── Logo ── */}
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="EduPortal"
            className="h-9 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
            EduPortal
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(to)
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
            >
              {label}
            </Link>
          ))}

          {isAuth ? (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <Link
                to="/notifications"
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Bell size={18} />
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <UserCircle size={18} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pb-4 space-y-1 bg-white/95 border-t border-slate-100">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              {label}
            </Link>
          ))}
          {!isAuth && (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
