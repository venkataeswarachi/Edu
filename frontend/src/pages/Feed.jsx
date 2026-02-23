import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { useLocation } from "react-router-dom";
import { Rss, RefreshCw } from "lucide-react";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="skeleton w-9 h-9 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="skeleton h-2.5 w-20 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-3 w-3/5 rounded" />
    </div>
  </div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activePost, setActivePost] = useState(null);
  const [activeComment, setActiveComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const highlightPostId = location.state?.postId;
  const highlightCommentId = location.state?.commentId;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/feed");
      const sorted = res.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      setPosts(sorted);
      setError(null);
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!highlightPostId) return;
    setActivePost(highlightPostId);
    setActiveComment(highlightCommentId);
    const timer = setTimeout(() => { setActivePost(null); setActiveComment(null); }, 3000);
    const scrollTimer = setTimeout(() => {
      document.getElementById(`post-${highlightPostId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => { clearTimeout(timer); clearTimeout(scrollTimer); };
  }, [highlightPostId, highlightCommentId]);

  const handleAddComment = async (postId) => {
    const message = commentInputs[postId];
    if (!message?.trim()) return;
    await api.post(`/user/comment?pid=${postId}&message=${encodeURIComponent(message)}`);
    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Rss size={22} className="text-indigo-500" />
              Explore Feed
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Discover posts from your community</p>
          </div>
          <button
            onClick={fetchPosts}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:border-indigo-200 transition-all"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-100 shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-600 mb-4 font-medium">{error}</p>
            <button
              onClick={fetchPosts}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400 font-medium">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                commentInputs={commentInputs}
                setCommentInputs={setCommentInputs}
                handleAddComment={handleAddComment}
                highlightPost={activePost}
                highlightComment={activeComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
