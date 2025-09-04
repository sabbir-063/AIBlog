import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const AISettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        aiAssistantEnabled: true,
        preferredTone: 'neutral',
        contentSuggestions: true
    });
    const [loading, setLoading] = useState(false);
    const [contentIdeas, setContentIdeas] = useState([]);
    const [loadingIdeas, setLoadingIdeas] = useState(false);

    // Load user settings
    useEffect(() => {
        if (user?.aiSettings) {
            setSettings({
                aiAssistantEnabled: user.aiSettings.aiAssistantEnabled ?? true,
                preferredTone: user.aiSettings.preferredTone || 'neutral',
                contentSuggestions: user.aiSettings.contentSuggestions ?? false
            });
        }
    }, [user]);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            await axiosInstance.put('/ai/settings', settings);
            toast.success('AI settings updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const loadContentSuggestions = async () => {
        setLoadingIdeas(true);
        try {
            const response = await axiosInstance.get('/ai/suggest-content');
            setContentIdeas(response.data.data);
        } catch (error) {
            toast.error('Failed to load content suggestions');
        } finally {
            setLoadingIdeas(false);
        }
    };

    useEffect(() => {
        if (settings.contentSuggestions) {
            loadContentSuggestions();
        }
    }, [settings.contentSuggestions]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Settings</h1>

            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">AI Assistant Configuration</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Customize how AI assists you with content creation
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* AI Assistant Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Enable AI Assistant
                            </label>
                            <p className="text-sm text-gray-500">
                                Allow AI to help with writing, SEO optimization, and content suggestions
                            </p>
                        </div>
                        <button
                            onClick={() => handleSettingChange('aiAssistantEnabled', !settings.aiAssistantEnabled)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.aiAssistantEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.aiAssistantEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Preferred Tone */}
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">
                            Preferred Writing Tone
                        </label>
                        <p className="text-sm text-gray-500 mb-3">
                            AI will adapt its suggestions to match your preferred writing style
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'formal', label: 'Formal', desc: 'Professional and academic' },
                                { value: 'casual', label: 'Casual', desc: 'Conversational and friendly' },
                                { value: 'neutral', label: 'Neutral', desc: 'Balanced and informative' }
                            ].map((tone) => (
                                <button
                                    key={tone.value}
                                    onClick={() => handleSettingChange('preferredTone', tone.value)}
                                    className={`p-3 rounded-lg border-2 text-left transition-colors ${settings.preferredTone === tone.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-medium text-gray-900">{tone.label}</div>
                                    <div className="text-sm text-gray-500">{tone.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Suggestions */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-base font-medium text-gray-900">
                                Content Suggestions
                            </label>
                            <p className="text-sm text-gray-500">
                                Receive AI-generated blog post ideas based on your writing history
                            </p>
                        </div>
                        <button
                            onClick={() => handleSettingChange('contentSuggestions', !settings.contentSuggestions)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${settings.contentSuggestions ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.contentSuggestions ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            onClick={saveSettings}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Suggestions Section */}
            {settings.contentSuggestions && (
                <div className="mt-8 bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">AI Content Suggestions</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Blog post ideas tailored to your interests
                                </p>
                            </div>
                            <button
                                onClick={loadContentSuggestions}
                                disabled={loadingIdeas}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                            >
                                {loadingIdeas ? 'Loading...' : '🔄 Refresh Ideas'}
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {loadingIdeas ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <span className="ml-2 text-gray-600">Generating personalized content ideas...</span>
                            </div>
                        ) : contentIdeas.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {contentIdeas.map((idea, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs ${idea.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                                    idea.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {idea.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{idea.description}</p>
                                        {idea.suggestedTags && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {idea.suggestedTags.slice(0, 3).map((tag, tagIndex) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => {
                                                // Navigate to create post with pre-filled title
                                                window.location.href = `/create-post?title=${encodeURIComponent(idea.title)}`;
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Start Writing →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No content suggestions available yet.</p>
                                <p className="text-sm mt-1">Write a few posts to get personalized recommendations!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISettings;
