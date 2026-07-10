import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { settings } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand & Newsletter */}
          <div style={styles.brandCol}>
            <span style={styles.logoSub}>S N E H A A S</span>
            <h2 style={styles.brandName}>{settings?.boutiqueName || 'Snehaas Boutique'}</h2>
            <p style={styles.description}>
              Curating exquisite silk sarees, designer ethnic suits, custom lehengas, and hand-finished boutique wear for the discerning modern woman.
            </p>
            <div style={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialLink} aria-label="Instagram">
                <FiInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.socialLink} aria-label="Facebook">
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksCol}>
            <h3 style={styles.colTitle}>Boutique Shop</h3>
            <ul style={styles.linksList}>
              <li><a href="#/shop?category=Sarees" style={styles.link}>Designer Sarees</a></li>
              <li><a href="#/shop?category=Salwars" style={styles.link}>Salwar Suits</a></li>
              <li><a href="#/shop?category=Kurtis" style={styles.link}>Designer Kurtis</a></li>
              <li><a href="#/shop?category=Lehengas" style={styles.link}>Wedding Lehengas</a></li>
              <li><a href="#/shop?category=Western Wear" style={styles.link}>Western Boutique</a></li>
              <li><a href="#/shop?category=Accessories" style={styles.link}>Premium Jewelry</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div style={styles.linksCol}>
            <h3 style={styles.colTitle}>Customer Care</h3>
            <ul style={styles.linksList}>
              <li><a href="#/track" style={styles.link}>Track Order</a></li>
              <li><a href="#/returns" style={styles.link}>Returns & Exchanges</a></li>
              <li><a href="#/privacy" style={styles.link}>Privacy Policy</a></li>
              <li><a href="#/terms" style={styles.link}>Terms & Conditions</a></li>
              <li><a href="#/contact" style={styles.link}>Store Locator</a></li>
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div style={styles.contactCol}>
            <h3 style={styles.colTitle}>Newsletter</h3>
            <p style={styles.newsletterText}>Subscribe to receive early access to new collections, lookbooks, and private sales.</p>
            <form onSubmit={handleSubscribe} style={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.subscribeInput}
                required
              />
              <button type="submit" style={styles.subscribeSubmit}>
                SUBSCRIBE
              </button>
            </form>
            {subscribed && (
              <p style={styles.successMessage}>Thank you for subscribing to our mailing list!</p>
            )}

            <div style={styles.contactInfo}>
              <div style={styles.contactRow}>
                <FiMapPin size={16} style={styles.contactIcon} />
                <span>{settings?.address || 'Chennai, Tamil Nadu'}</span>
              </div>
              <div style={styles.contactRow}>
                <FiPhone size={16} style={styles.contactIcon} />
                <span>{settings?.contactPhone || '+91 98765 43210'}</span>
              </div>
              <div style={styles.contactRow}>
                <FiMail size={16} style={styles.contactIcon} />
                <span>{settings?.contactEmail || 'info@snehaasboutique.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Snehaas Boutique. All Rights Reserved. Crafted with love.</p>
        </div>
      </div>
    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: 'var(--color-cream-dark)',
    borderTop: '1px solid var(--color-border)',
    padding: '5rem 0 2rem 0',
    marginTop: '6rem',
    color: 'var(--color-charcoal-light)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr',
    gap: '3rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logoSub: {
    fontSize: '0.55rem',
    letterSpacing: '0.4em',
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginBottom: '2px',
  },
  brandName: {
    fontSize: '1.6rem',
    color: 'var(--color-charcoal)',
    marginBottom: '1rem',
    fontFamily: 'var(--font-serif)',
  },
  description: {
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: 'var(--color-charcoal-light)',
    marginBottom: '1.5rem',
  },
  socials: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--color-border)',
    color: 'var(--color-charcoal)',
    transition: 'var(--transition-fast)',
    backgroundColor: 'var(--color-white)',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  colTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--color-charcoal)',
    marginBottom: '1.5rem',
    fontFamily: 'var(--font-sans)',
  },
  linksList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  link: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    transition: 'var(--transition-fast)',
    borderBottom: '1px solid transparent',
  },
  contactCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  newsletterText: {
    fontSize: '0.85rem',
    marginBottom: '1rem',
    lineHeight: 1.5,
  },
  subscribeForm: {
    display: 'flex',
    marginBottom: '1.5rem',
    width: '100%',
  },
  subscribeInput: {
    flex: 1,
    padding: '0.65rem 0.8rem',
    fontSize: '0.85rem',
    border: '1px solid var(--color-border)',
    borderRight: 'none',
    borderRadius: 0,
  },
  subscribeSubmit: {
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    padding: '0 1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    border: '1px solid var(--color-charcoal)',
    borderRadius: 0,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  successMessage: {
    color: 'var(--color-success)',
    fontSize: '0.8rem',
    fontWeight: 500,
    marginBottom: '1rem',
  },
  contactInfo: {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    fontSize: '0.85rem',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '1.5rem',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
  },
  contactIcon: {
    color: 'var(--color-primary)',
    marginTop: '3px',
    flexShrink: 0,
  },
  footerBottom: {
    borderTop: '1px solid var(--color-border)',
    marginTop: '4rem',
    paddingTop: '2rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
  }
};

const injectFooterResponsiveStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      footer div[style*="grid-template-columns"] {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 576px) {
      footer div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
        gap: 2rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectFooterResponsiveStyles();
}
