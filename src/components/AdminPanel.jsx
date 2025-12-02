import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "", image: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleAdd = () => {
    fetch("http://127.0.0.1:5000/api/admin/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(newProduct => {
        setProducts([...products, newProduct.product]);
        setForm({ title: "", description: "", price: "", category: "", image: "" });
      });
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:5000/api/admin/product/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setProducts(products.filter(p => p.id !== id));
      });
  };

  // Edit function can be similar: PUT request with updated data

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Add Product</h3>
      <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
      <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
      <input placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
      <button onClick={handleAdd}>Add Product</button>

      <h3>Existing Products</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.title} - ${p.price} 
            <button onClick={() => handleDelete(p.id)}>Delete</button>
            {/* Edit button can open a modal to edit product and send PUT */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
