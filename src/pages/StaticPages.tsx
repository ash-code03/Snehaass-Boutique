import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

/* ABOUT US PAGE */
export const AboutUs: React.FC = () => {
  return (
    <div className="container" style={styles.page}>
      <div className="section-title-wrapper" style={{ marginBottom: '3rem' }}>
        <span className="section-subtitle">OUR DIARIES</span>
        <h2 className="section-title">The Heritage of Snehaas Boutique</h2>
      </div>

      <div style={styles.editorialGrid}>
        <div style={styles.editorialTextCol}>
          <h3 style={styles.editorialTitle}>A Passion for Heritage Handlooms</h3>
          <p style={styles.paragraph}>
            Established with a vision to preserve and promote the timeless craftsmanship of Indian handloom weavers, Snehaas Boutique is a haven for premium ethnic couture. We believe that every saree tells a story—a narrative of threads woven together by master craftsmen who have spent generations perfecting their art.
          </p>
          <p style={styles.paragraph}>
            From the heavy silk temples of Kanchipuram to the ethereal silver zari borders of Banaras, our collection is curated with an eye for authenticity, heavyweight silks, and rich, vibrant colors. We hand-select each piece to ensure that it meets the highest standards of luxury and aesthetics.
          </p>
          <h3 style={styles.editorialTitle}>Couture Made for the Modern Woman</h3>
          <p style={styles.paragraph}>
            While our roots are deeply anchored in tradition, we continuously design for the contemporary woman. Our collection features lightweight tissue silk organzas, handcrafted Lucknowi Chikankari salwar suits, sparkling sequined lehengas, and fusion western wear.
          </p>
          <p style={styles.paragraph}>
            We invite you to explore our creations and experience the warmth of personalized service that lies at the core of Snehaas Boutique.
          </p>
        </div>
        <div style={styles.editorialImgCol}>
          <img 
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" 
            alt="Boutique Fabric Curation" 
            style={styles.editorialImg} 
          />
        </div>
      </div>
    </div>
  );
};

/* CONTACT US PAGE */
export const ContactUs: React.FC = () => {
  const { settings } = useShop();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && msg.trim()) {
      setSuccess(true);
      setName('');
      setEmail('');
      setMsg('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="container" style={styles.page}>
      <div className="section-title-wrapper" style={{ marginBottom: '3rem' }}>
        <span className="section-subtitle">STORE LOCATOR</span>
        <h2 className="section-title">Get In Touch</h2>
      </div>

      <div style={styles.contactGrid}>
        {/* Contact Info column */}
        <div style={styles.contactDetailsBlock}>
          <h3 style={styles.editorialTitle}>Visit Snehaas Boutique</h3>
          <p style={{ ...styles.paragraph, marginBottom: '2.5rem' }}>
            We'd love to welcome you to our flagship boutique to experience our fabrics and customization fittings in person.
          </p>

          <div style={styles.infoList}>
            <div style={styles.infoRow}>
              <FiMapPin size={20} style={styles.infoIcon} />
              <div>
                <h4 style={styles.infoTitle}>Flagship Store Address</h4>
                <p style={styles.infoText}>{settings?.address || 'Chennai, Tamil Nadu'}</p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <FiPhone size={20} style={styles.infoIcon} />
              <div>
                <h4 style={styles.infoTitle}>Phone & WhatsApp</h4>
                <p style={styles.infoText}>{settings?.contactPhone || '+91 98765 43210'}</p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <FiMail size={20} style={styles.infoIcon} />
              <div>
                <h4 style={styles.infoTitle}>Email Inquiries</h4>
                <p style={styles.infoText}>{settings?.contactEmail || 'info@snehaasboutique.com'}</p>
              </div>
            </div>

            <div style={styles.infoRow}>
              <FiClock size={20} style={styles.infoIcon} />
              <div>
                <h4 style={styles.infoTitle}>Working Hours</h4>
                <p style={styles.infoText}>Monday to Saturday: 10:30 AM – 8:30 PM<br />Sunday: 11:30 AM – 7:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form column */}
        <div style={styles.contactFormBlock}>
          <h3 style={styles.editorialTitle}>Write An Inquiry</h3>
          {success && (
            <div style={styles.successBanner}>Thank you! Your inquiry was submitted. A representative will email/WhatsApp you shortly.</div>
          )}
          <form onSubmit={handleContactSubmit} style={styles.form}>
            <div className="form-group">
              <label>Your Name *</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Your Message / Custom Requirement *</label>
              <textarea 
                rows={5} 
                placeholder="Inquire about sarees, sizing custom fits or bulk boutique orders..." 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={styles.submitContactBtn}>
              <span>SEND INQUIRY</span>
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* PRIVACY POLICY PAGE */
export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container" style={styles.policyPage}>
      <h2 style={styles.policyTitle}>Privacy Policy</h2>
      <p style={styles.policyDate}>Last Updated: July 10, 2026</p>
      
      <p style={styles.paragraph}>
        At Snehaas Boutique, we value our customers' trust and are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you visit or make a purchase from our website.
      </p>
      <h3 style={styles.policySubTitle}>1. Personal Information We Collect</h3>
      <p style={styles.paragraph}>
        When you make a purchase, register an account, or submit inquiries, we collect personal details such as your name, email, billing address, shipping address, phone number, and selected payment choices (such as UPI tags or card references).
      </p>
      <h3 style={styles.policySubTitle}>2. How We Use Your Information</h3>
      <p style={styles.paragraph}>
        We use the order information we collect to fulfill your purchases (including processing payments, arranging shipping, providing invoices, and tracking delivery). Additionally, we use this information to communicate order statuses and share announcements with you.
      </p>
      <h3 style={styles.policySubTitle}>3. Contact Us</h3>
      <p style={styles.paragraph}>
        For more information about our privacy practices, or if you have questions, please contact us by e-mail at info@snehaasboutique.com.
      </p>
    </div>
  );
};

