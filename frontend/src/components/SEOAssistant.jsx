import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const SEOAssistant = ({
    title,
    content,
    onSEODataSelect,
    isVisible,
    onClose,
    currentTags = []
}) => {
    const [loading, setLoading] = useState(false);
    const [seoData, setSeoData] = useState(null);
    const [customTitle, setCustomTitle] = useState(title || '');
    const [customContent, setCustomContent] = useState(content || '');

    const generateSEOData = async () => {
        if (!customTitle.trim() || !customContent.trim()) {
            toast.error('Title and content are required');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/ai/generate-seo', {
                title: customTitle,
                content: customContent
            });
            setSeoData(response.data.data);
            toast.success('SEO data generated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate SEO data');
        } finally {
            setLoading(false);
        }
    };

    const handleUseSEOData = () => {
        if (seoData) {
            onSEODataSelect(seoData);
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        🔍 SEO Assistant
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Title
                            </label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your blog title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Content (first 500 characters will be analyzed)
                            </label>
                            <textarea
                                value={customContent}
                                onChange={(e) => setCustomContent(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your blog content..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {customContent.length} characters
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={generateSEOData}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 mb-6"
                    >
                        {loading ? 'Analyzing...' : '🚀 Generate SEO Data'}
                    </button>

                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span className="ml-2 text-gray-600">Analyzing content for SEO optimization...</span>
                        </div>
                    )}

                    {seoData && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold mb-4 text-green-700">
                                🎯 SEO Recommendations
                            </h4>

                            <div className="space-y-4">
                                {/* SEO Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📝 SEO-Optimized Title ({seoData.seoTitle?.length || 0}/60 chars)
                                    </label>
                                    <div className="bg-white p-3 rounded border">
                                        <p className="text-gray-800">{seoData.seoTitle}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {seoData.seoTitle?.length <= 60 ? '✅ Good length' : '⚠️ Consider shortening'}
                                    </p>
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        📄 Meta Description ({seoData.seoDescription?.length || 0}/160 chars)
                                    </label>
                                    <div className="bg-white p-3 rounded border">
                                        <p className="text-gray-800">{seoData.seoDescription}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {seoData.seoDescription?.length <= 160 ? '✅ Good length' : '⚠️ Consider shortening'}
                                    </p>
                                </div>

                                {/* Suggested Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        🏷️ Suggested Tags
                                    </label>
                                    <div className="bg-white p-3 rounded border">
                                        <div className="flex flex-wrap gap-2">
                                            {seoData.suggestedTags?.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-3 py-1 rounded-full text-sm ${currentTags.includes(tag)
                                                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                            : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {tag}
                                                    {currentTags.includes(tag) && ' ✓'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Keywords */}
                                {seoData.keywords && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🎯 Target Keywords
                                        </label>
                                        <div className="bg-white p-3 rounded border">
                                            <div className="flex flex-wrap gap-2">
                                                {seoData.keywords.map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* URL Slug */}
                                {seoData.slug && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            🔗 URL Slug
                                        </label>
                                        <div className="bg-white p-3 rounded border">
                                            <code className="text-gray-800">/blog/{seoData.slug}</code>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleUseSEOData}
                                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                    >
                                        ✅ Apply SEO Data
                                    </button>
                                    <button
                                        onClick={() => setSeoData(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        🔄 Generate Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SEOAssistant;
