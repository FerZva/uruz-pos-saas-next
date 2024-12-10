"use client";
import { Product, Client } from "@/app/types/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const StoreProductsPage = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{
    [key: string]: { product: Product; quantity: number };
  }>({});
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [printFormat, setPrintFormat] = useState<"thermal" | "letter">(
    "thermal"
  );

  const fetchProducts = async () => {
    const res = await fetch(`/api/storeProducts?storeId=${storeId}`);
    const data = await res.json();
    setProducts(data);
    setFilteredProducts(data);
  };

  const fetchClients = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setClients(data);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const currentProduct = prevCart[product.id];
      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: currentProduct ? currentProduct.quantity + 1 : 1,
        },
      };
    });
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCart((prevCart) => {
      const currentProduct = prevCart[productId];
      if (!currentProduct) return prevCart;

      const newQuantity = currentProduct.quantity + change;

      if (newQuantity <= 0) {
        const updatedCart = { ...prevCart };
        delete updatedCart[productId];
        return updatedCart;
      }

      return {
        ...prevCart,
        [productId]: {
          ...currentProduct,
          quantity: newQuantity,
        },
      };
    });
  };

  const calculateTotal = () => {
    return Object.values(cart).reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    );
  };

  const handleRegisterSale = async () => {
    if (!selectedClient) {
      alert("Please select a client before registering the sale.");
      return;
    }

    const saleDetails = {
      clientId: selectedClient,
      storeId,
      totalAmount: calculateTotal(),
      products: Object.values(cart).map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    };

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        body: JSON.stringify(saleDetails),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Sale registered successfully!");

        // Generate PDF invoice
        const pdfBytes = await generateReceiptPDF();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "invoice.pdf");
        setCart({});
        fetchProducts(); // Refresh product stock
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to register sale:", error);
      alert("Failed to register sale.");
    }
  };

  const generateReceiptPDF = async () => {
    const client = clients.find((c) => c.id === selectedClient);
    const pdfDoc = await PDFDocument.create();
    const page =
      printFormat === "thermal"
        ? pdfDoc.addPage([227.7, 315]) // Thermal format
        : pdfDoc.addPage([612, 792]); // Letter format

    const { height } = page.getSize();

    page.drawText("Invoice", {
      x: 20,
      y: height - 30,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Client: ${client?.name || "Unknown"}`, {
      x: 20,
      y: height - 50,
      size: 12,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 100;
    Object.values(cart).forEach(({ product, quantity }) => {
      page.drawText(
        `${product.name} - $${product.price} x ${quantity} = $${(
          product.price * quantity
        ).toFixed(2)}`,
        { x: 20, y: yPosition, size: 10, color: rgb(0, 0, 0) }
      );
      yPosition -= 20;
    });

    page.drawText(`Total: $${calculateTotal().toFixed(2)}`, {
      x: 20,
      y: yPosition - 20,
      size: 14,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

  const handlePreviewReceipt = async () => {
    if (!selectedClient) {
      alert("Please select a client before previewing the receipt.");
      return;
    }

    try {
      const pdfBytes = await generateReceiptPDF();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, [storeId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products for Store {storeId}</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Print Format:</label>
        <select
          value={printFormat}
          onChange={(e) =>
            setPrintFormat(e.target.value as "thermal" | "letter")
          }
          className="p-2 border rounded shadow-md"
        >
          <option value="thermal">Thermal (80x70mm)</option>
          <option value="letter">Letter (8.5x11 inches)</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border rounded shadow-md"
        />
      </div>

      {/* Client Dropdown */}
      <div className="mb-6">
        <label htmlFor="clientDropdown" className="block mb-2 font-semibold">
          Select a Client:
        </label>
        <select
          id="clientDropdown"
          value={selectedClient || ""}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border rounded shadow-md"
        >
          <option value="" disabled>
            Choose a client...
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.email ? `(${client.email})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 bg-slate-200 dark:bg-slate-800"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-500 text-white p-2 mt-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="border p-4 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {Object.values(cart).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-800">
                  <th className="p-2">Product</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Subtotal</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(cart).map(({ product, quantity }) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">${product.price}</td>
                    <td className="p-2">{quantity}</td>
                    <td className="p-2">${product.price * quantity}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, -1)}
                        className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(product.id, 1)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Register Sale Button */}
      <button
        onClick={handlePreviewReceipt}
        className="bg-gray-500 text-white p-4 rounded"
        disabled={Object.keys(cart).length === 0 || !selectedClient}
      >
        Preview Receipt
      </button>
      <button
        onClick={handleRegisterSale}
        className="bg-blue-500 text-white p-4 mt-6 rounded"
        disabled={Object.keys(cart).length === 0 || !selectedClient}
      >
        Register Sale
      </button>
    </div>
  );
};

export default StoreProductsPage;
