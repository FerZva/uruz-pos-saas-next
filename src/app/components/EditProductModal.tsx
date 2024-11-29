"use client";
import React, { useEffect, useState } from "react";

interface EditProductModalProps {
  isOpen: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    providerId?: string;
    storeId?: string;
  } | null;
  onClose: () => void;
  onSubmit: (formData: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    providerId?: string;
    storeId?: string;
  }) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: 0,
    quantity: 0,
    providerId: "",
    storeId: "",
  });

  const [providers, setProviders] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await fetch("/api/providers");
      const data = await response.json();
      setProviders(data);
    };

    const fetchStores = async () => {
      const response = await fetch("/api/stores");
      const data = await response.json();
      setStores(data);
    };

    fetchProviders();
    fetchStores();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        providerId: product.providerId || "",
        storeId: product.storeId || "",
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || form.price <= 0 || form.quantity < 0) {
      console.error("Invalid form data", form);
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Provider</label>
            <select
              name="providerId"
              value={form.providerId}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800"
            >
              <option value="">Select Provider</option>
              {providers.map((provider: any) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Store</label>
            <select
              name="storeId"
              value={form.storeId}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800"
            >
              <option value="">Select Store</option>
              {stores.map((store: any) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
