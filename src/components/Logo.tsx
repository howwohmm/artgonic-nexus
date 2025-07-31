
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { container: 'h-8', icon: 'w-8 h-8', text: 'text-xl', subscript: 'text-[10px]' },
    md: { container: 'h-12', icon: 'w-12 h-12', text: 'text-3xl', subscript: 'text-xs' },
    lg: { container: 'h-16', icon: 'w-16 h-16', text: 'text-4xl', subscript: 'text-sm' }
  };

  const { container, icon, text, subscript } = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-3 ${container} ${className}`}>
      {/* Geometric logo icon */}
      <div className={`${icon} relative flex items-center justify-center`}>
        {/* Outer circle */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
        
        {/* Inner geometric shape - triangle pointing up */}
        <div className="w-5 h-5 relative">
          <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-0" 
               style={{
                 clipPath: 'polygon(50% 20%, 80% 80%, 20% 80%)'
               }}>
          </div>
        </div>
        
        {/* Small dot accent */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      </div>

      {/* Text logo */}
      {showText && (
        <div className="flex items-baseline">
          <span className={`font-bold ${text} text-gray-900 dark:text-white tracking-tight`}>
            Art Gonic
          </span>
          <span className={`${subscript} text-gray-500 dark:text-gray-400 ml-1 font-medium`}>
            by ohm.
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
