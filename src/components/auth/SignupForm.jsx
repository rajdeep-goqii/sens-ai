// src/components/auth/SignupForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const SignupForm = ({ onClose, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(formData.name, formData.email, formData.password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
        Create Account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

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
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group px-4 py-3 rounded-lg overflow-hidden transition-all hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600" />
          <span className="relative text-white font-medium">
          {isLoading ? 'Creating Account...' : 'Create Account'}
            </span>
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;