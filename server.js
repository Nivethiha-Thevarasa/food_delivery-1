const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'online_delivery',
  port: process.env.DB_PORT || 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL database successfully!');
});

// JWT Secret (in production, use a strong secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// =====================================================
// MIDDLEWARE - Authentication
// =====================================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// User Registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, address, city, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, phone, address, city, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        address,
        city
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password by email (no email delivery, direct change)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and newPassword are required' });
    }

    // Check user exists
    const [users] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// USER ROUTES
// =====================================================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, address, city FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, city } = req.body;

    await db.promise().query(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, city = ? WHERE id = ?',
      [name, email, phone, address, city, req.user.userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// MENU ROUTES
// =====================================================

// Get all categories
app.get('/api/menu/categories', async (req, res) => {
  try {
    const [categories] = await db.promise().query(
      'SELECT * FROM categories WHERE is_active = TRUE ORDER BY id'
    );
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu items by category
app.get('/api/menu/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [items] = await db.promise().query(
      'SELECT * FROM menu_items WHERE category_id = ? AND is_available = TRUE ORDER BY name',
      [categoryId]
    );
    res.json(items);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all menu items
app.get('/api/menu/items', async (req, res) => {
  try {
    const [items] = await db.promise().query(
      'SELECT mi.*, c.name as category_name FROM menu_items mi JOIN categories c ON mi.category_id = c.id WHERE mi.is_available = TRUE ORDER BY c.id, mi.name'
    );
    res.json(items);
  } catch (error) {
    console.error('Get all menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search menu items
app.get('/api/menu/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const [items] = await db.promise().query(
      'SELECT * FROM menu_items WHERE (name LIKE ? OR description LIKE ?) AND is_available = TRUE',
      [`%${q}%`, `%${q}%`]
    );
    res.json(items);
  } catch (error) {
    console.error('Search menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// CART ROUTES
// =====================================================

// Get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await db.promise().query(
      `SELECT c.id, c.quantity, mi.id as menu_item_id, mi.name, mi.description, mi.price, mi.image_url, mi.is_spicy, mi.is_vegetarian
       FROM cart c
       JOIN menu_items mi ON c.menu_item_id = mi.id
       WHERE c.user_id = ?`,
      [req.user.userId]
    );

    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { menu_item_id, quantity = 1 } = req.body;

    // Check if item already exists in cart
    const [existingItems] = await db.promise().query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND menu_item_id = ?',
      [req.user.userId, menu_item_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      await db.promise().query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
    } else {
      // Add new item
      await db.promise().query(
        'INSERT INTO cart (user_id, menu_item_id, quantity) VALUES (?, ?, ?)',
        [req.user.userId, menu_item_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
app.put('/api/cart/update/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db.promise().query(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [itemId, req.user.userId]
      );
    } else {
      // Update quantity
      await db.promise().query(
        'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, itemId, req.user.userId]
      );
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
app.delete('/api/cart/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    await db.promise().query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [itemId, req.user.userId]
    );

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear user's cart
app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    await db.promise().query(
      'DELETE FROM cart WHERE user_id = ?',
      [req.user.userId]
    );

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// ORDER ROUTES
// =====================================================

// Create new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { deliveryData, cartItems, totalAmount } = req.body;

    // Start transaction
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();

    try {
      // Generate order number
      const orderNumber = `ORD${Date.now()}${req.user.userId}`;

      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_city, delivery_instructions, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderNumber, req.user.userId, totalAmount, deliveryData.address, deliveryData.city, deliveryData.instructions, deliveryData.paymentMethod]
      );

      const orderId = orderResult.insertId;

      // Add order items
      for (const item of cartItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
        );
      }

      // Clear user's cart
      await connection.query(
        'DELETE FROM cart WHERE user_id = ?',
        [req.user.userId]
      );

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        message: 'Order created successfully',
        orderId,
        orderNumber
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      `SELECT o.id, o.order_number, o.total_amount, o.delivery_fee, o.order_status, o.order_date, o.delivery_date,
              o.delivery_address, o.delivery_city, o.delivery_instructions, o.payment_method
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`,
      [req.user.userId]
    );

    // Get order items for each order
    for (let order of orders) {
      const [items] = await db.promise().query(
        'SELECT item_name, quantity, unit_price, total_price FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific order details
app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await db.promise().query(
      `SELECT o.*, u.name as customer_name, u.email, u.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, req.user.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.promise().query(
      'SELECT item_name, quantity, unit_price, total_price FROM order_items WHERE order_id = ?',
      [orderId]
    );

    order.items = items;

    res.json(order);
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Food Delivery API is running',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler (Express 5 compatible)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Food Delivery API server running on port ${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
