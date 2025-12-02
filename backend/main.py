

from flask import Flask, jsonify
from flask_cors import CORS
import csv
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Allow frontend to fetch

CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")


# ----------------------------
# Load all products from CSV
# ----------------------------
def load_products():
    products = []
    try:
        with open(CSV_FILE, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                row['id'] = int(row['id'])
                row['price'] = float(row['price'])
                row['image'] = row['image'].strip()
                # Optional: ensure rating_count exists for popularity
                if 'rating_count' not in row:
                    row['rating_count'] = 0
                else:
                    row['rating_count'] = int(row['rating_count'])
                products.append(row)
        return products
    except Exception as e:
        print("Error loading CSV:", e)
        return []


# ----------------------------
# Route: All products
# ----------------------------
@app.route('/products', methods=['GET'])
def get_products():
    products = load_products()
    if not products:
        return jsonify({"error": "CSV file not found or empty"}), 404
    return jsonify(products)


# ----------------------------
# Route: Product by ID
# ----------------------------
@app.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    else:
        return jsonify({"error": "Product not found"}), 404


# ----------------------------
# Route: Recommendations
# ----------------------------
@app.route('/recommend/<int:product_id>', methods=['GET'])
def recommend(product_id):
    products = load_products()
    if not products:
        return jsonify({"error": "CSV file not found"}), 404

    df = pd.DataFrame(products)

    # Create a text column for content-based filtering
    df['text'] = df['title'] + ' ' + df['description'] + ' ' + df['category']

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text'])
    sim_matrix = cosine_similarity(tfidf_matrix)

    if product_id not in df['id'].values:
        return jsonify({"error": "Product not found"}), 404

    idx = df.index[df['id'] == product_id][0]

    # Top 5 similar products (excluding itself)
    scores = list(enumerate(sim_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    top_scores = scores[1:6]
    recommended_ids = [df.iloc[i[0]]['id'] for i in top_scores]
    rec_df = df[df['id'].isin(recommended_ids)]

    # Top 5 popular products by rating_count
    popular_df = df.sort_values(by='rating_count', ascending=False).head(5)

    return jsonify({
        "you_may_like": rec_df.to_dict(orient='records'),
        "popular": popular_df.to_dict(orient='records')
    })


@app.route('/')
def index():
    return "Flask backend running. Use /products, /product/<id>, /recommend/<id>"


if __name__ == '__main__':
    app.run(debug=True)
