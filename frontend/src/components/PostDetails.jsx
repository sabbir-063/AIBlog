import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import AISummaryGenerator from './AISummaryGenerator';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/posts/${id}`);
        setPost(response.data);

        // Check if user has liked this post
        if (user && response.data.likes) {
          const userLiked = response.data.likes.some(like => like._id === user.id);
          setLiked(userLiked);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like posts');
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.post(`/posts/${id}/like`);

      // Update the post state with the new likes information
      setLiked(response.data.liked);
      setPost(prev => ({
        ...prev,
        likeCount: response.data.likeCount
      }));

      toast.success(response.data.message);
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error('Failed to like post. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-red-500 mb-4">{error || 'Post not found'}</div>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        {/* Cover Image */}
        <div className="mb-8">
          <img
            src={post.coverImage?.url || 'https://via.placeholder.com/1200x400?text=No+Image'}
            alt={post.title}
            className="w-full h-96 object-fit rounded-lg shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Author and Meta Information */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src={post.author?.profilePicture || 'https://via.placeholder.com/40'}
              alt={post.author?.username || 'Author'}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">
                {post.author ? `${post.author.firstname} ${post.author.lastname}` : 'Unknown author'}
              </p>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-gray-500">{post.viewCount}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose lg:prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* AI Tools for Authors/Admins */}
        {user && (
          (post.author && user.id === post.author._id) ||
          user.role === 'admin'
        ) && (
            <div className="mb-8">
              <AISummaryGenerator
                postId={post._id}
                currentSummary={post.aiMeta?.summary}
                onSummaryGenerated={(summary) => {
                  setPost(prev => ({
                    ...prev,
                    aiMeta: {
                      ...prev.aiMeta,
                      summary
                    }
                  }));
                }}
              />
            </div>
          )}

        {/* AI Generated Metadata Display */}
        {post.aiMeta && (
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI-Generated Metadata
            </h3>

            {post.aiMeta.summary && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">📝 Summary (TL;DR)</h4>
                <p className="text-gray-600 bg-white p-3 rounded border">{post.aiMeta.summary}</p>
              </div>
            )}

            {post.aiMeta.seoTitle && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">🔍 SEO Title</h4>
                <p className="text-gray-600 bg-white p-3 rounded border">{post.aiMeta.seoTitle}</p>
              </div>
            )}

            {post.aiMeta.seoDescription && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">📄 Meta Description</h4>
                <p className="text-gray-600 bg-white p-3 rounded border">{post.aiMeta.seoDescription}</p>
              </div>
            )}

            {post.aiMeta.suggestedTags && post.aiMeta.suggestedTags.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">🏷️ AI Suggested Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.aiMeta.suggestedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {post.aiMeta.generatedAt && (
              <div className="text-xs text-gray-500 mt-4">
                Generated on {new Date(post.aiMeta.generatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.likeCount || 0} {post.likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {user && (
            (post.author && user.id === post.author._id) ||
            user.role === 'admin'
          ) && (
              <Link
                to={`/edit-post/${post._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Post
              </Link>
            )}

          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
};

export default PostDetails;