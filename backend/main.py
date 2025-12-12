
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import csv
import pandas as pd
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import re

# Import database helper functions
from database import (
    create_users_table, add_user, verify_user, get_user_by_id, update_user_credentials,
    create_admins_table, add_admin, verify_admin, get_all_users, get_all_admins,
    create_cart_table, add_to_cart, get_cart_items, remove_from_cart, clear_cart,
    create_orders_table, create_order, get_all_orders, update_order_status, get_user_orders,
    create_payments_table, add_payment
)

app = Flask(__name__)
CORS(app)

#  DATABASE SETUP 
create_admins_table()
create_cart_table()
create_orders_table()
create_payments_table()

# Create default admin once
add_admin("admin", "admin123")

# FILE PATHS 
CSV_FILE = os.path.join(os.path.dirname(__file__), "fakestore_products.csv")
PRODUCTS_FILE = os.path.join("Files", "products_df.pkl")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("Files", exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#  PRODUCTS 
def load_products():
    if os.path.exists(PRODUCTS_FILE):
        return pd.read_pickle(PRODUCTS_FILE).to_dict(orient='records')

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
        pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
        return products
    except Exception as e:
        print("CSV Load Error:", e)
        return []

#  STATIC FILES 
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#  USER AUTH 
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return jsonify({"success": False, "message": "Invalid email format"}), 400
    if add_user(email, password):
        return jsonify({"success": True, "message": "Registered successfully"})
    else:
        return jsonify({"success": False, "message": "Email already exists"}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = verify_user(email, password)
    if user:
        return jsonify({"success": True, "user": {"id": user[0], "username": user[1]}})
    return jsonify({"success": False, "message": "Invalid email or password"}), 401

@app.route('/api/user/update', methods=['PUT'])
def update_user():
    data = request.get_json()
    user_id = data.get("id")
    email = data.get("email")
    password = data.get("password")
    if not user_id or not email or not password:
        return jsonify({"success": False, "message": "All fields required"}), 400
    current_user = get_user_by_id(user_id)
    if current_user:
        is_same_email = (current_user['email'] == email)
        is_same_password = check_password_hash(current_user['password'], password)
        if is_same_email and is_same_password:
            return jsonify({"success": False, "message": "New email and password cannot be same as current"}), 400
    if update_user_credentials(user_id, email, password):
        return jsonify({"success": True, "message": "Profile updated successfully"})
    return jsonify({"success": False, "message": "Email already in use"}), 400

#  ADMIN AUTH 
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    admin = verify_admin(username, password)
    if admin:
        return jsonify({"success": True, "admin": {"id": admin[0], "username": admin[1]}})
    return jsonify({"success": False, "message": "Invalid admin credentials"}), 401

@app.route('/api/users', methods=['GET'])
def users_list():
    return jsonify(get_all_users())

@app.route('/api/admins', methods=['GET'])
def admins_list():
    return jsonify(get_all_admins())

#  PRODUCTS CRUD 
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
    # Handle multipart/form-data
    image_url = ""
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            filename = secure_filename(file.filename)
            unique_filename = f"{int(pd.Timestamp.now().timestamp())}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            image_url = request.host_url + "uploads/" + unique_filename

    data = request.get_json() if request.is_json else request.form
    products = load_products()
    new_id = max([p['id'] for p in products], default=0) + 1
    new_product = {
        "id": new_id,
        "title": data.get('title'),
        "price": float(data.get('price', 0)),
        "description": data.get('description', ""),
        "image": image_url,
        "category": data.get('category', ""),
        "rating_count": 0
    }
    products.append(new_product)
    pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
    return jsonify({"success": True, "message": "Product added", "product": new_product})

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
            p['title'] = data.get('title', p['title'])
            p['price'] = float(data.get('price', p['price']))
            p['description'] = data.get('description', p['description'])
            break
    pd.DataFrame(products).to_pickle(PRODUCTS_FILE)
    return jsonify({"success": True, "message": "Product updated"})

#  RECOMMENDATIONS 
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
    return jsonify({"you_may_like": recommended.to_dict(orient="records"),
                    "popular": popular.to_dict(orient="records")})

# SEARCH
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
    results = df_filtered.iloc[top_indices].to_dict(orient='records')
    return jsonify(results)

# CART 
@app.route('/api/cart/add', methods=['POST'])
def add_cart_item():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    if not user_id or not product_id:
        return jsonify({"success": False, "message": "User ID and Product ID required"}), 400
    add_to_cart(user_id, product_id, quantity)
    return jsonify({"success": True, "message": "Item added to cart"})

@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    items = get_cart_items(user_id)
    products = load_products()
    cart_details = []
    for item in items:
        product = next((p for p in products if p['id'] == item['product_id']), None)
        if product:
            cart_details.append({**product, "quantity": item['quantity']})
    return jsonify(cart_details)

@app.route('/api/cart/remove', methods=['POST'])
def remove_cart_item():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    remove_from_cart(user_id, product_id)
    return jsonify({"success": True, "message": "Item removed"})

@app.route('/api/cart/clear/<int:user_id>', methods=['DELETE'])
def clear_user_cart(user_id):
    clear_cart(user_id)
    return jsonify({"success": True, "message": "Cart cleared"})

# PAYMENTS 
@app.route('/api/payments', methods=['POST'])
def save_payment():
    """
    Save payment info from Khalti frontend
    Expected JSON: {transaction_id, pid, amount, status, user_id}
    """
    data = request.get_json()
    transaction_id = data.get("transaction_id")
    pid = data.get("pid")
    amount = data.get("amount")
    status = data.get("status")
    user_id = data.get("user_id")

    if not all([transaction_id, pid, amount, status, user_id]):
        return jsonify({"success": False, "message": "Missing payment data"}), 400

    payment_id = add_payment(transaction_id, pid, amount, status, user_id)
    if payment_id:
        return jsonify({"success": True, "payment_id": payment_id}), 201
    else:
        return jsonify({"success": False, "message": "Failed to save payment"}), 500


#  PLACE ORDER WITH PAYMENT 
@app.route('/api/orders/place_with_payment', methods=['POST'])
def place_order_with_payment():
    """
    Place an order after successful payment
    Expected JSON: {user_id, items: [{id, quantity, price}], total_price, payment_id}
    """
    data = request.get_json()
    user_id = data.get("user_id")
    items = data.get("items")
    total_price = data.get("total_price")
    payment_id = data.get("payment_id")

    if not user_id or not items or not total_price or not payment_id:
        return jsonify({"success": False, "message": "Invalid order data"}), 400

    order_id = create_order(user_id, total_price, items, payment_id)
    if order_id:
        clear_cart(user_id)  # Clear cart after order
        return jsonify({"success": True, "order_id": order_id}), 201

    return jsonify({"success": False, "message": "Failed to place order"}), 500


#  GET ALL ORDERS (ADMIN) 
@app.route('/api/admin/orders', methods=['GET'])
def get_admin_orders():
    """
    Admin route to fetch all orders with items + payment info
    """
    orders = get_all_orders()
    products = load_products()
    # Add product title & image for each item
    for order in orders:
        for item in order['items']:
            product = next((p for p in products if p['id'] == item['product_id']), None)
            if product:
                item['title'] = product['title']
                item['image'] = product['image']
    return jsonify(orders)


#  GET USER ORDERS 
@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_order_history(user_id):
    """
    Get orders for a specific user with product info
    """
    orders = get_user_orders(user_id)
    products = load_products()
    for order in orders:
        for item in order['items']:
            product = next((p for p in products if p['id'] == item['product_id']), None)
            if product:
                item['title'] = product['title']
                item['image'] = product['image']
    return jsonify(orders)


@app.route('/')
def home():
    return "Flask backend running. APIs: /api/register /api/login /api/admin/login /api/users /api/admins /api/products"

if __name__ == '__main__':
    app.run(debug=True)
