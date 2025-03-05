import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, TrendingUp, Users, Store, Truck, Shield, Star, Smartphone, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-emerald-50 to-white pt-20 pb-32">
        <div className="absolute inset-0 z-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80"
            alt="Indian Grocery Store"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <ShoppingBasket className="w-20 h-20 text-emerald-600" />
            </div>
            
            <h1 className="text-6xl font-bold text-gray-800 mb-6 tracking-tight">
              KiranaKart
              <span className="block text-emerald-600 mt-2">आपकी सुविधा, हमारी प्राथमिकता</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Groceries delivered in 10 minutes. Fresh vegetables, fruits, dairy and more at your doorstep.
            </p>
            
            <div className="flex gap-6 justify-center">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:bg-emerald-700"
                >
                  Start Shopping
                </motion.button>
              </Link>
              
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold shadow-lg hover:bg-gray-50"
                >
                  Register Store
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* App Showcase */}
          <div className="mt-20 flex justify-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=272&h=572"
                    className="w-[272px] h-[572px] object-cover"
                    alt="KiranaKart Mobile App"
                  />
                </div>
              </div>
              <div className="absolute -right-16 top-10 bg-white p-4 rounded-lg shadow-lg">
                <Star className="h-6 w-6 text-yellow-400" />
                <p className="font-semibold">4.9/5</p>
                <p className="text-sm text-gray-500">User Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-xl"
            >
              <Clock className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">10-Minute Delivery</h3>
              <p className="text-gray-600">Get your groceries delivered in just 10 minutes</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-xl"
            >
              <MapPin className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nearby Stores</h3>
              <p className="text-gray-600">Connect with local kirana stores in your neighborhood</p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-6 bg-emerald-50 rounded-xl"
            >
              <Shield className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">100% quality guarantee on all products</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-10 h-10 object-contain" 
                  />
                </div>
                <span className="font-medium text-gray-800">{category.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">Explore thousands of products from local stores near you</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Add to Cart</h3>
              <p className="text-gray-600">Select items and add them to your shopping cart</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your order delivered to your doorstep in minutes</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-emerald-600 font-bold">₹{product.price}</span>
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Download App */}
      <div className="bg-emerald-600 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
              <p className="text-emerald-100 mb-6">Get the best grocery shopping experience on your phone. Fast, convenient, and reliable.</p>
              <div className="flex space-x-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" className="h-12" />
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=300&h=600" 
                  alt="KiranaKart App"
                  className="h-80 object-cover rounded-xl shadow-lg" 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-600">Local Stores</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -10 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">100K+</div>
              <div className="text-gray-600">Orders Delivered</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample data
const categories = [
  { name: 'Fruits', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194766.png' },
  { name: 'Vegetables', image: 'https://cdn-icons-png.flaticon.com/512/2153/2153786.png' },
  { name: 'Dairy', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png' },
  { name: 'Bakery', image: 'https://cdn-icons-png.flaticon.com/512/3081/3081967.png' },
  { name: 'Beverages', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050098.png' },
  { name: 'Snacks', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553651.png' },
];

const featuredProducts = [
  { name: 'Fresh Apples', price: 120, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Organic Tomatoes', price: 40, image: 'https://images.unsplash.com/photo-1546470427-f5b9c4b9f220?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Whole Wheat Bread', price: 35, image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Farm Fresh Milk', price: 60, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300&h=300' },
];

const testimonials = [
  { 
    name: 'Priya Sharma', 
    rating: 5, 
    comment: 'KiranaKart has made grocery shopping so convenient! I get all my essentials delivered in just 10 minutes.',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  { 
    name: 'Rahul Verma', 
    rating: 4, 
    comment: 'Great selection of products and the delivery is always on time. Highly recommend!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  { 
    name: 'Ananya Patel', 
    rating: 5, 
    comment: 'The quality of fruits and vegetables is always fresh. Love the service!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
];

export default Hero;