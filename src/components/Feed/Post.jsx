import { useState, useEffect } from 'react';
import { AiOutlineHeart, AiOutlineComment, AiOutlineSend, AiFillHeart, AiOutlineDelete } from "react-icons/ai";
import { API_URL } from '../../api';
import Follow from '../follow/Follow';

const Post = ({ post, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const authorName = post.user?.username || "Anonymous";
  const imageUrl = post.image?.url ? post.image.url : null;
  // دالة إضافة تعليق
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

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
            post: post.id // نربط التعليق بهذا البوست
          }
        }),
      });

      if (response.ok) {
        setCommentText(""); // تفريغ الحقل
        onUpdate(); // تحديث الـ Feed لجلب التعليق الجديد
      }
    } catch (error) {
      console.error("Comment Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("Post Likes Data:", post.likes);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const userId = user.documentId || user.id;
      const postDocId = post.documentId;

      // الخطوة 1: التحقق هل اللايك موجود في جدول الـ likes
      const checkResponse = await fetch(
        `${API_URL}/api/likes?filters[user][documentId][$eq]=${userId}&filters[post][documentId][$eq]=${postDocId}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const checkData = await checkResponse.json();

      // الخطوة 2: إذا كان موجود (عملية Unlike)
      if (checkData.data && checkData.data.length > 0) {
        const likeDocId = checkData.data[0].documentId;

        await fetch(`${API_URL}/api/likes/${likeDocId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      // الخطوة 3: إذا لم يكن موجود (عملية Like)
      else {
        await fetch(`${API_URL}/api/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              post: postDocId,
              user: userId
            }
          }),
        });
      }

      // الخطوة 4: تحديث الواجهة
      onUpdate();

    } catch (error) {
      console.error("Like Error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // دالة للتحقق هل أنا معجب بهذا البوست أم لا
  const checkIfLiked = async () => {
    const userId = user.documentId || user.id;
    const postDocId = post.documentId;

    try {
      const response = await fetch(
        `${API_URL}/api/likes?filters[user][documentId][$eq]=${userId}&filters[post][documentId][$eq]=${postDocId}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const result = await response.json();
      // إذا كانت المصفوفة فيها بيانات، يعني أنا مسوي لايك
      setIsLikedByMe(result.data && result.data.length > 0);
    } catch (error) {
      console.error("Error checking like status", error);
    }
  };

  // تشغيل الفحص عند ظهور البوست
  useEffect(() => {
    checkIfLiked();
  }, [post.likes]); // سيعيد الفحص إذا تغيرت مصفوفة اللايكات

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${API_URL}/api/posts/${post.documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onUpdate(); // تحديث القائمة بعد الحذف
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };
  // هذه الوظيفة تنفذ الحذف الحقيقي عند الضغط على "تأكيد" داخل المودال
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${post.documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteModal(false); // أغلق النافذة
        onUpdate(); // تحديث القائمة
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {/* تأكدنا من وجود الاسم قبل أخذ أول حرف */}
            {(post.user?.username || "U")[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-800">{post.user?.username || "Unknown User"}</h4>

              {/* استدعاء مكون المتابعة فقط إذا وجد المستخدم وليس هو أنا */}
              {post.user && post.user.id !== user.id && (
                <Follow
                  targetUserId={post.user.id}
                  targetUserName={post.user.username}
                />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </span>
          </div>
        </div>

        {/* زر الحذف */}
        {(post.user?.documentId === user.documentId || post.user?.id === user.id) && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Delete Post"
          >
            <AiOutlineDelete size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Image if exists */}
      {imageUrl && (
        <img src={imageUrl} alt="Post" className="w-full object-cover max-h-96" />
      )}

      {/* Actions (Likes & Comments) */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-6">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 transition-all active:scale-125 ${isLikedByMe ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
        >
          {isLikedByMe ? <AiFillHeart className="text-2xl" /> : <AiOutlineHeart className="text-2xl" />}
          <span className="text-sm font-bold">{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
            }`}
        >
          <AiOutlineComment className="text-2xl" />
          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* قسم التعليقات */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showComments ? 'max-h-1000px opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="bg-gray-50 px-4 py-4">
          <div className="space-y-4 mb-4">
            {post.comments?.map((comm) => {
              const isMyComment = (comm.user?.id === user.id || comm.user === user.id);
              const displayName = comm.user?.username || (isMyComment ? user.username : "User");

              return (
                <div key={comm.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                    {displayName[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                      <p className="text-xs font-bold text-blue-600 mb-1">{displayName}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{comm.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* حقل كتابة تعليق */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-gray-200 focus-within:border-blue-400 transition-all shadow-sm">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="grow bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button
              disabled={isSubmitting || !commentText.trim()}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-md"
            >
              <AiOutlineSend size={18} />
            </button>
          </form>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* الخلفية المظلمة مع تأثير الـ Blur */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          ></div>

          {/* جسم النافذة */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              {/* أيقونة تحذير دائرية */}
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">Delete Post?</h3>
              <p className="text-gray-500 text-sm mb-8">
                This action cannot be undone. This will permanently delete your post and all its data.
              </p>

              {/* الأزرار */}
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-shadow shadow-lg shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default Post;