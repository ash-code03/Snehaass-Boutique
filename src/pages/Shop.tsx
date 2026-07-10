import React, { useState, useEffect, useMemo } from 'react';
import { FiFilter, FiSliders, FiX, FiSearch } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const { products } = useShop();

  // Read URL search params
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(35000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL hash params
  useEffect(() => {
    const parseUrlParams = () => {
      const hash = window.location.hash;
      const paramStr = hash.includes('?') ? hash.split('?')[1] : '';
      const params = new URLSearchParams(paramStr);

      const catParam = params.get('category');
      if (catParam) {
        setSelectedCategories(catParam.split(','));
      } else {
        setSelectedCategories([]);
      }

      const searchParam = params.get('search');
      if (searchParam) {
        setSearchQuery(decodeURIComponent(searchParam));
      } else {
        setSearchQuery('');
      }
    };

    parseUrlParams();
    window.addEventListener('hashchange', parseUrlParams);
    return () => window.removeEventListener('hashchange', parseUrlParams);
  }, []);

  // Update hash when categories change directly
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const next = prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category];
      
      const newHash = next.length > 0 
        ? `#/shop?category=${next.join(',')}`
        : `#/shop`;
      window.location.hash = newHash;
      return next;
    });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(35000);
    setSearchQuery('');
    window.location.hash = '#/shop';
  };

  // Extract lists for filters
  const categoriesList = ['Sarees', 'Salwars', 'Kurtis', 'Lehengas', 'Western Wear', 'Accessories', 'Boutique Collections'];
  const sizesList = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorsList = [
    { name: 'Red', hex: '#9B111E' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Rose Gold', hex: '#B76E79' },
    { name: 'Gold', hex: '#DAA520' },
    { name: 'Cream', hex: '#FFFFF0' },
    { name: 'Blue', hex: '#0F52BA' },
    { name: 'Green', hex: '#50C878' },
    { name: 'Black', hex: '#111111' }
  ];

  // Perform filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query) ||
             p.category.toLowerCase().includes(query) ||
             p.material.toLowerCase().includes(query)
      );
    }

    // Categories filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

    // Colors filter
    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(color => selectedColors.includes(color.name)));
    }

    // Price range filter
    result = result.filter(p => {
      const currentPrice = p.discountPrice !== null ? p.discountPrice : p.price;
      return currentPrice <= priceRange;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const pA = a.discountPrice !== null ? a.discountPrice : a.price;
        const pB = b.discountPrice !== null ? b.discountPrice : b.price;
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const pA = a.discountPrice !== null ? a.discountPrice : a.price;
        const pB = b.discountPrice !== null ? b.discountPrice : b.price;
        return pB - pA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy]);

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <section style={styles.shopHeader}>
        <div className="container" style={styles.shopHeaderContainer}>
          <h2 style={styles.title}>Boutique Catalog</h2>
          <p style={styles.subtitle}>Browse our curated couture, made with the finest silk, georgette, and linen.</p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="container" style={styles.mainGrid}>
        {/* Sidebar Filters - Desktop */}
        <aside style={styles.sidebar}>
          <div style={styles.filterSectionHeader}>
            <span style={styles.filterSectionTitle}><FiSliders style={{ marginRight: '6px' }} /> Filters</span>
            <button onClick={handleResetFilters} style={styles.resetBtn}>Reset</button>
          </div>

          {/* Search bar inside sidebar */}
          <div style={styles.sidebarBlock}>
            <h4 style={styles.blockTitle}>Search Products</h4>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="Type keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchField}
              />
              <FiSearch size={16} style={styles.searchIcon} />
            </div>
          </div>

          {/* Category Filter */}
          <div style={styles.sidebarBlock}>
            <h4 style={styles.blockTitle}>Categories</h4>
            <div style={styles.checkboxList}>
              {categoriesList.map(cat => (
                <label key={cat} style={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    style={styles.checkbox}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={styles.sidebarBlock}>
            <div style={styles.priceRow}>
              <h4 style={styles.blockTitle}>Max Price</h4>
              <span style={styles.priceLabel}>₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={35000}
              step={500}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={styles.rangeSlider}
            />
            <div style={styles.rangeLabels}>
              <span>₹1K</span>
              <span>₹35K</span>
            </div>
          </div>

          {/* Sizes Filter */}
          <div style={styles.sidebarBlock}>
            <h4 style={styles.blockTitle}>Select Size</h4>
            <div style={styles.sizeGrid}>
              {sizesList.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
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

          {/* Colors Filter */}
          <div style={styles.sidebarBlock}>
            <h4 style={styles.blockTitle}>Color Tone</h4>
            <div style={styles.colorFlex}>
              {colorsList.map(color => {
                const hexVal = typeof color === 'string' ? color : (color.hex || '#CCCCCC');
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    style={{
                      ...styles.colorCircle,
                      backgroundColor: hexVal,
                      border: isSelected ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                      boxShadow: isSelected ? '0 0 0 2px var(--color-primary)' : 'none'
                    }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>
        </aside>

        {/* Catalog List Column */}
        <main style={styles.catalogColumn}>
          {/* Controls Bar */}
          <div style={styles.controlsBar}>
            <button style={styles.mobileFilterToggle} onClick={() => setMobileFiltersOpen(true)}>
              <FiFilter size={16} /> Filters
            </button>
            <span style={styles.resultsCount}>
              Showing {filteredProducts.length} results
            </span>
            <div style={styles.sortWrapper}>
              <span style={styles.sortLabel}>Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.sortSelect}
              >
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyContainer}>
              <h3 style={styles.emptyTitle}>No products found</h3>
              <p style={styles.emptyText}>We couldn't find matches for the selected filters. Try broadening your criteria.</p>
              <button onClick={handleResetFilters} className="btn-primary">Reset Filters</button>
            </div>
          ) : (
            <div className="grid-responsive" style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </section>

      {/* Slide-out Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div style={styles.mobileDrawerOverlay} onClick={() => setMobileFiltersOpen(false)}>
          <div style={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h3 style={styles.drawerTitle}><FiFilter /> Refine Catalog</h3>
              <button onClick={() => setMobileFiltersOpen(false)} style={styles.closeBtn}>
                <FiX size={24} />
              </button>
            </div>
            
            {/* Scrollable filters form */}
            <div style={styles.drawerContent}>
              {/* Category */}
              <div style={styles.sidebarBlock}>
                <h4 style={styles.blockTitle}>Categories</h4>
                <div style={styles.checkboxList}>
                  {categoriesList.map(cat => (
                    <label key={cat} style={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        style={styles.checkbox}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div style={styles.sidebarBlock}>
                <div style={styles.priceRow}>
                  <h4 style={styles.blockTitle}>Max Price</h4>
                  <span style={styles.priceLabel}>₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={35000}
                  step={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  style={styles.rangeSlider}
                />
              </div>

              {/* Sizes */}
              <div style={styles.sidebarBlock}>
                <h4 style={styles.blockTitle}>Sizes</h4>
                <div style={styles.sizeGrid}>
                  {sizesList.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
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

              {/* Colors */}
              <div style={styles.sidebarBlock}>
                <h4 style={styles.blockTitle}>Colors</h4>
                <div style={styles.colorFlex}>
                  {colorsList.map(color => {
                    const hexVal = color.hex || '#CCCCCC';
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorToggle(color.name)}
                        style={{
                          ...styles.colorCircle,
                          backgroundColor: hexVal,
                          border: isSelected ? '2px solid var(--color-charcoal)' : '1px solid var(--color-border)',
                          boxShadow: isSelected ? '0 0 0 2px var(--color-primary)' : 'none'
                        }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={styles.drawerFooter}>
              <button 
                onClick={handleResetFilters} 
                style={styles.drawerResetBtn}
              >
                Clear All
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)} 
                style={styles.drawerApplyBtn}
              >
                Apply Filters
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
    paddingBottom: '4rem',
  },
  shopHeader: {
    backgroundColor: 'var(--color-cream-dark)',
    borderBottom: '1px solid var(--color-border)',
    padding: '3rem 0',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  shopHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 400,
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--color-charcoal-light)',
    maxWidth: '550px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '3rem',
  },
  sidebar: {
    display: 'block',
  },
  filterSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--color-charcoal)',
    paddingBottom: '0.8rem',
    marginBottom: '1.5rem',
  },
  filterSectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-charcoal)',
    display: 'flex',
    alignItems: 'center',
  },
  resetBtn: {
    fontSize: '0.8rem',
    color: 'var(--color-primary)',
    fontWeight: 600,
    textDecoration: 'underline',
  },
  sidebarBlock: {
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
  },
  blockTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--color-charcoal)',
    marginBottom: '1rem',
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchField: {
    width: '100%',
    padding: '0.6rem 2.2rem 0.6rem 0.8rem',
    fontSize: '0.85rem',
    borderRadius: '4px',
  },
  searchIcon: {
    position: 'absolute',
    right: '10px',
    color: 'var(--color-charcoal-light)',
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
    width: '15px',
    height: '15px',
    accentColor: 'var(--color-primary)',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '0.5rem',
  },
  priceLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
  },
  rangeSlider: {
    width: '100%',
    cursor: 'pointer',
    accentColor: 'var(--color-primary)',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--color-charcoal-light)',
    marginTop: '4px',
  },
  sizeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
  },
  sizeBtn: {
    border: '1px solid var(--color-border)',
    padding: '6px 0',
    fontSize: '0.75rem',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  colorFlex: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  colorCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
    transition: 'var(--transition-fast)',
  },
  catalogColumn: {
    width: '100%',
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '0.8rem 1.2rem',
    marginBottom: '2rem',
  },
  mobileFilterToggle: {
    display: 'none',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  resultsCount: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortLabel: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
  },
  sortSelect: {
    border: '1px solid var(--color-border)',
    fontSize: '0.85rem',
    padding: '4px 8px',
    backgroundColor: 'var(--color-white)',
  },
  productsGrid: {
    width: '100%',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '5rem var(--spacing-lg)',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'var(--color-charcoal-light)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    maxWidth: '400px',
    margin: '0 auto 1.5rem auto',
  },
  mobileDrawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10000,
  },
  mobileDrawer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '320px',
    height: '100%',
    backgroundColor: 'var(--color-cream)',
    zIndex: 10001,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem',
    borderBottom: '1px solid var(--color-border)',
  },
  drawerTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeBtn: {
    color: 'var(--color-charcoal)',
  },
  drawerContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.2rem',
  },
  drawerFooter: {
    padding: '1.2rem',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    gap: '10px',
    backgroundColor: 'var(--color-cream-dark)',
  },
  drawerResetBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '0.8rem 0',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    backgroundColor: 'var(--color-white)',
  },
  drawerApplyBtn: {
    flex: 2,
    textAlign: 'center',
    padding: '0.8rem 0',
    fontSize: '0.85rem',
    fontWeight: 600,
    backgroundColor: 'var(--color-charcoal)',
    color: 'var(--color-white)',
    border: 'none',
    cursor: 'pointer',
  }
};

const injectShopResponsive = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (max-width: 991px) {
      aside[style*="sidebar"] { display: none !important; }
      main[style*="catalogColumn"] { grid-column: 1 / -1 !important; }
      button[style*="mobileFilterToggle"] { display: flex !important; }
      section[style*="mainGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectShopResponsive();
}
