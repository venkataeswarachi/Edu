import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { Sparkles, Plus, PenSquare, Loader2 } from "lucide-react";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [askAI, setAskAI] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchMyPosts();
  }, [navigate]);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/user/posts");
      const sorted = res.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      setPosts(sorted);
      setError(null);
    } catch {
      setError("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const res = await api.post("/user/create-post", { content, mentions: askAI });
      setPosts((prev) => [res.data, ...prev]);
      setContent("");
      setAskAI(false);
      setError(null);
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (postId) => {
    const message = commentInputs[postId];
    if (!message?.trim()) return;
    await api.post(`/user/comment?pid=${postId}&message=${encodeURIComponent(message)}`);
    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchMyPosts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <PenSquare size={22} className="text-indigo-500" />
            My Posts
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Share your thoughts with the community</p>
        </div>

        {/* Composer */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <textarea
            className="w-full rounded-xl p-4 bg-slate-50 border border-slate-200 resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="What's on your mind? Share an insight, question, or update…"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setAskAI((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${askAI
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              <Sparkles size={13} className={askAI ? "animate-spin-slow" : ""} />
              {askAI ? "DEVIKA will reply ✨" : "Ask DEVIKA"}
            </button>

            <button
              onClick={handleCreatePost}
              disabled={posting || !content.trim()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
            >
              {posting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={30} className="text-indigo-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-400 font-medium">No posts yet. Share your first thought!</p>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
