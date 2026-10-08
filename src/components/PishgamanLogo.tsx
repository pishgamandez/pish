import React from 'react';

interface Props {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PishgamanLogo: React.FC<Props> = ({
  className = '',
  variant = 'full',
  size = 'md'
}) => {
  // Dimensions based on size
  const dim = size === 'sm' ? 36 : size === 'lg' ? 72 : size === 'xl' ? 110 : 50;

  const blueColor = variant === 'white' ? '#FFFFFF' : '#1A367E';
  const greenColor = variant === 'white' ? '#4ADE80' : '#58B82A';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Crisp Circular Emblem */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        {/* Outer Navy Blue Sweeping Orbit Arc */}
        <path
          d="M 50 155 C 25 125, 20 80, 50 45 C 80 15, 130 15, 165 40 C 185 55, 195 80, 185 105 C 180 90, 168 70, 150 55 C 120 32, 75 35, 52 62 C 30 90, 35 125, 58 148 C 65 155, 75 160, 85 162 C 70 162, 58 160, 50 155 Z"
          fill={blueColor}
        />

        {/* Inner Green Arc */}
        <path
          d="M 75 145 C 55 125, 55 85, 78 58 C 102 32, 142 34, 165 58 C 172 65, 178 75, 180 82 C 176 72, 168 62, 158 54 C 135 36, 100 38, 80 60 C 60 82, 62 118, 78 138 C 82 143, 88 147, 95 150 C 86 149, 79 148, 75 145 Z"
          fill={greenColor}
        />

        {/* Central Sprout/Leaves - Center Leaf */}
        <path
          d="M 100 65 C 118 85, 122 120, 100 148 C 78 120, 82 85, 100 65 Z"
          fill={greenColor}
        />

        {/* Left Leaf */}
        <path
          d="M 100 135 C 78 130, 62 110, 68 95 C 82 92, 95 110, 100 135 Z"
          fill={greenColor}
        />

        {/* Right Leaf */}
        <path
          d="M 100 135 C 122 130, 138 110, 132 95 C 118 92, 105 110, 100 135 Z"
          fill={greenColor}
        />

        {/* Base Pod / Wave Under Leaves in Navy Blue */}
        <path
          d="M 52 148 C 75 138, 95 138, 100 150 C 105 138, 125 138, 148 148 C 125 156, 105 155, 100 148 C 95 155, 75 156, 52 148 Z"
          fill={blueColor}
        />
        <path
          d="M 68 152 C 90 146, 110 146, 140 152 C 165 156, 185 150, 195 142 C 182 152, 158 160, 135 157 C 105 153, 85 153, 68 152 Z"
          fill={blueColor}
        />
      </svg>

      {/* Typography Section */}
      {variant === 'full' && (
        <div className="flex flex-col text-right">
          <div
            className="text-lg sm:text-xl font-black tracking-wider uppercase flex items-center gap-0.5 leading-none"
            style={{ color: greenColor, fontFamily: 'system-ui, sans-serif' }}
          >
            <span>PISHGAMAN</span>
          </div>
          <div
            className="h-0.5 my-1 rounded-full opacity-80"
            style={{ backgroundColor: blueColor }}
          />
          <div
            className="text-xs sm:text-sm font-black leading-tight tracking-tight"
            style={{ color: blueColor }}
          >
            شرکت پیشگامان
          </div>
        </div>
      )}
    </div>
  );
};
