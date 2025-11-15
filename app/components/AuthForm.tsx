'use client';

import { useState } from 'react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/75 to-indigo-900/80"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-6 md:mb-8">
          {/* Decorative AI Icons */}
          <div className="inline-flex items-center justify-center space-x-2 md:space-x-3 text-4xl md:text-6xl mb-4 md:mb-6">
            <span className="animate-pulse">✨</span>
            <span className="animate-bounce">🤖</span>
            <span className="animate-pulse">💡</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg px-2">
            Welcome to AI Content Generator
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-4 md:mb-6 drop-shadow px-2">
            Create Professional Content in Seconds with AI
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">📝</div>
              <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Blog Posts</h3>
              <p className="text-white/80 text-xs md:text-sm">Generate engaging blog content instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">📱</div>
              <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Social Media</h3>
              <p className="text-white/80 text-xs md:text-sm">Create viral social media posts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
              <div className="text-2xl md:text-3xl mb-1 md:mb-2">🎯</div>
              <h3 className="text-white font-semibold mb-1 text-sm md:text-base">Marketing</h3>
              <p className="text-white/80 text-xs md:text-sm">Professional marketing copy in seconds</p>
            </div>
          </div>

          {/* CTA Text */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 md:p-6 mb-6 md:mb-8 max-w-2xl mx-auto">
            <p className="text-white text-base md:text-lg font-medium mb-2">
              🚀 Start Creating Amazing Content Today!
            </p>
            <p className="text-white/90 text-sm md:text-base">
              Simple registration is all you need to test our platform. Get started with one free generation attempt – no credit card required!
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Sign In' : 'Create Your Free Account'}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Welcome back! Sign in to continue' : 'Join now and get 1 free generation'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="At least 6 characters"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Free Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up free"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
