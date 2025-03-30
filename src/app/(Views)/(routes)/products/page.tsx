"use client";
import { Product } from "../../../types/interfaces";
import { useFetch } from "../../../../app/hooks/useFetch";
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
  FilePlus,
  Package,
  DollarSign,
  Truck,
  Store,
  BarChart,
  MoreVertical,
  FilePenLine,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Pagination } from "../../../components/Pagination";
import { useState, useEffect } from "react";
import ProductFormModal from "../../../components/ProductFormModal";
import ProductEditFormModal from "../../../components/EditProductModal";
import { SpreadsheetUpload } from "../../../components/BulkProductsModal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../../../../components/ui/dropdown-menu";
import Image from "next/image";

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
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
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

  const handleBulkUpload = async (products: Product[]) => {
    const formData = new FormData();
    const file = products[0].image as File;
    formData.append("file", file);

    const response = await fetch("/api/products/bulk", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setPage(1);
    }
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
                <DropdownMenuLabel>New Product</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer"
                  >
                    <Plus />
                    Manually
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setIsBulkModalOpen(true)}
                  >
                    <FilePlus /> From a file
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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

      {editingProduct && (
        <ProductEditFormModal
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={async (updatedProduct) => {
            await handleUpdate(updatedProduct);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Bulk Products Modal */}
      <SpreadsheetUpload
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUploadSuccess={handleBulkUpload}
      />

      {/* Product List */}
      {viewMode === "table" ? (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-800 text-left">
              {/* <th className="p-2">ID</th> */}
              <th className="p-2">#</th>
              <th className="p-2">Image</th>
              <th className="p-2 flex items-center cursor-pointer">
                Name
                <ArrowDownAZ className="ml-2" />
              </th>
              <th className="p-2 w-auto">Description</th>
              <th className="p-2">Category</th>
              <th className="p-2 flex items-center cursor-pointer">
                Price
                <ArrowDown01 className="ml-2" />
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
                {/* <td className="p-2">{product.id}</td> */}
                <td className="p-2">{product.productCode}</td>
                <td className="p-2">
                  <Image
                    src={product.productImage || "/placeholder.png"}
                    width={50}
                    height={50}
                    alt={`${product.name}`}
                  />
                </td>
                <td className=" p-2">{product.name}</td>
                <td className=" p-2">{product.description}</td>
                <td className="p-2">{product.category}</td>
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
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setEditingProduct(product)}
                      >
                        <FilePenLine />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
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
            <Card
              className="w-full dark:bg-slate-800 max-w-sm items-stretch"
              key={product.id}
            >
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4 overflow-hidden">
                  <Image
                    src={product.productImage || "/placeholder.png"}
                    width={1000}
                    height={1000}
                    alt={`${product.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex justify-between items-start">
                  <span>{product.name}</span>
                  <Badge variant="secondary">{product.category}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <MoreVertical />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col dark:bg-slate-800">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setEditingProduct(product)}
                      >
                        <FilePenLine />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Price: ${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Cost: ${product.costPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Taxes: ${product.taxes}</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>Provider: {product.Provider?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Store className="w-4 h-4 mr-2" />
                    <span>Store: {product.Store?.name || "Unknown Store"}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    <span>Stock: {product.quantity}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {/* ID: {product.id} */}
                    ID: {product.productCode}
                  </span>
                  <Badge variant="outline" className="flex items-center">
                    <BarChart className="w-4 h-4 mr-1" />
                    Profit: ${(product.price - product.costPrice).toFixed(2)}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
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
