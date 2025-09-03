import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import PostCard from './PostCard';
import SearchBar from './SearchBar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async (term = '') => {
    setLoading(true);
    let url = '/posts/all';
    if (term) {
      url = `/posts/search?q=${encodeURIComponent(term)}`;
    }
    const response = await axiosInstance.get(url);
    setPosts(response.data.posts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(); // Load all posts initially
  }, []);

const handleSearch = (term) => {
  setSearchTerm(term);
  fetchPosts(term);
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Blog Posts</h1> */}

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;