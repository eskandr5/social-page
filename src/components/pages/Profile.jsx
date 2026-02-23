import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import Rightbar from '../layout/Rightbar';
import Post from '../posts/Post';
import { API_URL } from '../../api';
import ProfileSkeleton from '../common/skeleton/ProfileSkeleton';
import FollowListModal from '../common/FollowListModal'; 
import { AiOutlineCalendar, AiOutlineCamera } from 'react-icons/ai';

const Profile = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showFollowList, setShowFollowList] = useState(false);
    const [listType, setListType] = useState(""); 
    
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const token = localStorage.getItem('token');
    const [bio, setBio] = useState(userData?.bio || "");
    const [uploading, setUploading] = useState(false);

    // دالة لتصحيح رابط الصورة
    const getAvatarUrl = (avatar) => {
        if (!avatar) return null;
        const url = avatar.url;
        // إذا كان الرابط يبدأ بـ http فهذا يعني أنه مخزن على Cloudinary ولا يحتاج لـ API_URL
        return url.startsWith('http') ? url : `${API_URL}${url}`;
    };

    const fetchProfileData = useCallback(async () => {
        if (!token) return;
        try {
            const userRes = await fetch(`${API_URL}/api/users/me?populate=*`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const fullData = await userRes.json();

            const postsRes = await fetch(
                `${API_URL}/api/posts?filters[user][id][$eq]=${fullData.id}&sort=createdAt:desc&populate=*`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const postsResult = await postsRes.json();

            setUserData(fullData);
            setMyPosts(postsResult.data || []);
            localStorage.setItem('user', JSON.stringify(fullData));
            if (fullData.bio) setBio(fullData.bio);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('files', file);

        try {
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const uploadedFiles = await uploadRes.json();
            
            await fetch(`${API_URL}/api/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ avatar: uploadedFiles[0].id })
            });
            fetchProfileData();
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users/${userData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ bio: bio })
            });
            if (res.ok) {
                setIsEditing(false);
                fetchProfileData();
            }
        } catch (error) {
            alert("Update failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
            <div className="hidden md:block w-64 mt-6"><Sidebar /></div>

            <div className="w-full md:w-[600px] py-6">
                {loading ? (
                    <ProfileSkeleton />
                ) : userData && (
                    <>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                            <div className="px-6 pb-6">
                                <div className="relative flex justify-between items-end -mt-12 mb-4">
                                    <div className="relative group">
                                        <div className="w-24 h-24 bg-blue-600 border-4 border-white rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                                            {userData.avatar ? (
                                                <img 
                                                    src={getAvatarUrl(userData.avatar)} 
                                                    alt="avatar" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <span>{userData.username?.[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                            <AiOutlineCamera size={24} />
                                            <input type="file" hidden onChange={handleAvatarChange} disabled={uploading} />
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-gray-50 border hover:bg-gray-100 text-gray-800'}`}
                                    >
                                        {isEditing ? "Save" : "Edit Profile"}
                                    </button>
                                </div>

                                <h2 className="text-2xl font-black text-gray-800">{userData.username}</h2>
                                <p className="text-blue-600 text-sm font-bold">@{userData.username?.toLowerCase()}</p>

                                <div className="mt-4">
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed">{userData.bio || "No bio yet."}</p>
                                    )}
                                </div>

                                <div className="flex gap-6 mt-6 border-t pt-4">
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-gray-800">{myPosts.length}</span>
                                        <span className="text-gray-500 text-sm font-medium">Posts</span>
                                    </div>
                                    <div className="flex gap-1 items-center cursor-pointer hover:text-blue-600 transition" onClick={() => { setListType("following"); setShowFollowList(true); }}>
                                        <span className="font-bold text-gray-800">{userData.following?.length || 0}</span>
                                        <span className="text-gray-500 text-sm font-medium">Following</span>
                                    </div>
                                    <div className="flex gap-1 items-center cursor-pointer hover:text-blue-600 transition" onClick={() => { setListType("followers"); setShowFollowList(true); }}>
                                        <span className="font-bold text-gray-800">{userData.followers?.length || 0}</span>
                                        <span className="text-gray-500 text-sm font-medium">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {myPosts.map((post) => (
                                <Post key={post.id} post={post} onUpdate={fetchProfileData} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="hidden lg:block w-80 mt-6"><Rightbar /></div>

            {/* استدعاء المودال بالبروبس الصحيحة */}
            {showFollowList && (
                <FollowListModal 
                    type={listType} 
                    data={userData[listType] || []} 
                    onClose={() => setShowFollowList(false)} 
                />
            )}
        </div>
    );
};

export default Profile;