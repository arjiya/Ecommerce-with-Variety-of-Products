import { useEffect, useState } from "react";
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

  const [orders, setOrders] = useState([]);

  const loadUsers = () => {
    fetch("http://127.0.0.1:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error loading users:", err));
  };

  const loadProducts = () => {
    fetch("http://127.0.0.1:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  };


  const loadOrders = () => {
    fetch("http://127.0.0.1:5000/api/admin/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error loading orders:", err));
  };

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadOrders();
  }, []);

  const addProduct = async () => {
    if (!productForm.title || !productForm.price) {
      alert("Title and Price are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", productForm.title);
    formData.append("price", productForm.price);
    formData.append("description", productForm.description);
    if (productForm.imageFile) {
      formData.append("image", productForm.imageFile);
    }

    await fetch("http://127.0.0.1:5000/api/products/add", {
      method: "POST",
      body: formData, 
    });

    alert("Product Added");
    setProductForm({ id: "", title: "", price: "", description: "", imageFile: null });
    loadProducts();
  };


  const deleteProduct = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/products/delete/${id}`, {
      method: "DELETE",
    });

    alert("Product Deleted");
    loadProducts();
  };


  const editProduct = (p) => {
    setEditMode(true);
    setProductForm({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description
    });
  };

 
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

  const updateOrderStatus = async (orderId, newStatus) => {
    await fetch(`http://127.0.0.1:5000/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    loadOrders();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">ADMIN DASHBOARD</h1>

      {/* ---------------- ORDERS TABLE ----------------
      <div className="section">
        <h2>User Orders</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.username} (ID: {order.user_id})</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: "15px" }}>
                    {order.items && order.items.map(item => (
                      <li key={item.id}>
                        Prod #{item.product_id} (x{item.quantity}) - ${item.price_at_purchase}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === "Pending" && (
                    <button onClick={() => updateOrderStatus(order.id, "Delivered")}>
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr /> */}

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

        <div className="file-input-group">
          <label>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProductForm({ ...productForm, imageFile: e.target.files[0] })}
          />
        </div>

        {editMode ? (
          <button className="edit-btn" onClick={updateProduct}>Update Product</button>
        ) : (
          <button className="add-btn" onClick={addProduct}>Add Product</button>
        )}
      </div>

      <hr />

      
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
