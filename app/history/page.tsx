'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Interface representing a content item from user's history
 */
interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: string;
  template: string;
  createdAt: string;
}

/**
 * History Page Component
 * Displays user's generated content history with filtering, viewing, and export capabilities
 */
export default function HistoryPage() {
  // State for storing the list of content items
  const [history, setHistory] = useState<ContentItem[]>([]);
  // State for content type filter (all, blog, marketing, social-media)
  const [selectedType, setSelectedType] = useState<string>('all');
  // State for currently selected content item to display
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(true);
  // Error message state
  const [error, setError] = useState<string>('');

  // Fetch history when component mounts or when filter changes
  useEffect(() => {
    fetchHistory();
  }, [selectedType]);

  /**
   * Fetches content history from API based on selected filter
   * Handles authentication errors by redirecting to login page
   */
  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Build URL with filter parameter if specific type is selected
      const url = selectedType === 'all'
        ? '/api/history'
        : `/api/history?type=${selectedType}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        // Handle unauthorized access
        if (response.status === 401) {
          setError('Please log in to view your content history');
          window.location.href = '/';
          return;
        }
        throw new Error(data.error || 'Failed to fetch history');
      }

      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError(error instanceof Error ? error.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a content item from history
   * Shows confirmation dialog before deletion
   * @param id - ID of the content item to delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove deleted item from state
        setHistory(history.filter(item => item.id !== id));
        // Clear selection if deleted item was selected
        if (selectedContent?.id === id) {
          setSelectedContent(null);
        }
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  /**
   * Downloads content in specified format
   * Creates a blob and triggers browser download
   * @param content - Content item to download
   * @param format - File format (txt, md, or json)
   */
  const handleDownload = (content: ContentItem, format: 'txt' | 'md' | 'json') => {
    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      // For JSON, stringify the entire content object
      blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      filename = `${content.title.substring(0, 30)}-${Date.now()}.json`;
    } else {
      // For TXT and MD, only save the content text
      blob = new Blob([content.content], { type: 'text/plain' });
      filename = `${content.title.substring(0, 30)}-${Date.now()}.${format}`;
    }

    // Create temporary download link and trigger click
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Copies content to clipboard
   * @param content - Text content to copy
   */
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
  };

  /**
   * Formats ISO date string to human-readable format
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Logs out user and redirects to home page
   */
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  /**
   * Returns Tailwind CSS classes for content type badges
   * @param type - Content type (blog, marketing, social-media)
   * @returns CSS class string
   */
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'social-media':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content History</h1>
              <p className="text-gray-600 mt-1">View and manage your generated content</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
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
              <h1 className="text-2xl font-bold text-gray-900">Content History</h1>
              <p className="text-gray-600 text-sm mt-1">View and manage your generated content</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - History List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">History</h2>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Content</option>
                  <option value="blog">Blog Posts</option>
                  <option value="marketing">Marketing</option>
                  <option value="social-media">Social Media</option>
                </select>
              </div>

              {/* History List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Show error message if fetch failed */}
                {error ? (
                  <div className="text-center py-8">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  </div>
                ) : isLoading ? (
                  /* Show loading state while fetching */
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : history.length === 0 ? (
                  /* Show empty state if no content exists */
                  <div className="text-center py-8 text-gray-500">
                    <p>No content generated yet</p>
                    <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                      Create your first content
                    </Link>
                  </div>
                ) : (
                  /* Render list of content items */
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedContent(item)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedContent?.id === item.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(item.contentType)}`}>
                            {item.template}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area - Selected Content */}
          <div className="lg:col-span-2">
            {/* Show selected content details and actions, or empty state */}
            {selectedContent ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Content Header with title and metadata */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedContent.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full ${getTypeColor(selectedContent.contentType)}`}>
                        {selectedContent.template}
                      </span>
                      <span>{formatDate(selectedContent.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Copy, Export, Delete */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => handleCopy(selectedContent.content)}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDownload(selectedContent, 'txt')}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Export .TXT
                  </button>
                  <button
                    onClick={() => handleDownload(selectedContent, 'md')}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Export .MD
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContent.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>

                {/* Content Display - Shows the actual generated text */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {selectedContent.content}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state - No content selected */
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Content to View</h2>
                <p className="text-gray-600">Choose an item from your history to view and export</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
