const mysql = require('mysql2');

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

// Test database connection
console.log('🔌 Testing MySQL Database Connection...\n');

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Successfully connected to MySQL database!');
  console.log(`📊 Database: ${dbConfig.database}`);
  console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}\n`);
  
  // Test basic queries
  testDatabaseQueries();
});

async function testDatabaseQueries() {
  try {
    console.log('🧪 Testing Database Queries...\n');
    
    // Test 1: Check if tables exist
    console.log('1️⃣ Checking database tables...');
    const [tables] = await connection.promise().query('SHOW TABLES');
    console.log('   Tables found:', tables.map(t => Object.values(t)[0]).join(', '));
    
    // Test 2: Count users
    console.log('\n2️⃣ Counting users...');
    const [userCount] = await connection.promise().query('SELECT COUNT(*) as count FROM users');
    console.log(`   Total users: ${userCount[0].count}`);
    
    // Test 3: Count menu items
    console.log('\n3️⃣ Counting menu items...');
    const [menuCount] = await connection.promise().query('SELECT COUNT(*) as count FROM menu_items');
    console.log(`   Total menu items: ${menuCount[0].count}`);
    
    // Test 4: Check sample data
    console.log('\n4️⃣ Checking sample data...');
    const [users] = await connection.promise().query('SELECT name, email FROM users LIMIT 3');
    console.log('   Sample users:');
    users.forEach(user => console.log(`     - ${user.name} (${user.email})`));
    
    const [menuItems] = await connection.promise().query('SELECT name, price FROM menu_items LIMIT 3');
    console.log('   Sample menu items:');
    menuItems.forEach(item => console.log(`     - ${item.name}: Rs ${item.price}`));
    
    // Test 5: Test categories
    console.log('\n5️⃣ Checking categories...');
    const [categories] = await connection.promise().query('SELECT name, description FROM categories');
    console.log('   Categories:');
    categories.forEach(cat => console.log(`     - ${cat.name}: ${cat.description}`));
    
    console.log('\n🎉 All database tests passed successfully!');
    console.log('🚀 Your MySQL database is ready to use with the food delivery app.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
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
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  connection.end();
  process.exit(0);
});
