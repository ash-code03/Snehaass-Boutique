import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiShoppingBag, FiTag, FiTrash2, FiEdit2, FiSettings, FiLock, FiLogOut, FiGrid } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    settings, 
    adminToken, 
    verifyAdmin, 
    logoutAdmin,
    addProduct,
    editProduct,
    deleteProduct,
    updateOrderStatus,
    updateSettings 
  } = useShop();

  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'settings'>('analytics');

  // Product Form State
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Sarees');
  const [prodSizes, setProdSizes] = useState<string[]>(['Free Size']);
  const [prodColors, setProdColors] = useState<{ name: string; hex: string }[]>([]);
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodStock, setProdStock] = useState('5');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodTrending, setProdTrending] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(true);
  const [prodScheduledDate, setProdScheduledDate] = useState('');
  const [prodFiles, setProdFiles] = useState<File[]>([]);
  const [prodPreviews, setProdPreviews] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState('');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percent' | 'fixed'>('percent');
  const [couponVal, setCouponVal] = useState('');
  const [couponMin, setCouponMin] = useState('');

  // Store Settings Form State
  const [settingsName, setSettingsName] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsWa, setSettingsWa] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsAddress, setSettingsAddress] = useState('');
  const [settingsPasskey, setSettingsPasskey] = useState('');

  // Initial Form Seeds from store settings
  useEffect(() => {
    if (settings) {
      setSettingsName(settings.boutiqueName);
      setSettingsPhone(settings.contactPhone);
      setSettingsWa(settings.whatsappNumber);
      setSettingsEmail(settings.contactEmail);
      setSettingsAddress(settings.address);
      setSettingsPasskey(settings.adminPasskey);
    }
  }, [settings, adminToken]);

  // Auth Guard submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = await verifyAdmin(passkey);
    if (!success) {
      setAuthError('Invalid administrator passkey. Please try again.');
    }
  };

  // Variant helper checkboxes
  const sizesList = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'];
  const handleSizeToggle = (size: string) => {
    setProdSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Dynamic colors list editor
  const [colorInputName, setColorInputName] = useState('');
  const [colorInputHex, setColorInputHex] = useState('#B76E79');
  const addColorSwatch = () => {
    if (colorInputName.trim() && colorInputHex) {
      setProdColors(prev => [...prev, { name: colorInputName.trim(), hex: colorInputHex }]);
      setColorInputName('');
    }
  };
  const removeColorSwatch = (idx: number) => {
    setProdColors(prev => prev.filter((_, i) => i !== idx));
  };

  // Image Selection Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProdFiles(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setProdPreviews(prev => [...prev, ...previews]);
    }
  };

  const removeSelectedImage = (idx: number) => {
    setProdFiles(prev => prev.filter((_, i) => i !== idx));
    setProdPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit Product Add/Edit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');

    const formData = new FormData();
    formData.append('name', prodName);
    formData.append('description', prodDesc);
    formData.append('price', prodPrice);
    formData.append('discountPrice', prodDiscountPrice);
    formData.append('category', prodCategory);
    formData.append('sizes', JSON.stringify(prodSizes));
    formData.append('colors', JSON.stringify(prodColors));
    formData.append('material', prodMaterial);
    formData.append('stock', prodStock);
    formData.append('isFeatured', String(prodFeatured));
    formData.append('isTrending', String(prodTrending));
    formData.append('isNewArrival', String(prodNewArrival));
    formData.append('scheduledDate', prodScheduledDate);

    // Append file objects
    prodFiles.forEach(file => {
      formData.append('images', file);
    });

    let success = false;
    if (editingProdId) {
      success = await editProduct(editingProdId, formData);
      if (success) setFormSuccess('Product details updated successfully.');
    } else {
      success = await addProduct(formData);
      if (success) setFormSuccess('New product uploaded and added to catalog.');
    }

    if (success) {
      resetProductForm();
      setTimeout(() => setFormSuccess(''), 5000);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProdId(p.id);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(String(p.price));
    setProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setProdCategory(p.category);
    setProdSizes(p.sizes);
    setProdColors(p.colors);
    setProdMaterial(p.material);
    setProdStock(String(p.stock));
    setProdFeatured(p.isFeatured);
    setProdTrending(p.isTrending);
    setProdNewArrival(p.isNewArrival);
    setProdScheduledDate(p.scheduledDate || '');
    setProdFiles([]);
    setProdPreviews(p.images); // load existing images as previews
  };

  const resetProductForm = () => {
    setEditingProdId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscountPrice('');
    setProdCategory('Sarees');
    setProdSizes(['Free Size']);
    setProdColors([]);
    setProdMaterial('');
    setProdStock('5');
    setProdFeatured(false);
    setProdTrending(false);
    setProdNewArrival(true);
    setProdScheduledDate('');
    setProdFiles([]);
    setProdPreviews([]);
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      await deleteProduct(id);
    }
  };

  // Add Coupon
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponVal) return;

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim().toUpperCase(),
          discountType: couponType,
          discountValue: Number(couponVal),
          minPurchase: Number(couponMin || 0)
        })
      });
      if (response.ok) {
        setCouponCode('');
        setCouponVal('');
        setCouponMin('');
        alert('Coupon code created successfully.');
        window.location.reload(); // refresh lists
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to create coupon.');
      }
    } catch (err) {
      alert('Communication error.');
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      try {
        const response = await fetch(`/api/coupons/${code}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Coupon deleted.');
          window.location.reload();
        }
      } catch (err) {
        alert('Error deleting coupon.');
      }
    }
  };

  // Update Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings({
      boutiqueName: settingsName,
      contactPhone: settingsPhone,
      whatsappNumber: settingsWa,
      contactEmail: settingsEmail,
      address: settingsAddress,
      adminPasskey: settingsPasskey
    });
    if (success) {
      alert('Boutique settings saved successfully.');
    } else {
      alert('Failed to update boutique settings.');
    }
  };

  // --- ANALYTICS COMPUTATIONS ---
  const totalSales = orders.reduce((acc, o) => o.orderStatus !== 'Cancelled' ? acc + o.finalAmount : acc, 0);
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const aov = orders.length > 0 ? Math.round(totalSales / orders.filter(o => o.orderStatus !== 'Cancelled').length) : 0;

  // Render Lock Overlay if not authenticated
  if (!adminToken) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <FiLock size={40} style={styles.lockIcon} />
          <h2 style={styles.authTitle}>Administrator Portal</h2>
          <p style={styles.authDesc}>Please enter Snehaas Boutique credentials to access store controls.</p>
          {authError && <div style={styles.authErrorText}>{authError}</div>}
          <form onSubmit={handleAuthSubmit} style={styles.authForm}>
            <input
              type="password"
              placeholder="Enter Admin Passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              style={styles.authInput}
              autoFocus
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              UNLOCK DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardLayout}>
      {/* 1. Sidebar Navigation */}
      <aside style={styles.dashboardSidebar}>
        <div style={styles.sidebarBrand}>
          <h3>Boutique Manager</h3>
          <span>Admin Portal</span>
        </div>
        <nav style={styles.sidebarNav}>
          <button 
            onClick={() => setActiveTab('analytics')} 
            style={{ ...styles.navBtn, backgroundColor: activeTab === 'analytics' ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === 'analytics' ? '#fff' : 'rgba(255,255,255,0.7)' }}
          >
            <FiTrendingUp /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            style={{ ...styles.navBtn, backgroundColor: activeTab === 'products' ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === 'products' ? '#fff' : 'rgba(255,255,255,0.7)' }}
          >
            <FiGrid /> Catalog / Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{ ...styles.navBtn, backgroundColor: activeTab === 'orders' ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === 'orders' ? '#fff' : 'rgba(255,255,255,0.7)' }}
          >
            <FiShoppingBag /> Orders Queue {activeOrdersCount > 0 && <span style={styles.sidebarBadge}>{activeOrdersCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('coupons')} 
            style={{ ...styles.navBtn, backgroundColor: activeTab === 'coupons' ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === 'coupons' ? '#fff' : 'rgba(255,255,255,0.7)' }}
          >
            <FiTag /> Discount Coupons
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={{ ...styles.navBtn, backgroundColor: activeTab === 'settings' ? 'rgba(255,255,255,0.06)' : 'transparent', color: activeTab === 'settings' ? '#fff' : 'rgba(255,255,255,0.7)' }}
          >
            <FiSettings /> Store Settings
          </button>
        </nav>
        <button onClick={logoutAdmin} style={styles.logoutBtn}>
          <FiLogOut /> Sign Out
        </button>
      </aside>

      {/* 2. Main Workspace */}
      <main style={styles.dashboardWorkspace}>
        {/* Analytics Workspace */}
        {activeTab === 'analytics' && (
          <div style={styles.tabContent} className="animate-fade-in">
            <h2 style={styles.workspaceTitle}>Overview Analytics</h2>
            
            {/* KPI Metrics */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Total Sales Revenue</span>
                <h3 style={styles.kpiVal}>₹{totalSales.toLocaleString('en-IN')}</h3>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Total Orders Placed</span>
                <h3 style={styles.kpiVal}>{orders.length}</h3>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Average Basket Value</span>
                <h3 style={styles.kpiVal}>₹{aov.toLocaleString('en-IN')}</h3>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Catalog Products</span>
                <h3 style={styles.kpiVal}>{products.length}</h3>
              </div>
            </div>

            {/* Custom SVG Sales Chart */}
            <div style={styles.chartBlock}>
              <h3 style={styles.chartBlockTitle}>Sales Revenue Curve</h3>
              <div style={styles.chartContainer}>
                {/* SVG Graph rendering dynamic sales data representation */}
                <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="750" y2="20" stroke="#FAF0EA" strokeWidth="1" />
                  <line x1="50" y1="70" x2="750" y2="70" stroke="#FAF0EA" strokeWidth="1" />
                  <line x1="50" y1="120" x2="750" y2="120" stroke="#FAF0EA" strokeWidth="1" />
                  <line x1="50" y1="170" x2="750" y2="170" stroke="#FAF0EA" strokeWidth="1" />

                  {/* Graph Line & Gradient area */}
                  <path 
                    d="M 50 170 C 150 160, 250 110, 350 120 C 450 130, 550 50, 650 70 L 750 20 L 750 170 Z" 
                    fill="url(#chartGrad)" 
                  />
                  <path 
                    d="M 50 170 C 150 160, 250 110, 350 120 C 450 130, 550 50, 650 70 L 750 20" 
                    fill="none" 
                    stroke="var(--color-primary)" 
                    strokeWidth="3" 
                  />

                  {/* Grid Labels */}
                  <text x="760" y="25" fill="var(--color-charcoal-light)" fontSize="10">₹30K</text>
                  <text x="760" y="75" fill="var(--color-charcoal-light)" fontSize="10">₹20K</text>
                  <text x="760" y="125" fill="var(--color-charcoal-light)" fontSize="10">₹10K</text>
                  <text x="760" y="175" fill="var(--color-charcoal-light)" fontSize="10">₹0</text>
                  
                  <text x="50" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Mon</text>
                  <text x="190" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Wed</text>
                  <text x="330" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Fri</text>
                  <text x="470" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Sun</text>
                  <text x="610" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Tue</text>
                  <text x="750" y="195" fill="var(--color-charcoal-light)" fontSize="10" textAnchor="middle">Today</text>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Products Management Workspace */}
        {activeTab === 'products' && (
          <div style={styles.tabContent} className="animate-fade-in">
            <div style={styles.tabHeaderFlex}>
              <h2 style={styles.workspaceTitle}>{editingProdId ? 'Edit Product' : 'Add New Product'}</h2>
              {editingProdId && (
                <button onClick={resetProductForm} style={styles.resetFormBtn}>Cancel Edit</button>
              )}
            </div>

            {formSuccess && <div style={styles.successBanner}>{formSuccess}</div>}

            {/* Product Forms Block */}
            <form onSubmit={handleProductSubmit} style={styles.adminFormGrid}>
              <div style={styles.formColMain}>
                <div className="form-group">
                  <label>Product Title / Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Silk Banarasi Saree"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Product Description *</label>
                  <textarea
                    rows={5}
                    placeholder="Provide details about stitching, weaves, design, and embroidery..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Retail Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 5999"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Discount Price (₹, optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4999"
                      value={prodDiscountPrice}
                      onChange={(e) => setProdDiscountPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Category *</label>
                    <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <option value="Sarees">Sarees</option>
                      <option value="Salwars">Salwars</option>
                      <option value="Kurtis">Kurtis</option>
                      <option value="Lehengas">Lehengas</option>
                      <option value="Western Wear">Western Wear</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Boutique Collections">Boutique Collections</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Fabric / Material Details</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Organza Silk"
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Stock Count *</label>
                    <input
                      type="number"
                      placeholder="Stock quantity"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Sizing options */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={styles.formSectionLabel}>Available Sizes</label>
                  <div style={styles.sizesCheckboxFlex}>
                    {sizesList.map(size => (
                      <label key={size} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={prodSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          style={{ marginRight: '6px' }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color swatches selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={styles.formSectionLabel}>Color Variations</label>
                  <div style={styles.colorBuilderBlock}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Color Name (e.g. Royal Pink)" 
                        value={colorInputName} 
                        onChange={(e) => setColorInputName(e.target.value)}
                        style={{ flex: 2, padding: '0.4rem' }}
                      />
                      <input 
                        type="color" 
                        value={colorInputHex} 
                        onChange={(e) => setColorInputHex(e.target.value)}
                        style={{ width: '45px', padding: 0, border: 'none', height: '36px' }}
                      />
                      <button 
                        type="button" 
                        onClick={addColorSwatch}
                        style={styles.addColorBtn}
                      >
                        Add Color
                      </button>
                    </div>
                    {/* Render current Swatches list */}
                    {prodColors.length > 0 && (
                      <div style={styles.swatchesList}>
                        {prodColors.map((col, idx) => (
                          <div key={idx} style={styles.swatchItem}>
                            <span style={{ ...styles.swatchCircle, backgroundColor: col.hex }} />
                            <span>{col.name}</span>
                            <button type="button" onClick={() => removeColorSwatch(idx)} style={styles.deleteSwatch}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Side controls column */}
              <div style={styles.formColSide}>
                {/* Images Upload area */}
                <div style={styles.uploadBlock}>
                  <label style={styles.formSectionLabel}>Product Images *</label>
                  <div style={styles.dragDropZone}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={styles.fileInputHidden}
                      id="adminFileUploader"
                    />
                    <label htmlFor="adminFileUploader" style={styles.dropZoneLabel}>
                      <span>Drag & Drop Images</span>
                      <span>or Click to Select</span>
                    </label>
                  </div>
                  {/* Previews */}
                  {prodPreviews.length > 0 && (
                    <div style={styles.previewsGrid}>
                      {prodPreviews.map((src, idx) => (
                        <div key={idx} style={styles.previewThumbFrame}>
                          <img src={src} alt="Upload preview" style={styles.previewThumb} />
                          <button type="button" onClick={() => removeSelectedImage(idx)} style={styles.deletePreviewBtn}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags and Status settings */}
                <div style={styles.promoTagsBlock}>
                  <label style={styles.formSectionLabel}>Catalog Promotional Tags</label>
                  <label style={styles.toggleLabel}>
                    <input type="checkbox" checked={prodFeatured} onChange={(e) => setProdFeatured(e.target.checked)} />
                    Featured product (Homepage)
                  </label>
                  <label style={styles.toggleLabel}>
                    <input type="checkbox" checked={prodTrending} onChange={(e) => setProdTrending(e.target.checked)} />
                    Trending Collection
                  </label>
                  <label style={styles.toggleLabel}>
                    <input type="checkbox" checked={prodNewArrival} onChange={(e) => setProdNewArrival(e.target.checked)} />
                    New Arrival badge
                  </label>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Schedule Release Date (Future date)</label>
                  <input
                    type="date"
                    value={prodScheduledDate}
                    onChange={(e) => setProdScheduledDate(e.target.value)}
                  />
                  <span style={styles.helpText}>Leave blank to publish instantly.</span>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.1rem 0' }}>
                  <span>{editingProdId ? 'SAVE CHANGES' : 'PUBLISH PRODUCT'}</span>
                </button>
              </div>
            </form>

            {/* Current Products list catalog */}
            <div style={styles.catalogTableBlock}>
              <h3 style={styles.tableBlockTitle}>Catalog Inventory</h3>
              <div style={styles.tableContainer}>
                <table style={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.images[0]} alt="" style={styles.tableImg} /></td>
                        <td>
                          <strong>{p.name}</strong>
                          <span style={styles.tableProdId}>ID: {p.id}</span>
                        </td>
                        <td>{p.category}</td>
                        <td>₹{p.price.toLocaleString('en-IN')}</td>
                        <td>
                          <span style={{ color: p.stock <= 2 ? 'var(--color-error)' : 'inherit', fontWeight: p.stock <= 2 ? 600 : 400 }}>
                            {p.stock} units
                          </span>
                        </td>
                        <td>
                          <div style={styles.actionsBtnGroup}>
                            <button onClick={() => startEditProduct(p)} style={styles.editRowBtn} title="Edit Product"><FiEdit2 size={14} /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} style={styles.deleteRowBtn} title="Delete Product"><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management Queue */}
        {activeTab === 'orders' && (
          <div style={styles.tabContent} className="animate-fade-in">
            <h2 style={styles.workspaceTitle}>Customer Orders</h2>

            <div style={styles.tableContainer}>
              <table style={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Items Count</th>
                    <th>Total Paid</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <strong>{o.id}</strong><br />
                        <span style={styles.tableProdId}>{new Date(o.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <strong>{o.customerName}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>{o.customerPhone} | {o.address.city}</span>
                      </td>
                      <td>{o.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                      <td>₹{o.finalAmount.toLocaleString('en-IN')}</td>
                      <td>
                        <select 
                          value={o.paymentStatus}
                          onChange={(e) => updateOrderStatus(o.id, o.orderStatus).then(() => {
                            // Update Payment status route simulation
                            fetch(`/api/orders/${o.id}/status`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ paymentStatus: e.target.value })
                            }).then(() => window.location.reload());
                          })}
                          style={{
                            ...styles.statusSelect,
                            color: o.paymentStatus === 'Paid' ? 'var(--color-success)' : 'var(--color-error)'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                          style={{
                            ...styles.statusSelect,
                            color: o.orderStatus === 'Delivered' ? 'var(--color-success)' : (o.orderStatus === 'Cancelled' ? 'var(--color-error)' : 'var(--color-primary)')
                          }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Coupons codes builder */}
        {activeTab === 'coupons' && (
          <div style={styles.tabContent} className="animate-fade-in">
            <h2 style={styles.workspaceTitle}>Discounts & Coupons</h2>
            
            <div style={styles.adminFormGrid}>
              <form onSubmit={handleAddCoupon} style={{ ...styles.formSection, flex: 1, height: 'fit-content' }}>
                <h3 style={styles.sectionTitle}><FiTag /> Create Discount Coupon</h3>
                
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. SNEHA20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Discount Type *</label>
                    <select value={couponType} onChange={(e) => setCouponType(e.target.value as any)}>
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      placeholder="e.g. 10 or 500"
                      value={couponVal}
                      onChange={(e) => setCouponVal(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Minimum Purchase Required (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={couponMin}
                    onChange={(e) => setCouponMin(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  CREATE COUPON
                </button>
              </form>

              {/* Coupons list */}
              <div style={{ ...styles.formSection, flex: 1, backgroundColor: 'var(--color-cream-dark)' }}>
                <h3 style={styles.sectionTitle}>Active Offers List</h3>
                <div style={styles.couponsList}>
                  {coupons.map(c => (
                    <div key={c.code} style={styles.couponCard}>
                      <div>
                        <strong style={styles.couponCodeLabel}>{c.code}</strong>
                        <p style={styles.couponDescLabel}>
                          {c.discountType === 'percent' ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}<br />
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-light)' }}>Min Purchase: ₹{c.minPurchase}</span>
                        </p>
                      </div>
                      <button onClick={() => handleDeleteCoupon(c.code)} style={styles.deleteCouponBtn} title="Delete Coupon">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Store Settings panel */}
        {activeTab === 'settings' && (
          <div style={styles.tabContent} className="animate-fade-in">
            <h2 style={styles.workspaceTitle}>Boutique General Settings</h2>
            
            <form onSubmit={handleSaveSettings} style={{ ...styles.formSection, maxWidth: '700px' }}>
              <h3 style={styles.sectionTitle}><FiSettings /> Brand Settings</h3>
              
              <div className="form-group">
                <label>Boutique Brand Name</label>
                <input
                  type="text"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Store Contact Email</label>
                  <input
                    type="email"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Store Contact Phone</label>
                  <input
                    type="text"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Floating WhatsApp Hotline Number (with country code e.g. 919876543210)</label>
                <input
                  type="text"
                  value={settingsWa}
                  onChange={(e) => setSettingsWa(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Flagship Store Address</label>
                <textarea
                  rows={3}
                  value={settingsAddress}
                  onChange={(e) => setSettingsAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <label>Admin Dashboard Security Passkey</label>
                <input
                  type="text"
                  value={settingsPasskey}
                  onChange={(e) => setSettingsPasskey(e.target.value)}
                  required
                />
                <span style={styles.helpText}>Used to lock/unlock this dashboard.</span>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                SAVE BRAND SETTINGS
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  authPage: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 var(--spacing-lg)',
  },
  authCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-premium)',
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  },
  lockIcon: {
    color: 'var(--color-primary)',
    marginBottom: '1.5rem',
  },
  authTitle: {
    fontSize: '1.8rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: 400,
    marginBottom: '0.5rem',
  },
  authDesc: {
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    lineHeight: 1.5,
    marginBottom: '2rem',
  },
  authErrorText: {
    color: 'var(--color-error)',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '1rem',
    backgroundColor: '#FAF0F2',
    padding: '8px',
    border: '1px solid var(--color-error)',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  authInput: {
    padding: '0.9rem',
    fontSize: '1rem',
    textAlign: 'center',
    letterSpacing: '0.1em',
  },
  dashboardLayout: {
    minHeight: '90vh',
    display: 'flex',
  },
  dashboardSidebar: {
    width: '280px',
    backgroundColor: 'var(--color-charcoal)',
    color: 'rgba(255,255,255,0.8)',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  sidebarBrand: {
    marginBottom: '2.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '1.5rem',
  },
  sidebarBadge: {
    backgroundColor: 'var(--color-accent-dark)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '10px',
    marginLeft: '6px',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    flex: 1,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.9rem 1.2rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    transition: 'var(--transition-fast)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#EFA5B0',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '2rem',
    padding: '0.5rem 1rem',
    border: '1px solid rgba(239, 165, 176, 0.3)',
  },
  dashboardWorkspace: {
    flex: 1,
    padding: '3rem',
    backgroundColor: '#FCFAF6',
    overflowY: 'auto',
  },
  workspaceTitle: {
    fontSize: '1.8rem',
    fontWeight: 400,
    fontFamily: 'var(--font-serif)',
    marginBottom: '2rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  kpiCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  kpiLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-charcoal-light)',
    marginBottom: '6px',
    display: 'block',
  },
  kpiVal: {
    fontSize: '1.8rem',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
  },
  chartBlock: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  chartBlockTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  chartContainer: {
    width: '100%',
    height: '220px',
  },
  tabHeaderFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '2rem',
  },
  resetFormBtn: {
    fontSize: '0.85rem',
    color: 'var(--color-error)',
    fontWeight: 600,
    textDecoration: 'underline',
  },
  successBanner: {
    backgroundColor: 'var(--color-success)',
    color: '#fff',
    padding: '0.8rem 1.2rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    marginBottom: '2rem',
  },
  adminFormGrid: {
    display: 'flex',
    gap: '3rem',
    marginBottom: '4rem',
  },
  formColMain: {
    flex: 1.3,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2.5rem',
  },
  formColSide: {
    flex: 0.7,
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2.5rem',
    height: 'fit-content',
  },
  formSectionLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-charcoal)',
    marginBottom: '8px',
    display: 'block',
  },
  sizesCheckboxFlex: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '6px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: 'var(--color-charcoal-light)',
    cursor: 'pointer',
  },
  colorBuilderBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  addColorBtn: {
    padding: '0.4rem 1rem',
    backgroundColor: 'var(--color-charcoal)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  swatchesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  swatchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'var(--color-cream-dark)',
    border: '1px solid var(--color-border)',
    padding: '4px 8px',
    fontSize: '0.75rem',
  },
  swatchCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  deleteSwatch: {
    color: 'var(--color-error)',
    fontWeight: 700,
    marginLeft: '4px',
    fontSize: '1rem',
  },
  uploadBlock: {
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
  },
  dragDropZone: {
    border: '2px dashed var(--color-border)',
    backgroundColor: 'var(--color-cream-dark)',
    padding: '2rem 1rem',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  fileInputHidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  dropZoneLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    gap: '4px',
  },
  previewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginTop: '1rem',
  },
  previewThumbFrame: {
    position: 'relative',
    paddingTop: '125%',
    border: '1px solid var(--color-border)',
  },
  previewThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  deletePreviewBtn: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'rgba(194, 94, 94, 0.9)',
    color: '#fff',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
  },
  promoTagsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--color-charcoal-light)',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '0.75rem',
    color: 'var(--color-charcoal-light)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  catalogTableBlock: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '2rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  tableBlockTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  adminTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  tableImg: {
    width: '45px',
    height: '55px',
    objectFit: 'cover',
    border: '1px solid var(--color-border)',
  },
  tableProdId: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--color-charcoal-light)',
    fontWeight: 400,
  },
  actionsBtnGroup: {
    display: 'flex',
    gap: '6px',
  },
  editRowBtn: {
    border: '1px solid var(--color-border)',
    padding: '6px',
    cursor: 'pointer',
    color: 'var(--color-primary)',
    backgroundColor: '#fff',
  },
  deleteRowBtn: {
    border: '1px solid var(--color-border)',
    padding: '6px',
    cursor: 'pointer',
    color: 'var(--color-error)',
    backgroundColor: '#fff',
  },
  statusSelect: {
    border: '1px solid var(--color-border)',
    fontSize: '0.8rem',
    padding: '4px',
    backgroundColor: '#fff',
    fontWeight: 600,
  },
  couponsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  couponCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '1rem 1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponCodeLabel: {
    fontSize: '1rem',
    letterSpacing: '0.05em',
    color: 'var(--color-accent-dark)',
  },
  couponDescLabel: {
    fontSize: '0.8rem',
    marginTop: '2px',
    lineHeight: 1.4,
  },
  deleteCouponBtn: {
    color: 'var(--color-error)',
    cursor: 'pointer',
  }
};

// Inject custom table styles dynamically
const injectTableStyles = () => {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    table[style*="adminTable"] th {
      background-color: var(--color-cream-dark);
      padding: 12px 16px;
      font-weight: 600;
      border-bottom: 1.5px solid var(--color-border);
    }
    table[style*="adminTable"] td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border);
    }
    @media (max-width: 1200px) {
      div[style*="kpiGrid"] {
        grid-template-columns: 1fr 1fr !important;
      }
      form[style*="adminFormGrid"] {
        flex-direction: column !important;
      }
    }
    @media (max-width: 991px) {
      div[style*="dashboardLayout"] {
        flex-direction: column !important;
      }
      aside[style*="dashboardSidebar"] {
        flex-direction: row !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 1.5rem !important;
        width: 100% !important;
        padding: 1.5rem !important;
      }
      div[style*="sidebarBrand"] {
        margin-bottom: 0 !important;
        border-bottom: none !important;
        padding-bottom: 0 !important;
      }
      nav[style*="sidebarNav"] {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        width: 100% !important;
      }
      button[style*="navBtn"] {
        width: auto !important;
        padding: 0.6rem 1rem !important;
      }
      button[style*="logoutBtn"] {
        margin-top: 0 !important;
      }
    }
    @media (max-width: 576px) {
      main[style*="dashboardWorkspace"] {
        padding: 1.5rem !important;
      }
    }
    @media (max-width: 480px) {
      div[style*="kpiGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
};
if (typeof window !== 'undefined') {
  injectTableStyles();
}
