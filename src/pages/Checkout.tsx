import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiChevronRight, FiChevronLeft, FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import type { Address } from '../types';

export const Checkout: React.FC = () => {
  const { cart, placeOrder, applyCoupon } = useShop();

  // Step wizard: 1 = Shipping, 2 = Payment Selection, 3 = Completed
  const [step, setStep] = useState(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [zip, setZip] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'COD'>('UPI');
  const [cardNo, setCardNo] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // UPI Simulation state
  const [upiUpiId, setUpiUpiId] = useState('');
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  // Coupon syncing from Cart
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Placed Order details
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = subtotal > 1999 ? 0 : 150;

  // Retrieve coupon from URL query param if present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const coupon = params.get('coupon');
      if (coupon) {
        setCouponCode(coupon);
        applyCoupon(coupon, subtotal).then(res => {
          if (res.success) {
            setDiscountAmount(res.discount);
          }
        });
      }
    }
  }, [subtotal]);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container" style={styles.errorContainer}>
        <h2>Your Cart is Empty</h2>
        <p>You cannot proceed to checkout with an empty shopping bag.</p>
        <a href="#/shop" className="btn-primary" style={{ marginTop: '1.5rem' }}>Back to Shop</a>
      </div>
    );
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + delivery);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!customerName || !customerEmail || !customerPhone || !streetAddress || !city || !addressState || !zip) {
        setErrorMessage('Please fill in all shipping fields.');
        return;
      }
      setErrorMessage('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleCompleteOrder = async () => {
    setErrorMessage('');
    
    // Formulate Address Object
    const addressObj: Address = {
      street: streetAddress,
      city,
      state: addressState,
      zip
    };

    // If payment method is UPI, open QR modal for beautiful mockup simulation
    if (paymentMethod === 'UPI' && !showUpiQrModal) {
      setShowUpiQrModal(true);
      return;
    }

    // Process real submission
    const result = await placeOrder(
      customerName,
      customerEmail,
      customerPhone,
      addressObj,
      paymentMethod,
      couponCode
    );

    if (result.success && result.order) {
      setPlacedOrder(result.order);
      setStep(3);
      setShowUpiQrModal(false);
    } else {
      setErrorMessage(result.message || 'Failed to place order.');
    }
  };

  // Simulate payment processing inside UPI Modal
  const simulatePaymentProcessing = () => {
    setSimulatingPayment(true);
    setTimeout(() => {
      setSimulatingPayment(false);
      handleCompleteOrder(); // complete checkout logic
    }, 2500);
  };

  return (
    <div className="container" style={styles.page}>
      {/* 1. Header and Progress Indicator */}
      {step !== 3 && (
        <div style={styles.checkoutProgress}>
          <div style={{ ...styles.stepIndicator, color: step >= 1 ? 'var(--color-charcoal)' : 'var(--color-charcoal-light)' }}>
            <span style={{ ...styles.stepNum, backgroundColor: step >= 1 ? 'var(--color-charcoal)' : 'var(--color-border)', color: step >= 1 ? '#fff' : 'inherit' }}>1</span>
            <span>Shipping Details</span>
          </div>
          <FiChevronRight style={styles.progressArrow} />
          <div style={{ ...styles.stepIndicator, color: step >= 2 ? 'var(--color-charcoal)' : 'var(--color-charcoal-light)' }}>
            <span style={{ ...styles.stepNum, backgroundColor: step >= 2 ? 'var(--color-charcoal)' : 'var(--color-border)', color: step >= 2 ? '#fff' : 'inherit' }}>2</span>
            <span>Payment Selection</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div style={styles.errorBanner}>{errorMessage}</div>
      )}

      {/* 2. Step Views */}
      {step === 1 && (
        <form onSubmit={handleNextStep} style={styles.checkoutGrid}>
          {/* Shipping Form Details */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}><FiMapPin /> Shipping Address</h3>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Contact Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                placeholder="Flat/House No., Building, Street Name"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>City *</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>State *</label>
                <input
                  type="text"
                  placeholder="State"
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>PIN Code *</label>
                <input
                  type="text"
                  placeholder="6-digit ZIP"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={styles.continueBtn}>
              <span>PROCEED TO PAYMENT</span>
              <FiChevronRight />
            </button>
          </div>

          {/* Checkout Bag review summary sidebar */}
          <div style={styles.summarySidebar}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Your Order</h3>
              <div style={styles.checkoutItemsList}>
                {cart.map(item => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} style={styles.itemRow}>
                    <img src={item.image} alt={item.name} style={styles.itemThumb} />
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemName}>{item.name}</h4>
                      <span style={styles.itemMeta}>Qty: {item.quantity} | Size: {item.size}</span>
                    </div>
                    <span style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={styles.calcBlock}>
                <div style={styles.calcRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {discountAmount > 0 && <div style={{ ...styles.calcRow, color: 'var(--color-accent-dark)' }}><span>Discount</span><span>- ₹{discountAmount.toLocaleString('en-IN')}</span></div>}
                <div style={styles.calcRow}><span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                <div style={styles.calcDivider} />
                <div style={styles.totalRow}><span>Total</span><span>₹{finalTotal.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <div style={styles.checkoutGrid}>
          {/* Payment Methods selector column */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}><FiCreditCard /> Select Payment Method</h3>
            
            <div style={styles.paymentSelectorGrid}>
              <button 
                onClick={() => setPaymentMethod('UPI')}
                style={{ ...styles.paymentOptionBtn, borderColor: paymentMethod === 'UPI' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'UPI' ? 'var(--color-pink-soft)' : 'var(--color-white)' }}
              >
                <strong>UPI (QR Scanner / VPA)</strong>
                <span style={styles.paymentDesc}>Scan QR instantly to pay from GPay, PhonePe, Paytm.</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('Card')}
                style={{ ...styles.paymentOptionBtn, borderColor: paymentMethod === 'Card' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'Card' ? 'var(--color-pink-soft)' : 'var(--color-white)' }}
              >
                <strong>Credit / Debit Card</strong>
                <span style={styles.paymentDesc}>Visa, MasterCard, RuPay, American Express.</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('Net Banking')}
                style={{ ...styles.paymentOptionBtn, borderColor: paymentMethod === 'Net Banking' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'Net Banking' ? 'var(--color-pink-soft)' : 'var(--color-white)' }}
              >
                <strong>Net Banking</strong>
                <span style={styles.paymentDesc}>Direct transfer from all Indian public and private banks.</span>
              </button>

              <button 
                onClick={() => setPaymentMethod('COD')}
                style={{ ...styles.paymentOptionBtn, borderColor: paymentMethod === 'COD' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'COD' ? 'var(--color-pink-soft)' : 'var(--color-white)' }}
              >
                <strong>Cash on Delivery (COD)</strong>
                <span style={styles.paymentDesc}>Pay in cash when your boutique box arrives at your door.</span>
              </button>
            </div>

            {/* Custom Payment Sub-Forms */}
            <div style={styles.paymentDetailsContainer}>
              {paymentMethod === 'UPI' && (
                <div style={styles.subForm}>
                  <label style={styles.subLabel}>Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    placeholder="username@okaxis"
                    value={upiUpiId}
                    onChange={(e) => setUpiUpiId(e.target.value)}
                    style={styles.subInput}
                  />
                  <p style={styles.infoText}>Or click complete order below to scan a dynamic QR Code.</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div style={styles.subForm}>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sharma"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div style={styles.subForm}>
                  <label style={styles.subLabel}>Select Bank</label>
                  <select style={styles.subSelect}>
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div style={styles.subForm}>
                  <p style={styles.codWarning}><strong>Cash on Delivery selected:</strong> A delivery charge of ₹50 may apply to certain pin codes. Please ensure cash is ready at the address when the courier contacts you.</p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={styles.navRow}>
              <button onClick={handlePrevStep} style={styles.backBtn}>
                <FiChevronLeft /> Back to Shipping
              </button>
              <button onClick={handleCompleteOrder} className="btn-primary" style={styles.submitOrderBtn}>
                <span>PLACE ORDER (₹{finalTotal.toLocaleString('en-IN')})</span>
                <FiCheck />
              </button>
            </div>
          </div>

          {/* Review items sidebar */}
          <div style={styles.summarySidebar}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Deliver to</h3>
              <p style={styles.summaryAddress}>
                <strong>{customerName}</strong><br />
                {streetAddress}, {city},<br />
                {addressState} - {zip}<br />
                Phone: {customerPhone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Success Screen */}
      {step === 3 && placedOrder && (
        <section style={styles.successBlock}>
          <FiCheckCircle size={60} style={styles.successIcon} />
          <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
          <p style={styles.successMsg}>Thank you for shopping at Snehaas Boutique. We are packing your gorgeous boutique box with love.</p>
          
          <div style={styles.receiptBox}>
            <div style={styles.receiptRow}><strong>Order ID:</strong> <span>{placedOrder.id}</span></div>
            <div style={styles.receiptRow}><strong>Tracking Number:</strong> <span>{placedOrder.trackingNumber}</span></div>
            <div style={styles.receiptRow}><strong>Amount Paid:</strong> <span>₹{placedOrder.finalAmount.toLocaleString('en-IN')} ({placedOrder.paymentMethod})</span></div>
            <div style={styles.receiptRow}><strong>Deliver to:</strong> <span>{placedOrder.customerName}, {placedOrder.address.city}</span></div>
          </div>

          <p style={styles.notificationNote}>An order confirmation summary and tracking link have been dispatched via Email & WhatsApp.</p>

          <div style={styles.successActions}>
            <a href={`#/track?id=${placedOrder.id}`} className="btn-primary">
              Track Order Real-Time
            </a>
            <a href="#/shop" className="btn-secondary">
              Continue Shopping
            </a>
          </div>
        </section>
      )}

      {/* UPI QR Payment Modal Simulation */}
      {showUpiQrModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.qrModal}>
            <h3 style={styles.qrModalTitle}>UPI Instant Payment Gateway</h3>
            <p style={styles.qrModalDesc}>Scan the dynamic QR code using GPay, PhonePe, or BHIM UPI apps.</p>
            
            {/* Simulated QR Code box */}
            <div style={styles.qrContainer}>
              <div style={styles.qrCodeGraphic}>
                {/* Visual Representation of QR Code */}
                <div style={styles.qrRow}>
                  <div style={styles.qrSquare}></div>
                  <div style={{ ...styles.qrSpacer, flex: 1 }}></div>
                  <div style={styles.qrSquare}></div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={styles.qrBoutiqueLabel}>SNEHAAS</span>
                  <span style={styles.qrPriceLabel}>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.qrRow}>
                  <div style={styles.qrSquare}></div>
                  <div style={{ ...styles.qrSpacer, flex: 1 }}></div>
                  <div style={styles.qrSquare}></div>
                </div>
              </div>
            </div>

            <p style={styles.qrModalTimer}>Waiting for payment confirmations... (Simulated)</p>

            <div style={styles.qrModalActions}>
              <button 
                onClick={() => setShowUpiQrModal(false)} 
                disabled={simulatingPayment}
                style={styles.qrCancelBtn}
              >
                Cancel
              </button>
              
              <button 
                onClick={simulatePaymentProcessing}
                disabled={simulatingPayment}
                style={styles.qrConfirmBtn}
              >
                {simulatingPayment ? 'Verifying payment...' : 'SIMULATE PAYMENT SUCCESS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '80vh',
    padding: '4rem var(--spacing-lg)',
  },
  checkoutProgress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  progressArrow: {
    color: 'var(--color-border)',
  },
  errorBanner: {
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-white)',
    padding: '0.8rem 1.2rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    marginBottom: '2rem',
    borderRadius: '2px',
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'start',
  },
  formSection: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2.5rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '0.8rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  continueBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    marginTop: '1.5rem',
  },
  summarySidebar: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  summaryTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '0.8rem',
    marginBottom: '1.2rem',
  },
  checkoutItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '1.5rem',
  },
  itemRow: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
  },
  itemThumb: {
    width: '50px',
    height: '65px',
    objectFit: 'cover',
    backgroundColor: '#FAF7F3',
    border: '1px solid var(--color-border)',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'var(--font-serif)',
  },
  itemMeta: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
  },
  itemPrice: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  calcBlock: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '1.2rem',
  },
  calcRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    marginBottom: '0.6rem',
  },
  calcDivider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '1rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.15rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  paymentSelectorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem',
  },
  paymentOptionBtn: {
    border: '1px solid var(--color-border)',
    padding: '1.2rem',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  paymentDesc: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    marginTop: '4px',
    lineHeight: 1.4,
  },
  paymentDetailsContainer: {
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '1.5rem',
    marginBottom: '2.5rem',
  },
  subForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  subLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  subInput: {
    padding: '0.7rem 0.8rem',
    fontSize: '0.85rem',
  },
  subSelect: {
    padding: '0.7rem 0.8rem',
    fontSize: '0.85rem',
  },
  infoText: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
  },
  codWarning: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.5,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    cursor: 'pointer',
  },
  submitOrderBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '1rem 2rem',
  },
  summaryAddress: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: 'var(--color-charcoal-light)',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '6rem 0',
  },
  successBlock: {
    textAlign: 'center',
    maxWidth: '650px',
    margin: '0 auto',
    padding: '4rem 2rem',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-premium)',
  },
  successIcon: {
    color: 'var(--color-success)',
    marginBottom: '1.5rem',
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    marginBottom: '1rem',
  },
  successMsg: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
  },
  receiptBox: {
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal)',
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '6px',
  },
  notificationNote: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    fontStyle: 'italic',
    marginBottom: '2.5rem',
  },
  successActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.2rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModal: {
    backgroundColor: 'var(--color-cream)',
    width: '90%',
    maxWidth: '400px',
    padding: '2.5rem',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-premium)',
    textAlign: 'center',
  },
  qrModalTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  qrModalDesc: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.4,
    marginBottom: '1.5rem',
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  qrCodeGraphic: {
    width: '200px',
    height: '200px',
    border: '4px solid var(--color-charcoal)',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  qrRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  qrSquare: {
    width: '45px',
    height: '45px',
    backgroundColor: 'var(--color-charcoal)',
  },
  qrSpacer: {
    height: '1px',
  },
  qrBoutiqueLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: 'var(--color-primary)',
    marginBottom: '4px',
  },
  qrPriceLabel: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--color-charcoal)',
  },
  qrModalTimer: {
    fontSize: '0.8rem',
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginBottom: '1.5rem',
    animation: 'pulseWhatsApp 1.5s infinite',
  },
  qrModalActions: {
    display: 'flex',
    gap: '10px',
  },
  qrCancelBtn: {
    flex: 1,
    padding: '0.75rem 0',
    fontSize: '0.8rem',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  qrConfirmBtn: {
    flex: 2,
    padding: '0.75rem 0',
    fontSize: '0.8rem',
    fontWeight: 600,
    backgroundColor: 'var(--color-success)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  }
};

// Inject dynamic CSS overrides for responsive checkout
const injectCheckoutStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      form[style*="checkoutGrid"], div[style*="checkoutGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
    }
    @media (max-width: 576px) {
      div[style*="paymentSelectorGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
    @media (max-width: 480px) {
      div[style*="successActions"] {
        flex-direction: column !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectCheckoutStyles();
}