/* TERMS AND CONDITIONS PAGE */
export const TermsAndConditions: React.FC = () => {
  return (
    <div className="container" style={styles.policyPage}>
      <h2 style={styles.policyTitle}>Terms & Conditions</h2>
      <p style={styles.policyDate}>Last Updated: July 10, 2026</p>

      <p style={styles.paragraph}>
        Welcome to Snehaas Boutique. By accessing or using our website, catalog and services, you agree to comply with and be bound by the following terms. Please read them carefully.
      </p>
      <h3 style={styles.policySubTitle}>1. Products & Custiomization</h3>
      <p style={styles.paragraph}>
        We make every effort to display product colors, textures, and details as accurately as possible. However, because handlooms are handcrafted and screen displays vary, minor color variations or weaving slubs may occur and are celebrated as marks of authenticity.
      </p>
      <h3 style={styles.policySubTitle}>2. Pricing & Payments</h3>
      <p style={styles.paragraph}>
        All prices are listed in Indian Rupees (INR) and are inclusive of GST. Snehaas Boutique reserves the right to modify prices without prior notice. Payments must be fully cleared at checkout before shipment handoffs.
      </p>
    </div>
  );
};

/* RETURN POLICY PAGE */
export const ReturnPolicy: React.FC = () => {
  return (
    <div className="container" style={styles.policyPage}>
      <h2 style={styles.policyTitle}>Return & Exchange Policy</h2>
      <p style={styles.policyDate}>Last Updated: July 10, 2026</p>

      <p style={styles.paragraph}>
        We want you to be absolutely delighted with your Snehaas Boutique creations. If you are not completely satisfied, we are here to help.
      </p>
      <h3 style={styles.policySubTitle}>1. Returns & Exchanges Criteria</h3>
      <p style={styles.paragraph}>
        - Items must be unused, unwashed, and in the original packaging with all boutique tags intact.<br />
        - Custom-fitted dresses, blouse stitches, or altered sarees are **not eligible** for returns.<br />
        - Return requests must be initiated within 7 days of package delivery.
      </p>
      <h3 style={styles.policySubTitle}>2. Process</h3>
      <p style={styles.paragraph}>
        To initiate an exchange, please email returns@snehaasboutique.com with your Order ID and photo attachments of the product. Once approved, we will schedule a reverse pickup or request self-shipping depending on location.
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '5rem var(--spacing-lg)',
  },
  editorialGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '4rem',
    alignItems: 'center',
  },
  editorialTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  editorialTitle: {
    fontSize: '1.5rem',
    fontWeight: 500,
    fontFamily: 'var(--font-serif)',
    marginBottom: '1rem',
    marginTop: '1.5rem',
    color: 'var(--color-charcoal)',
  },
  paragraph: {
    fontSize: '0.95rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.7,
    marginBottom: '1.2rem',
  },
  editorialImgCol: {
    width: '100%',
  },
  editorialImg: {
    width: '100%',
    height: 'auto',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-medium)',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '4rem',
    alignItems: 'start',
  },
  contactDetailsBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
  },
  infoRow: {
    display: 'flex',
    gap: '1.2rem',
    alignItems: 'flex-start',
  },
  infoIcon: {
    color: 'var(--color-primary)',
    marginTop: '4px',
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  infoText: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.5,
  },
  contactFormBlock: {
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '2.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
  },
  submitContactBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem 0',
  },
  successBanner: {
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    padding: '0.8rem 1.2rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    borderRadius: '2px',
    marginBottom: '1rem',
  },
  policyPage: {
    maxWidth: '800px',
    padding: '6rem var(--spacing-lg)',
  },
  policyTitle: {
    fontSize: '2.5rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    marginBottom: '6px',
  },
  policyDate: {
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    fontStyle: 'italic',
    marginBottom: '2.5rem',
  },
  policySubTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginTop: '2rem',
    marginBottom: '0.8rem',
  }
};

// Inject dynamic CSS rules for responsive static page grids
const injectStaticPageStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      div[style*="editorialGrid"] {
        grid-template-columns: 1fr !important;
        gap: 2.5rem !important;
      }
      div[style*="contactGrid"] {
        grid-template-columns: 1fr !important;
        gap: 3rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectStaticPageStyles();
}

