import React, { useState, useEffect, useMemo } from 'react';
import { FiShoppingBag, FiHeart, FiCheck, FiInfo, FiTruck, FiRotateCcw, FiSend } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import { ProductZoom } from '../components/ProductZoom';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  productId: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { products, addToCart, toggleWishlist, isInWishlist, addReview } = useShop();
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Review Form state
  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch target product
  const product = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [products, productId]);

  // Set default variants when product loaded
  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0] || '');
      setSelectedSize(product.sizes[0] || 'Free Size');
      setSelectedColor(product.colors[0]?.name || 'Default');
      setQuantity(1);
      setReviewSuccess(false);
      setReviewUser('');
      setReviewComment('');
      setReviewRating(5);
    }
  }, [product, productId]);

  if (!product) {
    return (
      <div className="container" style={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you are trying to view does not exist or has been removed.</p>
        <a href="#/shop" className="btn-primary" style={{ marginTop: '1.5rem' }}>Back to Shop</a>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const hasDiscount = product.discountPrice !== null;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setToastMessage('Added to Bag successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewUser.trim() || !reviewComment.trim()) return;

    const updatedProduct = await addReview(product.id, reviewUser.trim(), reviewRating, reviewComment.trim());
    if (updatedProduct) {
      setReviewSuccess(true);
      setReviewUser('');
      setReviewComment('');
      setReviewRating(5);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  // Find related products (same category, exclude current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={styles.page}>
      <div className="container">
        {/* Main Details Section */}
        <div style={styles.detailsGrid}>
          {/* Left Column: Image Gallery */}
          <div style={styles.galleryColumn}>
            {/* Main Image Viewer */}
            <div style={styles.mainImageFrame}>
              <ProductZoom src={activeImage} alt={product.name} />
              <div style={styles.magnifyBadge}><FiInfo size={12} /> Hover to Zoom Fabric</div>
            </div>
            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div style={styles.thumbnailsGrid}>
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    style={{
                      ...styles.thumbnailBtn,
                      borderColor: activeImage === img ? 'var(--color-primary)' : 'var(--color-border)'
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} style={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information details */}
          <div style={styles.infoColumn}>
            <span style={styles.category}>{product.category}</span>
            <h2 style={styles.name}>{product.name}</h2>

            {/* Ratings Summary */}
            <div style={styles.ratingsRow}>
              <div style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} color={i < Math.round(product.rating) ? '#C5A059' : '#EAE3D5'} />
                ))}
              </div>
              <span style={styles.ratingText}>
                {product.rating} / 5.0 ({product.reviewsCount} Reviews)
              </span>
            </div>

            {/* Prices */}
            <div style={styles.priceRow}>
              {hasDiscount ? (
                <>
                  <span style={styles.discountPrice}>₹{currentPrice.toLocaleString('en-IN')}</span>
                  <span style={styles.originalPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span style={styles.discountBadge}>
                    {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span style={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p style={styles.description}>{product.description}</p>

            {/* Product Metadata */}
            <div style={styles.metaBlock}>
              <div style={styles.metaItem}><strong>Fabric / Material:</strong> {product.material || 'Premium Boutique Curation'}</div>
              <div style={styles.metaItem}><strong>Availability:</strong> {product.stock > 0 ? (
                <span style={{ color: product.stock <= 3 ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 600 }}>
                  {product.stock <= 3 ? `Only ${product.stock} Left in Stock!` : 'In Stock'}
                </span>
              ) : (
                <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>Sold Out</span>
              )}</div>
            </div>

            {/* Variant Selectors */}
            <div style={styles.variantsBlock}>
              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div style={styles.variantItem}>
                  <label style={styles.variantLabel}>Selected Color: <strong>{selectedColor}</strong></label>
                  <div style={styles.colorSwatches}>
                    {product.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        style={{
                          ...styles.colorCircle,
                          backgroundColor: col.hex,
                          borderColor: selectedColor === col.name ? 'var(--color-charcoal)' : 'var(--color-border)',
                          boxShadow: selectedColor === col.name ? '0 0 0 2px var(--color-primary)' : 'none'
                        }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div style={styles.variantItem}>
                  <label style={styles.variantLabel}>Select Size:</label>
                  <div style={styles.sizeOptions}>
                    {product.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          style={{
                            ...styles.sizeBtn,
                            backgroundColor: isSelected ? 'var(--color-charcoal)' : 'transparent',
                            color: isSelected ? 'var(--color-white)' : 'var(--color-charcoal-light)',
                            borderColor: isSelected ? 'var(--color-charcoal)' : 'var(--color-border)'
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div style={styles.variantItem}>
                <label style={styles.variantLabel}>Quantity:</label>
                <div style={styles.qtyBox}>
                  <button 
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => prev - 1)}
                    style={styles.qtyControl}
                  >-</button>
                  <span style={styles.qtyVal}>{quantity}</span>
                  <button 
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => prev + 1)}
                    style={styles.qtyControl}
                  >+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionsBlock}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary"
                style={{
                  ...styles.addToBagBtn,
                  backgroundColor: product.stock <= 0 ? 'var(--color-border)' : 'var(--color-charcoal)',
                  borderColor: product.stock <= 0 ? 'var(--color-border)' : 'var(--color-charcoal)',
                  cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <FiShoppingBag />
                <span>{product.stock <= 0 ? 'SOLD OUT' : 'ADD TO BAG'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  ...styles.wishlistAction,
                  color: isFavorite ? 'var(--color-accent-dark)' : 'var(--color-charcoal-light)',
                  borderColor: isFavorite ? 'var(--color-accent)' : 'var(--color-border)'
                }}
              >
                <FiHeart fill={isFavorite ? 'var(--color-accent-dark)' : 'none'} />
                <span>{isFavorite ? 'WISHLISTED' : 'ADD TO WISHLIST'}</span>
              </button>
            </div>

            {/* Toast feedback */}
            {toastMessage && (
              <div style={styles.toast}>
                <FiCheck size={16} /> {toastMessage}
              </div>
            )}

            {/* Logistics Promises */}
            <div style={styles.promises}>
              <div style={styles.promiseItem}>
                <FiTruck style={styles.promiseIcon} />
                <div>
                  <h4 style={styles.promiseTitle}>Free Insured Delivery</h4>
                  <p style={styles.promiseText}>Complimentary shipping on orders above ₹1,999 across India.</p>
                </div>
              </div>
              <div style={styles.promiseItem}>
                <FiRotateCcw style={styles.promiseIcon} />
                <div>
                  <h4 style={styles.promiseTitle}>Easy Exchanges</h4>
                  <p style={styles.promiseText}>Hassle-free size exchanges within 7 days of package arrival.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews and Specifications Block */}
        <section style={styles.tabsSection}>
          <div style={styles.tabsHeader}>
            <h3 style={styles.activeTab}>Ratings & Customer Reviews ({product.reviewsCount})</h3>
          </div>

          <div style={styles.tabsContent}>
            {/* Reviews List & Form Grid */}
            <div style={styles.reviewsGrid}>
              {/* Left Column: Review Listings */}
              <div style={styles.reviewsCol}>
                {product.reviews.length === 0 ? (
                  <p style={styles.noReviews}>No reviews written yet. Be the first to share your experience with this curation!</p>
                ) : (
                  <div style={styles.reviewsList}>
                    {product.reviews.map((rev) => (
                      <div key={rev.id} style={styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                          <h4 style={styles.reviewUser}>{rev.user}</h4>
                          <span style={styles.reviewDate}>{rev.date}</span>
                        </div>
                        <div style={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={12} color={i < rev.rating ? '#C5A059' : '#EAE3D5'} />
                          ))}
                        </div>
                        <p style={styles.reviewComment}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Write a Review Form */}
              <div style={styles.reviewFormCol}>
                <h4 style={styles.reviewFormTitle}>Write a Review</h4>
                {reviewSuccess && (
                  <div style={styles.reviewSuccessMsg}>Thank you! Your feedback has been published.</div>
                )}
                <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priyadharshini"
                      value={reviewUser}
                      onChange={(e) => setReviewUser(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Star Rating</label>
                    <div style={styles.ratingSelectFlex}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          style={styles.starSelectBtn}
                        >
                          <FaStar size={20} color={star <= reviewRating ? '#C5A059' : '#EAE3D5'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Review Description</label>
                    <textarea
                      rows={4}
                      placeholder="How did the fabric feel? Tell others about sizing, fit and drape..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={styles.reviewSubmitBtn}>
                    <span>SUBMIT REVIEW</span>
                    <FiSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section style={styles.relatedSection}>
            <div className="section-title-wrapper">
              <span className="section-subtitle">COMPLEMENTARY FINDS</span>
              <h2 className="section-title">You May Also Elegant Like</h2>
            </div>
            <div className="grid-responsive">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '80vh',
    padding: '4rem 0',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '6rem 0',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '4rem',
    alignItems: 'start',
    marginBottom: '6rem',
  },
  galleryColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mainImageFrame: {
    position: 'relative',
    width: '100%',
  },
  magnifyBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(28, 28, 28, 0.85)',
    color: '#FFFFFF',
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: 500,
    borderRadius: '2px',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    letterSpacing: '0.05em',
  },
  thumbnailsGrid: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
  },
  thumbnailBtn: {
    width: '80px',
    height: '100px',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  name: {
    fontSize: '2.4rem',
    fontWeight: 400,
    lineHeight: 1.2,
    marginBottom: '0.8rem',
  },
  ratingsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  ratingText: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    fontWeight: 500,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '2rem',
  },
  price: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
  },
  discountPrice: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: 'var(--color-accent-dark)',
  },
  originalPrice: {
    fontSize: '1.25rem',
    textDecoration: 'line-through',
    color: 'var(--color-charcoal-light)',
  },
  discountBadge: {
    backgroundColor: 'var(--color-accent-dark)',
    color: 'var(--color-white)',
    padding: '3px 8px',
    fontSize: '0.7rem',
    fontWeight: 700,
    borderRadius: '2px',
  },
  description: {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'var(--color-charcoal-light)',
    marginBottom: '2rem',
  },
  metaBlock: {
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    padding: '1.2rem 0',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  metaItem: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal)',
  },
  variantsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  variantItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  variantLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-charcoal-light)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  colorSwatches: {
    display: 'flex',
    gap: '10px',
  },
  colorCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid transparent',
    padding: 0,
    transition: 'var(--transition-fast)',
  },
  sizeOptions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  sizeBtn: {
    border: '1px solid var(--color-border)',
    minWidth: '50px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    width: '120px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-white)',
  },
  qtyControl: {
    width: '36px',
    height: '36px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: 'var(--color-charcoal-light)',
    background: 'none',
    border: 'none',
  },
  qtyVal: {
    flex: 1,
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  actionsBlock: {
    display: 'flex',
    gap: '1.2rem',
    marginBottom: '2rem',
  },
  addToBagBtn: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1.1rem 0',
  },
  wishlistAction: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: '1px solid var(--color-border)',
    padding: '1.1rem 0',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    backgroundColor: 'transparent',
  },
  toast: {
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    padding: '0.8rem 1.2rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'fadeIn 0.2s ease',
  },
  promises: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '1.5rem',
  },
  promiseItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  promiseIcon: {
    color: 'var(--color-primary)',
    fontSize: '1.2rem',
    marginTop: '2px',
    flexShrink: 0,
  },
  promiseTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '2px',
  },
  promiseText: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.4,
  },
  tabsSection: {
    borderTop: '1px solid var(--color-border)',
    marginTop: '5rem',
    paddingTop: '3rem',
  },
  tabsHeader: {
    borderBottom: '1.5px solid var(--color-border)',
    paddingBottom: '0.8rem',
    marginBottom: '2rem',
  },
  activeTab: {
    fontSize: '1.3rem',
    fontWeight: 500,
    fontFamily: 'var(--font-serif)',
    position: 'relative',
    display: 'inline-block',
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
    alignItems: 'start',
  },
  reviewsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  noReviews: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  reviewCard: {
    borderBottom: '1px dashed var(--color-border)',
    paddingBottom: '1.5rem',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  reviewUser: {
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  reviewDate: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
  },
  reviewStars: {
    display: 'flex',
    gap: '2px',
    marginBottom: '8px',
  },
  reviewComment: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.5,
  },
  reviewFormCol: {
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
  },
  reviewFormTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '1.5rem',
  },
  reviewSuccessMsg: {
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    padding: '8px 12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '1rem',
    borderRadius: '2px',
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  ratingSelectFlex: {
    display: 'flex',
    gap: '6px',
  },
  starSelectBtn: {
    cursor: 'pointer',
    padding: '5px',
  },
  reviewSubmitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0.9rem 0',
    marginTop: '0.5rem',
  },
  relatedSection: {
    marginTop: '6rem',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '5rem',
  }
};

// Inject dynamic CSS for responsive product detail components
const injectProductDetailsStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      div[style*="detailsGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="reviewsGrid"] {
        grid-template-columns: 1fr !important;
        gap: 3rem !important;
      }
    }
    @media (max-width: 480px) {
      div[style*="actionsBlock"] {
        flex-direction: column !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectProductDetailsStyles();
}

