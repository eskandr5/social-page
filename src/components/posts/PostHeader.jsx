import React from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import Follow from '../follow/Follow';

const PostHeader = ({ post, user, onDeleteClick }) => {
  // استخراج البيانات لتسهيل القراءة
  const author = post.user || {};
  const username = author.username || "Unknown User";
  const initial = username[0].toUpperCase();
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleString() : "";

  // التحقق من ملكية المنشور لإظهار زر الحذف
  const isOwner = author.documentId === user.documentId || author.id === user.id;

  return (
    <div className="flex justify-between items-start p-4">
      <div className="flex items-center gap-3">
        {/* Avatar الشخصي */}
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
          {initial}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors">
              {username}
            </h4>

            {/* زر المتابعة: يظهر فقط إذا لم يكن هذا منشوري الشخصي */}
            {author.id && author.id !== user.id && (
              <Follow
                targetUserId={author.id}
                targetUserName={username}
              />
            )}
          </div>
          
          <span className="text-[11px] text-gray-400 font-medium">
            {postDate}
          </span>
        </div>
      </div>

      {/* زر الحذف للمالك فقط */}
      {isOwner && (
        <button
          onClick={onDeleteClick}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-full"
          title="Delete Post"
        >
          <AiOutlineDelete size={20} />
        </button>
      )}
    </div>
  );
};

export default PostHeader;