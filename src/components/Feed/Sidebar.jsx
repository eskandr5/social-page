import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    const menuItems = [
        { icon: <AiOutlineHome size={24} />, label: 'main', path: '/' },
        { icon: <IoMdSearch size={24} />, label: 'search', path: '/explore' },
        { icon: <AiOutlineBell size={24} />, label: 'notifications', path: '/notifications' },
        { icon: <AiOutlineUser size={24} />, label: 'profile', path: '/profile' },
        { icon: <AiOutlineSetting size={24} />, label: 'settings', path: '/settings' },
    ];

    return (
        <div className="hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20 p-4 justify-between">
            {/* القسم العلوي: الروابط */}
            <div className="space-y-2">
                {/* بطاقة المستخدم السريعة */}
                <div className="flex items-center gap-3 p-3 mb-6 bg-linear-to-r from-blue-50 to-transparent rounded-2xl">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {user?.username?.[0].toUpperCase()}
                    </div>
                    <div className="hidden lg:block">
                        <p className="font-bold text-gray-800 leading-none">{user?.username}</p>
                        <p className="text-xs text-gray-500 mt-1">@{user?.username?.toLowerCase()}</p>
                    </div>
                </div>

                {/* قائمة التنقل */}
                <nav className="space-y-1">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className="flex items-center gap-4 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                        >
                            <span className="group-hover:scale-110 transition-transform">
                                {item.icon}
                            </span>
                            <span className="font-medium hidden lg:block">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* القسم السفلي: زر تسجيل الخروج */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all mt-auto"
            >
                <AiOutlineLogout size={24} />
                <span className="font-medium hidden lg:block">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;