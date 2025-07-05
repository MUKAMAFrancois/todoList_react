import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
            setMessage('Password reset link has been sent to your email.');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left side with illustration */}
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img src="/Mobile login-rafiki.svg" alt="Forgot Password Illustration" className="w-full h-full object-cover" />
                </div>

                {/* Right side with the form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                    {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 