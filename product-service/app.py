from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Product data
products = [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 15, "category": "Electronics"},
    {"id": 2, "name": "Headphones", "price": 79.99, "stock": 50, "category": "Electronics"},
    {"id": 3, "name": "Coffee Maker", "price": 49.99, "stock": 30, "category": "Home"},
    {"id": 4, "name": "Running Shoes", "price": 89.99, "stock": 25, "category": "Sports"},
    {"id": 5, "name": "Backpack", "price": 39.99, "stock": 40, "category": "Accessories"}
]

RATING_SERVICE_URL = "http://localhost:4000/api/ratings"

def enrich_with_rating(product):
    try:
        resp = requests.get(f"{RATING_SERVICE_URL}/{product['id']}", timeout=2)
        if resp.status_code == 200:
            rating_data = resp.json()
            product['avg_rating'] = rating_data.get('avg_rating')
            product['rating_count'] = rating_data.get('count')
        else:
            product['avg_rating'] = None
            product['rating_count'] = 0
    except requests.exceptions.RequestException:
        product['avg_rating'] = None
        product['rating_count'] = 0
    return product

@app.route('/api/products/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    enriched_products = [enrich_with_rating(p.copy()) for p in products]
    return jsonify(enriched_products)

@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').lower()
    results = [p for p in products if query in p['name'].lower()]
    enriched_results = [enrich_with_rating(p.copy()) for p in results]
    return jsonify(enriched_results)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        enriched_product = enrich_with_rating(product.copy())
        return jsonify(enriched_product)
    return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)




# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import requests

# app = Flask(__name__)
# CORS(app)

# # Product data
# products = [
#     {"id": 1, "name": "Laptop", "price": 999.99, "stock": 15, "category": "Electronics"},
#     {"id": 2, "name": "Headphones", "price": 79.99, "stock": 50, "category": "Electronics"},
#     {"id": 3, "name": "Coffee Maker", "price": 49.99, "stock": 30, "category": "Home"},
#     {"id": 4, "name": "Running Shoes", "price": 89.99, "stock": 25, "category": "Sports"},
#     {"id": 5, "name": "Backpack", "price": 39.99, "stock": 40, "category": "Accessories"}
# ]

# # Rating Service URL
# RATING_SERVICE_URL = "http://localhost:4000/api/ratings"

# def enrich_with_rating(product):
#     """Fetch average rating from Rating Service and add to product"""
#     try:
#         resp = requests.get(f"{RATING_SERVICE_URL}/{product['id']}")
#         if resp.status_code == 200:
#             rating_data = resp.json()
#             product['avg_rating'] = rating_data.get('avg_rating')
#             product['rating_count'] = rating_data.get('count')
#         else:
#             product['avg_rating'] = None
#             product['rating_count'] = 0
#     except requests.exceptions.RequestException:
#         product['avg_rating'] = None
#         product['rating_count'] = 0
#     return product

# @app.route('/api/products', methods=['GET'])
# def get_products():
#     enriched_products = [enrich_with_rating(p.copy()) for p in products]
#     return jsonify(enriched_products)

# @app.route('/api/products/search', methods=['GET'])
# def search_products():
#     query = request.args.get('q', '').lower()
#     results = [p for p in products if query in p['name'].lower()]
#     enriched_results = [enrich_with_rating(p.copy()) for p in results]
#     return jsonify(enriched_results)

# @app.route('/api/products/<int:product_id>', methods=['GET'])
# def get_product(product_id):
#     product = next((p for p in products if p['id'] == product_id), None)
#     if product:
#         enriched_product = enrich_with_rating(product.copy())
#         return jsonify(enriched_product)
#     return jsonify({"error": "Product not found"}), 404

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)







