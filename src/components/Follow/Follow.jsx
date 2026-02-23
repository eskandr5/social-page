import { useState, useEffect } from 'react';
import { API_URL } from '../../api';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai'; // استيراد الأيقونات

const Follow = ({ targetUserId, targetUserName, variant = "text" }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/users/me?populate=following`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const followingIds = data.following?.map(u => u.id) || [];
        setIsFollowing(followingIds.includes(targetUserId));
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id && storedUser.id !== targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, token]);

  const toggleFollow = async (e) => {
    // نستخدم e.stopPropagation لمنع الضغط على العناصر الأب (مثل الـ div في الـ Rightbar)
    e.stopPropagation();

    if (loading) return;
    
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser?.id;

    if (!userId) {
        alert("Please login again");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/me?populate=following`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      let currentFollowingIds = data.following?.map(u => u.id) || [];

      let updatedFollowing;
      if (isFollowing) {
        updatedFollowing = currentFollowingIds.filter(id => id !== targetUserId);
      } else {
        updatedFollowing = [...currentFollowingIds, targetUserId];
      }

      const updateRes = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ following: updatedFollowing })
      });

      if (updateRes.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (!storedUser?.id || storedUser.id === targetUserId) return null;

  // --- النمط الأول: شكل الأيقونة للـ Rightbar ---
  if (variant === "icon") {
    return (
      <button
        onClick={toggleFollow}
        disabled={loading}
        className={`p-1.5 rounded-full transition-all shadow-md shrink-0 active:scale-90 ${
          isFollowing 
          ? 'bg-gray-100 text-gray-400 shadow-none' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
           <span className="text-[10px]">...</span>
        ) : isFollowing ? (
          <AiOutlineCheck size={16} />
        ) : (
          <AiOutlinePlus size={16} />
        )}
      </button>
    );
  }

  // --- النمط الثاني: الشكل الافتراضي (نص) للبروفايل ---
  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${
        isFollowing 
        ? 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default Follow;