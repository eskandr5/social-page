import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Feed from './components/pages/Feed';
import Navbar from './components/navbar/Navbar';
import Profile from './components/pages/Profile';
import Notifications from './components/pages/Notifications';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlusSquare, AiOutlineBell } from 'react-icons/ai';
import { Link } from 'react-router-dom';
// مكون الحماية
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const BottomNav = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Link to="/feed" className="text-gray-600 focus:text-blue-600"><AiOutlineHome size={26} /></Link>
      <Link className="text-gray-600 focus:text-blue-600"><AiOutlineSearch size={26} /></Link>
      <Link className="text-gray-600 focus:text-blue-600"><AiOutlinePlusSquare size={26} /></Link>
      <Link to="/notifications" className="text-gray-600 focus:text-blue-600"><AiOutlineBell size={26} /></Link>
      <Link to="/profile">
        <div className="w-8 h-8 bg-blue-600 rounded-full text-white text-xs font-bold flex items-center justify-center border border-gray-100">
          {user?.username ? user.username[0].toUpperCase() : "U"}
        </div>
      </Link>
    </div>
  );
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router basename="/social-page">      {/* 1. النافبار العلوي */}
      {token && <Navbar />}

      {/* 2. محتوى الصفحة مع إضافة padding سفلي في الموبايل لكي لا يغطي الشريط المحتوى */}
      <div className={`bg-gray-50 min-h-screen ${token ? 'pb-20 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/feed" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="*" element={<Navigate to="/feed" />} />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {/* 3. استدعاء الـ BottomNav هنا ليظهر في كل الصفحات المحمية */}
      {token && <BottomNav />}
    </Router>
  );
}

export default App;