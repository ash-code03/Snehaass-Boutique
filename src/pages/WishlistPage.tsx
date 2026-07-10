import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={styles.emptyContainer}>
        <FiHeart size={48} style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }} />
        <h2>Your Wishlist is Empty</h2>
        <p style={styles.emptyText}>Tap the heart icon on any design to save it to your wishlist.</p>
        <a href="#/shop" className="btn-primary">Explore Designs</a>
      </div>
    );
  }

  return (
    <div className="container" style={styles.page}>
      <div className="section-title-wrapper" style={{ marginBottom: '3.5rem' }}>
        <span className="section-subtitle">FAVORITES</span>
        <h2 className="section-title">Your Wishlist</h2>
      </div>

      <div className="grid-responsive">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '70vh',
    padding: '4rem var(--spacing-lg)',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '7rem 0',
  },
  emptyText: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.95rem',
    marginBottom: '1.8rem',
  }
};
