import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Package, CreditCard, Search } from 'lucide-react';

// --- Simulated Microservices --- //

// 1. Product Service
const ProductService = {
  async getProducts() {
    const res = await fetch(`${process.env.REACT_APP_PRODUCT_SERVICE_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },
  async searchProducts(query) {
    const res = await fetch(`${process.env.REACT_APP_PRODUCT_SERVICE_URL}/api/products/search?q=${query}`);
    if (!res.ok) throw new Error('Failed to search products');
    return await res.json();
  }
};

// 2. User Service
const UserService = {
  currentUser: null,
  async login(email, password) {
    this.currentUser = { id: 1, email, name: 'John Doe', token: 'jwt_' + Date.now() };
    return this.currentUser;
  },
  async getCurrentUser() {
    if (!this.currentUser) {
      this.currentUser = { id: 1, email: 'guest@example.com', name: 'Guest User' };
    }
    return this.currentUser;
  }
};

// 3. Cart Service
const CartService = {
  async addToCart(product, quantity = 1, userId) {
    if (!userId) throw new Error('User ID is required');
    const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, product, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return await res.json();
  },
  async getCart(userId) {
    if (!userId) throw new Error('User ID is required');
    const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return await res.json();
  },
  async removeFromCart(productId, userId) {
    if (!userId) throw new Error('User ID is required');
    const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${userId}/${productId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove item from cart');
    return await res.json();
  },
  async updateQuantity(productId, quantity, userId) {
    if (!userId) throw new Error('User ID is required');
    const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to update quantity');
    return await res.json();
  },
  async clearCart(userId) {
    if (!userId) throw new Error('User ID is required');
    const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/clear/${userId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear cart');
    return await res.json();
  },
};

// 4. Order Service
const OrderService = {
  orders: [],
  async createOrder(cart, user) {
    const order = {
      id: Date.now(),
      userId: user.id,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.orders.push(order);
    return order;
  },
  async getOrders(userId) {
    return this.orders.filter(order => order.userId === userId);
  }
};

// 5. Payment Service
const PaymentService = {
  async processPayment(orderId, amount, cardDetails) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, transactionId: 'txn_' + Date.now(), orderId, amount, status: 'completed' };
  }
};

// 6. Rating Service
const RatingService = {
  async getRating(productId) {
    try {
      const response = await fetch(`${process.env.REACT_APP_RATING_SERVICE_URL}/api/ratings/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch rating');
      const data = await response.json();
      return data.rating;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};

// --- Main App --- //
const ECommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const init = async () => {
      const u = await UserService.getCurrentUser();
      setUser(u);
      await loadProducts();
      await loadCart(u.id);
    };
    init();
  }, []);

  const loadProducts = async () => {
    try {
      const prods = await ProductService.getProducts();
      const prodsWithRatings = await Promise.all(prods.map(async (p) => {
        const rating = await RatingService.getRating(p.id);
        return { ...p, rating };
      }));
      setProducts(prodsWithRatings);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCart = async (userId) => {
    try {
      const cartData = await CartService.getCart(userId);
      setCart(cartData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const results = await ProductService.searchProducts(searchQuery);
        const resultsWithRatings = await Promise.all(results.map(async (p) => {
          const rating = await RatingService.getRating(p.id);
          return { ...p, rating };
        }));
        setProducts(resultsWithRatings);
      } else {
        loadProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async (product) => {
    if (!user || !user.id) return showNotification('User not logged in');
    try {
      const updatedCart = await CartService.addToCart(product, 1, user.id);
      setCart(updatedCart);
      showNotification(`${product.name} added to cart!`);
    } catch (error) {
      showNotification(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = await CartService.removeFromCart(productId, user.id);
      setCart(updatedCart);
    } catch (error) {
      showNotification(error.message);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedCart = await CartService.updateQuantity(productId, quantity, user.id);
      setCart(updatedCart);
    } catch (error) {
      showNotification(error.message);
    }
  };

  const checkout = async () => {
    if (!user || !user.id) return showNotification('User not logged in');
    if (cart.length === 0) return showNotification('Cart is empty!');
    setLoading(true);
    try {
      const order = await OrderService.createOrder(cart, user);
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const payment = await PaymentService.processPayment(order.id, total, { cardNumber: '****1234' });
      if (payment.success) {
        await CartService.clearCart(user.id);
        setCart([]);
        const userOrders = await OrderService.getOrders(user.id);
        setOrders(userOrders);
        setView('orders');
        showNotification('Order placed successfully!');
      }
    } catch (error) {
      showNotification('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">MicroStore</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => setView('products')} className="hover:text-blue-200 flex items-center gap-2">
              <Package size={20} /> Products
            </button>
            <button onClick={() => setView('cart')} className="hover:text-blue-200 flex items-center gap-2 relative">
              <ShoppingCart size={20} /> Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => setView('orders')} className="hover:text-blue-200 flex items-center gap-2">
              <CreditCard size={20} /> Orders
            </button>
            <div className="flex items-center gap-2">
              <User size={20} />
              <span className="text-sm">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'products' && (
          <>
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Search size={20} /> Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{product.category}</span>
                  <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  {product.rating && <p className="text-sm text-yellow-500">⭐ {product.rating.toFixed(1)}</p>}
                  <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p>${item.product.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border rounded"
                        />
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <p className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</p>
                  <button onClick={checkout} className="bg-green-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-green-700">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-4 rounded shadow">
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ECommerceApp;
