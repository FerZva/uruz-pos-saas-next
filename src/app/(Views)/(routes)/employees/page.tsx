"use client";
import { useFetch } from "@/app/hooks/useFetch";
import { Employee } from "@/app/types/interfaces";
import { useState } from "react";

export default function EmployeesPage() {
  const {
    data: employees,
    loading,
    error,
  } = useFetch<Employee[]>("/api/employees?storeId=<STORE_ID>");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    salary: 0,
    schedule: "",
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleCreate = async () => {
    await fetch("/api/employees", {
      method: "POST",
      body: JSON.stringify({ ...form, storeId: "<STORE_ID>" }),
    });
    window.location.reload(); // Recargar para actualizar la lista
    setForm({ name: "", email: "", role: "", salary: 0, schedule: "" });
  };

  const handleUpdate = async () => {
    if (!editingEmployee) return;

    await fetch("/api/employees", {
      method: "PATCH",
      body: JSON.stringify({ id: editingEmployee.id, ...form }),
    });
    window.location.reload(); // Recargar para actualizar la lista
    setForm({ name: "", email: "", role: "", salary: 0, schedule: "" });
    setEditingEmployee(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    window.location.reload(); // Recargar para actualizar la lista
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

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
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Schedule"
          value={form.schedule}
          onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          className="border p-2 mr-2"
        />
        {editingEmployee ? (
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

      {/* Employee List */}
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Role</th>
            <th className="border border-gray-400 p-2">Salary</th>
            <th className="border border-gray-400 p-2">Schedule</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee.id}>
              <td className="border border-gray-400 p-2">{employee.name}</td>
              <td className="border border-gray-400 p-2">{employee.email}</td>
              <td className="border border-gray-400 p-2">{employee.role}</td>
              <td className="border border-gray-400 p-2">{employee.salary}</td>
              <td className="border border-gray-400 p-2">
                {employee.schedule}
              </td>
              <td className="border border-gray-400 p-2">
                <button
                  onClick={() => setEditingEmployee(employee)}
                  className="bg-yellow-500 text-white p-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
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
}
