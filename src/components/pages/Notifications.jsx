import { useState, useEffect } from 'react';
import Sidebar from '../Feed/Sidebar';
import Rightbar from '../Feed/Rightbar';
import { API_URL } from '../../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    // استخدام Optional Chaining لضمان عدم الخطأ عند عدم وجود مستخدم
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id || !token) return;
            try {
                const res = await fetch(
                    `${API_URL}/api/notifications?filters[receiver][id][$eq]=${user.id}&sort=createdAt:desc&populate=sender`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const result = await res.json();
                setNotifications(result.data || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user.id]); // يكفي الاعتماد على id المستخدم

    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
            <div className="hidden md:block w-64"><Sidebar /></div>

            <div className="w-full md:w-600px py-6">
                <div className="bg-white rounded-3xl shadow-sm border p-6 mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Notifications</h2>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        // يمكنك هنا وضع الـ Skeleton الذي تعلمناه سابقاً
                        <p className="text-center py-10 text-gray-400">Loading...</p>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => {
                            const attr = notif.attributes || notif;
                            // هذا السطر يضمن الوصول لاسم المستخدم مهما كانت نسخة Strapi
                            const sender = attr.sender?.data?.attributes || attr.sender;
                            const isRead = attr.isRead;

                            return (
                                <div key={notif.id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition duration-300 hover:shadow-md ${isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
                                        }`}>
                                    <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                                        {sender?.username ? sender.username[0].toUpperCase() : "?"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-bold text-gray-900">{sender?.username || "Someone"}</span>
                                            {" "}{attr.text || "interacted with you"}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                            {attr.createdAt && new Date(attr.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    {!isRead && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed italic">
                            No notifications yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="hidden lg:block w-80"><Rightbar /></div>
        </div>
    );
};

export default Notifications;