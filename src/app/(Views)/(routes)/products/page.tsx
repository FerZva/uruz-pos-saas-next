"use client";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  providerId?: string;
  Provider?: { name: string };
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 0,
    providerId: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products?storeId=<STORE_ID>");
    const data = await res.json();
    setProducts(data);
  };

  const handleCreate = async () => {
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...form, storeId: "<STORE_ID>" }),
    });
    fetchProducts();
    setForm({ name: "", price: 0, quantity: 0, providerId: "" });
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;

    await fetch("/api/products", {
      method: "PATCH",
      body: JSON.stringify({ id: editingProduct.id, ...form }),
    });
    fetchProducts();
    setForm({ name: "", price: 0, quantity: 0, providerId: "" });
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) })
          }
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: parseInt(e.target.value) })
          }
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Provider ID"
          value={form.providerId}
          onChange={(e) => setForm({ ...form, providerId: e.target.value })}
          className="border p-2 mr-2"
        />
        {editingProduct ? (
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2">
            Update
          </button>
        ) : (
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white p-2"
          >
            Create
          </button>
        )}
      </div>

      {/* Product List */}
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Price</th>
            <th className="border border-gray-400 p-2">Quantity</th>
            <th className="border border-gray-400 p-2">Provider</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-400 p-2">{product.name}</td>
              <td className="border border-gray-400 p-2">${product.price}</td>
              <td className="border border-gray-400 p-2">{product.quantity}</td>
              <td className="border border-gray-400 p-2">
                {product.Provider?.name || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
