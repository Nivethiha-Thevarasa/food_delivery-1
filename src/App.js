import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const Logo = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fork and Spoon Design */}
    <path d="M6 3V21" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 4C6 4 6 2 8 2C10 2 10 4 10 4" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 3V8C18 10 16 11 16 11H14C14 11 12 10 12 8V3" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 11V21" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Steam/Aroma Effect */}
    <path d="M8 6C8 6 9 5 10 6" stroke="#DDD6FE" strokeWidth="1" strokeLinecap="round"/>
    <path d="M16 6C16 6 17 5 18 6" stroke="#DDD6FE" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const authMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Utility function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close the auth menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    
    // Special handling for home - always scroll to top
    if (path === '/#home' || path === '/') {
      if (location.pathname !== '/') {
        navigate('/');
        // Add a small delay to ensure the page loads before scrolling
        setTimeout(() => {
          scrollToTop();
        }, 100);
      } else {
        scrollToTop();
      }
      return;
    }
    
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to ensure the page loads before scrolling
      setTimeout(() => {
        const element = document.getElementById(path.replace('/#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(path.replace('/#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowAuthMenu(false);
    navigate('/');
  };
  
  return (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-xl border-b border-violet-800">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2" onClick={scrollToTop}>
        <Logo />
            <span className="text-2xl font-bold text-violet-400">Flavor Fusion</span>
          </Link>
      </div>
        <div className="flex items-center space-x-6">
          <a href="/#home" onClick={(e) => handleNavigation(e, '/#home')} className="hover:text-violet-300 transition-colors">Home</a>
          <Link to="/about" className="hover:text-violet-300 transition-colors" onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}>About</Link>
          <a href="/#menu" onClick={(e) => handleNavigation(e, '/#menu')} className="hover:text-violet-300 transition-colors">Menu</a>
          <a href="/#contact" onClick={(e) => handleNavigation(e, '/#contact')} className="hover:text-violet-300 transition-colors">Contact</a>
          
          {isAuthenticated ? (
            <div className="relative" ref={authMenuRef}>
              <button
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="flex items-center space-x-2 bg-violet-700 text-white px-4 py-2 rounded-full hover:bg-violet-800 transition-colors"
              >
                <span>My Account</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showAuthMenu ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAuthMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 border border-violet-700">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-violet-700 hover:text-white transition-colors"
                      onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-violet-700 hover:text-white transition-colors"
                      onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-700 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={authMenuRef}>
              <button
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="flex items-center space-x-2 bg-violet-700 text-white px-4 py-2 rounded-full hover:bg-violet-800 transition-colors"
              >
                <span>Sign In</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showAuthMenu ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAuthMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 border border-violet-700">
                  <div className="py-1">
                    <Link
                      to="/signin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-violet-700 hover:text-white transition-colors"
                      onClick={() => {
                        setShowAuthMenu(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                      }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-violet-700 hover:text-white transition-colors"
                      onClick={() => {
                        setShowAuthMenu(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                      }}
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  </nav>
);
};

const Hero = ({ isAuthenticated, navigate }) => (
  <section id="home" className="relative bg-cover bg-center h-screen flex items-center justify-center text-white" 
    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)' }}>
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
    <div className="relative z-10 text-center max-w-5xl px-4">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-violet-300 font-serif">Flavor Fusion</h1>
      <p className="text-2xl md:text-3xl mb-8 text-gray-200 font-light">Delicious Food, Delivered to Your Door</p>
      <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto">
        Experience restaurant-quality meals in the comfort of your home. 
        Fast delivery, fresh ingredients, and flavors that will make your day special.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <button 
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/signin');
            } else {
              const menuSection = document.getElementById('menu');
              if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
          className="bg-violet-700 text-white px-6 py-4 rounded-xl hover:bg-violet-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{isAuthenticated ? 'Order Now' : 'Sign in to Order'}</span>
        </button>
        <a href="#contact" 
          className="bg-slate-800 text-white px-6 py-4 rounded-xl hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Support</span>
        </a>
      </div>
    </div>
  </section>
);

const QuickActions = () => (
  <section className="py-8 bg-slate-800">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-violet-800 hover:border-violet-500 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-violet-700/20 p-3 rounded-lg group-hover:bg-violet-700/30 transition-all duration-300">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-violet-300">Quick Order</h3>
              <p className="text-gray-400 text-sm">Order your favorites</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-violet-800 hover:border-violet-500 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-violet-700/20 p-3 rounded-lg group-hover:bg-violet-700/30 transition-all duration-300">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-violet-300">Live Tracking</h3>
              <p className="text-gray-400 text-sm">Track your delivery</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-violet-800 hover:border-violet-500 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-violet-700/20 p-3 rounded-lg group-hover:bg-violet-700/30 transition-all duration-300">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-violet-300">Past Orders</h3>
              <p className="text-gray-400 text-sm">View order history</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-violet-800 hover:border-violet-500 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center space-x-4">
            <div className="bg-violet-700/20 p-3 rounded-lg group-hover:bg-violet-700/30 transition-all duration-300">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-violet-300">Offers</h3>
              <p className="text-gray-400 text-sm">Latest deals & discounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-20 bg-slate-900">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-violet-900 transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 mx-auto mb-6 text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-violet-300 mb-4">Fast Delivery</h3>
          <p className="text-gray-400">
            Lightning-fast delivery to your doorstep, with real-time tracking and updates.
          </p>
        </div>
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-violet-900 transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 mx-auto mb-6 text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-violet-300 mb-4">Quality Assured</h3>
          <p className="text-gray-400">
            Premium ingredients and strict quality control for the best dining experience at home.
          </p>
        </div>
        <div className="text-center p-8 bg-slate-800 rounded-2xl border border-violet-900 transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 mx-auto mb-6 text-violet-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-violet-300 mb-4">Best Deals</h3>
          <p className="text-gray-400">
            Regular promotions, loyalty rewards, and special discounts on your favorite meals.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-20 bg-slate-900 text-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-violet-400">About Flavor Fusion</h2>
        <p className="text-xl text-gray-300 leading-relaxed mb-10">
          Welcome to Flavor Fusion, your premier online food delivery service. 
          We bring the finest cuisines from top local restaurants directly to your doorstep, 
          ensuring a seamless and delightful dining experience at home.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-slate-800 rounded-lg shadow-xl border border-violet-900">
            <div className="text-violet-400 text-4xl font-bold mb-2">30+</div>
            <div className="text-gray-300">Partner Restaurants</div>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-xl border border-violet-900">
            <div className="text-violet-400 text-4xl font-bold mb-2">45min</div>
            <div className="text-gray-300">Average Delivery Time</div>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-xl border border-violet-900">
            <div className="text-violet-400 text-4xl font-bold mb-2">10k+</div>
            <div className="text-gray-300">Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MenuItem = ({ item, addToCart, isAuthenticated, navigate }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl border border-violet-900/50 hover:border-violet-500">
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
    <img
      src={item.image}
      alt={item.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a680?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';
          }}
      loading="lazy"
    />
        {item.isSpicy && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Spicy 🌶️
          </span>
        )}
        {item.isVegetarian && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Veg 🥬
          </span>
        )}
    </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-violet-300">{item.name}</h3>
          <span className="text-yellow-400 font-bold text-lg">Rs {item.price}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{item.description}</p>
        <div className="flex justify-end">
    <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/signin');
              } else {
                addToCart(item);
              }
            }}
            className="bg-violet-700 text-white px-4 py-2 rounded-full hover:bg-violet-800 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add</span>
    </button>
        </div>
      </div>
    </div>
  </div>
);

