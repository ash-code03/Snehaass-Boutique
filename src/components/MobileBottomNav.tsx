import React, { useState } from 'react';
import { FiHome, FiGrid, FiSearch, FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

interface MobileBottomNavProps {
  onOpenCartDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCartDrawer }) => {
  const { cart, wishlist } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.hash = `#/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const currentHash = window.location.hash || '#/';

  return (
    <>
      <div className="mobile-bottom-nav" style={styles.navBar}>
        <a 
          href="#/" 
          style={{
            ...styles.navItem,
            color: currentHash === '#/' || currentHash === '#' ? 'var(--color-primary)' : 'var(--color-charcoal-light)'
          }}
        >
          <FiHome size={20} />
          <span style={styles.navLabel}>Home</span>
        </a>

        <a 
          href="#/shop" 
          style={{
            ...styles.navItem,
            color: currentHash.startsWith('#/shop') ? 'var(--color-primary)' : 'var(--color-charcoal-light)'
          }}
        >
          <FiGrid size={20} />
          <span style={styles.navLabel}>Shop</span>
        </a>

        <button 
          onClick={() => setSearchOpen(true)} 
          style={styles.navItemButton}
        >
          <FiSearch size={20} />
          <span style={styles.navLabel}>Search</span>
        </button>

        <a 
          href="#/wishlist" 
          style={{
            ...styles.navItem,
            color: currentHash === '#/wishlist' ? 'var(--color-primary)' : 'var(--color-charcoal-light)'
          }}
        >
          <div style={styles.iconWrapper}>
            <FiHeart size={20} />
            {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
          </div>
          <span style={styles.navLabel}>Wishlist</span>
        </a>

        <button 
          onClick={onOpenCartDrawer} 
          style={styles.navItemButton}
        >
          <div style={styles.iconWrapper}>
            <FiShoppingBag size={20} />
            {cartItemsCount > 0 && <span style={styles.badge}>{cartItemsCount}</span>}
          </div>
          <span style={styles.navLabel}>Cart</span>
        </button>
      </div>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div style={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div style={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.searchHeader}>
              <h3 style={styles.searchTitle}>What are you looking for?</h3>
              <button style={styles.closeSearch} onClick={() => setSearchOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <input
                type="text"
                placeholder="Search sarees, kurtis, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                autoFocus
              />
              <button type="submit" style={styles.searchSubmit}>
                <FiSearch size={22} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65px',
    backgroundColor: 'rgba(253, 251, 247, 0.96)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid var(--color-border)',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
    display: 'none', // Managed by responsive styles media query
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 999,
    padding: '5px 0',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  navItemButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--color-charcoal-light)',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'inherit',
  },
  navLabel: {
    fontSize: '0.65rem',
    fontWeight: 500,
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  iconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-10px',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-white)',
    fontSize: '0.6rem',
    fontWeight: 700,
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '10vh',
  },
  searchModal: {
    backgroundColor: 'var(--color-cream)',
    width: '90%',
    maxWidth: '500px',
    padding: '2rem',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-premium)',
    borderRadius: '8px',
    animation: 'fadeIn 0.25s ease-out',
  },
  searchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.2rem',
  },
  searchTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.3rem',
    fontWeight: 400,
  },
  closeSearch: {
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  searchForm: {
    display: 'flex',
    borderBottom: '2px solid var(--color-charcoal)',
    paddingBottom: '0.3rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    fontSize: '1.1rem',
    padding: '5px 0',
    borderRadius: 0,
    color: 'var(--color-charcoal)',
  },
  searchSubmit: {
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  }
};

// Add responsive layout styles
const injectStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 767px) {
      .mobile-bottom-nav {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectStyles();
}
