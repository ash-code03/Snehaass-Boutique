import { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { AboutUs, ContactUs, PrivacyPolicy, TermsAndConditions, ReturnPolicy } from './pages/StaticPages';
import { AdminDashboard } from './pages/AdminDashboard';

// Define Route Page structures
type RoutePage = 
  | { name: 'home' }
  | { name: 'shop' }
  | { name: 'product'; id: string }
  | { name: 'wishlist' }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'track' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'admin' }
  | { name: 'privacy' }
  | { name: 'terms' }
  | { name: 'returns' };

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<RoutePage>({ name: 'home' });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Hash Router Parser
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      const cleanHash = hash.split('?')[0]; // strip parameters for route matching

      if (cleanHash === '#/' || cleanHash === '#') {
        setCurrentRoute({ name: 'home' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/shop') {
        setCurrentRoute({ name: 'shop' });
        window.scrollTo(0, 0);
      } else if (cleanHash.startsWith('#/product/')) {
        const id = cleanHash.replace('#/product/', '');
        setCurrentRoute({ name: 'product', id });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/wishlist') {
        setCurrentRoute({ name: 'wishlist' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/cart') {
        setCurrentRoute({ name: 'cart' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/checkout') {
        setCurrentRoute({ name: 'checkout' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/track') {
        setCurrentRoute({ name: 'track' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/about') {
        setCurrentRoute({ name: 'about' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/contact') {
        setCurrentRoute({ name: 'contact' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/admin') {
        setCurrentRoute({ name: 'admin' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/privacy') {
        setCurrentRoute({ name: 'privacy' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/terms') {
        setCurrentRoute({ name: 'terms' });
        window.scrollTo(0, 0);
      } else if (cleanHash === '#/returns') {
        setCurrentRoute({ name: 'returns' });
        window.scrollTo(0, 0);
      } else {
        setCurrentRoute({ name: 'home' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Parse route on initial render
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderActivePage = () => {
    switch (currentRoute.name) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product':
        return <ProductDetails productId={currentRoute.id} />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <Checkout />;
      case 'track':
        return <OrderTracking />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'admin':
        return <AdminDashboard />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsAndConditions />;
      case 'returns':
        return <ReturnPolicy />;
      default:
        return <Home />;
    }
  };
  return (
    <>
      <Header onOpenCartDrawer={() => setCartDrawerOpen(true)} />
      
      <main style={{ minHeight: '80vh' }}>
        {renderActivePage()}
      </main>

      <Footer />
      
      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav onOpenCartDrawer={() => setCartDrawerOpen(true)} />
      
      {/* Floating Elements */}
      <FloatingWhatsApp />
      
      {/* Cart Drawer Sidebar */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}

function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  )
}

export default App
