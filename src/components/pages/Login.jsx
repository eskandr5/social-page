import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // أضفنا Link هنا
import { API_URL } from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/local`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.jwt) {
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('user', JSON.stringify(data.user));
                // يفضل استبدال الـ alert بتنبيه أجمل لاحقاً
                navigate('/Feed');
                window.location.reload(); // لضمان تحديث حالة الـ Navbar
            } else {
                alert('بيانات الدخول غير صحيحة');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <form onSubmit={handleLogin}>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Login</h2>

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="block w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="block w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            disabled={loading}

                            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer 
                                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}>
                            {loading ? "Login..." : "Login"}
                        </button>
                    </div>
                </form>

                {/* الرابط المضاف لصفحة التسجيل */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;