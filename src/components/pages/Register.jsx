import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { API_URL } from '../../api'; // التأكد من وجود رابط السيرفر هنا

import { FaUserPlus } from 'react-icons/fa';



const Register = () => {

    // 1. استخدام State بدلاً من getElementById

    const [username, setUsername] = useState('');

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [message, setMessage] = useState({ text: '', type: '' }); // لتخزين الرسالة ونوعها (خطأ أم نجاح)

    const [loading, setLoading] = useState(false);



    const navigate = useNavigate(); // للتوجيه لصفحة الدخول بعد النجاح



    const handleRegister = async (e) => {

        e.preventDefault(); // منع الصفحة من إعادة التحميل

        setLoading(true);

        setMessage({ text: '', type: '' });



        try {

            const response = await fetch(`${API_URL}/api/auth/local/register`, {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ username, email, password }),

            });



            const data = await response.json();


            if (response.ok) {
                // 1. تخزين البيانات لكي يتعرف التطبيق أن المستخدم سجل دخوله بالفعل
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('user', JSON.stringify(data.user));

                setMessage({
                    text: "Account created successfully! Redirecting to feed...",
                    type: "success"
                });

                // 2. التوجيه لصفحة الـ Feed مباشرة بعد ثانية واحدة
                setTimeout(() => {
                    navigate('/feed');
                    window.location.reload(); // لإعادة تحميل الحالة في التطبيق (Navbar وغيرها)
                }, 1500);
            } else {

                setMessage({

                    text: "Error: " + data.error.message,

                    type: "error"

                });

            }

        } catch (error) {

            setMessage({ text: "Failed to connect to server.", type: "error" });

        } finally {

            setLoading(false);

        }

    };



    return (

        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">



                {/* Header */}

                <div className="text-center mb-8">

                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">

                        <FaUserPlus size={28} />

                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

                    <p className="text-gray-500 mt-2">Join our social network today</p>

                </div>



                {/* Form */}

                <form onSubmit={handleRegister} className="space-y-5">

                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>

                        <input

                            type="text"

                            required

                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"

                            placeholder="Enter your username"

                            onChange={(e) => setUsername(e.target.value)}

                        />

                    </div>



                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>

                        <input

                            type="email"

                            required

                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"

                            placeholder="email@example.com"

                            onChange={(e) => setEmail(e.target.value)}

                        />

                    </div>



                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>

                        <input

                            type="password"

                            required

                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"

                            placeholder="••••••••"

                            onChange={(e) => setPassword(e.target.value)}

                        />

                    </div>



                    <button

                        type="submit"

                        disabled={loading}

                        className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-200 

                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}

                    >

                        {loading ? "Registering..." : "Sign Up"}

                    </button>

                </form>



                {/* Feedback Message */}

                {message.text && (

                    <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'

                        }`}>

                        {message.text}

                    </div>

                )}



                {/* Footer Link */}

                <p className="mt-8 text-center text-gray-600">

                    Already have an account?{' '}

                    <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>

                </p>

            </div>

        </div>

    );

};



export default Register;