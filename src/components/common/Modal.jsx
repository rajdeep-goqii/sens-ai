// src/components/common/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/[0.2] to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;