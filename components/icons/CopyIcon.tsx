import React from 'react';

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 16.5v-13z" />
    <path d="M5 5.5A1.5 1.5 0 016.5 4h.5a.75.75 0 000-1.5h-.5A2.5 2.5 0 004 5v11.5A1.5 1.5 0 005.5 18h7a.75.75 0 000-1.5h-7A.5.5 0 015 16.5V5.5z" />
  </svg>
);