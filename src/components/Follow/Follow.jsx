import { useState, useEffect } from 'react';
import { API_URL } from '../../api';

const Follow = ({ targetUserId, targetUserName }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // نقل جلب البيانات إلى داخل الدالة لضمان قراءة أحدث قيمة دائماً
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

    // جلب المستخدم الحالي من localStorage داخل الـ useEffect لضمان الدقة
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id && storedUser.id !== targetUserId) {
      checkFollowStatus();
    }
  }, [targetUserId, token]);

  const toggleFollow = async () => {
    if (loading) return;
    
    // قراءة البيانات في لحظة الضغط على الزر لتجنب الـ undefined
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser?.id;

    if (!userId) {
        alert("Please login again");
        return;
    }

    setLoading(true);

    try {
      // 1. جلب القائمة الحالية
      const res = await fetch(`${API_URL}/api/users/me?populate=following`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      let currentFollowingIds = data.following?.map(u => u.id) || [];

      // 2. تحديث القائمة
      let updatedFollowing;
      if (isFollowing) {
        updatedFollowing = currentFollowingIds.filter(id => id !== targetUserId);
      } else {
        updatedFollowing = [...currentFollowingIds, targetUserId];
      }

      // 3. إرسال التحديث (استخدام userId المحمي)
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
      } else {
        console.error("Server refused update");
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // حماية إضافية قبل الرسم (Render)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (!storedUser?.id || storedUser.id === targetUserId) return null;

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