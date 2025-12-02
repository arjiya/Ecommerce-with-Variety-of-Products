


# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import csv
# import os
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# # main.py (add this below your existing Flask code)
# from database import create_users_table, add_user, verify_user
# from flask import request, jsonify
# from werkzeug.security import generate_password_hash, check_password_hash


# # Make sure table exists
# create_users_table()

# # Registration
# @app.route("/api/register", methods=["POST"])
# def register():
#     data = request.json
#     username = data.get("username")
#     password = data.get("password")

#     if not username or not password:
#         return jsonify({"error": "Username and password required"}), 400

#     success = add_user(username, password)
#     if success:
#         return jsonify({"message": "Registered successfully"})
#     else:
#         return jsonify({"error": "Username already exists"}), 400

# # Login
# @app.route("/api/login", methods=["POST"])
# def login():
#     data = request.json
#     username = data.get("username")
#     password = data.get("password")

#     if verify_user(username, password):
#         return jsonify({"message": "Login successful", "username": username})
#     else:
#         return jsonify({"error": "Invalid credentials"}), 401


# app = Flask(__name__)
# CORS(app)

# CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
# PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
# os.makedirs("Files", exist_ok=True)


# # ----------------------------------------
# # Load products from CSV or pickle
# # ----------------------------------------
# def load_products():
#     if os.path.exists(PRODUCTS_FILE):
#         return pd.read_pickle(PRODUCTS_FILE).to_dict(orient='records')

#     products = []
#     try:
#         with open(CSV_FILE, newline='', encoding='utf-8') as f:
#             reader = csv.DictReader(f)
#             for row in reader:
#                 row['id'] = int(row['id'])
#                 row['price'] = float(row['price'])
#                 row['image'] = row['image'].strip()

#                 row['rating_count'] = int(row.get('rating_count', 0))

#                 products.append(row)

#         df = pd.DataFrame(products)
#         df.to_pickle(PRODUCTS_FILE)
#         return products

#     except Exception as e:
#         print("Error loading CSV:", e)
#         return []


# # ----------------------------------------
# # Product recommendation
# # ----------------------------------------
# @app.route('/api/recommend/<int:product_id>', methods=['GET'])
# def recommend(product_id):
#     products = load_products()
#     if not products:
#         return jsonify({"error": "CSV file not found"}), 404

#     df = pd.DataFrame(products)

#     df['text'] = df['title'] + ' ' + df['description'] + ' ' + (df['category'] + ' ') * 5

#     vectorizer = TfidfVectorizer(stop_words='english')
#     tfidf_matrix = vectorizer.fit_transform(df['text'])

#     if product_id not in df['id'].values:
#         return jsonify({"error": "Product not found"}), 404

#     idx = df.index[df['id'] == product_id][0]

#     similarity = cosine_similarity(tfidf_matrix[idx:idx+1], tfidf_matrix).flatten()
#     df['similarity'] = similarity

#     recommended_df = df.sort_values(by='similarity', ascending=False).iloc[1:6]

#     popular_df = df.sort_values(by='rating_count', ascending=False).head(5)

#     return jsonify({
#         "you_may_like": recommended_df.to_dict(orient='records'),
#         "popular": popular_df.to_dict(orient='records')
#     })


# # ----------------------------------------
# # IMPROVED SEARCH (TOP 5 ONLY)
# # ----------------------------------------
# @app.route('/api/search', methods=['GET'])
# def search_products():
#     query = request.args.get('q', '').strip().lower()
#     if not query:
#         return jsonify({"error": "No search query provided"}), 400

#     products = load_products()
#     if not products:
#         return jsonify({"error": "CSV file not found"}), 404

#     df = pd.DataFrame(products)

#     # 1️⃣ CATEGORY MATCH PRIORITY
#     category_match = df[df['category'].str.lower().str.contains(query)]

#     if not category_match.empty:
#         df_filtered = category_match
#     else:
#         df_filtered = df

#     # 2️⃣ TEXT FIELD FOR TF-IDF
#     df_filtered['text'] = df_filtered['title'] + ' ' + df_filtered['description']

#     # 3️⃣ TF-IDF VECTOR
#     vectorizer = TfidfVectorizer(stop_words='english')
#     tfidf_matrix = vectorizer.fit_transform(df_filtered['text'])
#     query_vec = vectorizer.transform([query])

