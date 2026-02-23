import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlusSquare, AiOutlineBell } from 'react-icons/ai';

const BottomNav = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // دالة مساعدة لتحديد ما إذا كان الرابط نشطاً لتغيير اللون
  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      
      {/* Home */}
      <Link 
        to="/feed" 
        className={`${isActive('/feed') ? 'text-purple-600' : 'text-gray-600'}`}
      >
        <AiOutlineHome size={26} />
      </Link>

      {/* Search */}
      <Link 
        to="/search" 
        className={`${isActive('/search') ? 'text-purple-600' : 'text-gray-600'}`}
      >
        <AiOutlineSearch size={26} />
      </Link>

      {/* Add Post */}
      <Link 
        to="/create" 
        className="text-gray-600"
      >
        <AiOutlinePlusSquare size={26} />
      </Link>

      {/* Notifications */}
      <Link 
        to="/notifications" 
        className={`${isActive('/notifications') ? 'text-purple-600' : 'text-gray-600'}`}
      >
        <AiOutlineBell size={26} />
      </Link>

      {/* Profile */}
      <Link to="/profile">
        <div className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center border ${isActive('/profile') ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-100'} bg-blue-600`}>
          {user?.username ? user.username[0].toUpperCase() : "U"}
        </div>
      </Link>

    </div>
  );
};

export default BottomNav;