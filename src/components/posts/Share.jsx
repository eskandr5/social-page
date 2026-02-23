import { useState, useRef } from 'react';
import { IoMdImages, IoMdClose } from "react-icons/io";
import { API_URL } from '../../api';

const Share = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    // جلب بيانات المستخدم بأمان
    const getUserData = () => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleShare = async () => {
        const user = getUserData();
        if (!content.trim() && !image) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            let uploadedImageId = null;

            // الخطوة الأولى: رفع الصورة إذا وجدت
            if (image) {
                const imageFormData = new FormData();
                imageFormData.append('files', image);

                const uploadRes = await fetch(`${API_URL}/api/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: imageFormData
                });

                if (uploadRes.ok) {
                    const uploadResult = await uploadRes.json();
                    uploadedImageId = uploadResult[0].id; // حفظ معرف الصورة المرفوعة
                }
            }

            // الخطوة الثانية: إنشاء المنشور وربطه بالصورة
            const postData = {
                data: {
                    content: content,
                    user: user.id,
                    image: uploadedImageId, // ربط الـ ID مباشرة بالحقل
                    publishedAt: new Date().toISOString()
                }
            };

            const response = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                setContent("");
                setImage(null);
                setPreview(null);
                if (onPostCreated) onPostCreated();
            }

        } catch (error) {
            console.error("Error:", error);
            alert("حدث خطأ أثناء النشر");
        } finally {
            setLoading(false);
        }
    };

    const user = getUserData();

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {/* التعديل الجوهري هنا لمنع الانهيار */}
                    {user?.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-gray-100 rounded-full py-3 px-5 outline-none text-gray-700 focus:bg-gray-200 transition-all"
                />
            </div>

            {preview && (
                <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-100">
                    <button
                        onClick={() => { setImage(null); setPreview(null); }}
                        className="absolute top-2 right-2 bg-gray-800/50 text-white p-1 rounded-full hover:bg-gray-800 transition"
                    >
                        <IoMdClose size={20} />
                    </button>
                    <img src={preview} alt="Preview" className="w-full max-h-80 object-cover" />
                </div>
            )}

            <hr className="my-4 border-gray-100" />

            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                        <IoMdImages className="text-green-500 text-xl" />
                        <span className="text-sm font-medium text-gray-600">Photo</span>
                    </button>
                </div>

                <button
                    onClick={handleShare}
                    disabled={loading || (!content.trim() && !image)}
                    className={`px-6 py-1.5 rounded-full font-semibold transition shadow-md active:scale-95 
                        ${loading || (!content.trim() && !image) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    {loading ? "Posting..." : "Share"}
                </button>
            </div>
        </div>
    );
};

export default Share;