// src/Pages/Search.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Send,
  User,
  Bot,
  Sparkles,
  BookmarkPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const TypewriterText = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState("");
  const index = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayText((curr) => curr + text.charAt(index.current));
        index.current += 1;
        // Force scroll after each character
        if (containerRef.current) {
          const parentElement = containerRef.current.closest(".chat-messages");
          if (parentElement) {
            parentElement.scrollTop = parentElement.scrollHeight;
          }
        }
      } else {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, 20);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <div ref={containerRef} className="whitespace-pre-wrap">
      {displayText}
      {index.current < (text?.length || 0) && (
        <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
      )}
    </div>
  );
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const query = searchParams.get("q");
  const imageUrl = searchParams.get("img");
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [conversation, setConversation] = useState([]);
//   const [savedResponses, setSavedResponses] = useState([]);
  const { user } = useAuth();
  const chatContainerRef = useRef(null);

  // Scroll to bottom function
  //   const scrollToBottom = () => {
  //     if (chatContainerRef.current) {
  //       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //     }
  //   };

  const handleSaveResponse = async () => {
    if (!user) return;

    const saveData = {
      userId: user.id,
      query,
      response: result,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl || null,
    };

    const existingSaves = JSON.parse(
      localStorage.getItem("savedResponses") || "[]"
    );
    const newSaves = [...existingSaves, saveData];
    localStorage.setItem("savedResponses", JSON.stringify(newSaves));
    // setSavedResponses(newSaves);
  };

  const fetchAIResponse = async (searchQuery) => {
    setIsLoading(true);
    setError("");

    // Prepare the message content based on whether there's an image
    let messageContent;
    if (imageUrl) {
      messageContent = [
        {
          type: "text",
          text: searchQuery,
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
      ];
    } else {
      messageContent = searchQuery;
    }

    // Update conversation history with proper format
    const updatedConversation = [
      ...conversation,
      {
        role: "user",
        content: messageContent,
      },
    ];

    try {
      const response = await axios({
        method: "post",
        url: "http://34.28.28.107:30000/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
          messages: updatedConversation,
          stream: false,
        },
      });

      const newMessage = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };

      setConversation([...updatedConversation, newMessage]);
      setResult((prev) =>
        prev
          ? `${prev}\n\nQ: ${searchQuery}\nA: ${response.data.choices[0].message.content}`
          : response.data.choices[0].message.content
      );
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.error || "Failed to get response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize conversation when component mounts
  useEffect(() => {
    if (query) {
      // Set initial conversation with proper format
      const initialMessage = {
        role: "user",
        content: imageUrl
          ? [
              {
                type: "text",
                text: query,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ]
          : query,
      };

      setConversation([initialMessage]);
      fetchAIResponse(query);
    }
  }, [query, imageUrl]);

  // Handle follow-up questions
  const handleFollowUpSubmit = (e) => {
    e.preventDefault();
    if (followUpQuery.trim()) {
      fetchAIResponse(followUpQuery.trim());
      setFollowUpQuery("");
    }
  };

  useEffect(() => {
    if (isLoading || isTyping) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }
  }, [isLoading, isTyping]);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600/5 to-teal-600/5">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              AI Learning Assistant
            </h2>
          </div>

          {/* Chat Messages */}
          <div
            className="p-6 space-y-6 min-h-[500px] max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent chat-messages"
            ref={chatContainerRef}
          >
            {/* User Query */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="flex-1 bg-gray-100/80 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 text-gray-700">
                {query}
              </div>
            </div>

            {/* AI Response */}
            {(isLoading || result) && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="flex-1 bg-gradient-to-r from-blue-50/50 to-teal-50/50 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 text-gray-700">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <TypewriterText
                        text={result}
                        onComplete={() => {
                          setIsTyping(false);
                          // Final scroll to ensure we're at the bottom
                          if (chatContainerRef.current) {
                            setTimeout(() => {
                              chatContainerRef.current.scrollTop =
                                chatContainerRef.current.scrollHeight;
                            }, 100);
                          }
                        }}
                      />
                      {user && !isLoading && (
                        <button
                          onClick={handleSaveResponse}
                          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="Save to Study Room"
                        >
                          <BookmarkPlus size={20} className="text-blue-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-blue-600/5 to-teal-600/5">
            <form onSubmit={handleFollowUpSubmit} className="relative">
              <input
                type="text"
                value={followUpQuery}
                onChange={(e) => setFollowUpQuery(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="w-full px-6 py-4 bg-white/80 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-16 text-gray-700 placeholder-gray-500"
                disabled={isLoading || isTyping}
              />
              <button
                type="submit"
                disabled={isLoading || isTyping || !followUpQuery.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:hover:opacity-50 group overflow-hidden"
              >
                <Send size={20} className="relative z-10" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </form>
          </div>
        </div>

        {/* Powered By Badge */}
        {result && !isLoading && (
          <div className="mt-4 flex justify-end">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-gray-600">
              <Sparkles size={14} className="text-blue-600" />
              Powered by Llama-3.2-11B
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
