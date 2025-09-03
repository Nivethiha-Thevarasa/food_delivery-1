const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password
  database: 'online_delivery',
  port: 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL database successfully!');
});

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// User Registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, address, city, password } = req.body;
    
    console.log('📝 Registration attempt:', { name, email, phone, address, city });

    // Check if user already exists
    const [existingUsers] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed successfully');

    // Insert new user
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, phone, address, city, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, city, hashedPassword]
    );

    console.log('✅ User created with ID:', result.insertId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    const userData = {
      id: result.insertId,
      name,
      email,
      phone,
      address,
      city
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userData
    });

    console.log('🎉 Registration successful for:', email);

  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt for:', email);

    // Find user by email
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    console.log('👤 User found:', user.name);

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Password verified for:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city
    };

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

    console.log('🎉 Login successful for:', email);

  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password by email (simple server)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and newPassword are required' });
    }

    const [users] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.promise().query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Reset password error:', err);
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
// ERROR HANDLING
// =====================================================
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
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
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST /api/auth/signup - User registration`);
  console.log(`   POST /api/auth/signin - User login`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.end((err) => {
    if (err) {
      console.error('❌ Error closing database connection:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
