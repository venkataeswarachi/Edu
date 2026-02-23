import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { BellRing, CheckCircle2, MessageSquare, Sparkles, Loader2 } from "lucide-react";

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    api.get("/user/notifications")
      .then((res) => { setNotifs(res.data); setLoading(false); })
      .catch(() => { setError("Failed to load notifications."); setLoading(false); });
  }, [navigate]);

  const handleClick = (n) => {
    navigate("/feed", { state: { postId: n.pid, commentId: n.cid } });
  };

  const colors = [
    "from-indigo-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-teal-600",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <BellRing size={22} className="text-indigo-500" />
              Activity
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Stay updated with your network</p>
          </div>
          {!loading && notifs.length > 0 && (
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
              <Sparkles size={12} />
              {notifs.length} new
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={30} className="text-indigo-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Reload
            </button>
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellRing size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-400">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifs.map((n, idx) => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`group flex items-start gap-4 bg-white border border-slate-100 p-4 rounded-2xl cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200 animate-fade-up stagger-${Math.min(idx + 1, 5)}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <MessageSquare size={17} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{n.message}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 mt-0.5">Now</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                      Post #{n.pid}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Delivered
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
