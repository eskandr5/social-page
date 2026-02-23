import React from 'react';

const DeleteModal = ({ onClose, onConfirm, title = "Delete Post?", description = "This action cannot be undone. This will permanently delete your data." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 1. الخلفية المظلمة (Overlay) */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} // الإغلاق عند الضغط خارج النافذة
      ></div>

      {/* 2. جسم النافذة (Modal Body) */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          
          {/* أيقونة التحذير */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-8">
            {description}
          </p>

          {/* الأزرار */}
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-shadow shadow-lg shadow-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;