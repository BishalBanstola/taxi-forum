import { Link, Outlet } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
  const isAuthenticated = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Forum
            </Link>
            <div className="hidden md:flex ml-4 space-x-4">
              <Link to="/" className="text-gray-300">
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/account" className="text-gray-300">
                    Account
                  </Link>
                  <Link to="/create" className="text-gray-300">
                    Create Post
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 focus:outline-none"
            >
              {/* Hamburger Icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  localStorage.removeItem('refreshToken');
                  navigate('/login');
                }}
                className="text-gray-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => console.log('logged in')}
                className="text-gray-300"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2">
            <Link
              to="/"
              className="block text-gray-300 py-2 px-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/account"
                  className="block text-gray-300 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/create"
                  className="block text-gray-300 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Post
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  localStorage.removeItem('refreshToken');
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 py-2 px-4"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log('logged in');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left text-gray-300 py-2 px-4"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};
