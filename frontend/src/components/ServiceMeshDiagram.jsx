import React, { useState } from 'react';
import { ArrowRight, Database, Globe, Server, ShoppingCart, User, Package, CreditCard, Layers } from 'lucide-react';

const ServiceMeshDiagram = () => {
  const [activeFlow, setActiveFlow] = useState('browse');

  const flows = {
    browse: {
      title: "1. Browse Products Flow",
      steps: [
        { from: "User Browser", to: "Frontend (React)", detail: "User visits website" },
        { from: "Frontend", to: "Product Service", detail: "GET /api/products", port: ":5001" },
        { from: "Product Service", to: "Database", detail: "Query products from DB" },
        { from: "Database", to: "Product Service", detail: "Return product list" },
        { from: "Product Service", to: "Frontend", detail: "JSON response with products" },
        { from: "Frontend", to: "User Browser", detail: "Render products on UI" }
      ]
    },
    search: {
      title: "2. Search Products Flow",
      steps: [
        { from: "User Browser", to: "Frontend", detail: "User enters search query" },
        { from: "Frontend", to: "Product Service", detail: "GET /api/products/search?q=laptop", port: ":5001" },
        { from: "Product Service", to: "Database", detail: "Filter products by query" },
        { from: "Database", to: "Product Service", detail: "Return filtered results" },
        { from: "Product Service", to: "Frontend", detail: "JSON with matching products" },
        { from: "Frontend", to: "User Browser", detail: "Display search results" }
      ]
    },
    addToCart: {
      title: "3. Add to Cart Flow",
      steps: [
        { from: "User Browser", to: "Frontend", detail: "User clicks 'Add to Cart'" },
        { from: "Frontend", to: "User Service", detail: "GET /api/users/current", port: ":8080" },
        { from: "User Service", to: "Frontend", detail: "Return user info with JWT" },
        { from: "Frontend", to: "Cart Service", detail: "POST /api/cart/add", port: ":3001", payload: "{userId, product, quantity}" },
        { from: "Cart Service", to: "Cache/Memory", detail: "Store cart in-memory (Redis in prod)" },
        { from: "Cart Service", to: "Frontend", detail: "Return updated cart items" },
        { from: "Frontend", to: "User Browser", detail: "Update cart badge & show notification" }
      ]
    },
    checkout: {
      title: "4. Checkout & Payment Flow",
      steps: [
        { from: "User Browser", to: "Frontend", detail: "User clicks 'Checkout'" },
        { from: "Frontend", to: "Cart Service", detail: "GET /api/cart/:userId", port: ":3001" },
        { from: "Cart Service", to: "Frontend", detail: "Return cart items & total" },
        { from: "Frontend", to: "Order Service", detail: "POST /api/orders/create", port: ":8000", payload: "{userId, items, total}" },
        { from: "Order Service", to: "Database", detail: "INSERT order into DB" },
        { from: "Order Service", to: "Frontend", detail: "Return order ID & details" },
        { from: "Frontend", to: "Payment Service", detail: "POST /api/payment/process", port: ":3002", payload: "{orderId, amount, cardDetails}" },
        { from: "Payment Service", to: "Payment Gateway", detail: "Process payment (Stripe/PayPal)" },
        { from: "Payment Gateway", to: "Payment Service", detail: "Payment confirmation" },
        { from: "Payment Service", to: "Frontend", detail: "Return transaction ID & status" },
        { from: "Frontend", to: "Cart Service", detail: "DELETE /api/cart/clear/:userId", port: ":3001" },
        { from: "Cart Service", to: "Frontend", detail: "Cart cleared successfully" },
        { from: "Frontend", to: "User Browser", detail: "Show order confirmation" }
      ]
    },
    viewOrders: {
      title: "5. View Order History Flow",
      steps: [
        { from: "User Browser", to: "Frontend", detail: "User clicks 'My Orders'" },
        { from: "Frontend", to: "User Service", detail: "GET /api/users/current", port: ":8080" },
        { from: "User Service", to: "Frontend", detail: "Return authenticated user" },
        { from: "Frontend", to: "Order Service", detail: "GET /api/orders/:userId", port: ":8000" },
        { from: "Order Service", to: "Database", detail: "SELECT orders WHERE user_id=?" },
        { from: "Database", to: "Order Service", detail: "Return user's orders" },
        { from: "Order Service", to: "Frontend", detail: "JSON array of orders" },
        { from: "Frontend", to: "User Browser", detail: "Display order history" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          E-Commerce Microservices Architecture
        </h1>
        <p className="text-gray-600 text-center mb-8">Complete Service Mesh & Communication Flow</p>

        {/* Architecture Overview */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Layers className="text-blue-600" />
            System Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Client Layer */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-lg mb-4 text-blue-800">Client Layer</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm flex items-center gap-2">
                  <Globe className="text-blue-600" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Frontend</p>
                    <p className="text-xs text-gray-600">React SPA</p>
                    <p className="text-xs text-blue-600">Port: 3000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Layer */}
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-lg mb-4 text-green-800">Service Layer (API Gateway)</h3>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-2">
                  <Server className="text-purple-600" size={18} />
                  <div>
                    <p className="font-semibold text-xs">Product Service</p>
                    <p className="text-xs text-gray-600">Python/Flask :5001</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-2">
                  <User className="text-blue-600" size={18} />
                  <div>
                    <p className="font-semibold text-xs">User Service</p>
                    <p className="text-xs text-gray-600">Java/Spring :8080</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-2">
                  <ShoppingCart className="text-green-600" size={18} />
                  <div>
                    <p className="font-semibold text-xs">Cart Service</p>
                    <p className="text-xs text-gray-600">Node/Express :3001</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-2">
                  <Package className="text-orange-600" size={18} />
                  <div>
                    <p className="font-semibold text-xs">Order Service</p>
                    <p className="text-xs text-gray-600">Python/Django :8000</p>
                  </div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-2">
                  <CreditCard className="text-red-600" size={18} />
                  <div>
                    <p className="font-semibold text-xs">Payment Service</p>
                    <p className="text-xs text-gray-600">Node/Express :3002</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Layer */}
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-4 text-purple-800">Data Layer</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm flex items-center gap-2">
                  <Database className="text-purple-600" size={20} />
                  <div>
                    <p className="font-semibold text-sm">PostgreSQL</p>
                    <p className="text-xs text-gray-600">Products & Orders</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm flex items-center gap-2">
                  <Database className="text-blue-600" size={20} />
                  <div>
                    <p className="font-semibold text-sm">H2 Database</p>
                    <p className="text-xs text-gray-600">User Data</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm flex items-center gap-2">
                  <Database className="text-red-600" size={20} />
                  <div>
                    <p className="font-semibold text-sm">Redis Cache</p>
                    <p className="text-xs text-gray-600">Cart Sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Patterns */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Communication Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white p-2 rounded">REST</div>
                <div>
                  <p className="font-semibold">Synchronous HTTP/REST</p>
                  <p className="text-sm text-gray-600">Frontend ↔ All Services</p>
                  <p className="text-xs text-gray-500">JSON over HTTP, CORS enabled</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-600 text-white p-2 rounded">DB</div>
                <div>
                  <p className="font-semibold">Database Connections</p>
                  <p className="text-sm text-gray-600">Services ↔ Databases</p>
                  <p className="text-xs text-gray-500">JDBC, SQLAlchemy, Sequelize</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white p-2 rounded">JWT</div>
                <div>
                  <p className="font-semibold">Authentication</p>
                  <p className="text-sm text-gray-600">JWT Tokens via User Service</p>
                  <p className="text-xs text-gray-500">Bearer token in headers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-600 text-white p-2 rounded">API</div>
                <div>
                  <p className="font-semibold">External APIs</p>
                  <p className="text-sm text-gray-600">Payment Gateway Integration</p>
                  <p className="text-xs text-gray-500">Stripe/PayPal webhooks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow Selection */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Select a User Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.keys(flows).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFlow(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeFlow === key
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-semibold text-sm">{flows[key].title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">{flows[activeFlow].title}</h2>
          
          <div className="space-y-4">
            {flows[activeFlow].steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                    <p className="font-semibold text-sm text-blue-800">{step.from}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <ArrowRight className="text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-mono text-gray-700 bg-yellow-50 px-2 py-1 rounded">
                        {step.detail}
                      </p>
                      {step.port && (
                        <p className="text-xs text-blue-600 font-semibold mt-1">{step.port}</p>
                      )}
                      {step.payload && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">{step.payload}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                    <p className="font-semibold text-sm text-green-800">{step.to}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoints Reference */}
        <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">API Endpoints Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Service */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h3 className="font-bold text-lg mb-3 text-purple-800">Product Service :5001</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/products
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/products/search?q=query
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/products/:id
                </div>
              </div>
            </div>

            {/* User Service */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="font-bold text-lg mb-3 text-blue-800">User Service :8080</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-white p-2 rounded">
                  <span className="text-orange-600 font-bold">POST</span> /api/users/login
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/users/current
                </div>
              </div>
            </div>

            {/* Cart Service */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-bold text-lg mb-3 text-green-800">Cart Service :3001</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-white p-2 rounded">
                  <span className="text-orange-600 font-bold">POST</span> /api/cart/add
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/cart/:userId
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-blue-600 font-bold">PUT</span> /api/cart/update
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-red-600 font-bold">DELETE</span> /api/cart/:userId/:productId
                </div>
              </div>
            </div>

            {/* Order Service */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <h3 className="font-bold text-lg mb-3 text-orange-800">Order Service :8000</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-white p-2 rounded">
                  <span className="text-orange-600 font-bold">POST</span> /api/orders/create
                </div>
                <div className="bg-white p-2 rounded">
                  <span className="text-green-600 font-bold">GET</span> /api/orders/:userId
                </div>
              </div>
            </div>

            {/* Payment Service */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-bold text-lg mb-3 text-red-800">Payment Service :3002</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="bg-white p-2 rounded">
                  <span className="text-orange-600 font-bold">POST</span> /api/payment/process
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Flow Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">🔄 Complete E2E Data Flow Summary</h2>
          <div className="space-y-3 text-sm">
            <p>1️⃣ <strong>User Request</strong> → Browser sends HTTP request to Frontend (React SPA)</p>
            <p>2️⃣ <strong>Frontend Processing</strong> → React app makes RESTful API calls to appropriate microservice</p>
            <p>3️⃣ <strong>Service Layer</strong> → Microservices process business logic (validation, computation)</p>
            <p>4️⃣ <strong>Data Layer</strong> → Services query/update databases (PostgreSQL, H2, Redis)</p>
            <p>5️⃣ <strong>Response Flow</strong> → Data flows back: DB → Service → Frontend → User</p>
            <p>6️⃣ <strong>Cross-Service Communication</strong> → Services call each other via HTTP REST APIs</p>
            <p>7️⃣ <strong>Authentication</strong> → JWT tokens passed in Authorization headers for secure requests</p>
            <p>8️⃣ <strong>External Integration</strong> → Payment service connects to external payment gateways</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMeshDiagram;