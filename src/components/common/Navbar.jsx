// src/components/common/Navbar.jsx
import React, { useState } from "react";
import Modal from "./Modal";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  // const navigate = Navigate()
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50">
        <div className="absolute inset-0 backdrop-blur-[8px]]" />
        <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/[0.2] to-transparent" />

        <div className="relative container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="inline-block relative overflow-hidden group"
            >
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300 flex gap-2 items-center">
              <img
        src='https://appcdn.goqii.com/storeimg/94339_1729905925.png'
        alt='SensAI'
        className='w-6 h-5 mx-auto transform hover:scale-105 transition-transform duration-300'
      />
                SensAI
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl" />
              {/* Underline effect */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5" />
              <div className="w-6 h-0.5 bg-gray-600 mb-1.5" />
              <div className="w-6 h-0.5 bg-gray-600" />
            </button>

            {/* Desktop Nav Buttons */}
            <div className="hidden md:flex gap-4 items-center">
              {user ? (
                <>
                  <span className="text-gray-700">Hello, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-105"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="relative group px-4 py-2 rounded-lg overflow-hidden transition-all hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-teal-600/80 backdrop-blur-sm" />
                    {/* Added shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative text-white font-medium">
                      Sign Up
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel rounded-lg md:hidden">
                {user ? (
                  <>
                    <div className="text-gray-700 mb-2">Hello, {user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="block w-full py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="block w-full py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsSignupOpen(true);
                      }}
                      className="relative group block w-full mt-2 py-2 rounded-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600" />
                      {/* Added shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative text-white font-medium">
                        Sign Up
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </Modal>

      {/* Signup Modal */}
      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <SignupForm
          onClose={() => setIsSignupOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </Modal>
    </>
  );
};

export default Navbar;
