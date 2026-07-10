import React, { useState, useRef, useEffect } from 'react';

interface ProductZoomProps {
  src: string;
  alt: string;
}

export const ProductZoom: React.FC<ProductZoomProps> = ({ src, alt }) => {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    display: 'none',
    backgroundImage: `url(${src})`,
    backgroundPosition: '0% 0%',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Keep background image in sync when product image changes
  useEffect(() => {
    setZoomStyle(prev => ({
      ...prev,
      backgroundImage: `url(${src})`
    }));
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to percentage
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${src})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundSize: '220%', // Zoom factor (2.2x magnification)
      left: `${x - 75}px`, // Center lens on mouse
      top: `${y - 75}px`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(prev => ({ ...prev, display: 'none' }));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={styles.container}
    >
      <img src={src} alt={alt} style={styles.image} />
      {/* Magnifier Lens */}
      <div style={{ ...styles.zoomLens, ...zoomStyle }} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    cursor: 'zoom-in',
    backgroundColor: '#FAF7F3',
    border: '1px solid var(--color-border)',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  },
  zoomLens: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '2px solid var(--color-primary)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    pointerEvents: 'none', // Critical so mouse events fall through to container
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
};
