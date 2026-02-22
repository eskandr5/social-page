import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { AiOutlinePlus } from 'react-icons/ai';

const Rightbar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات مع حماية ضد null/undefined
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      // حاجز حماية: لا تطلب البيانات إذا لم يكن هناك مستخدم أو توكن
      if (!currentUser?.id || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users?filters[id][$ne]=${currentUser.id}&limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // نتأكد أن البيانات مصفوفة قبل التحديث
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // نعتمد على التوكن للتحديث

  // إذا لم يكن هناك مستخدم، لا تظهر الـ Rightbar لتوفير مساحة وتجنب الأخطاء
  if (!currentUser) return <div className="hidden lg:block w-80"></div>;

  return (
    <div className="hidden lg:block w-80 h-screen sticky top-20 p-4 space-y-6">

      {/* قسم اقتراحات المتابعة */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-bold text-gray-800 mb-4 px-2">Who to follow</h4>
        <div className="space-y-4">
          {!loading && users.map((user) => (
            <div key={user.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {/* حماية إضافية للـ username */}
                  {user?.username ? user.username[0].toUpperCase() : "?"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{user?.username || "User"}</p>
                  <p className="text-[10px] text-gray-500">Suggested for you</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-all shadow-md">
                <AiOutlinePlus size={16} />
              </button>
            </div>
          ))}
          {loading && <p className="text-center text-xs text-gray-400">Loading suggestions...</p>}
        </div>
        <button className="w-full text-blue-600 text-xs font-bold mt-4 hover:underline">
          Show more
        </button>
      </div>

      {/* قسم الترند */}
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