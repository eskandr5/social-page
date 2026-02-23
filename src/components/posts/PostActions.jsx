import React from 'react';
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { API_URL } from '../../api';

const PostActions = ({ post, isLikedByMe, isLiking, onLike, onToggleComments, showComments }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // دالة معالجة الإعجاب (Like Logic)
  const handleLikeClick = async () => {
    if (isLiking) return;
    
    // نمرر الحالة للمكون الأب لكي يبدأ الـ Loading
    onLike(true); 

    try {
      const userId = user.documentId || user.id;
      const postDocId = post.documentId;

      // 1. التحقق من وجود اللايك
      const checkResponse = await fetch(
        `${API_URL}/api/likes?filters[user][documentId][$eq]=${userId}&filters[post][documentId][$eq]=${postDocId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const checkData = await checkResponse.json();

      // 2. إذا كان موجود (عملية Unlike)
      if (checkData.data && checkData.data.length > 0) {
        const likeDocId = checkData.data[0].documentId;
        await fetch(`${API_URL}/api/likes/${likeDocId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } 
      // 3. إذا لم يكن موجود (عملية Like)
      else {
        await fetch(`${API_URL}/api/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: { post: postDocId, user: userId }
          }),
        });
      }

      // 4. إخبار المكون الأب بتحديث البيانات
      onLike(false, true); 

    } catch (error) {
      console.error("Like Error:", error);
      onLike(false);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-6">
      {/* زر الإعجاب */}
      <button
        onClick={handleLikeClick}
        disabled={isLiking}
        className={`flex items-center gap-2 transition-all active:scale-125 ${
          isLikedByMe ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
        }`}
      >
        {isLikedByMe ? (
          <AiFillHeart className="text-2xl animate-in zoom-in duration-200" />
        ) : (
          <AiOutlineHeart className="text-2xl" />
        )}
        <span className="text-sm font-bold">{post.likes?.length || 0}</span>
      </button>

      {/* زر التعليقات */}
      <button
        onClick={onToggleComments}
        className={`flex items-center gap-2 transition-colors ${
          showComments ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
        }`}
      >
        <AiOutlineComment className="text-2xl" />
        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
      </button>
    </div>
  );
};

export default PostActions;