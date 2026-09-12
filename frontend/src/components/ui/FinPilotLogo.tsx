import React from 'react';

interface FinPilotLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const FinPilotLogo: React.FC<FinPilotLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4', text: 'text-lg' },
    md: { box: 'w-9 h-9 rounded-xl', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-8 h-8', text: 'text-2xl' },
    xl: { box: 'w-16 h-16 rounded-2xl', icon: 'w-9 h-9', text: 'text-3xl' }
  };

  const { box, icon, text } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* FinPilot Icon: Futuristic soaring pilot chevron / paper plane with financial guidance trails */}
      <div 
        className={`${box} bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0 transition-transform duration-300 hover:scale-105`}
      >
        <svg 
          className={`${icon} text-white drop-shadow-sm`} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main soaring jet / paper-plane */}
          <path 
            d="M21.5 2.5L10 14L13.5 21.5L21.5 2.5Z" 
            fill="currentColor" 
            fillOpacity="0.95" 
          />
          <path 
            d="M21.5 2.5L2.5 10.5L10 14L21.5 2.5Z" 
            fill="currentColor" 
            fillOpacity="0.75" 
          />
          {/* Pilot flight trails indicating guidance and upward growth */}
          <path 
            d="M5 17L8 14" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.9" 
          />
          <path 
            d="M3 21L6 18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.5" 
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-tight ${text} text-gray-900 dark:text-white`}>
          Fin<span className="text-emerald-500 dark:text-emerald-400">Pilot</span>
        </span>
      )}
    </div>
  );
};
