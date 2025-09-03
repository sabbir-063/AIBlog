import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const AIWritingAssistant = ({
    onContentSelect,
    currentContent = '',
    title = '',
    isVisible,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState('outline');
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState(title);
    const [results, setResults] = useState(null);
    const [improvementType, setImprovementType] = useState('readability');

    const generateOutline = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/ai/generate-outline', { topic });
            setResults(response.data.data);
            toast.success('Outline generated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate outline');
        } finally {
            setLoading(false);
        }
    };

    const generateIntroductions = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/ai/generate-introductions', {
                topic,
                count: 3
            });
            setResults(response.data.data);
            toast.success('Introductions generated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate introductions');
        } finally {
            setLoading(false);
        }
    };

    const improveContent = async () => {
        if (!currentContent.trim()) {
            toast.error('No content to improve');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/ai/improve-content', {
                content: currentContent,
                improvementType
            });
            setResults(response.data.data);
            toast.success('Content improved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to improve content');
        } finally {
            setLoading(false);
        }
    };

    const handleUseContent = (content) => {
        onContentSelect(content);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden mx-4">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        ✨ AI Writing Assistant
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-300 text-xl"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-4">
                        {[
                            { id: 'outline', name: 'Generate Outline', icon: '📋' },
                            { id: 'intro', name: 'Write Intro', icon: '✍️' },
                            { id: 'improve', name: 'Improve Text', icon: '✨' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.icon} {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'outline' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blog Topic
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your blog topic..."
                                />
                            </div>

                            <button
                                onClick={generateOutline}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate Outline'}
                            </button>

                            {results && (
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-lg mb-3">{results.title}</h4>
                                    {results.sections?.map((section, index) => (
                                        <div key={index} className="mb-4">
                                            <h5 className="font-medium text-blue-600">{section.heading}</h5>
                                            <p className="text-gray-600 text-sm mb-2">{section.description}</p>
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {section.keyPoints?.map((point, pointIndex) => (
                                                    <li key={pointIndex}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleUseContent(JSON.stringify(results, null, 2))}
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                    >
                                        Use This Outline
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'intro' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Blog Topic
                                </label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your blog topic..."
                                />
                            </div>

                            <button
                                onClick={generateIntroductions}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate Introductions'}
                            </button>

                            {results && Array.isArray(results) && (
                                <div className="mt-6 space-y-4">
                                    {results.map((intro, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium mb-2">Option {index + 1}</h5>
                                            <p className="text-gray-700 mb-3">{intro}</p>
                                            <button
                                                onClick={() => handleUseContent(intro)}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                            >
                                                Use This Intro
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'improve' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Improvement Type
                                </label>
                                <select
                                    value={improvementType}
                                    onChange={(e) => setImprovementType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="readability">Improve Readability</option>
                                    <option value="grammar">Fix Grammar</option>
                                    <option value="expand">Expand Content</option>
                                    <option value="summarize">Summarize</option>
                                </select>
                            </div>

                            <button
                                onClick={improveContent}
                                disabled={loading || !currentContent.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Improving...' : 'Improve Content'}
                            </button>

                            {results && (
                                <div className="mt-6">
                                    <div className="mb-4">
                                        <h5 className="font-medium mb-2">Original Content</h5>
                                        <div className="bg-gray-100 p-3 rounded text-sm">
                                            {results.originalContent}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="font-medium mb-2">Improved Content</h5>
                                        <div className="bg-green-50 p-3 rounded text-sm">
                                            {results.improvedContent}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUseContent(results.improvedContent)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                    >
                                        Use Improved Content
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">AI is working on your request...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIWritingAssistant;
