"use client";

import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { Client } from "@/app/types/interfaces";

const ClientsPage = () => {
  const {
    data: clients,
    loading,
    error,
  } = useFetch<Client[]>("/api/customers");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Client | null>(null);

  const handleSave = async () => {
    const method = formData?.id ? "PUT" : "POST";
    const res = await fetch("/api/customers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData(null);
      setIsFormOpen(false);
      location.reload(); // Recarga para obtener los datos actualizados
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      location.reload(); // Recarga para obtener los datos actualizados
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <button
        onClick={() => {
          setFormData(null);
          setIsFormOpen(true);
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Add Client
      </button>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Phone</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients?.map((client) => (
            <tr key={client.id}>
              <td className="border border-gray-400 p-2">{client.name}</td>
              <td className="border border-gray-400 p-2">
                {client.email || "-"}
              </td>
              <td className="border border-gray-400 p-2">
                {client.phone || "-"}
              </td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => {
                    setFormData(client);
                    setIsFormOpen(true);
                  }}
                  className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Client Form */}
      {isFormOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {formData?.id ? "Edit Client" : "Add Client"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, name: e.target.value }))
              }
              className="w-full mb-2 p-2 border border-gray-400 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData?.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, email: e.target.value }))
              }
              className="w-full mb-2 p-2 border border-gray-400 rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData?.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev!, phone: e.target.value }))
              }
              className="w-full mb-2 p-2 border border-gray-400 rounded"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsFormOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
