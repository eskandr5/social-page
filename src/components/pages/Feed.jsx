import { useState, useEffect, useCallback } from 'react';
import Post from '../posts/Post';
import Share from '../posts/Share';
import Rightbar from '../layout/Rightbar';
import Sidebar from '../layout/Sidebar';
import PostSkeleton from '../common/skeleton/PostSkeleton';
import ShareSkeleton from '../common/skeleton/ShareSkeleton';
import { API_URL } from '../../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // استخدام useCallback لمنع إعادة تعريف الدالة إلا عند الحاجة
  const fetchPosts = useCallback(async () => {
    try {
      // لا نجعل الـ loading true هنا لكي لا تختفي المنشورات القديمة عند التحديث (Silent Refresh)
      const response = await fetch(`${API_URL}/api/posts?sort=createdAt:desc`);
      if (!response.ok) throw new Error('فشل في جلب البيانات');
      
      const result = await response.json();
      if (result.data) setPosts(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
      {/* Sidebar ثابت - لا يختفي أثناء التحميل */}
      <div className="hidden md:block w-20 lg:w-64">
        <Sidebar />
      </div>

      {/* القسم الأوسط */}
      <div className="w-full md:w-2/3 lg:w-2/4 max-w-2xl py-6 space-y-6">
        {loading ? <ShareSkeleton /> : <Share onPostCreated={fetchPosts} />}

        <div className="space-y-6">
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchPosts}
                className="mt-4 text-purple-600 hover:underline"
              >
                حاول مرة أخرى
              </button>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id} post={post} onUpdate={fetchPosts} />
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">لا توجد منشورات حالياً.</p>
          )}
        </div>
      </div>

      {/* Rightbar ثابت */}
      <div className="hidden lg:block w-80">
        <Rightbar />
      </div>
    </div>
  );
};

export default Feed;