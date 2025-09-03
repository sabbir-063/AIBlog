import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/posts/${id}`);
        const post = response.data;
        
        // Check if user is authorized to edit this post
        if (user && post.author && user.id !== post.author._id && user.role !== 'admin') {
          toast.error('You do not have permission to edit this post');
          navigate(`/posts/${id}`);
          return;
        }
        
        setOriginalPost(post);
        setFormData({
          title: post.title || '',
          content: post.content || '',
          tags: post.tags ? post.tags.join(', ') : ''
        });
        
        if (post.coverImage && post.coverImage.url) {
          setPreviewUrl(post.coverImage.url);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, user, navigate]);

  // Redirect if not author/admin
  useEffect(() => {
    if (!isLoading && !error && user && originalPost && 
        originalPost.author && user.id !== originalPost.author._id && 
        user.role !== 'admin' && user.role !== 'author') {
      toast.error('You do not have permission to edit this post');
      navigate(`/posts/${id}`);
    }
  }, [isLoading, error, user, originalPost, navigate, id]);

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
    
    setIsSaving(true);
    
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
      
      // Make API call to update post
      const response = await axiosInstance.put(`/posts/${id}`, postData);
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${response.data._id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate(`/posts/${id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Post
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>
      
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
            Cover Image
          </label>
          <div className="mt-1">
            {previewUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current image:</p>
                <img 
                  src={previewUrl} 
                  alt="Cover preview" 
                  className="h-48 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="flex items-center">
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <p className="mt-1 text-xs text-gray-500">
              Only upload a new image if you want to replace the current one.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;