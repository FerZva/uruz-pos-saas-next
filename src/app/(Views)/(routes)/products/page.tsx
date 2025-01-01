"use client";
import { Product } from "@/app/types/interfaces";
import { useFetch } from "@/app/hooks/useFetch";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Ellipsis,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDown01,
  ArrowDown10,
} from "lucide-react";
import { Pagination } from "@/app/components/Pagination";
import { useState, useEffect } from "react";
import ProductFormModal from "@/app/components/ProductFormModal";
import ProductEditFormModal from "@/app/components/EditProductModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10; // Número de productos por página
  const { data, loading, error } = useFetch<{
    products: Product[];
    total: number;
    page: number;
    pages: number;
  }>(`/api/products?page=${page}&limit=${limit}`);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { products, total, pages } = data || {};

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button onClick={() => setIsModalOpen(true)}>
                  <Plus />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col dark:bg-slate-800">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-2 dark:text-white p-1 mr-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 w-full"
                >
                  New product Manually
                </button>
                <button className="px-2 dark:text-white p-1 mr-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 w-full">
                  new product from a file
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <th className="p-2">Image</th>
              <th className="p-2 flex items-center cursor-pointer">
                Name <ArrowDownAZ className="ml-2" />
              </th>
              <th className="p-2">Description</th>
              <th className="p-2 flex items-center cursor-pointer">
                Price <ArrowDown01 className="ml-2" />
              </th>
              <th className="p-2">Cost Price</th>
              <th className="p-2">Taxes</th>
              <th className="p-2 flex items-center cursor-pointer">
                Provider
                <ArrowDownAZ className="ml-2" />
              </th>
              <th className="p-2">Store</th>
              <th className="p-2 flex items-center cursor-pointer">
                Stock
                <ArrowDown01 className="ml-2" />
              </th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <td className="p-2">{product.productImage}</td>
                <td className=" p-2">{product.name}</td>
                <td className=" p-2">{product.description}</td>
                <td className=" p-2">${product.price}</td>
                <td className=" p-2">${product.costPrice}</td>
                <td className=" p-2">${product.taxes}</td>
                <td className=" p-2">{product.Provider?.name || "N/A"}</td>
                <td className=" p-2">
                  {product.Store?.name || "Unknown Store"}
                </td>
                <td className=" p-2">{product.quantity}</td>
                <td className=" p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center">
                        <Ellipsis />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col dark:bg-slate-800">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-2 dark:text-white p-1 mr-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 w-full"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2 dark:text-white p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 w-full"
                      >
                        Delete
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              className="border p-4 flex flex-col items-start rounded bg-slate-200 dark:bg-slate-800"
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

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={pages || 1}
        onPageChange={(newPage: number) => setPage(newPage)}
      />
    </div>
  );
};

export default ProductsPage;
