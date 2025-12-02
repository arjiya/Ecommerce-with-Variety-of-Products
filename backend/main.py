
from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
os.makedirs("Files", exist_ok=True)

# ----------------------------
# Load products from CSV or pickle
# ----------------------------
def load_products():
    if os.path.exists(PRODUCTS_FILE):
        return pd.read_pickle(PRODUCTS_FILE).to_dict(orient='records')

    products = []
    try:
        with open(CSV_FILE, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                row['id'] = int(row['id'])
                row['price'] = float(row['price'])
                row['image'] = row['image'].strip()
                if 'rating_count' not in row:
                    row['rating_count'] = 0
                else:
                    row['rating_count'] = int(row['rating_count'])
                products.append(row)

        # Save to pickle for faster reload
        df = pd.DataFrame(products)
        df.to_pickle(PRODUCTS_FILE)
        return products
    except Exception as e:
        print("Error loading CSV:", e)
        return []

# ----------------------------
# Product recommendation endpoint
# ----------------------------
@app.route('/recommend/<int:product_id>', methods=['GET'])
def recommend(product_id):
    products = load_products()
    if not products:
        return jsonify({"error": "CSV file not found"}), 404

    df = pd.DataFrame(products)
    df['text'] = df['title'] + ' ' + df['description'] + ' ' + (df['category'] + ' ') * 5

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text'])

    if product_id not in df['id'].values:
        return jsonify({"error": "Product not found"}), 404

    idx = df.index[df['id'] == product_id][0]
    sim_matrix = cosine_similarity(tfidf_matrix)
    scores = list(enumerate(sim_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    top_scores = scores[1:6]  # Top 5 similar
    recommended_ids = [df.iloc[i[0]]['id'] for i in top_scores]
    rec_df = df[df['id'].isin(recommended_ids)]

    popular_df = df.sort_values(by='rating_count', ascending=False).head(5)

    return jsonify({
        "you_may_like": rec_df.to_dict(orient='records'),
        "popular": popular_df.to_dict(orient='records')
    })


# ----------------------------
# Improved search endpoint
# ----------------------------
@app.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').strip().lower()
    if not query:
        return jsonify({"error": "No search query provided"}), 400

    products = load_products()
    if not products:
        return jsonify({"error": "CSV file not found"}), 404

    df = pd.DataFrame(products)

    # 1️⃣ Strict category filtering first
    category_match = df[df['category'].str.lower().str.contains(query)]
    if not category_match.empty:
        df_filtered = category_match
    else:
        df_filtered = df  # fallback to all products if no category match

    # 2️⃣ Weighted text for TF-IDF
    df_filtered['text'] = df_filtered['title'] + ' ' + df_filtered['description']

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df_filtered['text'])
    query_vec = vectorizer.transform([query])
    similarity = cosine_similarity(query_vec, tfidf_matrix).flatten()

    # 3️⃣ Boost exact title matches
    df_filtered['boost'] = df_filtered['title'].str.lower().str.contains(query).astype(int) * 2
    similarity = similarity + df_filtered['boost'].values

    # 4️⃣ Get top 10
    top_indices = similarity.argsort()[::-1][:10]
    results = df_filtered.iloc[top_indices].to_dict(orient='records')

    return jsonify(results)


# ----------------------------
# Basic product routes
# ----------------------------
@app.route('/products', methods=['GET'])
def get_products():
    products = load_products()
    if not products:
        return jsonify({"error": "CSV file not found or empty"}), 404
    return jsonify(products)


@app.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404


@app.route('/')
def index():
    return "Flask backend running. Use /products, /product/<id>, /recommend/<id>, /search?q=..."


if __name__ == '__main__':
    app.run(debug=True)
