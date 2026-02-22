import { useState, useEffect } from 'react';
import Post from '../Feed/Post';
import Share from '../Feed/Share';
import Rightbar from '../Feed/Rightbar';
import Sidebar from '../Feed/Sidebar';
import { API_URL } from '../../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts?sort=createdAt:desc`);
      const result = await response.json();
      if (result.data) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
      <div className="hidden md:block w-20 lg:w-64">
        <Sidebar />
      </div>
      {/* القسم الأوسط: يحتوي على Share والمنشورات */}
      <div className="w-full md:w-2/3 lg:w-2/4 max-w-2xl py-6 space-y-6">
        <Share onPostCreated={fetchPosts} />

        <div className="space-y-6">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading posts...</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onUpdate={fetchPosts}
              />
            ))
          )}
        </div>
      </div>

      {/* القسم الجانبي: Rightbar */}
      <div className="hidden lg:block w-80">
        <Rightbar />
      </div>

    </div>
  );
};

export default Feed;