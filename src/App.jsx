import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Feed from './components/pages/Feed';
import Navbar from './components/layout/Navbar';
import Profile from './components/pages/Profile';
import Notifications from './components/pages/Notifications';
import BottomNav from './components/layout/BottomNav'; // اقترح نقله لملف مستقل

// 1. مكون هيكل الصفحات المحمية (تجميع Navbar و BottomNav في مكان واحد)
const PrivateLayout = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
        <Outlet /> {/* هنا سيتم عرض محتوى الصفحة (Feed, Profile, etc) */}
      </div>
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <Router basename="/social-page">
      <Routes>
        {/* المسارات العامة */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* المسارات المحمية - كلها تحت هيكل واحد */}
        <Route element={<PrivateLayout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Route>

        {/* أي مسار غير معروف */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  );
}

export default App;