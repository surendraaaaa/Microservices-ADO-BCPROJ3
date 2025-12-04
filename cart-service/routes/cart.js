const express = require('express');
const router = express.Router();

let carts = {}; // { userId: [{ product, quantity }] }

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Get cart for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'User ID required' });
  res.json(carts[userId] || []);
});

// Add to cart → POST /api/cart
router.post('/', (req, res) => {
  const { userId, product, quantity = 1 } = req.body;
  if (!userId || !product) return res.status(400).json({ error: 'User ID and product required' });

  if (!carts[userId]) carts[userId] = [];
  const existingItem = carts[userId].find(item => item.product.id === product.id);

  if (existingItem) existingItem.quantity += quantity;
  else carts[userId].push({ product, quantity });

  res.json(carts[userId]);
});

// Update quantity → PUT /api/cart
router.put('/', (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || quantity === undefined)
    return res.status(400).json({ error: 'User ID, Product ID, quantity required' });

  if (carts[userId]) {
    const item = carts[userId].find(item => item.product.id === productId);
    if (item) item.quantity = quantity;
  }
  res.json(carts[userId] || []);
});

// Remove item → DELETE /api/cart/:userId/:productId
router.delete('/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  if (!userId || !productId) return res.status(400).json({ error: 'User ID and Product ID required' });

  if (carts[userId]) {
    carts[userId] = carts[userId].filter(item => item.product.id != productId);
  }
  res.json(carts[userId] || []);
});

// Clear cart → DELETE /api/cart/clear/:userId
router.delete('/clear/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  carts[userId] = [];
  res.json([]);
});

module.exports = router;













// const CartService = {
//   async addToCart(product, quantity = 1, userId) {
//     if (!userId) throw new Error('User ID is required');
//     const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, product, quantity }),
//     });
//     if (!res.ok) throw new Error('Failed to add to cart');
//     return await res.json();
//   },

//   async getCart(userId) {
//     if (!userId) throw new Error('User ID is required');
//     const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${userId}`);
//     if (!res.ok) throw new Error('Failed to fetch cart');
//     return await res.json();
//   },

//   async removeFromCart(productId, userId) {
//     if (!userId) throw new Error('User ID is required');
//     const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${userId}/${productId}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Failed to remove item from cart');
//     return await res.json();
//   },

//   async updateQuantity(productId, quantity, userId) {
//     if (!userId) throw new Error('User ID is required');
//     const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/update`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId, productId, quantity }),
//     });
//     if (!res.ok) throw new Error('Failed to update quantity');
//     return await res.json();
//   },

//   async clearCart(userId) {
//     if (!userId) throw new Error('User ID is required');
//     const res = await fetch(`${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/clear/${userId}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Failed to clear cart');
//     return await res.json();
//   },
// };





// const express = require('express');
// const router = express.Router();

// let carts = {}; // In-memory storage: userId -> cart items

// router.post('/add', (req, res) => {
//     const { userId, product, quantity = 1 } = req.body;
    
//     if (!carts[userId]) {
//         carts[userId] = [];
//     }
    
//     const existingItem = carts[userId].find(item => item.product.id === product.id);
    
//     if (existingItem) {
//         existingItem.quantity += quantity;
//     } else {
//         carts[userId].push({ product, quantity });
//     }
    
//     res.json(carts[userId]);
// });

// router.get('/:userId', (req, res) => {
//     const { userId } = req.params;
//     res.json(carts[userId] || []);
// });

// router.delete('/:userId/:productId', (req, res) => {
//     const { userId, productId } = req.params;
    
//     if (carts[userId]) {
//         carts[userId] = carts[userId].filter(item => item.product.id != productId);
//     }
    
//     res.json(carts[userId] || []);
// });

// router.put('/update', (req, res) => {
//     const { userId, productId, quantity } = req.body;
    
//     if (carts[userId]) {
//         const item = carts[userId].find(item => item.product.id === productId);
//         if (item) {
//             item.quantity = quantity;
//         }
//     }
    
//     res.json(carts[userId] || []);
// });

// router.delete('/clear/:userId', (req, res) => {
//     const { userId } = req.params;
//     carts[userId] = [];
//     res.json([]);
// });

// module.exports = router;
// ```

// ### 14. **order-service/requirements.txt**
// // ```
// // Django==4.2.7
// // djangorestframework==3.14.0
// // django-cors-headers==4.3.0