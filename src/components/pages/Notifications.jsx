import { useState, useEffect } from 'react';
import Sidebar from '../Feed/Sidebar';
import Rightbar from '../Feed/Rightbar';
import { API_URL } from '../../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(
                    `${API_URL}/api/notifications?filters[receiver][id][$eq]=${user.id}&sort=createdAt:desc&populate=sender`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const result = await res.json();
                setNotifications(result.data || []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4">
            <div className="hidden md:block w-64"><Sidebar /></div>

            <div className="w-full md:w-600px py-6">
                <div className="bg-white rounded-3xl shadow-sm border p-6 mb-6">
                    <h2 className="text-2xl font-black text-gray-800">Notifications</h2>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center py-10">Loading notifications...</p>
                    ) : notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition ${notif.attributes.isRead ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                                    {notif.attributes.sender.data.attributes.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-bold">{notif.attributes.sender.data.attributes.username}</span>
                                        {" "}{notif.attributes.text}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(notif.attributes.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notif.attributes.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 italic">No notifications yet.</div>
                    )}
                </div>
            </div>

            <div className="hidden lg:block w-80"><Rightbar /></div>
        </div>
    );
};

export default Notifications;