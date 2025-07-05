import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;
      login(user, access_token);
      navigate('/tasks');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const errorMessages = detail.map((e: any) => e.msg).join('. ');
          setError(errorMessages);
        } else {
          setError(detail || 'Login failed');
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
        {/* Left side with the form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="frontend\todoapp-frontend\public\login.jpg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter an Email"
                className="pl-10 mt-1 block w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter Password"
                className="pl-10 mt-1 block w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-400 text-white p-3 rounded-md hover:bg-red-500 disabled:bg-gray-400"
            >
              {loading ? 'Please Wait...' : 'Login'}
            </button>
            <div className="text-sm text-center">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:underline">Create One</Link>
          </p>
        </div>

        {/* Right side with illustration */}
        <div className="w-1/2 hidden md:flex items-center justify-center">
            <img src="/Mobile login-rafiki.svg" alt="Login Illustration" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;