import React, { useState } from 'react';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const [hovered, setHovered] = useState(false);
  const [notification, setNotification] = useState('');

  const isFavorite = isInWishlist(product.id);
  const hasDiscount = product.discountPrice !== null;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  
  // Decide which image to show
  const displayImage = hovered && product.images.length > 1 
    ? product.images[1] 
    : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) return;

    // Use first size/color as default for quick-add
    const defaultSize = product.sizes[0] || 'Free Size';
    const defaultColor = product.colors[0]?.name || 'Default';

    addToCart(product, 1, defaultSize, defaultColor);
    setNotification('Added to Bag!');
    setTimeout(() => setNotification(''), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      className="card-luxury" 
      style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={`#/product/${product.id}`} style={styles.imageLink}>
        {/* Badges Container */}
        <div style={styles.badgeContainer}>
          {product.isNewArrival && <span className="badge badge-new" style={styles.badge}>New</span>}
          {product.isTrending && <span className="badge badge-trending" style={styles.badge}>Trending</span>}
          {hasDiscount && <span className="badge badge-sale" style={styles.badge}>Sale</span>}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          style={{
            ...styles.wishlistBtn,
            color: isFavorite ? 'var(--color-accent-dark)' : 'var(--color-charcoal-light)',
            backgroundColor: isFavorite ? 'var(--color-pink-soft)' : 'rgba(255, 255, 255, 0.85)'
          }}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <FiHeart size={18} fill={isFavorite ? 'var(--color-accent-dark)' : 'none'} />
        </button>

        {/* Mobile-Only Quick Add Button */}
        <button 
          className="mobile-quick-add-btn"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          style={{
            ...styles.wishlistBtn,
            top: '54px',
            color: 'var(--color-white)',
            backgroundColor: product.stock <= 0 ? 'var(--color-charcoal-light)' : 'var(--color-charcoal)',
            opacity: product.stock <= 0 ? 0.6 : 0.9,
            display: 'none', // Overridden by media query
          }}
          title={product.stock <= 0 ? 'Sold Out' : 'Quick Add to Bag'}
        >
          <FiShoppingBag size={16} />
        </button>

        {/* Product Image Frame */}
        <div style={styles.imageFrame}>
          <img 
            src={displayImage} 
            alt={product.name} 
            style={{
              ...styles.image,
              transform: hovered ? 'scale(1.05)' : 'scale(1)'
            }} 
          />
        </div>

        {/* Hover Quick Actions overlay */}
        <div style={{
          ...styles.overlayActions,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)'
        }}>
          <button 
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            style={{
              ...styles.actionBtn,
              backgroundColor: product.stock <= 0 ? 'var(--color-border)' : 'var(--color-charcoal)',
              color: product.stock <= 0 ? 'var(--color-charcoal-light)' : 'var(--color-white)',
              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FiShoppingBag size={14} />
            <span>{product.stock <= 0 ? 'SOLD OUT' : 'QUICK ADD'}</span>
          </button>
        </div>
      </a>

      {/* Details Box */}
      <div style={styles.details}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.name}>
          <a href={`#/product/${product.id}`} style={styles.nameLink}>{product.name}</a>
        </h3>
        
        {/* Rating Row */}
        <div style={styles.ratingRow}>
          <div style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                size={12} 
                color={i < Math.round(product.rating) ? '#C5A059' : '#EAE3D5'} 
              />
            ))}
          </div>
          <span style={styles.reviewsCount}>({product.reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div style={styles.priceRow}>
          {hasDiscount ? (
            <>
              <span style={styles.discountPrice}>₹{currentPrice.toLocaleString('en-IN')}</span>
              <span style={styles.originalPrice}>₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span style={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        {notification && (
          <div style={styles.toastNotification}>
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  imageLink: {
    position: 'relative',
    display: 'block',
    width: '100%',
    paddingTop: '125%', /* 4:5 Aspect Ratio for high-end boutique display */
    overflow: 'hidden',
    backgroundColor: '#FAF7F3',
  },
  imageFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.5s ease',
  },
  badgeContainer: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  badge: {
    padding: '4px 8px',
    fontSize: '0.65rem',
  },
  wishlistBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 5,
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'var(--transition-fast)',
  },
  overlayActions: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    right: '12px',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
    transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '0.8rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    border: 'none',
    borderRadius: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  details: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    position: 'relative',
  },
  category: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginBottom: '0.4rem',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.4,
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-serif)',
  },
  nameLink: {
    color: 'var(--color-charcoal)',
    transition: 'var(--transition-fast)',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '0.8rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  reviewsCount: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginTop: 'auto',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  discountPrice: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-accent-dark)',
  },
  originalPrice: {
    fontSize: '0.85rem',
    textDecoration: 'line-through',
    color: 'var(--color-charcoal-light)',
  },
  toastNotification: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textAlign: 'center',
    padding: '6px 0',
    animation: 'fadeIn 0.2s ease',
  }
};

const injectProductCardStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 767px) {
      .mobile-quick-add-btn {
        display: flex !important;
      }
      div[style*="details"] {
        padding: 0.8rem !important;
      }
      h3[style*="name"] {
        font-size: 0.85rem !important;
        margin-bottom: 0.3rem !important;
        height: 2.6em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      span[style*="category"] {
        font-size: 0.6rem !important;
      }
      div[style*="priceRow"] span {
        font-size: 0.95rem !important;
      }
      div[style*="ratingRow"] {
        margin-bottom: 0.4rem !important;
        gap: 3px !important;
      }
    }
    @media (min-width: 768px) {
      .mobile-quick-add-btn {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectProductCardStyles();
}
