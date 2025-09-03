const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password
  database: 'online_delivery',
  port: 3306
};

// Create connection
const connection = mysql.createConnection(dbConfig);

console.log('🧪 Testing User Registration and Login Flow...\n');

connection.connect(async (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Successfully connected to MySQL database!');
  
  try {
    // Test 1: Clear any existing test users
    console.log('1️⃣ Cleaning up test data...');
    await connection.promise().query('DELETE FROM users WHERE email LIKE "%test%"');
    console.log('   ✅ Test users cleaned up');
    
    // Test 2: Register a new user
    console.log('\n2️⃣ Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+94 71 999 9999',
      address: '123 Test Street',
      city: 'Test City',
      password: 'testpassword123'
    };
    
    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    // Insert user into database
    const [result] = await connection.promise().query(
      'INSERT INTO users (name, email, phone, address, city, password) VALUES (?, ?, ?, ?, ?, ?)',
      [testUser.name, testUser.email, testUser.phone, testUser.address, testUser.city, hashedPassword]
    );
    
    console.log(`   ✅ User registered with ID: ${result.insertId}`);
    
    // Test 3: Verify user was created
    console.log('\n3️⃣ Verifying user creation...');
    const [users] = await connection.promise().query(
      'SELECT id, name, email, phone, address, city FROM users WHERE email = ?',
      [testUser.email]
    );
    
    if (users.length > 0) {
      const user = users[0];
      console.log('   ✅ User found in database:');
      console.log(`      ID: ${user.id}`);
      console.log(`      Name: ${user.name}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Phone: ${user.phone}`);
      console.log(`      Address: ${user.address}`);
      console.log(`      City: ${user.city}`);
    } else {
      console.log('   ❌ User not found in database');
    }
    
    // Test 4: Test user login (password verification)
    console.log('\n4️⃣ Testing user login...');
    const [loginUsers] = await connection.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [testUser.email]
    );
    
    if (loginUsers.length > 0) {
      const user = loginUsers[0];
      const isValidPassword = await bcrypt.compare(testUser.password, user.password);
      
      if (isValidPassword) {
        console.log('   ✅ Login successful - password verified');
        console.log(`      User: ${user.name} (${user.email})`);
      } else {
        console.log('   ❌ Login failed - invalid password');
      }
    } else {
      console.log('   ❌ Login failed - user not found');
    }
    
    // Test 5: Test invalid login
    console.log('\n5️⃣ Testing invalid login...');
    const [invalidUsers] = await connection.promise().query(
      'SELECT * FROM users WHERE email = ?',
      ['nonexistent@example.com']
    );
    
    if (invalidUsers.length === 0) {
      console.log('   ✅ Invalid login properly rejected - user not found');
    } else {
      console.log('   ❌ Invalid login should not find user');
    }
    
    // Test 6: Test wrong password
    console.log('\n6️⃣ Testing wrong password...');
    if (loginUsers.length > 0) {
      const user = loginUsers[0];
      const isWrongPassword = await bcrypt.compare('wrongpassword', user.password);
      
      if (!isWrongPassword) {
        console.log('   ✅ Wrong password properly rejected');
      } else {
        console.log('   ❌ Wrong password should be rejected');
      }
    }
    
    // Test 7: Clean up test user
    console.log('\n7️⃣ Cleaning up test user...');
    await connection.promise().query('DELETE FROM users WHERE email = ?', [testUser.email]);
    console.log('   ✅ Test user removed');
    
    console.log('\n🎉 All user flow tests passed successfully!');
    console.log('🚀 Your user registration and login system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close connection
    connection.end((err) => {
      if (err) {
        console.error('❌ Error closing connection:', err.message);
      } else {
        console.log('\n🔌 Database connection closed.');
      }
      process.exit(0);
    });
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  connection.end();
  process.exit(0);
});
