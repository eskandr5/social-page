import { useState } from 'react';
import { AiOutlineSend } from "react-icons/ai";
import { API_URL } from '../../api';

const CommentSection = ({ show, post, user, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  // دالة إضافة تعليق
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            content: commentText,
            user: user.id,
            post: post.id 
          }
        }),
      });

      if (response.ok) {
        setCommentText("");
        onUpdate(); // تحديث المنشور لجلب التعليق الجديد
      }
    } catch (error) {
      console.error("Comment Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // إذا كانت حالة العرض (show) خاطئة، لا ترندر شيئاً
  if (!show) return null;

  return (
    <div className="bg-gray-50 border-t border-gray-100 transition-all duration-300">
      <div className="px-4 py-4">
        
        {/* قائمة التعليقات */}
        <div className="space-y-4 mb-4">
          {post.comments?.length > 0 ? (
            post.comments.map((comm) => {
              const displayName = comm.user?.username || "User";
              const initial = displayName[0].toUpperCase();

              return (
                <div key={comm.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {initial}
                  </div>
                  <div className="flex flex-col max-w-[85%]">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-blue-600 mb-1">{displayName}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{comm.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-gray-400 py-2">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* حقل كتابة تعليق */}
        <form 
          onSubmit={handleAddComment} 
          className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all shadow-sm"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="grow bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-all active:scale-95 shadow-md flex items-center justify-center"
          >
            <AiOutlineSend size={18} className={isSubmitting ? "animate-pulse" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;