const Menu = ({ addToCart, isAuthenticated }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const menuCategories = {
    popular: "Popular Items",
    main_course: "Main Course",
    appetizers: "Appetizers",
    desserts: "Desserts",
    beverages: "Beverages"
  };

  const menuItems = {
    popular: [
      { id: 1, name: "Chicken Biryani", description: "Aromatic basmati rice with tender chicken", price: 1200, image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg", isSpicy: true },
      { id: 2, name: "Margherita Pizza", description: "Classic pizza with fresh tomatoes, mozzarella, and basil", price: 1500, image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg", isVegetarian: true },
      { id: 3, name: "Butter Chicken", description: "Creamy tomato curry with tender chicken pieces", price: 1400, image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg", isSpicy: true }
    ],
    main_course: [
      { id: 4, name: "Paneer Tikka Masala", description: "Grilled cottage cheese in spiced tomato gravy", price: 1100, image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg", isVegetarian: true, isSpicy: true },
      { id: 5, name: "Grilled Salmon", description: "Fresh salmon with herbs and lemon butter sauce", price: 2200, image: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg" },
      { id: 6, name: "Vegetable Lasagna", description: "Layered pasta with fresh vegetables and cheese", price: 1300, image: "https://images.pexels.com/photos/5949885/pexels-photo-5949885.jpeg", isVegetarian: true }
    ],
    appetizers: [
      { id: 7, name: "Spring Rolls", description: "Crispy rolls with vegetables and glass noodles", price: 600, image: "https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg", isVegetarian: true },
      { id: 8, name: "Chicken Wings", description: "Spicy buffalo wings with blue cheese dip", price: 900, image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", isSpicy: true },
      { id: 9, name: "Hummus Platter", description: "Creamy hummus with pita bread and vegetables", price: 800, image: "https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg", isVegetarian: true }
    ],
    desserts: [
      { id: 10, name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center", price: 750, image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg" },
      { id: 11, name: "Tiramisu", description: "Classic Italian dessert with coffee and mascarpone", price: 850, image: "https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg" },
      { id: 12, name: "Fruit Parfait", description: "Layered yogurt with fresh fruits and granola", price: 650, image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg", isVegetarian: true }
    ],
    beverages: [
      { id: 13, name: "Fresh Fruit Smoothie", description: "Blend of seasonal fruits with yogurt", price: 550, image: "https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg", isVegetarian: true },
      { id: 14, name: "Iced Coffee", description: "Cold brewed coffee with cream", price: 450, image: "https://images.pexels.com/photos/2615326/pexels-photo-2615326.jpeg" },
      { id: 15, name: "Green Tea", description: "Premium Japanese green tea", price: 350, image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg", isVegetarian: true }
    ]
  };

  const allItems = Object.values(menuItems).flat();
  
  const filteredItems = activeCategory === 'all' 
    ? allItems 
    : menuItems[activeCategory] || [];

  const searchedItems = searchQuery 
    ? filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredItems;

  return (
    <section id="menu" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-violet-400">Our Menu</h2>
        
        {/* Search and Filter Bar */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400 pr-10"
            />
            <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all' 
                  ? 'bg-violet-700 text-white shadow-lg shadow-violet-700/50' 
                  : 'bg-slate-800 text-gray-300 hover:bg-violet-700/50'
              }`}
            >
              All Items
            </button>
            {Object.entries(menuCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === key 
                    ? 'bg-violet-700 text-white shadow-lg shadow-violet-700/50' 
                    : 'bg-slate-800 text-gray-300 hover:bg-violet-700/50'
                }`}
              >
                {label}
              </button>
              ))}
            </div>
          </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchedItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              addToCart={addToCart} 
              isAuthenticated={isAuthenticated}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Empty State */}
        {searchedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto border border-violet-900/50">
              <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">No items found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-violet-900">
    <div className="flex items-center gap-4">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a680?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';
        }}
      />
      <div>
        <h3 className="text-violet-300 font-medium">{item.name}</h3>
        <p className="text-gray-400 text-sm">Rs {item.price}</p>
        {(item.isVegetarian || item.isSpicy) && (
          <div className="flex gap-2 mt-1">
            {item.isVegetarian && (
              <span className="text-green-500 text-xs">Veg 🥬</span>
            )}
            {item.isSpicy && (
              <span className="text-red-500 text-xs">Spicy 🌶️</span>
            )}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-slate-700 rounded-lg">
        <button
          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
          className="px-3 py-1 text-gray-300 hover:text-white hover:bg-violet-700 rounded-l-lg transition-colors"
        >
          -
        </button>
        <span className="px-3 py-1 text-white">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="px-3 py-1 text-gray-300 hover:text-white hover:bg-violet-700 rounded-r-lg transition-colors"
        >
          +
        </button>
      </div>
      <span className="text-yellow-400 font-medium w-24 text-right">
        Rs {(item.price * item.quantity)}
              </span>
              <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-400 hover:text-red-300 transition-colors p-1"
        title="Remove item"
              >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
              </button>
            </div>
  </div>
);

const Cart = ({ cart, removeFromCart, updateQuantity, total }) => (
  <section className="py-8 bg-slate-800">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-violet-400">Shopping Cart</h2>
          <span className="text-gray-400">{cart.length} items</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-lg border border-violet-900">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">Your cart is empty</h3>
            <p className="text-gray-500">Add some delicious items from our menu!</p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg shadow-xl border border-violet-900">
            <div className="p-6">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
            
            <div className="border-t border-violet-900 p-6 bg-slate-800/50">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>Rs {total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span>Rs {cart.length > 0 ? 200 : 0}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-yellow-400 pt-3 border-t border-violet-900">
                  <span>Total</span>
                  <span>Rs {cart.length > 0 ? total + 200 : 0}</span>
                </div>
              </div>
            </div>
        </div>
      )}
      </div>
    </div>
  </section>
);

const DeliveryForm = ({ cart, total, clearCart, createOrder }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    instructions: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  // Single view for order completion

  const validateCardNumber = (cardNumber) => {
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
    
    // Check if it's a valid card number (13-19 digits)
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return 'Card number must be 13-19 digits';
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? '' : 'Invalid card number';
  };

  const validateExpiryDate = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return 'Use MM/YY format';
    }
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return 'Invalid month';
    }
    
    if (parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return 'Card has expired';
    }
    
    return '';
  };

  const validateCVC = (cvc) => {
    if (!/^\d{3,4}$/.test(cvc)) {
      return 'CVC must be 3-4 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // Validate and set error
      const error = validateCardNumber(formattedValue);
      setCardErrors(prev => ({
        ...prev,
        cardNumber: error
      }));
    }
    // Format expiry date with slash
    else if (name === 'cardExpiry') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // Validate and set error
      const error = validateExpiryDate(formattedValue);
      setCardErrors(prev => ({
        ...prev,
        cardExpiry: error
      }));
    }
    // Validate CVC
    else if (name === 'cardCVC') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Validate and set error
      const error = validateCVC(value);
      setCardErrors(prev => ({
        ...prev,
        cardCVC: error
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required field validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    
    // Credit card validation if card payment is selected
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCVC.trim()) errors.cardCVC = 'CVC is required';
      
      // Check for validation errors
      if (cardErrors.cardNumber) errors.cardNumber = cardErrors.cardNumber;
      if (cardErrors.cardExpiry) errors.cardExpiry = cardErrors.cardExpiry;
      if (cardErrors.cardCVC) errors.cardCVC = cardErrors.cardCVC;
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      alert('Please fix the following errors:\n' + Object.values(formErrors).join('\n'));
      return;
    }
    
    // Create the order
    const newOrder = createOrder(formData, cart, total);
    
    // Process order directly
    alert(`Order #${newOrder.id} confirmed! Your order will be delivered to ${formData.address}`);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      instructions: '',
      paymentMethod: 'cash',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    });
    setCardErrors({
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
    });
    clearCart();
  };



  const renderDeliveryForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
              required
            />
            <input
              type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
              required
            />
      </div>
            <input
        type="text"
        name="address"
        placeholder="Delivery Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
              required
            />
            <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
              required
            />
      <textarea
        name="instructions"
        placeholder="Delivery Instructions (Optional)"
        value={formData.instructions}
        onChange={handleChange}
        className="w-full p-3 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
        rows="3"
      />
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={formData.paymentMethod === 'cash'}
            onChange={handleChange}
            className="form-radio text-violet-600"
          />
          <span className="text-white">Cash on Delivery</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={formData.paymentMethod === 'card'}
            onChange={handleChange}
            className="form-radio text-violet-600"
          />
          <span className="text-white">Credit/Debit Card</span>
        </label>
      </div>

      {formData.paymentMethod === 'card' && (
        <div className="space-y-4 mt-4">
          <div>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400 ${
                cardErrors.cardNumber ? 'border-red-500' : 'border-violet-900'
              }`}
            />
            {cardErrors.cardNumber && (
              <p className="text-red-400 text-sm mt-1">{cardErrors.cardNumber}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="cardExpiry"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={handleChange}
                maxLength="5"
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400 ${
                  cardErrors.cardExpiry ? 'border-red-500' : 'border-violet-900'
                }`}
              />
              {cardErrors.cardExpiry && (
                <p className="text-red-400 text-sm mt-1">{cardErrors.cardExpiry}</p>
              )}
            </div>
            
            <div>
              <input
                type="text"
                name="cardCVC"
                placeholder="123"
                value={formData.cardCVC}
                onChange={handleChange}
                maxLength="4"
                className={`w-full p-3 bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400 ${
                  cardErrors.cardCVC ? 'border-red-500' : 'border-violet-900'
                }`}
              />
              {cardErrors.cardCVC && (
                <p className="text-red-400 text-sm mt-1">{cardErrors.cardCVC}</p>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Card number will be automatically formatted with spaces</p>
            <p>• Expiry date will be formatted as MM/YY</p>
            <p>• CVC is the 3-4 digit security code on your card</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-slate-700 p-6 rounded-lg space-y-4">
      <h4 className="text-lg font-medium text-violet-400">Order Summary</h4>
      <div className="space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-300">
            <span>{item.quantity}x {item.name}</span>
            <span>Rs {item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-gray-600 pt-2 mt-4">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>Rs {total - 200}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Delivery Fee</span>
            <span>Rs 200</span>
          </div>
          <div className="flex justify-between text-violet-400 font-medium text-lg mt-2">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-violet-400">Complete Your Order</h2>
                <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-violet-900">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-violet-400 mb-4">Delivery Details</h3>
                  {renderDeliveryForm()}
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-violet-400 mb-4">Payment Method</h3>
                  {renderPaymentForm()}
                </div>
              </div>
              
              <div className="border-t border-violet-900 pt-6">
                {renderOrderSummary()}
              </div>
              
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="px-8 py-4 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors text-lg font-medium"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-20 bg-slate-800">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12 text-violet-400">Contact Us</h2>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl text-gray-300 mb-8">We'd love to hear from you! Reach out for any inquiries or support.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-900 rounded-lg shadow-xl border border-violet-900">
            <h3 className="text-violet-400 font-semibold mb-2">Email</h3>
            <p className="text-gray-300">contact@flavorfusion.com</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-lg shadow-xl border border-violet-900">
            <h3 className="text-violet-400 font-semibold mb-2">Phone</h3>
            <p className="text-gray-300">021 222 9448</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-lg shadow-xl border border-violet-900">
            <h3 className="text-violet-400 font-semibold mb-2">Address</h3>
            <p className="text-gray-300">123 Culinary Lane, Food City, FC 12345</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (e, path) => {
    e.preventDefault();
    
    // Special handling for home - always scroll to top
    if (path === '/#home') {
      if (location.pathname !== '/') {
        navigate('/');
        // Add a small delay to ensure the page loads before scrolling
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to ensure the page loads before scrolling
      setTimeout(() => {
        const element = document.getElementById(path.replace('/#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(path.replace('/#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-gray-300 py-16 border-t border-violet-900">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo />
              <span className="text-2xl font-bold text-violet-400">Flavor Fusion</span>
            </Link>
            <p className="text-gray-400">
              Delivering happiness with every meal. Your trusted food delivery partner in Sri Lanka.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-violet-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/#home" 
                  onClick={(e) => handleNavigation(e, '/#home')} 
                  className="hover:text-violet-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                    // Scroll to top of the about page
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-violet-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/#menu" 
                  onClick={(e) => handleNavigation(e, '/#menu')} 
                  className="hover:text-violet-400 transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a 
                  href="/#contact" 
                  onClick={(e) => handleNavigation(e, '/#contact')} 
                  className="hover:text-violet-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-violet-400 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Culinary Lane, Food City, FC 12345</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>021 222 9448</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 mt-1 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@flavorfusion.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-violet-400 mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-violet-800/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2024 Flavor Fusion. All rights reserved.
            </p>
            <div className="flex justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
    </div>
  </footer>
);
};

// Authentication Components
const FormInput = ({ id, name, type, label, value, onChange, placeholder, autoComplete, error }) => (
  <div>
    <label htmlFor={id} className="sr-only">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      required
      className={`appearance-none relative block w-full px-3 py-3 border ${
        error ? 'border-red-500' : 'border-violet-700'
      } bg-slate-800 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm transition-colors duration-200`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
    />
    {error && (
      <p className="mt-1 text-sm text-red-400">{error}</p>
    )}
  </div>
);

const AuthButton = ({ isLoading, text, loadingText }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-700 hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
  >
    {isLoading && (
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )}
    {isLoading ? loadingText : text}
  </button>
);

const AuthLayout = ({ children, title, subtitle, linkText, linkTo }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-violet-800">
      <div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-violet-400">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {subtitle}{' '}
          <Link to={linkTo} className="font-medium text-violet-500 hover:text-violet-400 transition-colors">
            {linkText}
          </Link>
        </p>
      </div>
      {children}
    </div>
  </div>
);

const SignIn = ({ setIsAuthenticated, onSignIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Attempt to sign in with stored user data
      const success = onSignIn(formData.email, formData.password);
      
      if (success) {
        navigate('/');
      } else {
        setErrors({ submit: 'Invalid email or password. Please check your credentials or create an account.' });
      }
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="New to Flavor Fusion?"
      linkText="Create an account"
      linkTo="/signup"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <div className="relative">
            <FormInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded bg-slate-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-violet-500 hover:text-violet-400 transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton
          isLoading={isLoading}
          text="Sign in"
          loadingText="Signing in..."
        />
      </form>
    </AuthLayout>
  );
};

const SignUp = ({ setIsAuthenticated, onSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSignUp(formData); // Pass form data to parent component
      navigate('/');
    } catch (err) {
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkTo="/signin"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-4">
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <FormInput
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            autoComplete="tel"
          />

          <FormInput
            id="address"
            name="address"
            type="text"
            label="Delivery Address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            autoComplete="street-address"
          />

          <FormInput
            id="city"
            name="city"
            type="text"
            label="City"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            autoComplete="address-level2"
          />

          <div className="relative">
            <FormInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-400 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <AuthButton
          isLoading={isLoading}
          text="Create Account"
          loadingText="Creating account..."
        />

        <p className="text-sm text-gray-400 text-center mt-4">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
        </p>
      </form>
    </AuthLayout>
  );
};

// Add AboutUs component
const AboutUs = () => (
  <div className="bg-slate-900 min-h-screen text-white">
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative bg-violet-900/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-violet-400 mb-6">Our Story</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Founded in 2023, Flavor Fusion has revolutionized the food delivery experience in Sri Lanka,
              bringing restaurant-quality meals directly to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-slate-800 p-8 rounded-xl border border-violet-900/50">
              <div className="flex items-center mb-6">
                <div className="bg-violet-700/20 p-3 rounded-lg mr-4">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-violet-400">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To deliver not just food, but memorable dining experiences to every doorstep. 
                We strive to connect people with the best local cuisines while ensuring quality, 
                convenience, and satisfaction in every order.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-violet-900/50">
              <div className="flex items-center mb-6">
                <div className="bg-violet-700/20 p-3 rounded-lg mr-4">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-violet-400">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To become the most trusted and loved food delivery platform in Sri Lanka, 
                known for our exceptional service, diverse culinary offerings, and commitment 
                to customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-violet-400 mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="bg-violet-700/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-violet-400 mb-4">Quality Assurance</h3>
              <p className="text-gray-300">
                We maintain the highest standards of food quality and safety throughout 
                the delivery process.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-violet-700/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-violet-400 mb-4">Timely Delivery</h3>
              <p className="text-gray-300">
                We respect your time and ensure your food arrives fresh and hot, 
                right when you need it.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-violet-700/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-violet-400 mb-4">Customer First</h3>
              <p className="text-gray-300">
                Your satisfaction is our priority. We go above and beyond to ensure 
                a delightful experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-violet-400 mb-16">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-violet-900">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-violet-400">Nivethiha Theavarsa</h3>
              <p className="text-gray-400">Chief Executive Officer</p>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-violet-900">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="COO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-violet-400">John Mohan</h3>
              <p className="text-gray-400">Chief Operations Officer</p>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-violet-900">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="CTO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-violet-400">Nivi Priyatharsan</h3>
              <p className="text-gray-400">Chief Technology Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-violet-900/50">
              <div className="text-4xl font-bold text-violet-400 mb-2">30+</div>
              <div className="text-gray-300">Restaurant Partners</div>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-violet-900/50">
              <div className="text-4xl font-bold text-violet-400 mb-2">10k+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-violet-900/50">
              <div className="text-4xl font-bold text-violet-400 mb-2">45min</div>
              <div className="text-gray-300">Average Delivery Time</div>
            </div>
            <div className="text-center p-6 bg-slate-800 rounded-xl border border-violet-900/50">
              <div className="text-4xl font-bold text-violet-400 mb-2">4.8</div>
              <div className="text-gray-300">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
);

// Profile Component
const PasswordModal = ({ isOpen, onClose, onSubmit, isSubmitting, passwordData, passwordErrors, handlePasswordChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-violet-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-violet-400">Change Password</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {passwordErrors.submit && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{passwordErrors.submit}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 bg-slate-700 border ${
                passwordErrors.currentPassword ? 'border-red-500' : 'border-violet-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white`}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 bg-slate-700 border ${
                passwordErrors.newPassword ? 'border-red-500' : 'border-violet-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white`}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 bg-slate-700 border ${
                passwordErrors.confirmPassword ? 'border-red-500' : 'border-violet-900'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white`}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userProfile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update editedData when userProfile changes
  useEffect(() => {
    setEditedData(userProfile);
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswordForm();
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset form and close modal on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false);
      // Show success message (you can implement a toast notification here)
      alert('Password updated successfully');
    } catch (error) {
      setPasswordErrors({
        submit: 'Failed to update password. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(editedData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-violet-400 mb-8">My Profile</h1>
          
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 mb-8 border border-violet-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-violet-700 flex items-center justify-center text-2xl font-bold text-white">
                  {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('') : ''}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{userProfile.name || 'Update your name'}</h2>
                  <p className="text-gray-400">Member since January 2024</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                    />
                  ) : (
                    <p className="text-white">{userProfile.name || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                    />
                  ) : (
                    <p className="text-white">{userProfile.email || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                    />
                  ) : (
                    <p className="text-white">{userProfile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                    />
                  ) : (
                    <p className="text-white">{userProfile.address || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={editedData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-slate-700 border border-violet-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                    />
                  ) : (
                    <p className="text-white">{userProfile.city || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-violet-900">
            <h3 className="text-lg font-medium text-violet-400 mb-4">Account Security</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left px-4 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-white flex items-center justify-between"
              >
                <span>Change Password</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        isSubmitting={isSubmitting}
        passwordData={passwordData}
        passwordErrors={passwordErrors}
        handlePasswordChange={handlePasswordChange}
      />
    </div>
  );
};

// Orders Component
const Orders = ({ orders = [] }) => {

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-violet-400 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-slate-800 rounded-lg p-8 max-w-md mx-auto border border-violet-900/50">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm">Start ordering delicious food to see your order history here!</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-800 rounded-lg shadow-xl p-6 border border-violet-900">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Order #{order.id}</h3>
                      <p className="text-gray-400">{formatDate(order.date)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 font-semibold text-lg">Rs {order.total}</span>
                    </div>
                  </div>

                  <div className="border-t border-violet-900/50 pt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-white">{item.name}</span>
                            <span className="text-gray-400">x{item.quantity}</span>
                          </div>
                          <span className="text-gray-400">Rs {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-violet-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-violet-400">Order Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-violet-900">
                <div>
                  <h4 className="text-lg font-semibold text-white">Order #{selectedOrder.id}</h4>
                  <p className="text-gray-400">{formatDate(selectedOrder.date)}</p>
                </div>
                <span className="text-2xl font-bold text-yellow-400">Rs {selectedOrder.total}</span>
              </div>

              <div>
                <h5 className="text-md font-medium text-violet-400 mb-3">Order Items</h5>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-gray-400">x{item.quantity}</span>
                      </div>
                      <span className="text-yellow-400 font-semibold">Rs {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.deliveryInfo && (
                <div>
                  <h5 className="text-md font-medium text-violet-400 mb-3">Delivery Information</h5>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{selectedOrder.deliveryInfo.firstName} {selectedOrder.deliveryInfo.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{selectedOrder.deliveryInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedOrder.deliveryInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address:</span>
                      <span className="text-white">{selectedOrder.deliveryInfo.address}, {selectedOrder.deliveryInfo.city}</span>
                    </div>
                    {selectedOrder.deliveryInfo.instructions && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instructions:</span>
                        <span className="text-white">{selectedOrder.deliveryInfo.instructions}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment:</span>
                      <span className="text-white capitalize">{selectedOrder.deliveryInfo.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-violet-900">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-xl font-bold text-yellow-400">Rs {selectedOrder.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  
  // Simple user storage system (in real app, this would be a database)
  const [users, setUsers] = useState([]);
  
  // Order storage system
  const [orders, setOrders] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  
  // Initialize with some demo users for testing
  useEffect(() => {
    const demoUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94 71 123 4567',
        address: '123 Main Street',
        city: 'Colombo',
        password: 'password123'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94 77 987 6543',
        address: '456 Oak Avenue',
        city: 'Kandy',
        password: 'password123'
      }
    ];
    setUsers(demoUsers);
  }, []);

  const addToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...currentCart, { ...item, quantity: 1 }];
    });
    updateTotal();
  };

  const removeFromCart = (itemId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
    updateTotal();
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    updateTotal();
  };

  const updateTotal = () => {
    setTotal(
      cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    );
  };

  useEffect(() => {
    updateTotal();
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    setTotal(0);
  };

  const createOrder = (deliveryData, cartItems, totalAmount) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      total: totalAmount,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryInfo: {
        firstName: deliveryData.firstName,
        lastName: deliveryData.lastName,
        phone: deliveryData.phone,
        email: deliveryData.email,
        address: deliveryData.address,
        city: deliveryData.city,
        instructions: deliveryData.instructions,
        paymentMethod: deliveryData.paymentMethod
      }
    };
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const handleSignUp = async (formData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          password: formData.password
        })
      });

      if (!response.ok) {
        // Try to parse JSON error; if not JSON, show raw text/status
        let message = 'Signup failed';
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.error) message = parsed.error;
        } catch (_) {
          if (text) message = `${response.status} ${response.statusText}: ${text}`;
          else message = `${response.status} ${response.statusText}`;
        }
        throw new Error(message);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setUserProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city
      });
      setIsAuthenticated(true);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        let message = 'Signin failed';
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.error) message = parsed.error;
        } catch (_) {
          if (text) message = `${response.status} ${response.statusText}: ${text}`;
          else message = `${response.status} ${response.statusText}`;
        }
        throw new Error(message);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setUserProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city
      });
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      alert(e.message);
      return false;
    }
  };

  const updateUserProfile = (updatedData) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedData
    }));
    
    // Also update the stored user data
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.email === userProfile.email 
          ? { ...user, ...updatedData }
          : user
      )
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Routes>
        <Route path="/signin" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <SignIn setIsAuthenticated={setIsAuthenticated} onSignIn={handleSignIn} />
          </>
        } />
        <Route path="/signup" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <SignUp setIsAuthenticated={setIsAuthenticated} onSignUp={handleSignUp} />
          </>
        } />
        <Route path="/about" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <AboutUs />
          </>
        } />
        <Route path="/profile" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Profile userProfile={userProfile} onUpdateProfile={updateUserProfile} />
          </>
        } />
        <Route path="/orders" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Orders orders={orders} />
          </>
        } />
        <Route
          path="/"
          element={
            <>
              <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
              <Hero isAuthenticated={isAuthenticated} navigate={navigate} />
              <QuickActions />
              <Features />
              <About />
              <Menu addToCart={addToCart} isAuthenticated={isAuthenticated} />
              <Cart 
                cart={cart} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity}
                total={total} 
              />
              {isAuthenticated ? (
                <DeliveryForm 
                  cart={cart} 
                  total={total + (cart.length > 0 ? 200 : 0)} 
                  clearCart={clearCart}
                  createOrder={createOrder}
                />
              ) : cart.length > 0 ? (
                <div className="container mx-auto px-4 py-12 text-center">
                  <div className="bg-slate-800 p-8 rounded-lg border border-violet-900 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold text-violet-400 mb-4">Sign In to Complete Your Order</h3>
                    <p className="text-gray-300 mb-6">Please sign in or create an account to proceed with your order.</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => navigate('/signin')}
                        className="bg-violet-700 text-white px-6 py-3 rounded-lg hover:bg-violet-800 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate('/signup')}
                        className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/forgot-password" element={
          <>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <ForgotPassword />
          </>
        } />
      </Routes>
    </div>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
    if (!newPassword || newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      if (!res.ok) {
        const t = await res.text();
        try { const p = JSON.parse(t); throw new Error(p.error || 'Reset failed'); }
        catch(_) { throw new Error(t || 'Reset failed'); }
      }
      alert('Password updated. Please sign in with your new password.');
      navigate('/signin');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Remembered it?"
      linkText="Back to sign in"
      linkTo="/signin"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <div className="space-y-4">
          <FormInput
            id="reset-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <FormInput
            id="reset-password"
            name="newPassword"
            type="password"
            label="New password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            autoComplete="new-password"
          />

          <AuthButton
            isLoading={isLoading}
            text="Update password"
            loadingText="Updating..."
          />
        </div>
      </form>
    </AuthLayout>
  );
};

export default App;