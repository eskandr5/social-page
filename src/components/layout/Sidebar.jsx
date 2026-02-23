import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AiOutlineHome,
    AiOutlineUser,
    AiOutlineSetting,
    AiOutlineLogout,
    AiOutlineBell,
} from 'react-icons/ai';
import { IoMdSearch } from "react-icons/io";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // لمتابعة الصفحة الحالية
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        // ملاحظة: مع التنظيم الجديد في App.jsx، لا حاجة لـ reload() لأن التوجيه سيتكفل بالأمر
    };

    const menuItems = [
        { icon: <AiOutlineHome size={24} />, label: 'Main', path: '/feed' },
        { icon: <IoMdSearch size={24} />, label: 'Explore', path: '/explore' },
        { icon: <AiOutlineBell size={24} />, label: 'Notifications', path: '/notifications' },
        { icon: <AiOutlineUser size={24} />, label: 'Profile', path: '/profile' },
        { icon: <AiOutlineSetting size={24} />, label: 'Settings', path: '/settings' },
    ];

    // دالة للتحقق من الرابط النشط
    const isActive = (path) => location.pathname === path;

    return (
        <div className="hidden md:flex flex-col h-[calc(100vh-100px)] sticky top-24 p-2 justify-between">
            <div>
                {/* بطاقة المستخدم - حسنتُ التدرج اللوني ليتناسب مع بقية المكونات */}
                <div className="flex items-center gap-3 p-3 mb-6 bg-gradient-to-r from-blue-50 to-transparent rounded-2xl border border-blue-100/50">
                    <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <p className="font-bold text-gray-800 leading-tight truncate">{user?.username}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">@{user?.username?.toLowerCase()}</p>
                    </div>
                </div>

                {/* قائمة التنقل */}
                <nav className="space-y-2">
                    {menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${active
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <span className={`${active ? "" : "group-hover:scale-110"} transition-transform`}>
                                    {item.icon}
                                </span>
                                <span className={`font-bold hidden lg:block ${active ? "text-white" : "text-gray-700 group-hover:text-blue-600"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* زر تسجيل الخروج */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all mt-auto group"
            >
                <AiOutlineLogout size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold hidden lg:block text-gray-700 group-hover:text-red-600">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;