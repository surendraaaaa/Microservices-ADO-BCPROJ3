const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});