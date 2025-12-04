const express = require('express');
const router = express.Router();

// Health endpoint for Kubernetes
router.get('/health', (req, res) => {
    res.status(200).send('OK');
});

router.post('/process', async (req, res) => {
    const { orderId, amount, cardDetails } = req.body;
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful payment
    res.json({
        success: true,
        transactionId: 'txn_' + Date.now(),
        orderId: orderId,
        amount: amount,
        status: 'completed'
    });
});

module.exports = router;