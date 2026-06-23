import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Laravel ke login API ko hit karein
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: password
            });

            // Agar controller se success: true milta hai
            if (response.data.success) {
                // Token ko localStorage mein save karein
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Parent component (App.jsx) ko notify karein
                onLoginSuccess();
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Invalid Credentials');
            } else {
                setError('Something went wrong. Please check if backend server is running.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
                
                {/* Header Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Please enter your details to sign in
                    </p>
                </div>

                {/* Error Notification */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-2">
                        <span className="font-semibold">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Form Section */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="admin@fincore.com"
                                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-200"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                            </div>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                className="mt-1.5 block w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button 
                            type="submit" 
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Login;