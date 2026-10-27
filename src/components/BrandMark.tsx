import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import campyLogo from '../assets/campy-logo.png';

const LOGO_SOURCES = [campyLogo, './logo.png?v=campy3', '/logo.png?v=campy3'];

export const BrandMark: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32
}) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = LOGO_SOURCES[sourceIndex];

  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-xl bg-[#F43F5E] ${className}`}
        style={{ width: size, height: size }}
      >
        <Heart className="h-4 w-4 fill-white text-white" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt="Campy"
      width={size}
      height={size}
      className={`rounded-xl object-cover ${className}`}
      style={{ width: size, height: size, backgroundColor: '#1A1A1A' }}
      onError={() => setSourceIndex(index => index + 1)}
    />
  );
};
