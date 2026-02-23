import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineHome, AiOutlineMessage, AiOutlineBell, AiOutlineClose } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Rightbar from './Rightbar';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // لمعرفة الصفحة الحالية وتلوين الأيقونة
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <HiOutlineMenuAlt2 size={24} />
                        </button>

                        <Link to="/feed" className="text-xl md:text-2xl font-black text-blue-600 tracking-tighter">
                            SOCIAL<span className="text-gray-800 font-bold">APP</span>
                        </Link>
                    </div>

                    {/* Icons (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-8 text-gray-500">
                        <Link to="/feed" className={`transition-colors ${isActive('/feed') ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                            <AiOutlineHome size={26} />
                        </Link>
                        <Link to="/notifications" className={`relative transition-colors ${isActive('/notifications') ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                            <AiOutlineBell size={26} />
                            {/* نقطة إشعار وهمية للمثال */}
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full "></span>
                        </Link>
                        <Link to="/messages" className="hover:text-blue-600 transition-colors">
                            <AiOutlineMessage size={26} />
                        </Link>
                    </div>

                    {/* Right: Profile & Logout */}
                    <div className="flex items-center gap-3">
                        <Link to="/profile" className="flex items-center gap-2 group">
                            <span className="hidden lg:block font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">
                                {user?.username}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
                                {user?.username ? user.username[0].toUpperCase() : "U"}
                            </div>
                        </Link>

                        <div className="hidden sm:block h-6 w-[1px] bg-gray-200 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-bold text-sm"
                        >
                            <AiOutlineLogout size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Drawer --- */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-60 md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar Content */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                    <span className="font-black text-gray-800 text-lg uppercase">Suggestions</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-all"
                    >
                        <AiOutlineClose size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {/* استدعاء الرايت بار مع تغليف لتأكيد الظهور */}
                    <div className="mobile-sidebar-wrapper">
                        <Rightbar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;