#     similarity = cosine_similarity(query_vec, tfidf_matrix).flatten()

#     # 4️⃣ BOOST EXACT TITLE MATCHES
#     df_filtered['boost'] = df_filtered['title'].str.lower().str.contains(query).astype(int) * 2
#     similarity = similarity + df_filtered['boost'].values

#     # 5️⃣ GET **TOP 5 ONLY**
#     top_indices = similarity.argsort()[::-1][:5]
#     results = df_filtered.iloc[top_indices].to_dict(orient='records')

#     return jsonify(results)


# # ----------------------------------------
# # Basic Product Routes
# # ----------------------------------------
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     products = load_products()
#     if not products:
#         return jsonify({"error": "CSV file not found"}), 404
#     return jsonify(products)


# @app.route('/api/product/<int:product_id>', methods=['GET'])
# def get_product(product_id):
#     products = load_products()
#     product = next((p for p in products if p['id'] == product_id), None)
#     if product:
#         return jsonify(product)
#     return jsonify({"error": "Product not found"}), 404


# @app.route('/')
# def index():
#     return "Flask backend running. Use /api/products, /api/product/<id>, /api/recommend/<id>, /api/search?q=..."


# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import csv
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB_FILE = "shopnest.db"

# ----------------------------
# Database Setup
# ----------------------------
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# ----------------------------
# Register Endpoint
# ----------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    hashed_pw = generate_password_hash(password)

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Registered successfully"})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Username already exists"}), 400

# ----------------------------
# Login Endpoint
# ----------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, username, password FROM users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()

    if row and check_password_hash(row["password"], password):
        user = {"id": row["id"], "username": row["username"]}
        return jsonify({"success": True, "user": user})
    return jsonify({"success": False, "message": "Invalid username or password"}), 401

# ----------------------------
# Products Setup (CSV)
# ----------------------------
CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
os.makedirs("Files", exist_ok=True)

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
                row['rating_count'] = int(row.get('rating_count', 0))
                products.append(row)
        df = pd.DataFrame(products)
        df.to_pickle(PRODUCTS_FILE)
        return products
    except Exception as e:
        print("Error loading CSV:", e)
        return []

# ----------------------------
# Products API
# ----------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(load_products())

@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/recommend/<int:product_id>', methods=['GET'])
def recommend(product_id):
    products = load_products()
    df = pd.DataFrame(products)
    df['text'] = df['title'] + ' ' + df['description'] + ' ' + (df['category'] + ' ') * 5
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['text'])

    if product_id not in df['id'].values:
        return jsonify({"error": "Product not found"}), 404

    idx = df.index[df['id'] == product_id][0]
    similarity = cosine_similarity(tfidf_matrix[idx:idx+1], tfidf_matrix).flatten()
    df['similarity'] = similarity
    recommended_df = df.sort_values(by='similarity', ascending=False).iloc[1:6]
    popular_df = df.sort_values(by='rating_count', ascending=False).head(5)

    return jsonify({
        "you_may_like": recommended_df.to_dict(orient='records'),
        "popular": popular_df.to_dict(orient='records')
    })

@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').strip().lower()
    df = pd.DataFrame(load_products())
    category_match = df[df['category'].str.lower().str.contains(query)]
    df_filtered = category_match if not category_match.empty else df

    df_filtered['text'] = df_filtered['title'] + ' ' + df_filtered['description']
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df_filtered['text'])
    query_vec = vectorizer.transform([query])

    similarity = cosine_similarity(query_vec, tfidf_matrix).flatten()
    df_filtered['boost'] = df_filtered['title'].str.lower().str.contains(query).astype(int) * 2
    similarity += df_filtered['boost'].values

    top_indices = similarity.argsort()[::-1][:5]
    results = df_filtered.iloc[top_indices].to_dict(orient='records')
    return jsonify(results)

# ----------------------------
# Test Users Endpoint (optional)
# ----------------------------
@app.route('/api/test-users', methods=['GET'])
def test_users():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT id, username FROM users")
    users = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(users)



@app.route('/')
def index():
    return "Flask backend running. Use /api/register, /api/login, /api/products, /api/product/<id>, /api/recommend/<id>, /api/search?q=..."

if __name__ == '__main__':
    app.run(debug=True)
