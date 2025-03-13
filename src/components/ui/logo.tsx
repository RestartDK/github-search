import React from "react";

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 128 128" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_83_434)">
        <path 
          d="M112 112L89.0664 89.0664M101.333 58.6667C101.333 82.2308 82.2308 101.333 58.6667 101.333C35.1025 101.333 16 82.2308 16 58.6667C16 35.1025 35.1025 16 58.6667 16C82.2308 16 101.333 35.1025 101.333 58.6667Z" 
          stroke="currentColor" 
          strokeWidth="9" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M74 64.5C69.8579 64.5 66.5 67.8579 66.5 72C66.5 76.1421 69.8579 79.5 74 79.5C78.1421 79.5 81.5 76.1421 81.5 72C81.5 67.8579 78.1421 64.5 74 64.5ZM74 64.5V47C74 45.6739 73.4732 44.4021 72.5355 43.4645C71.5979 42.5268 70.3261 42 69 42H61.5M44 49.5C48.1421 49.5 51.5 46.1421 51.5 42C51.5 37.8579 48.1421 34.5 44 34.5C39.8579 34.5 36.5 37.8579 36.5 42C36.5 46.1421 39.8579 49.5 44 49.5ZM44 49.5V79.5" 
          stroke="currentColor" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_83_434">
          <rect width="128" height="128" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}; 