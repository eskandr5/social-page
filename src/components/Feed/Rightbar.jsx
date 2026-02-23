import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
// استيراد المكون الجديد
import Follow from '../follow/Follow';

const Rightbar = () => {
  const [users, setUsers] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id || !token) {
        setLoading(false);
        return;
      }
      try {
        const meRes = await fetch(`${API_URL}/api/users/me?populate=following`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        setMyFollowing(meData.following || []);

        const usersRes = await fetch(`${API_URL}/api/users?filters[id][$ne]=${currentUser.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Rightbar Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, currentUser?.id]);

  const isFollowing = (userId) => {
    return myFollowing.some(u => u.id === userId);
  };

  const suggestions = users.filter(user => !isFollowing(user.id));

  if (!currentUser) return <div className="hidden lg:block w-80"></div>;

  return (
    <div className="hidden lg:block w-80 h-screen sticky top-20 p-4 space-y-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-bold text-gray-800 mb-4 px-2">Who to follow</h4>
        <div className="space-y-4">

          {!loading && suggestions.slice(0, visibleCount).map((user) => (
            <div key={user.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                  {user?.username ? user.username[0].toUpperCase() : "?"}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate w-32">
                    {user?.username || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500">Suggested for you</p>
                </div>
              </div>

              {/* التعديل هنا: استبدلنا الـ button بمكون الـ Follow */}
              <div className="shrink-0">
                <Follow
                  targetUserId={user.id}
                  targetUserName={user.username}
                  variant="icon"
                />
              </div>

            </div>
          ))}

          {loading && <p className="text-center text-xs text-gray-400 italic">Loading suggestions...</p>}
          {!loading && suggestions.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4">No new suggestions</p>
          )}
        </div>

        {!loading && suggestions.length > visibleCount && (
          <button
            onClick={() => setVisibleCount(prev => prev + 3)}
            className="w-full text-blue-600 text-xs font-bold mt-4 hover:bg-blue-50 py-2 rounded-lg transition-colors border-t border-gray-50 pt-3"
          >
            Show more
          </button>
        )}
      </div>

      {/* قسم الترند كما هو */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-bold text-gray-800 mb-4 px-2">What's happening</h4>
        <div className="space-y-5">
          {[
            { tag: "#ReactJS", posts: "12.5K posts" },
            { tag: "#Strapi", posts: "8.2K posts" },
            { tag: "#WebDev", posts: "25K posts" }
          ].map((trend, index) => (
            <div key={index} className="px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trending in Tech</p>
              <p className="text-sm font-bold text-gray-800">{trend.tag}</p>
              <p className="text-xs text-gray-400">{trend.posts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;