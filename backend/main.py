

# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import sqlite3
# import csv
# import os
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from werkzeug.security import generate_password_hash, check_password_hash
# from database import create_admins_table, add_admin



# app = Flask(__name__)
# CORS(app)

# DB_FILE = "shopnest.db"

# # ----------------------------
# # Database Setup
# # ----------------------------
# def init_db():
#     conn = sqlite3.connect(DB_FILE)
#     c = conn.cursor()
#     c.execute('''
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     ''')
#     conn.commit()
#     conn.close()

# init_db()

# def get_db_connection():
#     conn = sqlite3.connect(DB_FILE)
#     conn.row_factory = sqlite3.Row
#     return conn

# # Create admins table
# create_admins_table()

# # Create default admin (once)
# add_admin("admin", "admin123")  #
# # ----------------------------
# # Register Endpoint
# # ----------------------------
# @app.route('/api/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")

#     if not username or not password:
#         return jsonify({"success": False, "message": "Username and password required"}), 400

#     hashed_pw = generate_password_hash(password)

#     try:
#         conn = get_db_connection()
#         c = conn.cursor()
#         c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
#         conn.commit()
#         conn.close()
#         return jsonify({"success": True, "message": "Registered successfully"})
#     except sqlite3.IntegrityError:
#         return jsonify({"success": False, "message": "Username already exists"}), 400

# # ----------------------------
# # Login Endpoint
# # ----------------------------
# @app.route('/api/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get("username")
#     password = data.get("password")

#     conn = get_db_connection()
#     c = conn.cursor()
#     c.execute("SELECT id, username, password FROM users WHERE username = ?", (username,))
#     row = c.fetchone()
#     conn.close()

#     if row and check_password_hash(row["password"], password):
#         user = {"id": row["id"], "username": row["username"]}
#         return jsonify({"success": True, "user": user})
#     return jsonify({"success": False, "message": "Invalid username or password"}), 401

# # ----------------------------
# # Products Setup (CSV)
# # ----------------------------
# CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
# PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
# os.makedirs("Files", exist_ok=True)

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

# # ----------------------------
# # Products API
# # ----------------------------
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     return jsonify(load_products())

# @app.route('/api/product/<int:product_id>', methods=['GET'])
# def get_product(product_id):
#     products = load_products()
#     product = next((p for p in products if p['id'] == product_id), None)
#     if product:
#         return jsonify(product)
#     return jsonify({"error": "Product not found"}), 404

# @app.route('/api/recommend/<int:product_id>', methods=['GET'])
# def recommend(product_id):
#     products = load_products()
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

# @app.route('/api/search', methods=['GET'])
# def search_products():
#     query = request.args.get('q', '').strip().lower()
#     df = pd.DataFrame(load_products())
#     category_match = df[df['category'].str.lower().str.contains(query)]
#     df_filtered = category_match if not category_match.empty else df

#     df_filtered['text'] = df_filtered['title'] + ' ' + df_filtered['description']
#     vectorizer = TfidfVectorizer(stop_words='english')
#     tfidf_matrix = vectorizer.fit_transform(df_filtered['text'])
#     query_vec = vectorizer.transform([query])

#     similarity = cosine_similarity(query_vec, tfidf_matrix).flatten()
#     df_filtered['boost'] = df_filtered['title'].str.lower().str.contains(query).astype(int) * 2
#     similarity += df_filtered['boost'].values

#     top_indices = similarity.argsort()[::-1][:5]
#     results = df_filtered.iloc[top_indices].to_dict(orient='records')
#     return jsonify(results)

# # ----------------------------
# # Test Users Endpoint (optional)
# # ----------------------------
# @app.route('/api/test-users', methods=['GET'])
# def test_users():
#     conn = get_db_connection()
#     c = conn.cursor()
#     c.execute("SELECT id, username FROM users")
#     users = [dict(row) for row in c.fetchall()]
#     conn.close()
#     return jsonify(users)



# @app.route('/')
# def index():
#     return "Flask backend running. Use /api/register, /api/login, /api/products, /api/product/<id>, /api/recommend/<id>, /api/search?q=..."

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import csv
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from werkzeug.security import generate_password_hash, check_password_hash

# Import database functions
from database import (
    create_users_table, add_user, verify_user,
    create_admins_table, add_admin, verify_admin,
    get_all_users, get_all_admins
)

app = Flask(__name__)
CORS(app)

# ----------------------------
# Initialize Database
# ----------------------------
create_users_table()
create_admins_table()

# Create default admin ONCE
add_admin("admin", "admin123")

# ----------------------------
# User Registration
# ----------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    if add_user(username, password):
        return jsonify({"success": True, "message": "Registered successfully"})
    else:
        return jsonify({"success": False, "message": "Username already exists"}), 400

# ----------------------------
# User Login
# ----------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = verify_user(username, password)
    if user:
        return jsonify({"success": True, "user": {"id": user[0], "username": user[1]}})
    return jsonify({"success": False, "message": "Invalid username or password"}), 401

# ----------------------------
# Admin Login
# ----------------------------
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = verify_admin(username, password)
    if admin:
        return jsonify({"success": True, "admin": {"id": admin[0], "username": admin[1]}})
    return jsonify({"success": False, "message": "Invalid admin credentials"}), 401

# ----------------------------
# Get All Users/Admins
# ----------------------------
@app.route('/api/users', methods=['GET'])
def users_list():
    return jsonify(get_all_users())

@app.route('/api/admins', methods=['GET'])
def admins_list():
    return jsonify(get_all_admins())

# ----------------------------
# Products Setup (CSV)
# ----------------------------
CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
os.makedirs("Files", exist_ok=True)

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        return pd.read_pickle(PRODUCTS_FILE).to_dict(orient="records")
    
    products = []
    try:
        with open(CSV_FILE, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                row["id"] = int(row["id"])
                row["price"] = float(row["price"])
                row["image"] = row["image"].strip()
                row["rating_count"] = int(row.get("rating_count", 0))
                products.append(row)
        df = pd.DataFrame(products)
        df.to_pickle(PRODUCTS_FILE)
        return products
    except Exception as e:
        print("CSV Load Error:", e)
        return []

# ----------------------------
# Products API (CRUD)
# ----------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(load_products())

@app.route('/api/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/products/add', methods=['POST'])
def add_product():
    data = request.get_json()
    products = load_products()
    new_id = max([p['id'] for p in products], default=0) + 1
    new_product = {
        "id": new_id,
        "title": data['title'],
        "price": float(data['price']),
        "description": data['description'],
        "image": "",
        "category": "",
        "rating_count": 0
    }
    products.append(new_product)
    pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
    return jsonify({"success": True, "message": "Product added"})

@app.route('/api/products/delete/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    products = load_products()
    products = [p for p in products if p['id'] != product_id]
    pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
    return jsonify({"success": True, "message": "Product deleted"})

@app.route('/api/products/update/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    products = load_products()
    for p in products:
        if p['id'] == product_id:
            p['title'] = data['title']
            p['price'] = float(data['price'])
            p['description'] = data['description']
            break
    pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
    return jsonify({"success": True, "message": "Product updated"})

# ----------------------------
# Recommendation API
# ----------------------------
@app.route('/api/recommend/<int:product_id>', methods=['GET'])
def recommend(product_id):
    products = load_products()
    df = pd.DataFrame(products)
    df["text"] = df["title"] + " " + df["description"] + " " + (df["category"] + " ") * 5
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(df["text"])

    if product_id not in df["id"].values:
        return jsonify({"error": "Product not found"}), 404

    idx = df.index[df["id"] == product_id][0]
    similarity = cosine_similarity(tfidf[idx:idx+1], tfidf).flatten()
    df["similarity"] = similarity

    recommended = df.sort_values(by="similarity", ascending=False).iloc[1:6]
    popular = df.sort_values(by="rating_count", ascending=False).head(5)

    return jsonify({
        "you_may_like": recommended.to_dict(orient="records"),
        "popular": popular.to_dict(orient="records")
    })

# ----------------------------
# Search API
# ----------------------------
@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get("q", "").strip().lower()
    df = pd.DataFrame(load_products())

    category_match = df[df["category"].str.lower().str.contains(query)]
    df_filtered = category_match if not category_match.empty else df

    df_filtered["text"] = df_filtered["title"] + " " + df_filtered["description"]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(df_filtered["text"])
    query_vec = vectorizer.transform([query])

    similarity = cosine_similarity(query_vec, tfidf).flatten()
    df_filtered["boost"] = df_filtered["title"].str.lower().str.contains(query).astype(int) * 2
    similarity += df_filtered["boost"].values

    top_indices = similarity.argsort()[::-1][:5]
    results = df_filtered.iloc[top_indices].to_dict(orient="records")
    return jsonify(results)

# ----------------------------
# Root Route
# ----------------------------
@app.route('/')
def home():
    return "Flask backend running. APIs: /api/register /api/login /api/admin/login /api/users /api/admins /api/products"

# ----------------------------
# Run Server
# ----------------------------
if __name__ == '__main__':
    app.run(debug=True)
