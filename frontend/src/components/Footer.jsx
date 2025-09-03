import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold">AI Blog</Link>
            <p className="mt-2 text-sm text-gray-400">
              Share your knowledge and ideas with the world.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-400 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/create-post" className="text-sm text-gray-400 hover:text-white">Create Post</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/login" className="text-sm text-gray-400 hover:text-white">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-400 hover:text-white">Register</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-400">
            © {currentYear} AI Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;