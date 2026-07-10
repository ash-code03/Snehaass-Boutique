import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useShop();

  // Strip non-numbers from the whatsapp string, use default if missing
  const cleanNumber = settings?.whatsappNumber 
    ? settings.whatsappNumber.replace(/\D/g, '') 
    : '919876543210';

  const defaultText = encodeURIComponent(
    "Hello Snehaas Boutique! I am visiting your store and would like to inquire about your collections."
  );
  
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${defaultText}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={styles.floatingBtn}
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
      <span style={styles.tooltip}>Need Help? Chat with us</span>
    </a>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  floatingBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#25D366',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    zIndex: 9999,
    cursor: 'pointer',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    animation: 'pulseWhatsApp 2s infinite',
  },
  tooltip: {
    position: 'absolute',
    right: '72px',
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0,
    transform: 'translateX(10px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    boxShadow: 'var(--shadow-medium)',
  },
};

// Add WhatsApp pulse animation and hover tooltip show in DOM style sheet
const injectWhatsAppStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    a[aria-label="Chat on WhatsApp"]:hover {
      transform: scale(1.1);
      background-color: #20BA5A !important;
    }
    a[aria-label="Chat on WhatsApp"]:hover span {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectWhatsAppStyles();
}
