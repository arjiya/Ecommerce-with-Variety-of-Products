import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [productForm, setProductForm] = useState({
    id: "",
    title: "",
    price: "",
    description: ""
  });

  // ---------------- LOAD USERS ----------------
  const loadUsers = () => {
    fetch("http://127.0.0.1:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error loading users:", err));
  };

  // ---------------- LOAD PRODUCTS ----------------
  const loadProducts = () => {
    fetch("http://127.0.0.1:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  };

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

  // ---------------- ADD PRODUCT ----------------
  const addProduct = async () => {
    if (!productForm.title || !productForm.price) {
      alert("Title and Price are required");
      return;
    }

    await fetch("http://127.0.0.1:5000/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productForm),
    });

    alert("Product Added");
    setProductForm({ id: "", title: "", price: "", description: "" });
    loadProducts();
  };

  // ---------------- DELETE PRODUCT ----------------
  const deleteProduct = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/products/delete/${id}`, {
      method: "DELETE",
    });

    alert("Product Deleted");
    loadProducts();
  };

  // ---------------- EDIT PRODUCT ----------------
  const editProduct = (p) => {
    setEditMode(true);
    setProductForm({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description
    });
  };

  // ---------------- UPDATE PRODUCT ----------------
  const updateProduct = async () => {
    if (!productForm.title || !productForm.price) {
      alert("Title and Price are required");
      return;
    }

    await fetch(`http://127.0.0.1:5000/api/products/update/${productForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productForm),
    });

    alert("Product Updated");
    setEditMode(false);
    setProductForm({ id: "", title: "", price: "", description: "" });
    loadProducts();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">ADMIN DASHBOARD</h1>

      {/* ---------------- USERS TABLE ---------------- */}
      <div className="section">
        <h2>Users List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      {/* ---------------- PRODUCT FORM ---------------- */}
      <div className="section">
        <h2>{editMode ? "Edit Product" : "Add Product"}</h2>

        <input
          type="text"
          placeholder="Title"
          value={productForm.title}
          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          value={productForm.price}
          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
        ></textarea>

        {editMode ? (
          <button className="edit-btn" onClick={updateProduct}>Update Product</button>
        ) : (
          <button className="add-btn" onClick={addProduct}>Add Product</button>
        )}
      </div>

      <hr />

      {/* ---------------- PRODUCTS TABLE ---------------- */}
      <div className="section">
        <h2>Products List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.description}</td>
                <td>
                  <button onClick={() => editProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;
