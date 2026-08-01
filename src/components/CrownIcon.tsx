import React from 'react';

export default function CrownIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      {/* Rolex-style 5-point crown */}
      <path d="M12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5.5 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM21 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM3 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      <path d="M12 19c-1.66 0-3-1.34-3-3 0-.35.07-.69.18-1L5 11l4 2 3-6 3 6 4-2-4.18 4c.11.31.18.65.18 1 0 1.66-1.34 3-3 3z" />
    </svg>
  );
}
