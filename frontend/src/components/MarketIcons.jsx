import React from "react";

// Original stylised icons evoking each marketplace category.

export const LimitedsIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-primary">
    <path
      d="M12 2.5c-4.3 0-7.6 3.2-7.6 7.3 0 2.2 1 4.1 2.6 5.4.3.2.5.6.5 1v1.3c0 .7.6 1.3 1.3 1.3h.6v-1.9h1.4v1.9h2.4v-1.9h1.4v1.9h.6c.7 0 1.3-.6 1.3-1.3V16.2c0-.4.2-.8.5-1 1.6-1.3 2.6-3.2 2.6-5.4 0-4.1-3.3-7.3-7.6-7.3z"
      fill="currentColor"
    />
    <circle cx="9" cy="10.5" r="1.9" fill="#0b0b0e" />
    <circle cx="15" cy="10.5" r="1.9" fill="#0b0b0e" />
  </svg>
);

export const ToyCodesIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="toyTongue" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ff3b3b" />
        <stop offset="0.3" stopColor="#ffb13b" />
        <stop offset="0.55" stopColor="#37d35a" />
        <stop offset="0.8" stopColor="#3b9bff" />
        <stop offset="1" stopColor="#a24bff" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#f3f3f5" />
    <ellipse cx="8.8" cy="9.8" rx="1.5" ry="2.1" fill="#1a1a1a" />
    <ellipse cx="15.2" cy="9.8" rx="1.5" ry="2.1" fill="#1a1a1a" />
    <path d="M8.6 13.2h6.8v1.8a3.4 3.4 0 0 1-6.8 0v-1.8z" fill="url(#toyTongue)" />
  </svg>
);

export const Cs2Icon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <circle cx="8.2" cy="5.4" r="2.1" />
    <path d="M3 10.7l6.4-1.1c.7-.1 1.4.1 1.9.6l2 1.9 4.2-1.2.6 1.9-4.1 1.2c-.5.1-1 0-1.4-.3l-.9-.8-.2 1.3 2.1 2c.3.3.5.7.5 1.1V21h-2v-3.2l-2.4-2.2-.7 3.4L3.1 21l-.3-2 4.5-1 1-5-3.9.7L3 10.7z" />
    <rect x="2.6" y="11.4" width="10" height="1.5" rx="0.7" transform="rotate(-9 7.6 12.1)" />
  </svg>
);

export const RustIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <path d="M4.3 3.7l3.3 3.3 1.8-1.8 1.4 1.4-1.8 1.8 2.3 2.3 1.9-1.9c.9.4 2 .2 2.8-.6a2.6 2.6 0 0 0 .3-3.3l-1.4 1.4-1.3-.3-.3-1.3L17 3.3a2.6 2.6 0 0 0-3.3.3c-.8.8-1 1.9-.6 2.8l-1.9 1.9-2.3-2.3 1.8-1.8-1.4-1.4-1.8 1.8-3.3-3.3z" />
    <path d="M12.4 12.6l5.3 5.3c.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0l-5.3-5.3 2.1-2.1z" />
  </svg>
);

export const marketIcons = {
  limiteds: LimitedsIcon,
  toycodes: ToyCodesIcon,
  cs2: Cs2Icon,
  rust: RustIcon,
};
