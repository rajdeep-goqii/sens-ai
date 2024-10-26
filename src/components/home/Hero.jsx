import React, { useState, useRef } from 'react';
import { Search, Paperclip, X, BookOpen, Loader } from 'lucide-react';
import { Parallax } from 'react-scroll-parallax';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile, "unnamed.png");
      
        try {
          const response = await axios({
            method: 'post',
            url: 'https://apiv7.goqii.com/user/upload_endoded_image',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
      
          // Parse the response text since it might come as a string
          const result = typeof response.data === 'string' 
            ? JSON.parse(response.data) 
            : response.data;
      
          console.log("Upload Response:", result);
          
          if (result && result.data && result.data.image) {
            return result.data.image;
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
        }
      };
      
      // Update handleSearch to better handle the upload result
      const handleSearch = async (e) => {
        e.preventDefault();
        
        try {
          if (selectedFile && searchQuery.trim()) {
            setIsUploading(true);
            const imageUrl = await uploadImage(selectedFile);
            if (imageUrl) {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&img=${encodeURIComponent(imageUrl)}`);
            } else {
              setError('Failed to process uploaded image');
            }
          } else if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
          }
        } catch (err) {
          setError(err.message || 'Failed to upload image. Please try again.');
        } finally {
          setIsUploading(false);
        }
      };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Handle file validation and selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        e.target.value = null;
        return;
      }

      // Check file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        e.target.value = null;
        return;
      }

      setSelectedFile(file);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Parallax speed={-10}>
      <div className="flex flex-col items-center justify-center pt-20 px-4">
        {/* Logo Section */}
        <div className="text-center space-y-6 mb-12 flex flex-col items-center justify-center -ml-16">
            <div className='flex flex-row justify-center items-start'>
    {/* Logo Image */}
    <div className="relative inline-block">
      <img
        src='https://appcdn.goqii.com/storeimg/94339_1729905925.png'
        alt='SensAI'
        className='w-32 md:w-40 mx-auto transform hover:scale-105 transition-transform duration-300'
      />
      
      {/* Gradient overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-teal-500/0 to-blue-600/0 hover:via-teal-500/10 transition-all duration-300 rounded-lg"></div>
    </div>

    {/* Text Logo */}
    <h1 className="text-6xl md:text-8xl font-bold tracking-tight inline-flex items-center justify-center">
      <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
        Sens
      </span>
      <span className="relative">
        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">A</span>
      </span>
      <span className="relative inline-flex items-center">
        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">I</span>
        <span className="absolute -top-1 right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-bounce" />
      </span>
    </h1>
            </div>

    {/* Tagline Section with enhanced typing effect */}
    <div className="mt-8 ml-16">
      <div className="relative inline-flex items-center bg-gradient-to-r from-gray-900/5 to-gray-900/0 rounded-lg px-6 py-2">
        <span className="animate-typing overflow-hidden whitespace-nowrap text-xl md:text-2xl font-light text-gray-700">
          Sense the Future of Learning
        </span>
        <span className="animate-cursor ml-1 h-7 w-[3px] bg-gradient-to-b from-blue-600 to-teal-600 inline-block rounded-full" />
      </div>
    </div>
  </div>

        {/* Study Room Button - Only shows for logged in users */}
        {user && (
          <div className="w-full max-w-3xl mx-auto">
            <Link 
              to="/studyroom" 
              className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-all group"
            >
              <BookOpen 
                size={20} 
                className="mr-2 group-hover:scale-110 transition-transform" 
              />
              <span className="relative mb-1">
                My StudyRoom
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>
          </div>
        )}

        {/* Search Bar with File Upload */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-200" />
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask SensAI..."
              className="w-full px-6 py-4 bg-white rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none text-lg shadow-lg"
            />
            
            {/* File Upload for logged-in users */}
            {user && (
              <div className="absolute right-14">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="file-upload"
                  className={`cursor-pointer p-2 transition-colors ${
                    isUploading ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                   {isUploading ? (
                    <Loader className="animate-spin" size={24} />
                  ) : (
                    <Paperclip size={24} />
                  )}
                </label>
              </div>
            )}

<button 
              type="submit"
              disabled={isUploading}
              className="absolute right-3 p-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUploading ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                <Search size={24} />
              )}
            </button>
          </div>

          {/* File Preview and Error Message */}
          {(selectedFile || error) && (
            <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg p-3">
              {error ? (
                <div className="text-red-500 text-sm flex items-center">
                  <X size={16} className="mr-2" />
                  {error}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="w-8 h-8 object-cover rounded mr-2"
                    />
                    <span className="text-sm text-gray-600 truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isUploading}
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Quick suggestion pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-full text-sm transition-colors border border-gray-200">
            Mathematics
          </button>
          <button className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-full text-sm transition-colors border border-gray-200">
            Computer Science
          </button>
          <button className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-full text-sm transition-colors border border-gray-200">
            Physics
          </button>
        </div>
      </div>
    </Parallax>
  );
};

export default Hero;