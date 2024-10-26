// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to login');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-center flex justify-center mb-8 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
        Welcome Back
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group px-4 py-3 rounded-lg overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600" />
          <span className="relative text-white font-medium">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </span>
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;