"use client";
import React, { useEffect, useState } from "react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    price: number;
    quantity: number;
    providerId: string;
    storeId: string;
  }) => void;
}
interface Provider {
  id: string;
  name: string;
}

interface Store {
  id: string;
  name: string;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 0,
    providerId: "",
    storeId: "",
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

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

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ name: "", price: 0, quantity: 0, providerId: "", storeId: "" }); // Limpiar formulario
    onClose(); // Cerrar modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-md w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create Product</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className=" p-2 w-full mb-2 dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) })
            }
            className=" p-2 w-full mb-2 dark:bg-slate-800"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) })
            }
            className=" p-2 w-full mb-2 dark:bg-slate-800"
          />
          <select
            value={form.providerId}
            onChange={(e) => setForm({ ...form, providerId: e.target.value })}
            className="p-2 w-full mb-2 dark:bg-slate-800"
          >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          <select
            value={form.storeId}
            onChange={(e) => setForm({ ...form, storeId: e.target.value })}
            className="p-2 w-full mb-2 dark:bg-slate-800"
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
