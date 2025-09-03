-- =====================================================
-- Online Food Delivery System Database Schema
-- Database: online_delivery
-- =====================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS online_delivery;
USE online_delivery;

-- =====================================================
-- USERS TABLE - Store user account information
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- CATEGORIES TABLE - Food categories (Main Course, Appetizers, etc.)
-- =====================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MENU_ITEMS TABLE - Store all food items
-- =====================================================
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_spicy BOOLEAN DEFAULT FALSE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- =====================================================
-- ORDERS TABLE - Store order information
-- =====================================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 200.00,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(50) NOT NULL,
    delivery_instructions TEXT,
    payment_method VARCHAR(50) NOT NULL,
    order_status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- ORDER_ITEMS TABLE - Store individual items in each order
-- =====================================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    menu_item_id INT,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- =====================================================
-- CART TABLE - Store user shopping cart
-- =====================================================
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    menu_item_id INT,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    UNIQUE KEY unique_user_item (user_id, menu_item_id)
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Popular Items', 'Most ordered and loved items'),
('Main Course', 'Primary dishes and entrees'),
('Appetizers', 'Starters and small plates'),
('Desserts', 'Sweet treats and desserts'),
('Beverages', 'Drinks and refreshments');

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_spicy, is_vegetarian) VALUES
(1, 'Chicken Biryani', 'Aromatic basmati rice with tender chicken', 1200.00, 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', TRUE, FALSE),
(1, 'Margherita Pizza', 'Classic pizza with fresh tomatoes, mozzarella, and basil', 1500.00, 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg', FALSE, TRUE),
(1, 'Butter Chicken', 'Creamy tomato curry with tender chicken pieces', 1400.00, 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg', TRUE, FALSE),
(2, 'Paneer Tikka Masala', 'Grilled cottage cheese in spiced tomato gravy', 1100.00, 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg', TRUE, TRUE),
(2, 'Grilled Salmon', 'Fresh salmon with herbs and lemon butter sauce', 2200.00, 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg', FALSE, FALSE),
(2, 'Vegetable Lasagna', 'Layered pasta with fresh vegetables and cheese', 1300.00, 'https://images.pexels.com/photos/5949885/pexels-photo-5949885.jpeg', FALSE, TRUE),
(3, 'Spring Rolls', 'Crispy rolls with vegetables and glass noodles', 600.00, 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg', FALSE, TRUE),
(3, 'Chicken Wings', 'Spicy buffalo wings with blue cheese dip', 900.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', TRUE, FALSE),
(3, 'Hummus Platter', 'Creamy hummus with pita bread and vegetables', 800.00, 'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg', FALSE, TRUE),
(4, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 750.00, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', FALSE, FALSE),
(4, 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 850.00, 'https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg', FALSE, FALSE),
(4, 'Fruit Parfait', 'Layered yogurt with fresh fruits and granola', 650.00, 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg', FALSE, TRUE),
(5, 'Fresh Fruit Smoothie', 'Blend of seasonal fruits with yogurt', 550.00, 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg', FALSE, TRUE),
(5, 'Iced Coffee', 'Cold brewed coffee with cream', 450.00, 'https://images.pexels.com/photos/2615326/pexels-photo-2615326.jpeg', FALSE, FALSE),
(5, 'Green Tea', 'Premium Japanese green tea', 350.00, 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg', FALSE, TRUE);

-- Sample users removed - users will be created through registration only

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for order summary with user details
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.total_amount,
    o.delivery_fee,
    o.order_status,
    o.order_date,
    u.name as customer_name,
    u.email as customer_email,
    u.phone as customer_phone,
    o.delivery_address,
    o.delivery_city
FROM orders o
JOIN users u ON o.user_id = u.id;

-- View for order details with items
CREATE VIEW order_details AS
SELECT 
    o.id as order_id,
    o.order_number,
    oi.item_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    o.total_amount,
    o.order_date
FROM orders o
JOIN order_items oi ON o.id = oi.order_id;

-- =====================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

-- Procedure to create a new order
DELIMITER //
CREATE PROCEDURE CreateOrder(
    IN p_user_id INT,
    IN p_total_amount DECIMAL(10,2),
    IN p_delivery_address TEXT,
    IN p_delivery_city VARCHAR(50),
    IN p_delivery_instructions TEXT,
    IN p_payment_method VARCHAR(50),
    OUT p_order_id INT
)
BEGIN
    DECLARE v_order_number VARCHAR(50);
    
    -- Generate unique order number
    SET v_order_number = CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(p_user_id, 4, '0'), LPAD(FLOOR(RAND() * 1000), 3, '0'));
    
    -- Insert order
    INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_city, delivery_instructions, payment_method)
    VALUES (v_order_number, p_user_id, p_total_amount, p_delivery_address, p_delivery_city, p_delivery_instructions, p_payment_method);
    
    -- Get the inserted order ID
    SET p_order_id = LAST_INSERT_ID();
    
    -- Clear user's cart after order creation
    DELETE FROM cart WHERE user_id = p_user_id;
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

-- Trigger to update order total when items change
DELIMITER //
CREATE TRIGGER update_order_total
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT SUM(total_price) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
END //
DELIMITER ;

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Get all orders for a specific user
-- SELECT * FROM order_summary WHERE customer_email = 'john@example.com';

-- Get order details with items
-- SELECT * FROM order_details WHERE order_number = 'ORD20240115001';

-- Get menu items by category
-- SELECT * FROM menu_items WHERE category_id = 1 AND is_available = TRUE;

-- Get user's cart
-- SELECT mi.name, mi.price, c.quantity, (mi.price * c.quantity) as total
-- FROM cart c
-- JOIN menu_items mi ON c.menu_item_id = mi.id
-- WHERE c.user_id = 1;
