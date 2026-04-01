import React from 'react';

const TOPS_LOGO_PNG_SRC = '/images/logo-transparent.png';

export default function AppLogo({ className = '', height = 44 }) {
  return (
    <img
      src={TOPS_LOGO_PNG_SRC}
      alt="TOPS Technologies"
      className={className}
      style={{
        height,
        width: 'auto',
        maxWidth: 240,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0
      }}
      loading="eager"
      decoding="async"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

