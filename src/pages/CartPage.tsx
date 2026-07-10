import React, { useState } from 'react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, applyCoupon } = useShop();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = subtotal > 1999 || subtotal === 0 ? 0 : 150;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError(false);
    setCouponMessage('');
    const result = await applyCoupon(couponCode.trim(), subtotal);

    if (result.success) {
      setAppliedCoupon(result.coupon);
      setDiscount(result.discount);
      setCouponMessage(result.message);
    } else {
      setAppliedCoupon(null);
      setDiscount(0);
      setCouponMessage(result.message);
      setCouponError(true);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    setCouponMessage('');
  };

  const finalTotal = Math.max(0, subtotal - discount + delivery);

  if (cart.length === 0) {
    return (
      <div className="container" style={styles.emptyContainer}>
        <FiShoppingBag size={48} style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }} />
        <h2>Your Bag is Empty</h2>
        <p style={styles.emptyText}>Add some exquisite boutique apparel to begin your luxury fashion journey.</p>
        <a href="#/shop" className="btn-primary">Browse Shop</a>
      </div>
    );
  }

  const handleProceedCheckout = () => {
    // Persist coupon code if applied
    const query = appliedCoupon ? `?coupon=${appliedCoupon.code}` : '';
    window.location.hash = `#/checkout${query}`;
  };

  return (
    <div className="container" style={styles.page}>
      <h2 style={styles.pageTitle}>Shopping Bag</h2>
      
      <div style={styles.cartGrid}>
        {/* Left: Cart Items List */}
        <div style={styles.itemsColumn}>
          <div style={styles.tableHeader}>
            <div style={{ flex: 2 }}>Product</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Quantity</div>
            <div style={{ flex: 1, textAlign: 'right' }}>Total</div>
          </div>

          <div style={styles.itemsList}>
            {cart.map(item => (
              <div key={`${item.productId}-${item.size}-${item.color}`} style={styles.cartItem}>
                {/* Product Detail Thumbnail and Info */}
                <div style={{ ...styles.productCol, flex: 2 }}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>
                      <a href={`#/product/${item.productId}`} style={styles.itemLink}>{item.name}</a>
                    </h3>
                    <p style={styles.itemVariants}>
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <span style={styles.itemUnitPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ ...styles.qtyCol, flex: 1 }}>
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
                    title="Remove item"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>

                {/* Total Column */}
                <div style={{ ...styles.priceCol, flex: 1 }}>
                  <span style={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary panel & Coupon code box */}
        <div style={styles.summaryColumn}>
          {/* Coupon Code section */}
          <div style={styles.summaryCard}>
            <h3 style={styles.cardTitle}>Offer Coupons</h3>
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={styles.couponInput}
                />
                <button type="submit" style={styles.couponSubmitBtn}>
                  APPLY
                </button>
              </form>
            ) : (
              <div style={styles.couponAppliedRow}>
                <div style={styles.couponTagBadge}>
                  <FiTag size={12} />
                  <span>{appliedCoupon.code} (Saved ₹{discount.toLocaleString('en-IN')})</span>
                </div>
                <button onClick={handleRemoveCoupon} style={styles.couponRemoveBtn}>Remove</button>
              </div>
            )}
            {couponMessage && (
              <div style={{
                ...styles.couponMsg,
                color: couponError ? 'var(--color-error)' : 'var(--color-success)'
              }}>
                {!couponError && <FiCheck size={12} style={{ marginRight: '4px' }} />}
                {couponMessage}
              </div>
            )}
            <div style={styles.suggestedCoupons}>
              <p style={styles.suggestTitle}>Available Boutique Offers:</p>
              <ul>
                <li><strong>WELCOME10</strong> - 10% Off on purchases above ₹1,000</li>
                <li><strong>FESTIVE20</strong> - 20% Off on purchases above ₹5,000</li>
                <li><strong>BOUTIQUE500</strong> - Flat ₹500 Off on orders above ₹4,000</li>
              </ul>
            </div>
          </div>

          {/* Pricing Summary card */}
          <div style={{ ...styles.summaryCard, marginTop: '1.5rem' }}>
            <h3 style={styles.cardTitle}>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div style={{ ...styles.summaryRow, color: 'var(--color-accent-dark)' }}>
                <span>Coupon Discount</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={styles.summaryRow}>
              <span>Estimated Delivery</span>
              <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
            <div style={styles.summaryDivider} />
            <div style={styles.totalRow}>
              <span>Estimated Total</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <p style={styles.taxNotice}>Price inclusive of GST and custom packaging.</p>

            <button onClick={handleProceedCheckout} style={styles.checkoutBtn}>
              <span>PROCEED TO CHECKOUT</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '70vh',
    padding: '4rem var(--spacing-lg)',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    marginBottom: '2.5rem',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '7rem 0',
  },
  emptyText: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.95rem',
    marginBottom: '1.8rem',
  },
  cartGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'start',
  },
  itemsColumn: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-subtle)',
  },
  tableHeader: {
    display: 'flex',
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-charcoal)',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  productCol: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'center',
  },
  itemImage: {
    width: '75px',
    height: '95px',
    objectFit: 'cover',
    backgroundColor: '#FAF7F3',
    border: '1px solid var(--color-border)',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    marginBottom: '0.2rem',
  },
  itemLink: {
    color: 'var(--color-charcoal)',
  },
  itemVariants: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '0.4rem',
  },
  itemUnitPrice: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
  },
  qtyCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-white)',
  },
  qtyBtn: {
    padding: '3px 8px',
    cursor: 'pointer',
    color: 'var(--color-charcoal-light)',
  },
  qtyValue: {
    fontSize: '0.8rem',
    fontWeight: 600,
    minWidth: '20px',
    textAlign: 'center',
  },
  removeBtn: {
    color: '#A55D6A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  priceCol: {
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: '1rem',
    fontWeight: 600,
  },
  summaryColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-charcoal)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '0.8rem',
    marginBottom: '1.2rem',
  },
  couponForm: {
    display: 'flex',
  },
  couponInput: {
    flex: 1,
    padding: '0.6rem 0.8rem',
    fontSize: '0.85rem',
    border: '1px solid var(--color-border)',
    borderRight: 'none',
    borderRadius: 0,
  },
  couponSubmitBtn: {
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    padding: '0 1.2rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    border: '1px solid var(--color-charcoal)',
    borderRadius: 0,
    cursor: 'pointer',
  },
  couponAppliedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-pink-soft)',
    border: '1px dashed var(--color-accent)',
    padding: '8px 12px',
  },
  couponTagBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-accent-dark)',
  },
  couponRemoveBtn: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  couponMsg: {
    fontSize: '0.8rem',
    fontWeight: 500,
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  suggestedCoupons: {
    marginTop: '1.2rem',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '1rem',
  },
  suggestTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--color-charcoal-light)',
    marginBottom: '6px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '0.8rem',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '1.2rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
    marginBottom: '0.5rem',
  },
  taxNotice: {
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
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  }
};

// Add styles dynamically for responsive cart items
const injectCartPageStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    div[style*="cartItem"]:last-child {
      border-bottom: none !important;
    }
    @media (max-width: 991px) {
      div[style*="cartGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
    }
    @media (max-width: 576px) {
      div[style*="cartItem"] {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 1rem !important;
      }
      div[style*="productCol"] { width: 100% !important; }
      div[style*="qtyCol"] { 
        flex-direction: row !important; 
        justify-content: space-between !important; 
        width: 100% !important; 
      }
      div[style*="priceCol"] { 
        width: 100% !important; 
        text-align: left !important;
      }
      div[style*="tableHeader"] { display: none !important; }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectCartPageStyles();
}
