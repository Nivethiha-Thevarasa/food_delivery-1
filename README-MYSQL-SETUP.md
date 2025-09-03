# 🗄️ MySQL Database Setup for Food Delivery App

## 📋 **Prerequisites**

1. **MySQL Server** installed and running
2. **Node.js** (version 14 or higher)
3. **npm** or **yarn** package manager

## 🚀 **Step-by-Step Setup**

### **1. Create MySQL Database**

```bash
# Connect to MySQL
mysql -u root -p

# Run the database schema
source database.sql
```

Or manually:
```sql
CREATE DATABASE online_delivery;
USE online_delivery;
```

### **2. Install Backend Dependencies**

```bash
# Install backend dependencies
npm install express mysql2 cors bcryptjs jsonwebtoken dotenv

# Install development dependencies
npm install -D nodemon
```

### **3. Environment Configuration**

Create a `.env` file in your project root:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=online_delivery
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### **4. Database Schema**

The `database.sql` file contains:

- ✅ **Users table** - User accounts and profiles
- ✅ **Categories table** - Food categories
- ✅ **Menu items table** - Food items with details
- ✅ **Orders table** - Order information
- ✅ **Order items table** - Individual items in orders
- ✅ **Cart table** - Shopping cart items
- ✅ **Sample data** - Pre-populated menu and users
- ✅ **Indexes** - For better performance
- ✅ **Views** - For common queries
- ✅ **Stored procedures** - For order creation
- ✅ **Triggers** - For data integrity

### **5. Backend Server Features**

The `server.js` provides:

- 🔐 **Authentication** - JWT-based user login/signup
- 👤 **User Management** - Profile CRUD operations
- 🍽️ **Menu Management** - Categories and items
- 🛒 **Cart Operations** - Add, update, remove items
- 📦 **Order Management** - Create and view orders
- 🔒 **Security** - Password hashing, token validation
- 📊 **Database** - MySQL connection with connection pooling

## 🎯 **API Endpoints**

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### **Users**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### **Menu**
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/category/:id` - Get items by category
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/search` - Search menu items

### **Cart**
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### **Orders**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order details

## 🔧 **Database Operations**

### **Create Order Example**
```sql
-- Using stored procedure
CALL CreateOrder(1, 2500.00, '123 Main St', 'Colombo', 'Leave at gate', 'cash', @order_id);
SELECT @order_id;
```

### **Get User Orders**
```sql
SELECT * FROM order_summary WHERE customer_email = 'john@example.com';
```

### **Get Order Details**
```sql
SELECT * FROM order_details WHERE order_number = 'ORD20240115001';
```

## 🚀 **Running the Application**

### **1. Start MySQL Server**
```bash
# Windows
net start mysql

# macOS/Linux
sudo systemctl start mysql
```

### **2. Start Backend Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### **3. Test API**
```bash
# Health check
curl http://localhost:5000/api/health

# Get menu categories
curl http://localhost:5000/api/menu/categories
```

## 📊 **Database Structure**

```
online_delivery/
├── users/           # User accounts
├── categories/      # Food categories
├── menu_items/      # Food items
├── orders/          # Order headers
├── order_items/     # Order line items
└── cart/            # Shopping cart
```

## 🔒 **Security Features**

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **Input Validation** - SQL injection prevention
- **CORS Protection** - Cross-origin request handling
- **Environment Variables** - Secure configuration

## 🧪 **Testing the Setup**

### **1. Test Database Connection**
```bash
mysql -u root -p online_delivery
SELECT * FROM users;
SELECT * FROM menu_items;
```

### **2. Test API Endpoints**
```bash
# Create user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **MySQL Connection Failed**
   - Check MySQL service is running
   - Verify credentials in .env file
   - Check firewall settings

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:5000 | xargs kill`

3. **Database Not Found**
   - Run `source database.sql` in MySQL
   - Check database name in .env

4. **Permission Denied**
   - Grant MySQL user permissions
   - Check file permissions

## 📈 **Next Steps**

1. **Frontend Integration** - Update React app to use API
2. **Real-time Updates** - Add WebSocket for live order tracking
3. **Payment Integration** - Connect payment gateways
4. **Admin Panel** - Restaurant management interface
5. **Mobile App** - React Native or Flutter

## 🎉 **Success!**

Your MySQL database is now set up and ready to power your food delivery application! The backend server provides a robust API that handles all the core functionality needed for a production-ready food delivery system.
