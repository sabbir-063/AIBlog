import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('profile-info');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow p-4">
            {/* User info summary */}
            <div className="flex items-center mb-6">
              <img 
                src={user?.profileImage?.url || user?.profilePicture || 'https://via.placeholder.com/100'} 
                alt={user?.username} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{user?.firstname} {user?.lastname}</h2>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>
            
            {/* Navigation links */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile-info')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'profile-info' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('change-password')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'change-password' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'my-posts' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                My Posts
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content area */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Conditional content based on active tab */}
            {activeTab === 'profile-info' && <ProfileInfo />}
            {activeTab === 'change-password' && <ChangePassword />}
            {activeTab === 'my-posts' && <MyPosts />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    username: user?.username || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage?.url || user?.profilePicture || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
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
    
    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const updateData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          updateData.append(key, formData[key]);
        }
      });
      
      // Append file if exists
      if (profilePicture) {
        updateData.append('profilePicture', profilePicture);
      }
      
      // Make API call
      const response = await axiosInstance.put('/user/profile', updateData);
      
      // Update user in context/local storage
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser); // Update auth context
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img 
              src={previewUrl || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover"
            />
            <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
            <input 
              type="file" 
              id="profile-picture" 
              name="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axiosInstance.put('/user/password', formData);
      
      toast.success('Password updated successfully');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};


const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/user/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setError('Failed to fetch your posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPosts();
  }, []);
  
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        
        // Remove deleted post from state
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.error || 'Failed to delete post');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Posts</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't created any posts yet.</p>
          <button
            onClick={() => navigate('/create-post')}
            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  <a href={`/posts/${post._id}`} className="hover:text-blue-600">
                    {post.title}
                  </a>
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()} • {post.viewCount} views • {post.likeCount} likes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;