"use client";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    productImage: string | null;
    name: string;
    description: string;
    category: string;
    price: number;
    costPrice: number;
    taxes: number;
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
    productImage: null as File | null,
    name: "",
    description: "",
    category: "",
    price: 0,
    costPrice: 0,
    taxes: 0,
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

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setForm({ ...form, productImage: acceptedFiles[0] });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    let productImageUrl = "";

    if (form.productImage) {
      const formData = new FormData();
      formData.append("file", form.productImage);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      productImageUrl = data.url;
    }

    onSubmit({ ...form, productImage: productImageUrl });
    setForm({
      productImage: null,
      name: "",
      description: "",
      category: "",
      price: 0,
      costPrice: 0,
      taxes: 0,
      quantity: 0,
      providerId: "",
      storeId: "",
    }); // Limpiar formulario
    onClose(); // Cerrar modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-600 p-6 rounded-md w-auto">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold ">Add New Product</h2>
            <p className="text-gray-500 text-sm mb-4 font-bold">
              Enter the details o the new product here. Click save when
              you&#39;re done.
            </p>
          </div>
          <div>
            <button onClick={onClose}>
              <X size={20} className="text-black dark:text-white" />
            </button>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          {/* Photo container */}
          <div className="p-2">
            <label htmlFor="file" className="block mb-2">
              Product Image
            </label>
            <div
              {...getRootProps()}
              className={`flex flex-col gap-4 p-2 rounded-md text-center border-4 border-dashed min-h-40 ${
                isDragActive
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              } cursor-pointer`}
            >
              <input {...getInputProps()} />
              {form.productImage ? (
                <p className="text-green-500">{form.productImage.name}</p>
              ) : isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag & drop an image here, or click to select one</p>
              )}
            </div>
            {form.productImage && (
              <div className="mt-4">
                <p className="text-sm font-bold mb-2">Preview:</p>
                <img
                  src={URL.createObjectURL(form.productImage)}
                  alt="Preview"
                  className="max-w-full h-auto rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>
          {/* Product details container */}
          <div className="w-full max-w-[90%]">
            <div className="flex flex-col gap-4 p-2 rounded-md mb-4 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Product description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 p-2 rounded-md mb-4 w-full">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: parseFloat(e.target.value) })
                    }
                    className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="costPrice" className="block mb-2">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    placeholder="Cost Price"
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        costPrice: parseFloat(e.target.value),
                      })
                    }
                    className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="taxes" className="block mb-2">
                    Taxes
                  </label>
                  <input
                    type="number"
                    placeholder="Taxes"
                    value={form.taxes}
                    onChange={(e) =>
                      setForm({ ...form, taxes: parseFloat(e.target.value) })
                    }
                    className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-2 mb-4 w-full">
              <div>
                <label className="block mb-2">Provider</label>
                <select
                  value={form.providerId}
                  onChange={(e) =>
                    setForm({ ...form, providerId: e.target.value })
                  }
                  className="p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Store</label>
                <select
                  value={form.storeId}
                  onChange={(e) =>
                    setForm({ ...form, storeId: e.target.value })
                  }
                  className="p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                >
                  <option value="">Select Store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: parseInt(e.target.value) })
                  }
                  className=" p-2 w-full mb-2 dark:bg-slate-800 rounded-md border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button
            onClick={handleSubmit}
            className="bg-slate-950 dark:bg-white text-white dark:text-black px-4 py-2 rounded-md"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
