import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { token, new_password: password, confirm_password: confirmPassword });
            setMessage('Password has been reset successfully. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                const detail = err.response.data.detail;
                if (Array.isArray(detail)) {
                    const errorMessages = detail.map((e: any) => e.msg).join('. ');
                    setError(errorMessages);
                } else {
                    setError(detail || 'An error occurred.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left side with illustration */}
                <div className="w-1/2 hidden md:flex items-center justify-center">
                    <img src="/Mobile login-rafiki.svg" alt="Password Reset Illustration" className="w-full h-full object-cover" />
                </div>

                {/* Right side with the form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                    {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 