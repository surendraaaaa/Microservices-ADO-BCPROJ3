# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Set environment variables for React build
ENV REACT_APP_PRODUCT_SERVICE_URL=http://product-service:5001
ENV REACT_APP_RATING_SERVICE_URL=http://rating-service:5002
ENV REACT_APP_CART_SERVICE_URL=http://cart-service:3001

# ENV REACT_APP_PRODUCT_SERVICE_URL=http://localhost:5001
# ENV REACT_APP_RATING_SERVICE_URL=http://localhost:5002
# ENV REACT_APP_CART_SERVICE_URL=http://localhost:3001

# Build React app
RUN npm run build

# Serve build with a lightweight server
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
