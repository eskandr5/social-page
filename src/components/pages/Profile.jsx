import { useState, useEffect } from 'react';
import Sidebar from '../Feed/Sidebar';
import Rightbar from '../Feed/Rightbar';
import Post from '../Feed/Post';
import { API_URL } from '../../api';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';
import { AiOutlineCalendar, AiOutlineCamera } from 'react-icons/ai';

const Profile = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showFollowList, setShowFollowList] = useState(false);
    const [listType, setListType] = useState(""); // "followers" or "following"
    // 1. أمان إضافي عند قراءة البيانات لأول مرة
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const token = localStorage.getItem('token');
    const [bio, setBio] = useState(userData?.bio || "");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userData?.id || !token) return;

            try {
                // 1. جلب بيانات المستخدم الأساسية فقط (بدون populate معقد)
                const userRes = await fetch(`${API_URL}/api/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const basicInfo = await userRes.json();

                // 2. جلب المتابعين والمتابعين (بطلبات منفصلة بسيطة)
                // سنجلب فقط الـ count أو المصفوفة بشكل مباشر
                const followingRes = await fetch(`${API_URL}/api/users/me?populate=following`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const followingData = await followingRes.json();

                const followersRes = await fetch(`${API_URL}/api/users/me?populate=followers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const followersData = await followersRes.json();

                // 3. دمج البيانات يدوياً
                const fullData = {
                    ...basicInfo,
                    following: followingData.following || [],
                    followers: followersData.followers || [],
                    avatar: basicInfo.avatar // سيعمل إذا كان الـ avatar حقل بسيط
                };

                setUserData(fullData);
                localStorage.setItem('user', JSON.stringify(fullData));
                if (fullData.bio) setBio(fullData.bio);

                // 4. جلب المنشورات
                const postsRes = await fetch(
                    `${API_URL}/api/posts?filters[user][id][$eq]=${userData.id}&sort=createdAt:desc&populate=*`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const postsResult = await postsRes.json();
                setMyPosts(postsResult.data || []);

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);
    // دالة تحديث الصورة الشخصية
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
            const avatarId = uploadedFiles[0].id;

            const updateRes = await fetch(`${API_URL}/api/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar: avatarId })
            });

            if (updateRes.ok) window.location.reload();
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // دالة تحديث الـ Bio
    const handleSaveProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bio: bio }) // تأكد من مطابقة اسم الحقل في Strapi
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUserData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
            } else {
                const errorData = await res.json();
                console.error("Server Error 400:", errorData);
                alert("Update failed. Check if 'bio' field exists in Strapi.");
            }
        } catch (error) {
            alert("Failed to connect to server");
        }
    };

    // 2. حاجز حماية لمنع الخطأ (Cannot read properties of null)
    if (!userData) {
        return <div className="flex justify-center items-center h-screen">Loading Profile...</div>;
    }
    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <ProfileSkeleton />

            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
            <div className="hidden md:block w-64">
                <Sidebar />
            </div>

            <div className="w-full md:w-600px py-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="h-32 bg-linear-to-r from-blue-400 to-indigo-600"></div>

                    <div className="px-6 pb-6">
                        <div className="relative flex justify-between items-end -mt-12 mb-4">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                                    {userData.avatar ? (
                                        <img
                                            src={`${API_URL}${userData.avatar.url}`}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {(userData.username ? userData.username[0] : "U").toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <AiOutlineCamera size={24} />
                                    <input type="file" hidden onChange={handleAvatarChange} disabled={uploading} />
                                </label>
                            </div>

                            <button
                                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${isEditing ? 'bg-green-600 text-white' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {isEditing ? "Save Changes" : "Edit Profile"}
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-800">{userData.username}</h2>
                            <p className="text-gray-500 text-sm">@{userData.username?.toLowerCase()}</p>
                        </div>

                        <div className="mt-3">
                            {isEditing ? (
                                <textarea
                                    className="w-full p-2 border rounded-xl text-sm outline-blue-500"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Write something about yourself..."
                                />
                            ) : (
                                <p className="text-gray-700 text-sm leading-relaxed">{userData.bio || "No bio yet."}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                                <AiOutlineCalendar size={18} />
                                <span>Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-6 border-t pt-4">
                            <div className="flex gap-1 items-center">
                                <span className="font-bold text-gray-800">{myPosts?.length || 0}</span>
                                <span className="text-gray-500 text-sm">Posts</span>
                            </div>
                            <div
                                className="flex gap-1 items-center cursor-pointer hover:underline"
                                onClick={() => { setListType("following"); setShowFollowList(true); }}
                            >
                                <span className="font-bold text-gray-800">
                                    {Array.isArray(userData.following) ? userData.following.length : 0}
                                </span>
                                <span className="text-gray-500 text-sm">Following</span>
                            </div>

                            <div
                                className="flex gap-1 items-center cursor-pointer hover:underline"
                                onClick={() => { setListType("followers"); setShowFollowList(true); }}
                            >
                                <span className="font-bold text-gray-800">
                                    {Array.isArray(userData.followers) ? userData.followers.length : 0}
                                </span>
                                <span className="text-gray-500 text-sm">Followers</span>
                            </div>
                            {showFollowList && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                                        {/* Header */}
                                        <div className="p-4 border-b flex justify-between items-center">
                                            <h3 className="font-black text-xl capitalize">{listType}</h3>
                                            <button
                                                onClick={() => setShowFollowList(false)}
                                                className="p-2 hover:bg-gray-100 rounded-full transition"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* List Content */}
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {userData[listType]?.length > 0 ? (
                                                userData[listType].map((person) => (
                                                    <div key={person.id} className="flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                                {person.username?.[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition cursor-pointer">
                                                                    {person.username}
                                                                </p>
                                                                <p className="text-xs text-gray-500">@{person.username?.toLowerCase()}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-full border border-blue-600 transition">
                                                            View Profile
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center py-10 text-gray-400 italic">No {listType} yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-bold text-xl text-gray-800 px-2">My Posts</h3>
                    {loading ? (
                        <p className="text-center text-gray-500 py-10">Loading...</p>
                    ) : myPosts.length > 0 ? (
                        myPosts.map((post) => (
                            <Post key={post.id} post={post} onUpdate={() => window.location.reload()} />
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-400 italic">No posts yet.</p>
                    )}
                </div>
            </div>

            <div className="hidden lg:block w-80">
                <Rightbar />
            </div>
        </div>
    );
};

export default Profile;