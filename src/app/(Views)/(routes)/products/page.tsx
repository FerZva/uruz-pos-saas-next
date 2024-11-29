"use client";
import { Product } from "@/app/types/interfaces";
import { useFetch } from "@/app/hooks/useFetch";
import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import ProductFormModal from "@/app/components/ProductFormModal";
import ProductEditFormModal from "@/app/components/EditProductModal";

const ProductsPage = () => {
  const {
    data: products,
    loading,
    error,
  } = useFetch<Product[]>("/api/products");

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  const handleSearch = (query: string) => {
    setSearch(query);
    if (products) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    const sorted = [...filteredProducts].sort((a, b) => {
      if (option === "alphabetical") return a.name.localeCompare(b.name);
      if (option === "price") return a.price - b.price;
      if (option === "stock") return a.quantity - b.quantity;
      if (option === "provider")
        return (a.Provider?.name || "").localeCompare(b.Provider?.name || "");
      return 0;
    });
    setFilteredProducts(sorted);
  };

  const handleCreate = async (formData: {
    name: string;
    price: number;
    quantity: number;
    providerId: string;
    storeId: string;
  }) => {
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  };

  const handleUpdate = async (updatedProduct: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    providerId?: string;
  }) => {
    if (!updatedProduct || !updatedProduct.id) {
      console.error("Invalid product data", updatedProduct);
      return;
    }

    await fetch("/api/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error loading products: {error}</div>;
  }

  return (
    <div className="px-8 p-1">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex items-center w-auto">
          <Search className="mr-2" />
          <input
            type="text"
            placeholder="Search products by name or keyboard..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-2 min-w-[300px] w-auto border-none outline-none dark:bg-slate-900"
          />
        </div>
        <div className="flex items-center">
          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            className=" py-2 mr-2 w-auto outline-none dark:bg-slate-900 text-center hover:cursor-pointer"
          >
            <option value="">Filters</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="provider">Provider</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${
                viewMode === "table"
                  ? "bg-slate-200 rounded-md text-black dark:dark:bg-slate-800 dark:text-white"
                  : ""
              }`}
            >
              <List />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-slate-200 rounded-md text-black dark:dark:bg-slate-800 dark:text-white"
                  : ""
              }`}
            >
              <LayoutGrid />
            </button>
            <button onClick={() => setIsModalOpen(true)}>
              <Plus />
            </button>
          </div>
        </div>
      </div>

      {/* Create Product */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />

      <ProductEditFormModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={async (updatedProduct) => {
          await handleUpdate(updatedProduct);
          setEditingProduct(null);
        }}
      />

      {/* Product List */}
      {viewMode === "table" ? (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-800 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Store</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <td className=" p-2">{product.name}</td>
                <td className=" p-2">${product.price}</td>
                <td className=" p-2">{product.quantity}</td>
                <td className=" p-2">{product.Provider?.name || "N/A"}</td>
                <td className=" p-2">
                  {product.Store?.name || "Unknown Store"}
                </td>
                <td className=" p-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-blue-500 rounded-md px-2 text-white p-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 rounded-md px-2 text-white p-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 flex flex-col items-start bg-slate-200 dark:bg-slate-800"
            >
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Provider: {product.Provider?.name || "N/A"}</p>
              <p>Store: {product.Store?.name || "Unknown Store"}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-blue-500 rounded-md px-2 text-white p-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 rounded-md px-2 text-white p-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
