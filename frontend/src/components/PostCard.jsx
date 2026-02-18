import {
  Send,
  MessageCircle,
  Share2,
  CornerDownRight,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const PostCard = ({
  post,
  commentInputs,
  setCommentInputs,
  handleAddComment,
  highlightPost,
  highlightComment,
}) => {
  return (
    <article
      id={`post-${post.id}`}
      className={`bg-white rounded-3xl shadow-md border transition-all duration-500 ${
        highlightPost === post.id
          ? "ring-2 ring-indigo-500 bg-indigo-50"
          : ""
      }`}
    >
      <div className="p-6">
        <h4 className="font-bold text-lg">@{post.username}</h4>
        <p className="text-xs text-slate-400">
          {new Date(post.postedAt).toLocaleString()}
        </p>

        <p className="mt-3 text-slate-700">{post.content}</p>

        {post.aiReply && (
          <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600">
                DEVIKA AI
              </span>
            </div>

            <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-1 prose-headings:mt-2">
              <ReactMarkdown>
                {post.aiReply}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        {post.comments?.map((comment) => (
          <div
            key={comment.id}
            className={`flex gap-2 mb-2 transition ${
              highlightComment === comment.id
                ? "bg-yellow-100 p-2 rounded-lg"
                : ""
            }`}
          >
            <CornerDownRight size={16} />
            <div>
              <span className="text-indigo-600 text-xs font-bold">
                @{comment.username}
              </span>
              <p className="text-sm text-slate-700">
                {comment.message}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 border border-slate-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            value={commentInputs[post.id] || ""}
            onChange={(e) =>
              setCommentInputs({
                ...commentInputs,
                [post.id]: e.target.value,
              })
            }
            onKeyDown={(e) =>
              e.key === "Enter" && handleAddComment(post.id)
            }
          />
          <button
            onClick={() => handleAddComment(post.id)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <div className="px-6 py-3 border-t text-xs text-slate-400 flex gap-4">
        <div className="flex items-center gap-1">
          <MessageCircle size={14} />
          {post.comments?.length || 0} Comments
        </div>
        <button className="flex items-center gap-1 hover:text-indigo-600">
          <Share2 size={14} /> Share
        </button>
      </div>
    </article>
  );
};

export default PostCard;
