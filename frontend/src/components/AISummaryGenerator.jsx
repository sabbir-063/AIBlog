import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const AISummaryGenerator = ({ postId, currentSummary, onSummaryGenerated }) => {
    const [loading, setLoading] = useState(false);
    const [generatedSummary, setGeneratedSummary] = useState('');

    const generateSummary = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/ai/posts/${postId}/summary`);
            const summary = response.data.data.summary;
            setGeneratedSummary(summary);

            if (onSummaryGenerated) {
                onSummaryGenerated(summary);
            }

            toast.success('AI summary generated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    const generateAllMetadata = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/ai/posts/${postId}/generate-metadata`);

            if (onSummaryGenerated) {
                onSummaryGenerated(response.data.data.aiMeta?.summary);
            }

            toast.success('All AI metadata generated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate metadata');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-blue-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Tools
                </h4>
            </div>

            {currentSummary ? (
                <div className="mb-4">
                    <p className="text-sm text-blue-700 mb-2">📝 Current AI Summary:</p>
                    <div className="bg-white p-3 rounded border border-blue-200">
                        <p className="text-gray-800 text-sm">{currentSummary}</p>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="text-sm text-blue-700 mb-2">
                        No AI summary available for this post yet.
                    </p>
                </div>
            )}

            {generatedSummary && generatedSummary !== currentSummary && (
                <div className="mb-4">
                    <p className="text-sm text-green-700 mb-2">✨ New Generated Summary:</p>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-gray-800 text-sm">{generatedSummary}</p>
                    </div>
                </div>
            )}

            <div className="flex space-x-3">
                <button
                    onClick={generateSummary}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Generate Summary
                        </>
                    )}
                </button>

                <button
                    onClick={generateAllMetadata}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm flex items-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Generate All SEO Data
                        </>
                    )}
                </button>
            </div>

            <div className="mt-3 text-xs text-blue-600">
                <p>💡 AI can generate summaries, SEO titles, meta descriptions, and suggested tags for better visibility!</p>
            </div>
        </div>
    );
};

export default AISummaryGenerator;
