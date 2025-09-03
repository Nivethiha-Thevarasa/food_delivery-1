# 🚀 Complete Setup Guide for MySQL Database Integration

## 📋 **What This Guide Covers:**

1. ✅ **Remove sample data** - No more fake users
2. ✅ **User registration** - Saves to MySQL database
3. ✅ **User login** - Fetches from MySQL database
4. ✅ **Data persistence** - All data survives page refreshes
5. ✅ **Security** - Password hashing and JWT authentication

## 🗄️ **Step 1: Set Up MySQL Database**

### **1.1 Install MySQL (if not already installed)**
```bash
# Windows - Download from https://dev.mysql.com/downloads/installer/
# macOS - brew install mysql
# Linux - sudo apt-get install mysql-server
```

### **1.2 Start MySQL Service**
```bash
# Windows
net start mysql

# macOS/Linux
sudo systemctl start mysql
```

### **1.3 Create Database and Tables**
```bash
# Connect to MySQL
mysql -u root -p

# Run the database schema (this will remove sample users)
source database.sql

# Verify tables were created
SHOW TABLES;

# Check that users table is empty (no sample data)
SELECT * FROM users;

# Exit MySQL
EXIT;
```

## 🔧 **Step 2: Install Backend Dependencies**

### **2.1 Install Required Packages**
```bash
npm install express mysql2 cors bcryptjs jsonwebtoken
```

### **2.2 Test Database Connection**
```bash
# Test if database is accessible
node test-database.js
```

**Expected Output:**
```
🔌 Testing MySQL Database Connection...

✅ Successfully connected to MySQL database!
📊 Database: online_delivery
🌐 Host: localhost:3306

🧪 Testing Database Queries...

1️⃣ Checking database tables...
   Tables found: cart, categories, menu_items, order_items, orders, users

2️⃣ Counting users...
   Total users: 0

3️⃣ Counting menu items...
   Total menu items: 15

🎉 All database tests passed successfully!
🚀 Your MySQL database is ready to use with the food delivery app.
```

## 🚀 **Step 3: Start Backend Server**

### **3.1 Start the Server**
```bash
# Use the simplified server for testing
node server-simple.js
```

**Expected Output:**
```
🚀 Food Delivery API server running on port 5000
📱 API endpoints available at http://localhost:5000/api
🏥 Health check: http://localhost:5000/api/health
🔐 Auth endpoints:
   POST /api/auth/signup - User registration
   POST /api/auth/signin - User login
✅ Connected to MySQL database successfully!
```

### **3.2 Test API Health**
```bash
# In a new terminal or browser
curl http://localhost:5000/api/health
```

## 🧪 **Step 4: Test User Registration and Login**

### **4.1 Test User Registration**
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+94 71 999 9999",
    "address": "123 Test Street",
    "city": "Test City",
    "password": "testpassword123"
  }'
```

**Expected Output:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+94 71 999 9999",
    "address": "123 Test Street",
    "city": "Test City"
  }
}
```

### **4.2 Test User Login**
```bash
# Test user login with correct credentials
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

**Expected Output:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+94 71 999 9999",
    "address": "123 Test Street",
    "city": "Test City"
  }
}
```

### **4.3 Test Invalid Login**
```bash
# Test login with wrong password
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Output:**
```json
{
  "error": "Invalid email or password"
}
```

### **4.4 Test Non-existent User**
```bash
# Test login with non-existent email
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "anypassword"
  }'
```

**Expected Output:**
```json
{
  "error": "Invalid email or password"
}
```

## 🧪 **Step 5: Run Complete User Flow Test**

### **5.1 Test Complete User Flow**
```bash
# Run the comprehensive test
node test-user-flow.js
```

**Expected Output:**
```
🧪 Testing User Registration and Login Flow...

✅ Successfully connected to MySQL database!

1️⃣ Cleaning up test data...
   ✅ Test users cleaned up

2️⃣ Testing user registration...
   ✅ User registered with ID: 1

