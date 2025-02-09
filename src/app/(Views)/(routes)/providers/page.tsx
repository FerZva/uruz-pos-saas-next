"use client";
import { useFetch } from "../../../hooks/useFetch";
import { Provider } from "../../../types/interfaces";
import { useState } from "react";

const ProvidersPage = () => {
  const {
    data: providers,
    loading,
    error,
  } = useFetch<Provider[]>("/api/providers");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const handleCreate = async () => {
    await fetch("/api/providers", {
      method: "POST",
      body: JSON.stringify(form),
    });
    window.location.reload();
    setForm({ name: "", email: "", phone: "", address: "" });
  };

  const handleUpdate = async () => {
    if (!editingProvider) return;

    await fetch("/api/providers", {
      method: "PATCH",
      body: JSON.stringify({ id: editingProvider.id, ...form }),
    });
    window.location.reload();
    setForm({ name: "", email: "", phone: "", address: "" });
    setEditingProvider(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/providers?id=${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Providers</h1>

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
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 mr-2"
        />
        {editingProvider ? (
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

      {/* Provider List */}
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Phone</th>
            <th className="border border-gray-400 p-2">Address</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers?.map((provider) => (
            <tr key={provider.id}>
              <td className="border border-gray-400 p-2">{provider.name}</td>
              <td className="border border-gray-400 p-2">{provider.email}</td>
              <td className="border border-gray-400 p-2">{provider.phone}</td>
              <td className="border border-gray-400 p-2">{provider.address}</td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => setEditingProvider(provider)}
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(provider.id)}
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

export default ProvidersPage;
