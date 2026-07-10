import React, { useState } from 'react';
import { FiShoppingBag, FiHeart, FiSearch, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

interface HeaderProps {
  onOpenCartDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCartDrawer }) => {
  const { cart, wishlist, adminToken, settings } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { label: 'Home', hash: '#/' },
    { label: 'Shop All', hash: '#/shop' },
    { label: 'Sarees', hash: '#/shop?category=Sarees' },
    { label: 'Kurtis & Salwars', hash: '#/shop?category=Kurtis,Salwars' },
    { label: 'Lehengas', hash: '#/shop?category=Lehengas' },
    { label: 'Boutique Collections', hash: '#/shop?category=Boutique Collections' },
    { label: 'About', hash: '#/about' },
    { label: 'Contact', hash: '#/contact' },
  ];

  return (
    <>
      <header style={styles.header}>
        <div className="container" style={styles.headerContainer}>
          {/* Mobile Menu Trigger */}
          <button 
            style={styles.mobileTrigger} 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <a href="#/" style={styles.logoWrapper}>
            <span style={styles.logoSub}>S N E H A A S</span>
            <h1 style={styles.logoTitle}>{settings?.boutiqueName || 'Snehaas Boutique'}</h1>
          </a>

          {/* Desktop Navigation Links */}
          <nav style={styles.desktopNav}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.hash} style={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions Icons */}
          <div style={styles.actions}>
            <button 
              onClick={() => setSearchOpen(true)} 
              style={styles.actionBtn}
              aria-label="Search Products"
            >
              <FiSearch size={20} />
            </button>
            
            <a href="#/wishlist" style={styles.actionBtn} aria-label="View Wishlist">
              <FiHeart size={20} />
              {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
            </a>

            <button 
              onClick={onOpenCartDrawer} 
              style={styles.actionBtn}
              aria-label="Open Cart"
            >
              <FiShoppingBag size={20} />
              {cartItemsCount > 0 && <span style={styles.badge}>{cartItemsCount}</span>}
            </button>

            <a 
              href="#/admin" 
              style={{
                ...styles.actionBtn, 
                color: adminToken ? 'var(--color-primary)' : 'inherit'
              }}
              title={adminToken ? 'Admin Dashboard (Active)' : 'Admin Login'}
              aria-label="Admin Portal"
            >
              <FiUser size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawerOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div style={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h3>MENU</h3>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            <nav style={styles.mobileNav}>
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.hash} 
                  style={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

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
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 99,
    backgroundColor: 'rgba(253, 251, 247, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-subtle)',
    padding: '0.8rem 0',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
  },
  mobileTrigger: {
    display: 'none',
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '5px',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoSub: {
    fontSize: '0.6rem',
    letterSpacing: '0.45em',
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginBottom: '-2px',
  },
  logoTitle: {
    fontSize: '1.6rem',
    fontWeight: 500,
    fontFamily: 'var(--font-serif)',
    color: 'var(--color-charcoal)',
    letterSpacing: '0.02em',
  },
  desktopNav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '0.8rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--color-charcoal-light)',
    transition: 'var(--transition-fast)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  actionBtn: {
    position: 'relative',
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-fast)',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-white)',
    fontSize: '0.65rem',
    fontWeight: 700,
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDrawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  mobileDrawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '300px',
    height: '100%',
    backgroundColor: 'var(--color-cream)',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 1001,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease reverse', // simplified helper
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mobileNavLink: {
    fontSize: '0.95rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-charcoal-light)',
    padding: '5px 0',
    borderBottom: '1px dashed transparent',
  },
  searchOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '10vh',
  },
  searchModal: {
    backgroundColor: 'var(--color-cream)',
    width: '90%',
    maxWidth: '600px',
    padding: '2.5rem',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-premium)',
    animation: 'fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  searchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  searchTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 400,
  },
  closeSearch: {
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
  },
  searchForm: {
    display: 'flex',
    borderBottom: '2px solid var(--color-charcoal)',
    paddingBottom: '0.5rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    fontSize: '1.2rem',
    padding: '5px 0',
    borderRadius: 0,
  },
  searchSubmit: {
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
  }
};

// Add responsive rules dynamically for styling
const injectResponsiveStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      header nav { display: none !important; }
      header button[aria-label="Open Menu"] { display: block !important; }
      button[style*="mobileTrigger"] { display: block !important; }
    }
    @media (min-width: 992px) {
      header button[aria-label="Open Menu"] { display: none !important; }
      button[style*="mobileTrigger"] { display: none !important; }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectResponsiveStyles();
}
