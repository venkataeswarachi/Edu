import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="ml-64 bg-white border-t border-slate-200">
    <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="EduPortal" className="h-7 w-auto object-contain rounded-md" />
        <span className="text-slate-300 text-xs">•</span>
        <span className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved</span>
      </div>
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
        <Link to="/how-to-use" className="hover:text-indigo-600 transition-colors">Guide</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
