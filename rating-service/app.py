from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory rating storage (replace with DB in production)
ratings = [
    {"product_id": 1, "user_id": 1, "rating": 4.5, "comment": "Great laptop!"},
    {"product_id": 1, "user_id": 2, "rating": 4.0, "comment": "Good value"},
    {"product_id": 2, "user_id": 3, "rating": 3.5, "comment": "Average quality"}
]

# Health endpoint
@app.route('/api/ratings/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

# Get average rating for a product
@app.route('/api/ratings/<int:product_id>', methods=['GET'])
def get_rating(product_id):
    product_ratings = [r['rating'] for r in ratings if r['product_id'] == product_id]
    if not product_ratings:
        return jsonify({"product_id": product_id, "avg_rating": None, "count": 0})
    
    avg_rating = sum(product_ratings) / len(product_ratings)
    return jsonify({
        "product_id": product_id,
        "avg_rating": round(avg_rating, 1),
        "count": len(product_ratings)
    })

# Add a rating for a product
@app.route('/api/ratings', methods=['POST'])
def add_rating():
    data = request.get_json()
    required_fields = ["product_id", "user_id", "rating"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    ratings.append({
        "product_id": data["product_id"],
        "user_id": data["user_id"],
        "rating": data["rating"],
        "comment": data.get("comment", "")
    })
    return jsonify({"message": "Rating added successfully!"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
