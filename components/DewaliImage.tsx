import React from 'react';

interface TopRightImageProps {
  src: string;
  alt?: string;
  size?: number; // in pixels (default: 60)
  offset?: number; // distance from top and right edges (default: 20)
}

const TopRightImage: React.FC<TopRightImageProps> = ({
  alt = "Top-right image",
  size = 60,
  offset = 20,
}) => {
  return (
    <img
      src={'/anime/dewali.png'}
      alt={alt}
      style={{
        opacity:0.9,
        position: 'fixed',
        top: `${0}px`,
        right: `${5}px`,
        width: `${200}px`,
        height: 'auto',
        zIndex: 100, // Ensure it's above all other content
        pointerEvents: 'none', // Optional: prevents interaction
        borderRadius: '8px', // Optional: soft corners
      }}
    />
  );
};

export default TopRightImage;