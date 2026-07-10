import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './dbService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists in public/uploads
const uploadDir = path.join(process.cwd(), 'public/uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Could not create upload directory (expected in serverless environments):', err.message);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer storage configuration for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Helper to generate IDs
const generateId = (prefix = 'id') => {
  return prefix + '_' + Math.random().toString(36).substr(2, 9);
};

// --- API ENDPOINTS ---

// 1. Admin Verification
app.post('/api/admin/verify', (req, res) => {
  const { passkey } = req.body;
  const db = readDb();
  if (passkey === db.settings.adminPasskey) {
    return res.json({ success: true, token: 'snehaas-authenticated-session' });
  }
  return res.status(401).json({ success: false, message: 'Invalid passkey. Access denied.' });
});

// 2. Fetch Store Settings
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// Update Store Settings
app.put('/api/settings', (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 3. Products Endpoints
app.get('/api/products', (req, res) => {
  const db = readDb();
  // Filter out products scheduled for future dates unless they are requested by admin
  const showScheduled = req.query.admin === 'true';
  const now = new Date();

  let products = db.products;
  if (!showScheduled) {
    products = products.filter(p => {
      if (!p.scheduledDate) return true;
      return new Date(p.scheduledDate) <= now;
    });
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Create Product
app.post('/api/products', upload.array('images'), (req, res) => {
  const db = readDb();
  const productData = req.body;

  // Process files
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  } else if (productData.images) {
    // If sent as array of URLs or base64s in JSON body
    imageUrls = Array.isArray(productData.images) ? productData.images : [productData.images];
  }

  // Parse arrays if form-data sent them as strings
  const sizes = typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : (productData.sizes || []);
  const colors = typeof productData.colors === 'string' ? JSON.parse(productData.colors) : (productData.colors || []);

  const newProduct = {
    id: generateId('prod'),
    name: productData.name,
    description: productData.description || '',
    price: Number(productData.price),
    discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
    images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'], // Fallback
    category: productData.category || 'Boutique Collections',
    sizes: sizes,
    colors: colors,
    material: productData.material || '',
    stock: Number(productData.stock || 0),
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    isFeatured: productData.isFeatured === 'true' || productData.isFeatured === true,
    isTrending: productData.isTrending === 'true' || productData.isTrending === true,
    isNewArrival: productData.isNewArrival === 'true' || productData.isNewArrival === true,
    scheduledDate: productData.scheduledDate || null,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.products.unshift(newProduct); // Add to beginning
  writeDb(db);
  res.status(201).json({ success: true, product: newProduct });
});

// Edit Product
app.put('/api/products/:id', upload.array('images'), (req, res) => {
  const db = readDb();
  const productIndex = db.products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingProduct = db.products[productIndex];
  const productData = req.body;

  // Process files
  let imageUrls = [...existingProduct.images]; // default keep existing
  
  // If user uploaded new files
  if (req.files && req.files.length > 0) {
    const newUrls = req.files.map(file => `/uploads/${file.filename}`);
    // If replace parameter is true, overwrite images, otherwise append
    if (productData.replaceImages === 'true') {
      imageUrls = newUrls;
    } else {
      imageUrls = [...imageUrls, ...newUrls];
    }
  } else if (productData.images) {
    imageUrls = Array.isArray(productData.images) ? productData.images : JSON.parse(productData.images);
  }

  const sizes = typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : (productData.sizes || existingProduct.sizes);
  const colors = typeof productData.colors === 'string' ? JSON.parse(productData.colors) : (productData.colors || existingProduct.colors);

  const updatedProduct = {
    ...existingProduct,
    name: productData.name || existingProduct.name,
    description: productData.description !== undefined ? productData.description : existingProduct.description,
    price: productData.price !== undefined ? Number(productData.price) : existingProduct.price,
    discountPrice: productData.discountPrice !== undefined ? (productData.discountPrice ? Number(productData.discountPrice) : null) : existingProduct.discountPrice,
    images: imageUrls,
    category: productData.category || existingProduct.category,
    sizes: sizes,
    colors: colors,
    material: productData.material !== undefined ? productData.material : existingProduct.material,
    stock: productData.stock !== undefined ? Number(productData.stock) : existingProduct.stock,
    isFeatured: productData.isFeatured !== undefined ? (productData.isFeatured === 'true' || productData.isFeatured === true) : existingProduct.isFeatured,
    isTrending: productData.isTrending !== undefined ? (productData.isTrending === 'true' || productData.isTrending === true) : existingProduct.isTrending,
    isNewArrival: productData.isNewArrival !== undefined ? (productData.isNewArrival === 'true' || productData.isNewArrival === true) : existingProduct.isNewArrival,
    scheduledDate: productData.scheduledDate !== undefined ? productData.scheduledDate : existingProduct.scheduledDate
  };

  db.products[productIndex] = updatedProduct;
  writeDb(db);
  res.json({ success: true, product: updatedProduct });
});

// Delete Product
app.delete('/api/products/:id', (req, res) => {
  const db = readDb();
  const filteredProducts = db.products.filter(p => p.id !== req.params.id);
  if (filteredProducts.length === db.products.length) {
    return res.status(404).json({ message: 'Product not found' });
  }
  db.products = filteredProducts;
  writeDb(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 4. Add Review
app.post('/api/products/:id/reviews', (req, res) => {
  const db = readDb();
  const productIndex = db.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { user, rating, comment } = req.body;
  const newReview = {
    id: generateId('rev'),
    user: user || 'Anonymous Customer',
    rating: Number(rating || 5),
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  const product = db.products[productIndex];
  product.reviews = product.reviews || [];
  product.reviews.unshift(newReview);
  product.reviewsCount = product.reviews.length;
  
  // Recalculate average rating
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.rating = Number((totalRating / product.reviews.length).toFixed(1));

  db.products[productIndex] = product;
  writeDb(db);
  res.status(201).json({ success: true, product });
});

// 5. Orders Endpoints
app.get('/api/orders', (req, res) => {
  const db = readDb();
  res.json(db.orders);
});

app.get('/api/orders/:id', (req, res) => {
  const db = readDb();
  const order = db.orders.find(o => o.id.toLowerCase() === req.params.id.toLowerCase() || o.trackingNumber.toLowerCase() === req.params.id.toLowerCase());
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order or Tracking Number not found' });
  }
});

// Place Order
app.post('/api/orders', (req, res) => {
  const db = readDb();
  const { customerName, customerEmail, customerPhone, address, items, totalAmount, discountAmount, finalAmount, couponCode, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Shopping cart is empty' });
  }

  // Deduct stock and verify availability
  for (const item of items) {
    const prodIndex = db.products.findIndex(p => p.id === item.productId);
    if (prodIndex !== -1) {
      const prod = db.products[prodIndex];
      if (prod.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${prod.name}. Available: ${prod.stock}` });
      }
      prod.stock -= item.quantity;
      db.products[prodIndex] = prod;
    }
  }

  // Generate unique Order ID and Tracking Number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = `SNE-2026-${randomNum}`;
  const trackingNumber = `TRACK-${Math.floor(100000 + Math.random() * 900000)}`;

  const newOrder = {
    id: orderId,
    customerName,
    customerEmail,
    customerPhone,
    address,
    items,
    totalAmount,
    discountAmount: discountAmount || 0,
    finalAmount,
    couponCode: couponCode || '',
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid', // UPI / Card simulate instant payment
    orderStatus: 'Placed',
    trackingNumber,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  res.status(201).json({ success: true, order: newOrder });
});

// Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const db = readDb();
  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { orderStatus, paymentStatus } = req.body;
  if (orderStatus) {
    db.orders[orderIndex].orderStatus = orderStatus;
  }
  if (paymentStatus) {
    db.orders[orderIndex].paymentStatus = paymentStatus;
  }

  writeDb(db);
  res.json({ success: true, order: db.orders[orderIndex] });
});

// 6. Coupons Endpoints
app.get('/api/coupons', (req, res) => {
  const db = readDb();
  res.json(db.coupons);
});

app.post('/api/coupons', (req, res) => {
  const db = readDb();
  const { code, discountType, discountValue, minPurchase } = req.body;

  if (!code || !discountType || !discountValue) {
    return res.status(400).json({ message: 'Missing discount coupon parameters' });
  }

  // Check if coupon exists
  const exists = db.coupons.some(c => c.code.toUpperCase() === code.toUpperCase());
  if (exists) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const newCoupon = {
    code: code.toUpperCase(),
    discountType,
    discountValue: Number(discountValue),
    minPurchase: Number(minPurchase || 0),
    active: true
  };

  db.coupons.push(newCoupon);
  writeDb(db);
  res.status(201).json({ success: true, coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req, res) => {
  const db = readDb();
  const filtered = db.coupons.filter(c => c.code.toUpperCase() !== req.params.code.toUpperCase());
  if (filtered.length === db.coupons.length) {
    return res.status(404).json({ message: 'Coupon not found' });
  }
  db.coupons = filtered;
  writeDb(db);
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

// 7. General Upload API (single file)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ success: true, url: `/uploads/${req.file.filename}` });
});

// --- SERVE FRONTEND IN PRODUCTION ---
const clientDistDir = path.join(__dirname, '../dist');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Serve static files directory: ${uploadDir}`);
  });
}

export default app;
