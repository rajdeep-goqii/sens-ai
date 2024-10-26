// src/Pages/StudyRoom.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Search,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Youtube,
  BookmarkPlus,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";

const StudyRoom = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notes"); // 'notes' or 'videos'
  const [savedItems, setSavedItems] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoSearchTerm, setVideoSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [videos, setVideos] = useState([]);
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile, "unnamed.png");

    try {
      const response = await axios({
        method: "post",
        url: "https://apiv7.goqii.com/user/upload_endoded_image",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Parse the response text since it might come as a string
      const result =
        typeof response.data === "string"
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

  useEffect(() => {
    const savedImages = JSON.parse(
      localStorage.getItem("uploadedImages") || "[]"
    );
    setUploadedImages(savedImages.filter((img) => img.userId === user?.id));
  }, [user]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const imageUrl = await uploadImage(file);
      const newImage = {
        userId: user.id,
        url: imageUrl,
        timestamp: new Date().toISOString(),
        name: file.name,
      };

      const updatedImages = [...uploadedImages, newImage];
      setUploadedImages(updatedImages);
      localStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageDelete = (timestamp) => {
    const newImages = uploadedImages.filter(
      (img) => img.timestamp !== timestamp
    );
    localStorage.setItem("uploadedImages", JSON.stringify(newImages));
    setUploadedImages(newImages);
  };

  useEffect(() => {
    // Load saved notes
    const items = JSON.parse(localStorage.getItem("savedResponses") || "[]");
    setSavedItems(items.filter((item) => item.userId === user?.id));

    // Load saved videos
    const videos = JSON.parse(localStorage.getItem("savedVideos") || "[]");
    setSavedVideos(videos.filter((video) => video.userId === user?.id));
  }, [user]);

  // YouTube search function
  const searchYoutubeVideos = async (query) => {
    if (!query.trim()) return;

    setIsSearchingVideos(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            key: "AIzaSyD3Ge_fBB2GCroi5Wn3P0Us2ekTtPo5vKo",
            maxResults: 5,
          },
        }
      );

      const formattedVideos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
        timestamp: new Date().toISOString(),
      }));

      setVideos(formattedVideos);
    } catch (error) {
      console.error("YouTube API Error:", error);
    } finally {
      setIsSearchingVideos(false);
    }
  };

  // Save video function
  const handleSaveVideo = (video) => {
    const videoToSave = {
      ...video,
      userId: user.id,
      savedAt: new Date().toISOString(),
    };

    const existingVideos = JSON.parse(
      localStorage.getItem("savedVideos") || "[]"
    );
    const newVideos = [...existingVideos, videoToSave];
    localStorage.setItem("savedVideos", JSON.stringify(newVideos));
    setSavedVideos((prevVideos) => [...prevVideos, videoToSave]);
  };

  // Delete video function
  const handleDeleteVideo = (videoId) => {
    const newVideos = savedVideos.filter((video) => video.id !== videoId);
    localStorage.setItem("savedVideos", JSON.stringify(newVideos));
    setSavedVideos(newVideos);
  };

  const handleDelete = (timestamp) => {
    const newItems = savedItems.filter((item) => item.timestamp !== timestamp);
    localStorage.setItem("savedResponses", JSON.stringify(newItems));
    setSavedItems(newItems);
  };

  const toggleExpand = (timestamp) => {
    setExpandedItems((prev) => ({
      ...prev,
      [timestamp]: !prev[timestamp],
    }));
  };

  const filteredItems = savedItems.filter(
    (item) =>
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header with Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 md:p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  My Study Room
                </h1>
              </div>
              <div className="flex flex-wrap w-full sm:w-auto gap-2 md:gap-4">
                <button
                  onClick={() => setActiveTab("self")}
                  className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg transition-all text-sm md:text-base ${
                    activeTab === "self"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Self - Notes
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === "notes"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  AI - Notes
                </button>
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === "videos"
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "notes" && (
          // Notes Section
          <div>
            {/* Search Bar for Notes */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search saved notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Saved Notes List */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.timestamp}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-200 hover:shadow-xl divide-y divide-gray-100/50"
                >
                  <div className="p-6">
                    {/* Query Section */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.query}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                          {item.imageUrl && (
                            <span className="flex items-center gap-1">
                              <ImageIcon size={14} />
                              Image Included
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(item.timestamp)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {expandedItems[item.timestamp] ? (
                            <ChevronUp size={20} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item.timestamp)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} className="text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Response Section */}
                    {expandedItems[item.timestamp] && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {/* Content Container */}
                        <div className="space-y-8">
                          {/* Main sections */}
                          {item.response.split("\n\n").map((section, index) => {
                            // Check if it's a heading (no colon and short)
                            if (!section.includes(":") && section.length < 50) {
                              return (
                                <h3
                                  key={index}
                                  className="text-xl font-semibold text-gray-800 mb-4"
                                >
                                  {section.replace(/\*\*/g, "")}
                                </h3>
                              );
                            }

                            // Check if it's a sub-heading with content
                            if (section.includes("\n")) {
                              const [title, ...content] = section.split("\n");
                              return (
                                <div key={index} className="space-y-4">
                                  {/* Sub-heading */}
                                  <h4 className="text-lg font-medium text-gray-700">
                                    {title.replace(/\*\*/g, "")}
                                  </h4>
                                  {/* Content */}
                                  {content.map((paragraph, pIndex) => {
                                    if (paragraph.startsWith(":")) {
                                      return (
                                        <p
                                          key={pIndex}
                                          className="text-gray-600 pl-4 border-l-2 border-gray-200"
                                        >
                                          {paragraph.replace(":", "").trim()}
                                        </p>
                                      );
                                    }
                                    return (
                                      <p key={pIndex} className="text-gray-600">
                                        {paragraph}
                                      </p>
                                    );
                                  })}
                                </div>
                              );
                            }

                            // Regular paragraphs
                            return (
                              <p
                                key={index}
                                className="text-gray-600 leading-relaxed"
                              >
                                {section}
                              </p>
                            );
                          })}

                          {/* Numbered Features/Points */}
                          <div className="space-y-6">
                            {item.response
                              .match(/\d+\.\s[^.]*/g)
                              ?.map((point, index) => {
                                const [number, ...text] = point.split(".");
                                return (
                                  <div
                                    key={index}
                                    className="flex items-start gap-4"
                                  >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium">
                                        {number}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-gray-700">
                                        {text.join(".").trim()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No saved notes yet
                  </h3>
                  <p className="text-gray-500">
                    Your saved responses will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          // Videos Section
          <div className="space-y-6">
            {/* Video Search */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  value={videoSearchTerm}
                  onChange={(e) => setVideoSearchTerm(e.target.value)}
                  placeholder="Search for educational videos..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-sm sm:placeholder:text-base"
                  onKeyPress={(e) =>
                    e.key === "Enter" && searchYoutubeVideos(videoSearchTerm)
                  }
                />
                <button
                  onClick={() => searchYoutubeVideos(videoSearchTerm)}
                  disabled={isSearchingVideos}
                  className="w-full sm:w-auto min-w-[100px] px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
                >
                  {isSearchingVideos ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Search Results */}
            {videos.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-40 h-24 relative group"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Youtube className="text-white" size={24} />
                        </div>
                      </a>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 line-clamp-2">
                          {video.title}
                        </h4>
                        <button
                          onClick={() => handleSaveVideo(video)}
                          className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <BookmarkPlus size={16} />
                          Save Video
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Videos */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Saved Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex flex-col xs:flex-row gap-3 md:gap-4 p-3 md:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full xs:w-40 h-48 xs:h-24 relative group"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Youtube className="text-white" size={24} />
                      </div>
                    </a>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 line-clamp-2 text-sm md:text-base">
                        {video.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Saved on {new Date(video.savedAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="mt-2 flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {savedVideos.length === 0 && (
                <div className="text-center py-12">
                  <Youtube className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No saved videos yet
                  </h3>
                  <p className="text-gray-500">
                    Search and save videos to watch later
                  </p>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isSearchingVideos && videos.length === 0 && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for videos...</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "self" && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </label>
                {uploadError && (
                  <div className="mt-2 text-red-500 text-sm">{uploadError}</div>
                )}
              </div>
            </div>

            {/* Images Grid */}
            {uploadedImages.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.timestamp}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <a
                            href={image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <ImageIcon className="w-5 h-5 text-white" />
                          </a>
                          <button
                            onClick={() => handleImageDelete(image.timestamp)}
                            className="p-2 bg-white/10 rounded-full hover:bg-red-500/50 transition-colors"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                      {/* Date overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                        {new Date(image.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {uploadedImages.length === 0 && !isUploading && (
              <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl border border-white/20">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No images uploaded yet
                </h3>
                <p className="text-gray-500">
                  Upload images to start your collection
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRoom;