3️⃣ Verifying user creation...
   ✅ User found in database:
      ID: 1
      Name: Test User
      Email: test@example.com
      Phone: +94 71 999 9999
      Address: 123 Test Street
      City: Test City

4️⃣ Testing user login...
   ✅ Login successful - password verified
      User: Test User (test@example.com)

5️⃣ Testing invalid login...
   ✅ Invalid login properly rejected - user not found

6️⃣ Testing wrong password...
   ✅ Wrong password properly rejected

7️⃣ Cleaning up test user...
   ✅ Test user removed

🎉 All user flow tests passed successfully!
🚀 Your user registration and login system is working correctly.
```

## 🌐 **Step 6: Test React Frontend**

### **6.1 Start React App**
```bash
# In a new terminal
npm start
```

### **6.2 Test User Registration in Browser**
1. Go to `http://localhost:3000/signup`
2. Fill out the registration form
3. Submit the form
4. Check browser console for success/error messages
5. Check MySQL database: `SELECT * FROM users;`

### **6.3 Test User Login in Browser**
1. Go to `http://localhost:3000/signin`
2. Use the credentials you just registered
3. Submit the form
4. You should be redirected to home page
5. Check that user data is loaded correctly

## 🔍 **Step 7: Verify Database Storage**

### **7.1 Check Database After Registration**
```bash
mysql -u root -p online_delivery

# Check users table
SELECT id, name, email, phone, address, city, created_at FROM users;

# Check that password is hashed (should be long string)
SELECT id, name, email, LEFT(password, 20) as password_start FROM users;
```

### **7.2 Verify Data Persistence**
1. Refresh the browser page
2. User should still be logged in
3. User data should still be available
4. Check localStorage for JWT token

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: Database Connection Failed**
```bash
# Check if MySQL is running
net start mysql  # Windows
sudo systemctl status mysql  # Linux/macOS

# Check database credentials
mysql -u root -p
```

### **Issue 2: Tables Not Found**
```bash
# Re-run database schema
mysql -u root -p
source database.sql;
```

### **Issue 3: API Server Not Starting**
```bash
# Check if port 5000 is available
netstat -an | findstr :5000  # Windows
lsof -i :5000  # Linux/macOS

# Kill process using port 5000 if needed
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Linux/macOS
```

### **Issue 4: CORS Errors**
```bash
# Make sure backend server is running
# Check that frontend is calling correct URL
# Verify API_BASE_URL in src/services/api.js
```

### **Issue 5: User Registration Fails**
```bash
# Check backend console for errors
# Verify database connection
# Check if users table exists and has correct structure
```

## 🎯 **What Should Happen Now:**

### **✅ User Registration:**
1. User fills signup form
2. Data sent to MySQL database via API
3. Password hashed with bcrypt
4. User account created with unique ID
5. JWT token generated and returned
6. User automatically logged in

### **✅ User Login:**
1. User enters credentials
2. API validates against MySQL database
3. Password verified with bcrypt
4. If valid, JWT token generated
5. User data loaded from database
6. User redirected to home page

### **✅ Data Persistence:**
- **Users**: Stored in MySQL, survive refreshes
- **Authentication**: JWT tokens in localStorage
- **Profile Data**: Fetched from database on login
- **Orders**: Stored in MySQL, survive refreshes
- **Cart**: Stored in MySQL, survive refreshes

## 🎉 **Success Indicators:**

1. ✅ **Database**: MySQL connection successful
2. ✅ **Registration**: New users saved to database
3. ✅ **Login**: Users can login with registered credentials
4. ✅ **Security**: Wrong passwords rejected
5. ✅ **Persistence**: Data survives page refreshes
6. ✅ **No Sample Data**: Only real registered users exist

## 🚀 **Next Steps:**

1. **Test the complete flow** with the test scripts
2. **Verify frontend integration** works correctly
3. **Test with multiple users** to ensure uniqueness
4. **Add more features** like profile updates, orders, etc.

Your food delivery app now has **enterprise-level database integration** with **real user authentication**! 🎉
