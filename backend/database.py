
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash


DB_NAME = "shopnest_v2.db"

# --------------------
# USERS
# --------------------
def create_users_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def add_user(email, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(password)
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_user(email, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()
    if user and check_password_hash(user[2], password):
        return user
    return None

def get_all_users():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, email FROM users")
    users = [{"id": row[0], "username": row[1]} for row in cursor.fetchall()] # Keep key 'username' for frontend compatibility if needed, or change to email
    conn.close()
    return users

def update_user_credentials(user_id, new_email, new_password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(new_password)
        cursor.execute("UPDATE users SET email=?, password=? WHERE id=?", (new_email, hashed_pw, user_id))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user_by_id(user_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id=?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

# --------------------
# ADMINS
# --------------------
def create_admins_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def add_admin(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(password)
        cursor.execute("INSERT INTO admins (username, password) VALUES (?, ?)", (username, hashed_pw))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_admin(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM admins WHERE username=?", (username,))
    admin = cursor.fetchone()
    conn.close()
    if admin and check_password_hash(admin[2], password):
        return admin
    return None

def get_all_admins():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM admins")
    admins = [{"id": row[0], "username": row[1]} for row in cursor.fetchall()]
    conn.close()
    return admins

# --------------------
# CART
# --------------------
def create_cart_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    conn.close()

def add_to_cart(user_id, product_id, quantity=1):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Check if item exists
    cursor.execute("SELECT quantity FROM cart WHERE user_id=? AND product_id=?", (user_id, product_id))
    item = cursor.fetchone()
    
    if item:
        new_quantity = item[0] + quantity
        cursor.execute("UPDATE cart SET quantity=? WHERE user_id=? AND product_id=?", (new_quantity, user_id, product_id))
    else:
        cursor.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", (user_id, product_id, quantity))
    
    conn.commit()
    conn.close()

def get_cart_items(user_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cart WHERE user_id=?", (user_id,))
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return items

def remove_from_cart(user_id, product_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE user_id=? AND product_id=?", (user_id, product_id))
    conn.commit()
    conn.close()

def clear_cart(user_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cart WHERE user_id=?", (user_id,))
    conn.commit()
    conn.close()

# --------------------
# ORDERS
# --------------------
def create_orders_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'Pending',  -- Pending, Completed, Cancelled
            payment_id INTEGER,             -- FK to payments.id
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(payment_id) REFERENCES payments(id)
        )
    """)
    # Order items table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price_at_purchase REAL NOT NULL,
            FOREIGN KEY(order_id) REFERENCES orders(id)
        )
    """)
    conn.commit()
    conn.close()

def create_order(user_id, total_price, items, payment_id=None):
    """
    Create a new order and attach items.
    - items: list of {id, quantity, price}
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        # Insert into orders table
        cursor.execute("""
            INSERT INTO orders (user_id, total_price, payment_id) 
            VALUES (?, ?, ?)
        """, (user_id, total_price, payment_id))
        order_id = cursor.lastrowid

        # Insert each item
        for item in items:
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                VALUES (?, ?, ?, ?)
            """, (order_id, item['id'], item['quantity'], item['price']))

        conn.commit()
        return order_id
    except Exception as e:
        print("Order Error:", e)
        conn.rollback()
        return None
    finally:
        conn.close()

def get_all_orders():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Join with users & payments
    cursor.execute("""
        SELECT 
            o.id, o.total_price, o.status, o.created_at,
            u.username, u.id as user_id,
            p.transaction_id, p.pid, p.status as payment_status, p.amount
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN payments p ON o.payment_id = p.id
        ORDER BY o.created_at DESC
    """)
    orders = [dict(row) for row in cursor.fetchall()]

    for order in orders:
        cursor.execute("SELECT * FROM order_items WHERE order_id=?", (order['id'],))
        order['items'] = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return orders

def get_user_orders(user_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("""
        SELECT o.id, o.total_price, o.status, o.payment_id, o.created_at,
               p.transaction_id, p.pid, p.status as payment_status, p.amount
        FROM orders o
        LEFT JOIN payments p ON o.payment_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    """, (user_id,))

    orders = [dict(row) for row in cursor.fetchall()]

    for order in orders:
        cursor.execute("SELECT * FROM order_items WHERE order_id=?", (order['id'],))
        order['items'] = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return orders

def update_order_status(order_id, status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status=? WHERE id=?", (status, order_id))
    conn.commit()
    conn.close()


# --------------------
# PAYMENTS
# --------------------
def create_payments_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT NOT NULL,
            pid TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL,  -- paid, failed
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.commit()
    conn.close()

def add_payment(transaction_id, pid, amount, status, user_id):
    """
    Insert payment record and return payment_id
    """
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO payments (transaction_id, pid, amount, status, user_id)
            VALUES (?, ?, ?, ?, ?)
        """, (transaction_id, pid, amount, status, user_id))
        conn.commit()
        payment_id = cursor.lastrowid
        return payment_id
    except Exception as e:
        print("Payment DB Error:", e)
        return None
   

    finally:
        conn.close()