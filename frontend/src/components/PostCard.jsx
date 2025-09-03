import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Truncate the content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Function to extract plain text from HTML content
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  if (!post) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/posts/${post._id}`}>
        <img
          src={post.coverImage?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        {/* {console.log(post.coverImage?.url)} */}
      </Link>
      <div className="p-5">
        <div className="flex items-center mb-2">
          <img
            src={post.author?.profilePicture || 'https://via.placeholder.com/40'}
            alt={post.author?.username || 'Author'}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">
            {post.author ? `${post.author.firstname} ${post.author.lastname}` : 'Unknown author'}
          </span>
        </div>

        <Link to={`/posts/${post._id}`} className="block mb-2">
          <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 text-sm">
          {truncateContent(stripHtml(post.content))}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(post.createdAt)}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {post.likeCount || 0}
            </div>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.viewCount || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;