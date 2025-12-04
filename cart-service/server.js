const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/cart', cartRoutes);


app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});