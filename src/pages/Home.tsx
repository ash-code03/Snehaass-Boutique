import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiPercent, FiTruck, FiAward, FiShield } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { products } = useShop();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80",
      subtitle: "EXQUISITE HANDLOOMS",
      title: "The Royal Silk Collection",
      desc: "Immerse yourself in authentic Kanchipuram and Banarasi silk sarees, hand-selected to celebrate heritage and timeless elegance.",
      btnText: "EXPLORE SAREES",
      link: "#/shop?category=Sarees"
    },
    {
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=80",
      subtitle: "BRIDAL COUTURE",
      title: "Dreamy Wedding Lehengas",
      desc: "Sparkle on your special day with handcrafted Zardozi, dense thread embroidery, and premium georgette and velvet silhouettes.",
      btnText: "DISCOVER BRIDAL",
      link: "#/shop?category=Lehengas"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      subtitle: "EXCLUSIVE CURATIONS",
      title: "Contemporary Boutique Collections",
      desc: "Discover a fusion of modern trends and traditional motifs, tailor-made to deliver premium style for cocktail parties and soirées.",
      btnText: "VIEW LOOKBOOK",
      link: "#/shop?category=Boutique Collections"
    }
  ];

  // Auto rotate hero slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const categories = [
    { name: 'Sarees', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80', count: products.filter(p => p.category === 'Sarees').length },
    { name: 'Lehengas', image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=500&q=80', count: products.filter(p => p.category === 'Lehengas').length },
    { name: 'Kurtis & Salwars', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=500&q=80', count: products.filter(p => ['Kurtis', 'Salwars'].includes(p.category)).length },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80', count: products.filter(p => p.category === 'Accessories').length }
  ];

  const testimonials = [
    {
      quote: "The fabric quality from Snehaas Boutique is simply unparalleled. The Kanchipuram silk saree I ordered feels like a luxury heirloom, and the zari work shines brilliantly.",
      author: "Radhika K., Bangalore",
      rating: 5
    },
    {
      quote: "Excellent fit on my customized Lehenga! The customer care team reached out via WhatsApp immediately to confirm my measurements. Highly recommended boutique!",
      author: "Sneha Nair, Chennai",
      rating: 5
    },
    {
      quote: "Their pastel chiffon and organza sarees are perfect for modern occasions. Finding authentic handlooms with a premium finish has never been this easy.",
      author: "Kritika S., Mumbai",
      rating: 5
    }
  ];

  return (
    <div style={styles.container}>
      {/* 1. Parallax Hero Section */}
      <section style={styles.heroSection}>
        {heroSlides.map((slide, index) => (
          <div 
            key={index} 
            style={{
              ...styles.heroSlide,
              backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${slide.image})`,
              opacity: index === currentHeroIndex ? 1 : 0,
              visibility: index === currentHeroIndex ? 'visible' : 'hidden',
              transform: index === currentHeroIndex ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div className="container" style={styles.heroTextContainer}>
              <span style={styles.heroSub}>{slide.subtitle}</span>
              <h2 style={styles.heroTitle}>{slide.title}</h2>
              <p style={styles.heroDesc}>{slide.desc}</p>
              <a href={slide.link} className="btn-primary" style={styles.heroBtn}>
                <span>{slide.btnText}</span>
                <FiArrowRight />
              </a>
            </div>
          </div>
        ))}
        {/* Hero Indicators */}
        <div style={styles.heroIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              style={{
                ...styles.indicatorDot,
                backgroundColor: index === currentHeroIndex ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)',
                width: index === currentHeroIndex ? '30px' : '8px'
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Value Propositions */}
      <section style={styles.propsSection}>
        <div className="container" style={styles.propsGrid}>
          <div style={styles.propCard}>
            <FiAward size={24} style={styles.propIcon} />
            <h3 style={styles.propTitle}>Artisanal Quality</h3>
            <p style={styles.propText}>Individually hand-crafted fabrics and handloom weaves.</p>
          </div>
          <div style={styles.propCard}>
            <FiTruck size={24} style={styles.propIcon} />
            <h3 style={styles.propTitle}>Worldwide Shipping</h3>
            <p style={styles.propText}>Insured, express delivery globally straight to your doorstep.</p>
          </div>
          <div style={styles.propCard}>
            <FiPercent size={24} style={styles.propIcon} />
            <h3 style={styles.propTitle}>Exclusive Offers</h3>
            <p style={styles.propText}>Welcome discounts and seasonal offers for subscribers.</p>
          </div>
          <div style={styles.propCard}>
            <FiShield size={24} style={styles.propIcon} />
            <h3 style={styles.propTitle}>Secure Checkout</h3>
            <p style={styles.propText}>Encrypted UPI, Cards, Net Banking, and COD payments.</p>
          </div>
        </div>
      </section>

      {/* 3. Promo Banner Grid */}
      <section style={styles.promoSection}>
        <div className="container" style={styles.promoGrid}>
          <div style={{ ...styles.promoCard, backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80)' }}>
            <span style={styles.promoSub}>LIMITED DURATION</span>
            <h3 style={styles.promoTitle}>Festive Elegance: 10% Off</h3>
            <p style={styles.promoText}>Use code <strong style={{ color: 'var(--color-primary)' }}>WELCOME10</strong> on checkout for designer sarees.</p>
            <a href="#/shop?category=Sarees" style={styles.promoLink}>Explore Now <FiArrowRight /></a>
          </div>
          <div style={{ ...styles.promoCard, backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80)' }}>
            <span style={styles.promoSub}>NEW RELEASE</span>
            <h3 style={styles.promoTitle}>Pastel Chiffon Curations</h3>
            <p style={styles.promoText}>A dreamy selection of lightweight suits and premium western silhouettes.</p>
            <a href="#/shop?category=Western Wear" style={styles.promoLink}>Shop Curation <FiArrowRight /></a>
          </div>
        </div>
      </section>

      {/* 4. Core Categories visual grid */}
      <section style={styles.section}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">THE COLLECTIONS</span>
            <h2 className="section-title">Shop By Curation</h2>
          </div>
          <div style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <a 
                key={cat.name} 
                href={cat.name === 'Kurtis & Salwars' ? '#/shop?category=Kurtis,Salwars' : `#/shop?category=${cat.name}`} 
                style={styles.catCard}
              >
                <div style={styles.catImageWrapper}>
                  <img src={cat.image} alt={cat.name} style={styles.catImage} />
                  <div style={styles.catOverlay} />
                </div>
                <div style={styles.catDetails}>
                  <h3 style={styles.catName}>{cat.name}</h3>
                  <span style={styles.catCount}>{cat.count} Items</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={styles.sectionAlt}>
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-subtitle">HANDPICKED EXCLUSIVES</span>
              <h2 className="section-title">Featured Creations</h2>
            </div>
            <div className="grid-responsive">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div style={styles.viewAllWrapper}>
              <a href="#/shop" className="btn-secondary">
                View All Collection
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 6. New Arrivals */}
      {newArrivals.length > 0 && (
        <section style={styles.section}>
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-subtitle">FRESHLY CURATED</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <div className="grid-responsive">
              {newArrivals.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Testimonials section */}
      <section style={styles.testimonialSection}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle" style={{ color: 'var(--color-white)' }}>HEARD FROM CLIENTS</span>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Boutique Diaries</h2>
          </div>
          <div style={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <div key={i} style={styles.testimonialCard}>
                <p style={styles.testimonialQuote}>"{t.quote}"</p>
                <div style={styles.testimonialDivider} />
                <h4 style={styles.testimonialAuthor}>{t.author}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Instagram Grid */}
      <section style={styles.section}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">LOOKBOOK GALLERY</span>
            <h2 className="section-title">Styled on Instagram</h2>
          </div>
          <div style={styles.instagramGrid}>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80" alt="Saree Style" style={styles.instaImg} /></div>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80" alt="Lehenga Style" style={styles.instaImg} /></div>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80" alt="Kurti Styling" style={styles.instaImg} /></div>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80" alt="Gold Accessories styling" style={styles.instaImg} /></div>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80" alt="Floral maxi look" style={styles.instaImg} /></div>
            <div style={styles.instagramTile}><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80" alt="Boutique shoot" style={styles.instaImg} /></div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
  },
  heroSection: {
    height: '80vh',
    minHeight: '550px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  heroTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    marginBottom: '1rem',
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '4rem',
    fontWeight: 300,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    maxWidth: '650px',
    color: '#FFFFFF',
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  heroDesc: {
    fontSize: '1rem',
    lineHeight: 1.6,
    maxWidth: '500px',
    marginBottom: '2.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroBtn: {
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  heroIndicators: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    display: 'flex',
    gap: '10px',
  },
  indicatorDot: {
    height: '8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
  },
  propsSection: {
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-border)',
    padding: '3rem 0',
  },
  propsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
  },
  propCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  propIcon: {
    color: 'var(--color-primary)',
    marginBottom: '1rem',
  },
  propTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  propText: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.5,
    maxWidth: '220px',
  },
  promoSection: {
    padding: '5rem 0 2rem 0',
  },
  promoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  promoCard: {
    height: '350px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: '#FFFFFF',
    position: 'relative',
    boxShadow: 'var(--shadow-subtle)',
  },
  promoSub: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.25em',
    color: 'var(--color-primary)',
    marginBottom: '0.75rem',
  },
  promoTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2rem',
    fontWeight: 400,
    marginBottom: '0.5rem',
    color: '#FFFFFF',
  },
  promoText: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    maxWidth: '350px',
    marginBottom: '1.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  promoLink: {
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    borderBottom: '1.5px solid #FFFFFF',
    paddingBottom: '3px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'var(--transition-fast)',
  },
  section: {
    padding: '6rem 0',
  },
  sectionAlt: {
    padding: '6rem 0',
    backgroundColor: 'var(--color-cream-dark)',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  catCard: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-subtle)',
  },
  catImageWrapper: {
    width: '100%',
    paddingTop: '135%', // Tall image aspect ratio
    position: 'relative',
    overflow: 'hidden',
  },
  catImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  catOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    transition: 'background-color 0.4s ease',
  },
  catDetails: {
    position: 'absolute',
    bottom: '24px',
    left: '24px',
    right: '24px',
    color: '#FFFFFF',
    zIndex: 5,
  },
  catName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.6rem',
    fontWeight: 400,
    marginBottom: '0.25rem',
    color: '#FFFFFF',
  },
  catCount: {
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.8)',
  },
  viewAllWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3.5rem',
  },
  testimonialSection: {
    backgroundColor: 'var(--color-charcoal)',
    padding: '7rem 0',
  },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2.5rem',
  },
  testimonialCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2.5rem 2rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(197, 160, 89, 0.15)',
  },
  testimonialQuote: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.25rem',
    fontStyle: 'italic',
    lineHeight: 1.6,
    color: 'var(--color-pink-soft)',
    marginBottom: '1.5rem',
  },
  testimonialDivider: {
    width: '40px',
    height: '1px',
    backgroundColor: 'var(--color-primary)',
    marginBottom: '1rem',
  },
  testimonialAuthor: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  instagramGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '0.75rem',
  },
  instagramTile: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '100%', // Square tiles
    backgroundColor: 'var(--color-cream-dark)',
  },
  instaImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.8s ease',
  }
};

// Inject custom styles in DOM for animations and hover transformations
const injectHomeAnimations = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    a[href^="#/shop?category"]:hover img {
      transform: scale(1.08) !important;
    }
    a[href^="#/shop?category"]:hover div[style*="catOverlay"] {
      background-color: rgba(0, 0, 0, 0.3) !important;
    }
    div[style*="instagramTile"]:hover img {
      transform: scale(1.06) !important;
    }
    @media (max-width: 991px) {
      div[style*="categoriesGrid"] {
        grid-template-columns: 1fr 1fr !important;
      }
      div[style*="testimonialGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
      div[style*="instagramGrid"] {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    @media (max-width: 768px) {
      div[style*="promoGrid"] {
        grid-template-columns: 1fr !important;
      }
      h2[style*="heroTitle"] {
        font-size: 2.5rem !important;
      }
      p[style*="heroDesc"] {
        font-size: 0.9rem !important;
      }
    }
    @media (max-width: 576px) {
      div[style*="instagramGrid"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
    @media (max-width: 480px) {
      div[style*="categoriesGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectHomeAnimations();
}
