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

  // Ensure payments table exists (store only masked card info)
  const createPaymentsTableSql = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT,
      user_id INT,
      method VARCHAR(20) NOT NULL,
      card_brand VARCHAR(32),
      card_last4 VARCHAR(4),
      exp_month TINYINT,
      exp_year SMALLINT,
      status ENUM('pending','succeeded','failed') DEFAULT 'succeeded',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

  db.query(createPaymentsTableSql, (tableErr) => {
    if (tableErr) {
      console.error('Error ensuring payments table:', tableErr);
    } else {
      console.log('💳 Payments table ready');
    }
  });

  // Ensure orders has payment_status column (paid/pending/failed)
  const addPaymentStatusColumnSql = `
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_status ENUM('pending','paid','failed') DEFAULT 'pending' AFTER payment_method`;

  db.query(addPaymentStatusColumnSql, (colErr) => {
    if (colErr) {
      // Older MySQL may not support IF NOT EXISTS; ignore duplicate column error
      if (colErr.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error ensuring orders.payment_status column:', colErr);
      }
    } else {
      console.log('🧾 orders.payment_status column ready');
    }
  });

  // Ensure users has role column (user/admin)
  const addUserRoleColumnSql = `
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role ENUM('user','admin') DEFAULT 'user' AFTER password`;

  db.query(addUserRoleColumnSql, (roleErr) => {
    if (roleErr) {
      if (roleErr.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error ensuring users.role column:', roleErr);
      }
    } else {
      console.log('👤 users.role column ready');
    }
  });

  // Seed initial admin user if not exists (uses env vars)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Administrator';
  if (adminEmail && adminPassword) {
    db.promise().query('SELECT id FROM users WHERE email = ?', [adminEmail])
      .then(async ([rows]) => {
        if (rows.length === 0) {
          const hashed = await bcrypt.hash(adminPassword, 10);
          await db.promise().query(
            'INSERT INTO users (name, email, phone, address, city, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [adminName, adminEmail, null, null, null, hashed, 'admin']
          );
          console.log(`🔑 Seeded admin user: ${adminEmail}`);
        }
      })
      .catch((e) => console.error('Error seeding admin user:', e));
  }
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

    // Insert new user (default role user)
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, phone, address, city, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city, hashedPassword, 'user']
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
        city,
        role: 'user'
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
        city: user.city,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
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

    // Start transaction on existing connection (mysql2 createConnection)
    const connection = db.promise();
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

      // If payment method is card, store masked card details
      if (deliveryData.paymentMethod && deliveryData.paymentMethod.toLowerCase() === 'card') {
        const card = deliveryData.card || {};
        const cardBrand = card.brand || null;
        const cardNumber = card.number || '';
        const last4 = cardNumber ? cardNumber.slice(-4) : null;
        const expMonth = card.expMonth || null;
        const expYear = card.expYear || null;

        await connection.query(
          'INSERT INTO payments (order_id, user_id, method, card_brand, card_last4, exp_month, exp_year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [orderId, req.user.userId, 'card', cardBrand, last4, expMonth, expYear, 'succeeded']
        );

        // Mark order as paid when card payment succeeds
        await connection.query(
          'UPDATE orders SET payment_status = ? WHERE id = ?',
          ['paid', orderId]
        );
      }

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

// (Moved error/404 handlers to bottom so admin routes are reachable)

// =====================================================
// ADMIN ROUTES (read-only)
// =====================================================

