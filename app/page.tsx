'use client';

import { useState, useEffect } from 'react';
import { templates, getTemplatesByType, Template, ContentType } from './lib/templates';
import Link from 'next/link';
import AuthForm from './components/AuthForm';
import Modal from './components/Modal';

interface User {
  id: string;
  email: string;
  attemptUsed: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuthSuccess = () => {
    checkAuth();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setGeneratedContent('');
      setSelectedTemplate(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const filteredTemplates = selectedType === 'all'
    ? templates
    : getTemplatesByType(selectedType);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setInputs({});
    setGeneratedContent('');
    setError('');
  };

  const handleInputChange = (placeholder: string, value: string) => {
    setInputs(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    // Check if user has already used their attempt
    if (user?.attemptUsed) {
      setError('Thank You for Testing! You have already used your free generation attempt. Thank you for testing our platform!');
      return;
    }

    // Check if all inputs are filled
    const missingInputs = selectedTemplate.placeholders.filter(
      p => !inputs[p] || inputs[p].trim() === ''
    );

    if (missingInputs.length > 0) {
      setError(`Please fill in all fields: ${missingInputs.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          inputs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.content);

      // Update user's attemptUsed status and show modal
      if (data.attemptUsed && user) {
        setUser({ ...user, attemptUsed: true });
        setIsModalOpen(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  const handleDownload = (format: 'txt' | 'md') => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Content Generator</h1>
              <p className="text-gray-600 mt-1">Create marketing content, blogs, and social media posts instantly</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
              <Link
                href="/history"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View History
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Content Generator</h1>
              <p className="text-gray-600 text-sm mt-1">Create marketing content, blogs, and social media posts instantly</p>
            </div>
            <div className="text-center text-sm text-gray-600">
              {user.email}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/history"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                View History
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Usage Warning Banner */}
      {!user.attemptUsed ? (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-yellow-800 text-center font-medium">
              ⚠️ You have <span className="font-bold">one free generation attempt</span>. Use it wisely!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-blue-800 text-center font-medium">
              ℹ️ You have used your free generation attempt. View your generated content in <Link href="/history" className="underline font-bold hover:text-blue-900">History</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Template</h2>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ContentType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Templates</option>
                  <option value="blog">Blog Posts</option>
                  <option value="marketing">Marketing</option>
                  <option value="social-media">Social Media</option>
                </select>
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Input Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedTemplate.icon} {selectedTemplate.name}
                  </h2>
                  <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>

                  {/* Input Fields */}
                  <div className="space-y-4">
                    {selectedTemplate.placeholders.map((placeholder) => (
                      <div key={placeholder}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {placeholder.replace(/-/g, ' ')}
                        </label>
                        <input
                          type="text"
                          value={inputs[placeholder] || ''}
                          onChange={(e) => handleInputChange(placeholder, e.target.value)}
                          placeholder={`Enter ${placeholder}...`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </button>
                </div>

                {/* Generated Content */}
                {generatedContent && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Generated Content</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDownload('txt')}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          .TXT
                        </button>
                        <button
                          onClick={() => handleDownload('md')}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          .MD
                        </button>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {generatedContent}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Template to Get Started</h2>
                <p className="text-gray-600">Choose from our library of templates to generate professional content instantly</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thank you for testing our platform!"
        message="You have already used your free generation attempt."
      />
    </div>
  );
}
