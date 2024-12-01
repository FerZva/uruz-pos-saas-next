"use client";
import { useFetch } from "@/app/hooks/useFetch";
import { Store } from "@/app/types/interfaces";
import { useState } from "react";
import { useRouter } from "next/navigation";

const POSPage = () => {
  const {
    data: stores,
    loading,
    error,
  } = useFetch<Store[]>("/api/stores?userId=<USER_ID>");

  const [form, setForm] = useState({ name: "" });
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    await fetch("/api/stores", {
      method: "POST",
      body: JSON.stringify({ ...form, userId: "<USER_ID>" }),
    });
    window.location.reload();
    setForm({ name: "" });
  };

  const handleUpdate = async () => {
    if (!editingStore) return;

    await fetch("/api/stores", {
      method: "PATCH",
      body: JSON.stringify({ id: editingStore.id, ...form }),
    });
    window.location.reload();
    setForm({ name: "" });
    setEditingStore(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/stores?id=${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>

      {/* Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
        />
        {/* <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border p-2 mr-2"
        /> */}
        {editingStore ? (
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

      {/* Store Cards */}
      <div className="w-full py-4 h-auto flex flex-wrap gap-x-10">
        {stores?.map((store) => (
          <div
            key={store.id}
            className="dark:bg-slate-800 px-2 py-4 hover:dark:bg-slate-700 cursor-pointer"
            onClick={() => router.push(`/pos/stores/${store.id}`)}
          >
            <h3>{store.name}</h3>
            <p>Status: Open</p>
            <p>Employees: 5</p>
            <p>Locations: New York 42 Stree, MH 56432</p>
            <div className="flex">
              <button
                onClick={() => setEditingStore(store)}
                className="bg-yellow-500 text-white p-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(store.id)}
                className="bg-red-500 text-white p-1"
              >
                Delete
              </button>
              <button className="bg-blue-500 text-white p-1 ml-2">
                Place sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default POSPage;
