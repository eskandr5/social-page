import { useState, useEffect } from 'react';
import { API_URL } from '../../api';
import PostHeader from './PostHeader'; // مكون جديد
import PostActions from './PostActions'; // مكون جديد
import CommentSection from './CommentSection'; // مكون جديد
import DeleteModal from '../common/DeleteModal'; // مكون عام

const Post = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false); // حالة التحميل للايك  
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  // const imageUrl = post.image?.url || null;

  const imageUrl = post.image?.url
    ? (post.image.url.startsWith('http') ? post.image.url : `${API_URL}${post.image.url}`)
    : null;
  // هذه هي الدالة التي سنمررها للابن (PostActions)
  const handleLikeUpdate = (loadingStatus, shouldRefresh = false) => {
    setIsLiking(loadingStatus);
    if (shouldRefresh) {
      onUpdate(); // تحديث البيانات من السيرفر بعد انتهاء اللايك
    }
  };
  // دالة فحص الإعجاب (حسنتُها لتقليل الطلبات)
  const checkIfLiked = async () => {
    const userId = user.documentId || user.id;
    try {
      const response = await fetch(
        `${API_URL}/api/likes?filters[user][documentId][$eq]=${userId}&filters[post][documentId][$eq]=${post.documentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const result = await response.json();
      setIsLikedByMe(result.data && result.data.length > 0);
    } catch (error) {
      console.error("Error checking like status", error);
    }
  };

  useEffect(() => {
    checkIfLiked();
  }, [post.likes]);
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${post.documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteModal(false); // إغلاق النافذة بعد الحذف
        onUpdate(); // تحديث الصفحة (Feed) لإزالة المنشور من القائمة
      } else {
        alert("حدث خطأ أثناء محاولة الحذف");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("لا يمكن الاتصال بالسيرفر حالياً");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      {/* 1. رأس المنشور */}
      <PostHeader
        post={post}
        user={user}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      {/* 2. المحتوى النصي والصورة */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>
      {/* {imageUrl && (
        <img src={imageUrl} alt="Post" className="w-full object-cover max-h-96" />
      )} */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="post content"
          className="w-full max-h-[500px] object-contain bg-gray-50 block mx-auto"
        />
      )}
      {/* 3. أزرار التفاعل */}
      <PostActions
        post={post}
        isLikedByMe={isLikedByMe}
        isLiking={isLiking} // نمرر الحالة
        onLike={handleLikeUpdate} // نمرر الدالة الصحيحة هنا
        onToggleComments={() => setShowComments(!showComments)}
        showComments={showComments}
      />

      {/* 4. قسم التعليقات */}
      <CommentSection
        show={showComments}
        post={post}
        user={user}
        onUpdate={onUpdate}
      />

      {/* 5. نافذة الحذف */}
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};
export default Post;