// Simple admin guard using role field
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const [rows] = await db.promise().query('SELECT role FROM users WHERE id = ?', [req.user.userId]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if ((rows[0].role || 'user') !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (e) {
    console.error('Admin check error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent users
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email, phone, city, created_at, role FROM users ORDER BY id DESC LIMIT 200'
    );
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent orders with payment status
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.promise().query(
      `SELECT o.id, o.order_number, o.total_amount, o.delivery_fee, o.payment_method, o.payment_status,
              o.order_status, o.order_date, u.name as customer_name, u.email as customer_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.order_date DESC LIMIT 200`
    );
    res.json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sales metrics summary
app.get('/api/admin/sales/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [[{ total_revenue }]] = await db.promise().query(
      'SELECT COALESCE(SUM(total_amount),0) as total_revenue FROM orders WHERE payment_status = "paid"'
    );
    const [[{ total_orders }]] = await db.promise().query(
      'SELECT COUNT(*) as total_orders FROM orders'
    );
    const [[{ paid_orders }]] = await db.promise().query(
      'SELECT COUNT(*) as paid_orders FROM orders WHERE payment_status = "paid"'
    );
    res.json({ total_revenue, total_orders, paid_orders });
  } catch (error) {
    console.error('Admin sales summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Progress metrics (orders by status, revenue last 7 days, new users last 7 days)
app.get('/api/admin/progress', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const connection = db.promise();

    // Orders by status
    const [rawStatusRows] = await connection.query(
      'SELECT order_status as status, COUNT(*) as count FROM orders GROUP BY order_status'
    );
    const allStatuses = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
    const statusMap = Object.fromEntries(rawStatusRows.map(r => [String(r.status), Number(r.count)]));
    const statusRows = allStatuses.map(s => ({ status: s, count: statusMap[s] || 0 }));

    // Revenue last 7 days (paid orders only)
    const [revenueRows] = await connection.query(
      `SELECT DATE(order_date) as date, COALESCE(SUM(total_amount),0) as revenue
       FROM orders
       WHERE payment_status = 'paid' AND order_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(order_date)
       ORDER BY date`
    );

    // New users last 7 days
    const [userRows] = await connection.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    // Normalize to include all last 7 days
    const makeLast7Dates = () => {
      const days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        days.push(iso);
      }
      return days;
    };

    const last7 = makeLast7Dates();
    const revenueMap = Object.fromEntries(revenueRows.map(r => [r.date instanceof Date ? r.date.toISOString().slice(0,10) : String(r.date), Number(r.revenue)]));
    const usersMap = Object.fromEntries(userRows.map(r => [r.date instanceof Date ? r.date.toISOString().slice(0,10) : String(r.date), Number(r.count)]));

    const revenue_last_7_days = last7.map(date => ({ date, revenue: revenueMap[date] || 0 }));
    const new_users_last_7_days = last7.map(date => ({ date, count: usersMap[date] || 0 }));

    res.json({ orders_by_status: statusRows, revenue_last_7_days, new_users_last_7_days });
  } catch (error) {
    console.error('Admin progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Seed demo data for admin to visualize progress quickly
app.post('/api/admin/seed/demo', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const cx = db.promise();
    // Ensure a demo user exists
    const demoEmail = 'demo.user@example.com';
    const [existing] = await cx.query('SELECT id FROM users WHERE email = ?', [demoEmail]);
    let demoUserId = existing.length ? existing[0].id : null;
    if (!demoUserId) {
      const [ins] = await cx.query(
        'INSERT INTO users (name, email, phone, address, city, password) VALUES (?, ?, ?, ?, ?, ?)',
        ['Demo User', demoEmail, '1234567890', '123 Demo Street', 'DemoCity', '$2a$10$zYxwvuTSampleHashxk5cQx9m2o0rR3Wc9aH1F2']
      );
      demoUserId = ins.insertId;
    }

    // Find a menu item to add to an order
    const [menu] = await cx.query('SELECT id, name, price FROM menu_items ORDER BY id LIMIT 1');
    const hasMenuItem = menu.length > 0;

    // Create a paid order for the demo user
    const orderNumber = `DEMO${Date.now()}`;
    const totalAmount = hasMenuItem ? Number(menu[0].price) : 1000;
    const [orderIns] = await cx.query(
      'INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_city, delivery_instructions, payment_method, order_status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderNumber, demoUserId, totalAmount, '123 Demo Street', 'DemoCity', null, 'card', 'delivered', 'paid']
    );
    const orderId = orderIns.insertId;

    if (hasMenuItem) {
      await cx.query(
        'INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, menu[0].id, menu[0].name, 1, menu[0].price, menu[0].price]
      );
    }

    // Insert a payment record to reflect paid status
    await cx.query(
      'INSERT INTO payments (order_id, user_id, method, status) VALUES (?, ?, ?, ?)',
      [orderId, demoUserId, 'card', 'succeeded']
    );

    res.status(201).json({ message: 'Demo data seeded', orderId, orderNumber });
  } catch (e) {
    console.error('Admin demo seed error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// ADMIN MENU CRUD
// =====================================================

// List all menu items with category
app.get('/api/admin/menu/items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [items] = await db.promise().query(
      'SELECT mi.*, c.name as category_name FROM menu_items mi LEFT JOIN categories c ON mi.category_id = c.id ORDER BY mi.id DESC'
    );
    res.json(items);
  } catch (error) {
    console.error('Admin list menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create menu item
app.post('/api/admin/menu/items', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { category_id, name, description, price, image_url, is_spicy = false, is_vegetarian = false, is_available = true } = req.body;
    const [result] = await db.promise().query(
      'INSERT INTO menu_items (category_id, name, description, price, image_url, is_spicy, is_vegetarian, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, description, price, image_url, !!is_spicy, !!is_vegetarian, !!is_available]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Admin create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item
app.put('/api/admin/menu/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, image_url, is_spicy, is_vegetarian, is_available } = req.body;
    await db.promise().query(
      'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_spicy = ?, is_vegetarian = ?, is_available = ? WHERE id = ?',
      [category_id, name, description, price, image_url, !!is_spicy, !!is_vegetarian, !!is_available, id]
    );
    res.json({ message: 'Updated' });
  } catch (error) {
    console.error('Admin update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item
app.delete('/api/admin/menu/items/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Admin delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Food Delivery API server running on port ${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// =====================================================
// ERROR HANDLING MIDDLEWARE (must be last)
// =====================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler (Express 5 compatible)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
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
