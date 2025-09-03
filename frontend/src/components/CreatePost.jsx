import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import AIWritingAssistant from './AIWritingAssistant';
import SEOAssistant from './SEOAssistant';

const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [showSEOAssistant, setShowSEOAssistant] = useState(false);

    // Redirect if not author/admin
    if (user && !['author', 'admin'].includes(user.role)) {
        toast.error('You do not have permission to create posts');
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!formData.content.trim()) {
            toast.error('Content is required');
            return;
        }

        if (!coverImage) {
            toast.error('Cover image is required');
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData object for file upload
            const postData = new FormData();
            postData.append('title', formData.title);
            postData.append('content', formData.content);

            if (formData.tags) {
                postData.append('tags', formData.tags);
            }

            if (coverImage) {
                postData.append('coverImage', coverImage);
            }

            // Make API call
            const response = await axiosInstance.post('/posts/create', postData);

            toast.success('Post created successfully!');
            navigate(`/posts/${response.data._id}`);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.error || 'Failed to create post');
        } finally {
            setIsLoading(false);
        }
    };

    // AI Assistant handlers
    const handleAIContentSelect = (content) => {
        setFormData(prev => ({
            ...prev,
            content: prev.content + '\n\n' + content
        }));
        toast.success('AI content added to your post!');
    };

    const handleSEODataSelect = (seoData) => {
        setFormData(prev => ({
            ...prev,
            title: seoData.seoTitle || prev.title,
            tags: seoData.suggestedTags?.join(', ') || prev.tags
        }));
        toast.success('SEO data applied to your post!');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>

                {/* AI Tools */}
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={() => setShowAIAssistant(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        ✨ AI Assistant
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowSEOAssistant(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        🔍 SEO Helper
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title*
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter post title"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content*
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows="10"
                        required
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Write your post content here..."
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                        You can use HTML tags for formatting if needed.
                    </p>
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                    </label>
                    <input
                        id="tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. technology, programming, AI"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Image*
                    </label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="file"
                            name="coverImage"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    {previewUrl && (
                        <div className="mt-4">
                            <img
                                src={previewUrl}
                                alt="Cover preview"
                                className="h-48 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>

            {/* AI Components */}
            <AIWritingAssistant
                isVisible={showAIAssistant}
                onClose={() => setShowAIAssistant(false)}
                onContentSelect={handleAIContentSelect}
                currentContent={formData.content}
                title={formData.title}
            />

            <SEOAssistant
                isVisible={showSEOAssistant}
                onClose={() => setShowSEOAssistant(false)}
                onSEODataSelect={handleSEODataSelect}
                title={formData.title}
                content={formData.content}
                currentTags={formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)}
            />
        </div>
    );
};

export default CreatePost;