import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckSquare, FiCalendar, FiMapPin } from 'react-icons/fi';
import type { Order } from '../types';

export const OrderTracking: React.FC = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Parse ID from URL parameter if present (e.g. from checkout redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const id = params.get('id');
      if (id) {
        setOrderQuery(id);
        fetchOrder(id);
      }
    }
  }, []);

  const fetchOrder = async (queryId: string) => {
    if (!queryId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(queryId.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError("We couldn't find an order matching that ID or Tracking Number. Please check and try again.");
      }
    } catch (err) {
      setError("Communication error. Could not connect to boutique server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  // Helper to figure out active step index
  const getStatusIndex = (status: Order['orderStatus']) => {
    const statuses: Order['orderStatus'][] = ['Placed', 'Processing', 'Shipped', 'Delivered'];
    return statuses.indexOf(status);
  };

  const activeIndex = order ? getStatusIndex(order.orderStatus) : -1;

  const timelineSteps = [
    { label: 'Order Placed', desc: 'We received your order request.', icon: <FiCheckSquare size={18} /> },
    { label: 'Processing', desc: 'Fabric customization and luxury packaging.', icon: <FiPackage size={18} /> },
    { label: 'Shipped', desc: 'Package handoff to express shipping partner.', icon: <FiTruck size={18} /> },
    { label: 'Delivered', desc: 'Delivered at destination address.', icon: <FiCheckSquare size={18} /> },
  ];

  return (
    <div className="container" style={styles.page}>
      <h2 style={styles.title}>Track Order</h2>
      <p style={styles.subtitle}>Enter your Order ID (e.g. SNE-2026-XXXX) or Shipping Tracking Code to check status.</p>

      {/* Search Input bar */}
      <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
        <input
          type="text"
          placeholder="e.g. SNE-2026-9281 or TRACK-781926"
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value)}
          style={styles.searchInput}
          required
        />
        <button type="submit" className="btn-primary" style={styles.searchSubmitBtn}>
          {loading ? 'Searching...' : 'TRACK'}
          <FiSearch />
        </button>
      </form>

      {error && (
        <div style={styles.errorCard}>{error}</div>
      )}

      {/* Results View */}
      {order && (
        <div style={styles.resultsCard} className="animate-fade-in">
          {/* Tracking Timeline */}
          <div style={styles.timelineBlock}>
            <div style={styles.timelineHeader}>
              <div>
                <span style={styles.orderLabel}>Order ID: {order.id}</span>
                <p style={styles.trackingLabel}>Tracking Number: <strong>{order.trackingNumber}</strong></p>
              </div>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: order.orderStatus === 'Cancelled' ? 'var(--color-error)' : 'var(--color-pink-soft)',
                color: order.orderStatus === 'Cancelled' ? 'var(--color-white)' : 'var(--color-accent-dark)'
              }}>
                {order.orderStatus.toUpperCase()}
              </span>
            </div>

            {order.orderStatus !== 'Cancelled' ? (
              <div style={styles.timelineProgressRow}>
                {timelineSteps.map((step, index) => {
                  const isCompleted = index <= activeIndex;
                  const isActive = index === activeIndex;

                  return (
                    <div key={step.label} style={styles.progressStepCol}>
                      {/* Line connecting nodes */}
                      {index > 0 && (
                        <div style={{
                          ...styles.timelineLine,
                          backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)'
                        }} />
                      )}
                      
                      {/* Node Icon Circle */}
                      <div style={{
                        ...styles.stepCircle,
                        backgroundColor: isActive 
                          ? 'var(--color-charcoal)' 
                          : (isCompleted ? 'var(--color-primary)' : '#FFF'),
                        color: isCompleted || isActive ? '#FFF' : 'var(--color-charcoal-light)',
                        borderColor: isCompleted || isActive ? 'transparent' : 'var(--color-border)',
                        boxShadow: isActive ? 'var(--shadow-luxury)' : 'none'
                      }}>
                        {step.icon}
                      </div>
                      
                      {/* Node text */}
                      <h4 style={{ ...styles.stepLabel, fontWeight: isActive ? 600 : 500 }}>{step.label}</h4>
                      <p style={styles.stepDesc}>{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.cancelledBlock}>
                <p>This order has been cancelled. If this is unexpected, please contact Snehaas Boutique support directly via WhatsApp.</p>
              </div>
            )}
          </div>

          {/* Details breakdown */}
          <div style={styles.detailsGrid}>
            {/* Left: Items list */}
            <div style={styles.itemsSummaryBlock}>
              <h3 style={styles.blockTitle}>Items Purchased</h3>
              <div style={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <img src={item.image} alt={item.name} style={styles.itemThumb} />
                    <div style={styles.itemMeta}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <p style={styles.itemVariants}>Size: {item.size} | Color: {item.color}</p>
                      <span style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')} x {item.quantity}</span>
                    </div>
                    <span style={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={styles.pricingSummary}>
                <div style={styles.priceSummaryRow}><span>Subtotal</span><span>₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
                {order.discountAmount > 0 && <div style={styles.priceSummaryRow}><span>Discount</span><span>- ₹{order.discountAmount.toLocaleString('en-IN')}</span></div>}
                <div style={styles.priceSummaryRow}><span>Delivery Fees</span><span>{order.totalAmount - order.discountAmount > 1999 ? 'FREE' : '₹150'}</span></div>
                <div style={styles.priceDivider} />
                <div style={styles.priceTotalRow}><span>Total Price</span><span>₹{order.finalAmount.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {/* Right: Logistics details */}
            <div style={styles.logisticsBlock}>
              <div style={styles.logisticsCard}>
                <h3 style={styles.blockTitle}><FiMapPin /> Delivery Address</h3>
                <p style={styles.addressText}>
                  <strong>{order.customerName}</strong><br />
                  {order.address.street},<br />
                  {order.address.city}, {order.address.state} - {order.address.zip}<br />
                  Phone: {order.customerPhone}
                </p>
              </div>

              <div style={{ ...styles.logisticsCard, marginTop: '1.5rem' }}>
                <h3 style={styles.blockTitle}><FiCalendar /> Order Activity Log</h3>
                <ul style={styles.activityLog}>
                  <li>Placed: {new Date(order.createdAt).toLocaleString('en-IN')}</li>
                  <li>Payment Mode: {order.paymentMethod}</li>
                  <li>Payment Status: <strong>{order.paymentStatus}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {searched && !order && !loading && !error && (
        <div style={styles.noResultsCard}>No search results.</div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '80vh',
    padding: '4rem var(--spacing-lg)',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal-light)',
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '550px',
    margin: '0 auto 3rem auto',
  },
  searchForm: {
    display: 'flex',
    maxWidth: '600px',
    margin: '0 auto 4rem auto',
    boxShadow: 'var(--shadow-subtle)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: '0.9rem 1.2rem',
    border: 'none',
    fontSize: '0.95rem',
    borderRadius: 0,
  },
  searchSubmitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 2rem',
    borderRadius: 0,
    border: 'none',
  },
  errorCard: {
    backgroundColor: '#FAF0F2',
    border: '1px solid var(--color-error)',
    color: 'var(--color-error)',
    maxWidth: '600px',
    margin: '0 auto 3rem auto',
    padding: '1.2rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  resultsCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-subtle)',
    padding: '2.5rem',
  },
  timelineBlock: {
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '3rem',
    marginBottom: '3rem',
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '3rem',
  },
  orderLabel: {
    fontSize: '1.3rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: 500,
  },
  trackingLabel: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    marginTop: '4px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '5px 12px',
    letterSpacing: '0.08em',
    borderRadius: '2px',
  },
  timelineProgressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
  },
  progressStepCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: '20px',
    right: '50%',
    width: '100%',
    height: '2px',
    zIndex: 1,
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    border: '2px solid transparent',
    marginBottom: '1rem',
    transition: 'var(--transition-smooth)',
  },
  stepLabel: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal)',
    marginBottom: '4px',
  },
  stepDesc: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    maxWidth: '140px',
    lineHeight: 1.4,
  },
  cancelledBlock: {
    backgroundColor: '#FAF0F2',
    borderLeft: '4px solid var(--color-error)',
    padding: '1.2rem',
    color: 'var(--color-charcoal-light)',
    fontSize: '0.9rem',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'start',
  },
  itemsSummaryBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  blockTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-charcoal)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '0.6rem',
    marginBottom: '1.2rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginBottom: '2rem',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  itemThumb: {
    width: '55px',
    height: '70px',
    objectFit: 'cover',
    backgroundColor: '#FAF7F3',
    border: '1px solid var(--color-border)',
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
  },
  itemVariants: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
  },
  itemPrice: {
    fontSize: '0.8rem',
    color: 'var(--color-primary)',
    fontWeight: 500,
  },
  itemTotal: {
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  pricingSummary: {
    backgroundColor: 'var(--color-cream-dark)',
    padding: '1.5rem',
    border: '1px solid var(--color-border)',
  },
  priceSummaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '0.6rem',
  },
  priceDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '0.8rem 0',
  },
  priceTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  logisticsBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  logisticsCard: {
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '1.5rem',
  },
  addressText: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: 'var(--color-charcoal-light)',
  },
  activityLog: {
    listStyle: 'circle',
    paddingLeft: '1.2rem',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  noResultsCard: {
    textAlign: 'center',
    padding: '2rem 0',
    color: 'var(--color-charcoal-light)',
  }
};

// Add responsive stylesheet rules dynamically for order tracking nodes
const injectOrderTrackingStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      div[style*="detailsGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
    }
    @media (max-width: 576px) {
      div[style*="timelineProgressRow"] {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 1.5rem !important;
        padding-left: 2rem !important;
      }
      div[style*="progressStepCol"] {
        flex-direction: row !important;
        align-items: center !important;
        text-align: left !important;
        width: 100% !important;
        gap: 1rem !important;
      }
      div[style*="timelineLine"] {
        width: 2px !important;
        height: 100% !important;
        left: 19px !important;
        top: -24px !important;
      }
      div[style*="stepCircle"] {
        margin-bottom: 0 !important;
        flex-shrink: 0 !important;
      }
      p[style*="stepDesc"] {
        display: none !important; /* Hide details on small mobile timeline for cleanliness */
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectOrderTrackingStyles();
}
