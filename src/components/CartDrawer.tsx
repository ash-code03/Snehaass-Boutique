import React from 'react';
import { FiX, FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart } = useShop();

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    window.location.hash = '#/checkout';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Your Bag ({cart.length})</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close Cart">
            <FiX size={22} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={styles.content}>
          {cart.length === 0 ? (
            <div style={styles.emptyCart}>
              <p style={styles.emptyText}>Your shopping bag is currently empty.</p>
              <a href="#/shop" style={styles.shopBtn} onClick={onClose}>
                Start Shopping
              </a>
            </div>
          ) : (
            <div style={styles.itemList}>
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} style={styles.cartItem}>
                  {/* Item Image */}
                  <img src={item.image} alt={item.name} style={styles.itemImage} />

                  {/* Item Info */}
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>
                      <a href={`#/product/${item.productId}`} onClick={onClose} style={styles.itemLink}>
                        {item.name}
                      </a>
                    </h3>
                    <p style={styles.itemVariants}>
                      Size: {item.size} | Color: {item.color}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div style={styles.qtyRow}>
                      <div style={styles.qtyControls}>
                        <button 
                          onClick={() => updateCartQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          style={styles.qtyBtn}
                        >
                          <FiMinus size={12} />
                        </button>
                        <span style={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          style={styles.qtyBtn}
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        style={styles.removeBtn}
                        title="Remove Item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div style={styles.itemPriceCol}>
                    <span style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.subtotalRow}>
              <span style={styles.subtotalLabel}>Subtotal</span>
              <span style={styles.subtotalAmount}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p style={styles.taxNote}>Shipping, taxes, and discounts calculated at checkout.</p>
            <button onClick={handleCheckoutClick} style={styles.checkoutBtn}>
              <span>PROCEED TO CHECKOUT</span>
              <FiArrowRight size={16} />
            </button>
            <button onClick={onClose} style={styles.continueBtn}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.3s ease',
  },
  drawer: {
    backgroundColor: 'var(--color-cream)',
    width: '100%',
    maxWidth: '450px',
    height: '100%',
    boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    animation: 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  closeBtn: {
    color: 'var(--color-charcoal)',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    textAlign: 'center',
  },
  emptyText: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  shopBtn: {
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    padding: '0.8rem 1.8rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cartItem: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1.5rem',
  },
  itemImage: {
    width: '80px',
    height: '100px',
    objectFit: 'cover',
    backgroundColor: '#FAF7F3',
    border: '1px solid var(--color-border)',
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.3,
    marginBottom: '0.25rem',
  },
  itemLink: {
    color: 'var(--color-charcoal)',
  },
  itemVariants: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '0.75rem',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: 'auto',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-white)',
  },
  qtyBtn: {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-charcoal-light)',
  },
  qtyValue: {
    fontSize: '0.8rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
  },
  removeBtn: {
    color: '#A55D6A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  itemPriceCol: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  footer: {
    borderTop: '1px solid var(--color-border)',
    padding: '1.5rem',
    backgroundColor: 'var(--color-cream-dark)',
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  subtotalLabel: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--color-charcoal)',
  },
  subtotalAmount: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  taxNote: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '1.5rem',
  },
  checkoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    width: '100%',
    padding: '1rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    border: 'none',
    transition: 'var(--transition-smooth)',
    cursor: 'pointer',
  },
  continueBtn: {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    marginTop: '0.8rem',
    fontSize: '0.8rem',
    color: 'var(--color-primary)',
    fontWeight: 600,
    textDecoration: 'underline',
    cursor: 'pointer',
  }
};
