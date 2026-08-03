import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { API_URL } from "../../api";

const PostActions = ({
  post,
  isLikedByMe,
  isLiking,
  onLike,
  onToggleComments,
  showComments,
}) => {
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setLikesCount(post.likes?.length || 0);
  }, [post.likes]);

  // دالة معالجة الإعجاب (Like Logic)
  const handleLikeClick = async () => {
    if (isLiking) return;

    const isCurrentlyLiked = isLikedByMe;
    const oldLikesCount = likesCount;
    const newLikesCount = isCurrentlyLiked
      ? oldLikesCount - 1
      : oldLikesCount + 1;

    // تحديث سريع (Optimistic UI)
    setLikesCount(newLikesCount);
    onLike(true, false, true);

    try {
      const userId = user.documentId || user.id;
      const postDocId = post.documentId;

      const checkResponse = await fetch(
        `${API_URL}/api/likes?filters[user][documentId][$eq]=${userId}&filters[post][documentId][$eq]=${postDocId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const checkData = await checkResponse.json();

      if (checkData.data && checkData.data.length > 0) {
        const likeDocId = checkData.data[0].documentId;
        await fetch(`${API_URL}/api/likes/${likeDocId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`${API_URL}/api/likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: { post: postDocId, user: userId },
          }),
        });
      }

      onLike(false, true);
    } catch (error) {
      console.error("Like Error:", error);
      setLikesCount(oldLikesCount);
      onLike(false, false, true);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-6">
      {/* زر الإعجاب */}
      <button
        onClick={handleLikeClick}
        disabled={isLiking}
        className={`flex items-center gap-2 transition-all active:scale-125 cursor-pointer disabled:cursor-pointer ${
          isLikedByMe ? "text-red-500" : "text-gray-600 hover:text-red-500"
        }`}
      >
        {isLikedByMe ? (
          <AiFillHeart className="text-2xl animate-in zoom-in duration-200" />
        ) : (
          <AiOutlineHeart className="text-2xl" />
        )}
        <span className="text-sm font-bold">{likesCount}</span>
      </button>

      {/* زر التعليقات */}
      <button
        onClick={onToggleComments}
        className={`flex items-center gap-2 transition-colors cursor-pointer ${
          showComments ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }`}
      >
        <AiOutlineComment className="text-2xl" />
        <span className="text-sm font-medium">
          {post.comments?.length || 0}
        </span>
      </button>
    </div>
  );
};

export default PostActions;
