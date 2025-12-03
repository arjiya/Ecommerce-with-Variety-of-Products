# # database.py
# import sqlite3

# DB_NAME = "shopnest.db"

# def create_users_table():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     """)
#     conn.commit()
#     conn.close()

# def add_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     try:
#         cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
#         conn.commit()
#         return True
#     except sqlite3.IntegrityError:
#         return False
#     finally:
#         conn.close()

# def verify_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
#     user = cursor.fetchone()
#     conn.close()
#     return user

# import sqlite3
# from werkzeug.security import generate_password_hash, check_password_hash

# DB_NAME = "shopnest.db"

# # -------------------- Users --------------------
# def create_users_table():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     """)
#     conn.commit()
#     conn.close()

# def add_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     try:
#         hashed_pw = generate_password_hash(password)
#         cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
#         conn.commit()
#         return True
#     except sqlite3.IntegrityError:
#         return False
#     finally:
#         conn.close()

# def verify_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM users WHERE username=?", (username,))
#     user = cursor.fetchone()
#     conn.close()
#     if user and check_password_hash(user[2], password):
#         return user
#     return None

# # -------------------- Admins --------------------
# def create_admins_table():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS admins (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     """)
#     conn.commit()
#     conn.close()

# def add_admin(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     try:
#         hashed_pw = generate_password_hash(password)
#         cursor.execute("INSERT INTO admins (username, password) VALUES (?, ?)", (username, hashed_pw))
#         conn.commit()
#         return True
#     except sqlite3.IntegrityError:
#         return False
#     finally:
#         conn.close()

# def verify_admin(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM admins WHERE username=?", (username,))
#     admin = cursor.fetchone()
#     conn.close()
#     if admin and check_password_hash(admin[2], password):
#         return admin
#     return None
# import sqlite3
# from werkzeug.security import generate_password_hash, check_password_hash

# DB_NAME = "shopnest.db"

# # -------------------- Users --------------------
# def create_users_table():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS users (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     """)
#     conn.commit()
#     conn.close()

# def add_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     try:
#         hashed_pw = generate_password_hash(password)
#         cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
#         conn.commit()
#         return True
#     except sqlite3.IntegrityError:
#         return False
#     finally:
#         conn.close()

# def get_all_users():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT id, username FROM users")
#     users = cursor.fetchall()
#     conn.close()
#     return [{"id": row[0], "username": row[1]} for row in users]

# def verify_user(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM users WHERE username=?", (username,))
#     user = cursor.fetchone()
#     conn.close()
#     if user and check_password_hash(user[2], password):
#         return user
#     return None

# # -------------------- Admins --------------------
# def create_admins_table():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS admins (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             username TEXT UNIQUE NOT NULL,
#             password TEXT NOT NULL
#         )
#     """)
#     conn.commit()
#     conn.close()

# def add_admin(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     try:
#         hashed_pw = generate_password_hash(password)
#         cursor.execute("INSERT INTO admins (username, password) VALUES (?, ?)", (username, hashed_pw))
#         conn.commit()
#         return True
#     except sqlite3.IntegrityError:
#         return False
#     finally:
#         conn.close()

# def get_all_admins():
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT id, username FROM admins")
#     admins = cursor.fetchall()
#     conn.close()
#     return [{"id": row[0], "username": row[1]} for row in admins]

# def verify_admin(username, password):
#     conn = sqlite3.connect(DB_NAME)
#     cursor = conn.cursor()
#     cursor.execute("SELECT * FROM admins WHERE username=?", (username,))
#     admin = cursor.fetchone()
#     conn.close()
#     if admin and check_password_hash(admin[2], password):
#         return admin
#     return None

import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

DB_NAME = "shopnest.db"

# --------------------
# USERS
# --------------------
def create_users_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def add_user(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        hashed_pw = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_user(username, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    conn.close()
    if user and check_password_hash(user[2], password):
        return user
    return None

def get_all_users():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users")
    users = [{"id": row[0], "username": row[1]} for row in cursor.fetchall()]
    conn.close()
    return users

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
