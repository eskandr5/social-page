import { useState } from 'react'; // أضفنا useState
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineLogout, AiOutlineHome, AiOutlineMessage, AiOutlineBell, AiOutlineClose } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Rightbar from '../Feed/Rightbar'; // استيراد الرايت بار لعرضه داخل القائمة

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // حالة القائمة الجانبية
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Left Side: Menu (Mobile) & Logo */}
                    <div className="flex items-center gap-3">
                        {/* زر فتح القائمة للموبايل فقط */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                            <HiOutlineMenuAlt2 size={26} />
                        </button>

                        <Link to="/feed" className="text-2xl font-bold text-blue-600 tracking-tighter">
                            SOCIAL<span className="text-gray-800">APP</span>
                        </Link>
                    </div>

                    {/* Icons - Middle (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-8 text-gray-600">
                        <Link title="Home" to="/feed" className="hover:text-blue-600 transition"><AiOutlineHome size={24} /></Link>
                        <button title="Messages" className="hover:text-blue-600 transition"><AiOutlineMessage size={24} /></button>
                        <button title="Notifications" className="hover:text-blue-600 transition"><AiOutlineBell size={24} /></button>
                    </div>

                    {/* Right Side: Profile & Logout */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                            <span className="hidden sm:block font-medium text-gray-700 text-sm">
                                {user?.username}
                            </span>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {user?.username ? user.username[0].toUpperCase() : "U"}
                            </div>
                        </Link>

                        <div className="h-6 w-1px bg-gray-200 mx-1"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition font-medium text-sm"
                        >
                            <AiOutlineLogout size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- Mobile Drawer (القائمة الجانبية للموبايل) --- */}
            {/* الخلفية المظلمة */}
            <div
                className={`fixed inset-0 bg-black/50 z-60 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* القائمة نفسها */}
            <div
                className={`fixed top-0 left-0 h-full w-280px bg-gray-50 z-70 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-10">
                    <span className="font-bold text-gray-800">Suggestions</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                    >
                        <AiOutlineClose size={20} />
                    </button>
                </div>

                <div className="p-2">
                    {/* استدعاء الرايت بار هنا ليعمل داخل الموبايل */}
                    <div className="block!"> {/* نلغي الـ hidden الخاص بالـ Rightbar هنا */}
                        <Rightbar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;