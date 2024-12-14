"use client";
import { Product, Client } from "@/app/types/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import Image from "next/image";

const StoreProductsPage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState<{ name: string; location: string } | null>(
    null
  );

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

        // Fetch store details
        const storeRes = await fetch(`/api/posStore?storeId=${storeId}`);
        const store = await storeRes.json();

        // Generate PDF invoice
        const pdfBytes = await generateReceiptPDF(
          printFormat,
          cart,
          store,
          calculateTotal()
        );
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, `invoice_${printFormat}.pdf`);
        setCart({});
        fetchProducts(); // Refresh product stock
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to register sale:", error);
    }
  };

  const generateReceiptPDF = async (
    printFormat: "thermal" | "letter",
    cart: any,
    store: any,
    totalAmount: number
  ) => {
    const pdfDoc = await PDFDocument.create();
    const pageWidth = printFormat === "thermal" ? 200 : 612; // Thermal: ~58mm, Letter: ~8.5in
    const pageHeight = printFormat === "thermal" ? 400 : 792; // Adjust height for the format
    const margin = 10;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = printFormat === "thermal" ? 10 : 12;

    let yPosition = pageHeight - margin;

    // Store details
    page.drawText(`${store.name}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize + 2,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 5;

    page.drawText(`Location: ${store.location}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 10;

    page.drawText("Invoice", {
      x: margin,
      y: yPosition,
      font,
      size: fontSize + 2,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 10;

    // Product Table Headers
    page.drawText("Product", {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    page.drawText("Qty", {
      x: margin + 100,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    page.drawText("Subtotal", {
      x: margin + 140,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 5;

    // Product details
    Object.values(cart).forEach(({ product, quantity }: any) => {
      page.drawText(product.name, {
        x: margin,
        y: yPosition,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      page.drawText(`${quantity}`, {
        x: margin + 100,
        y: yPosition,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      page.drawText(`$${(product.price * quantity).toFixed(2)}`, {
        x: margin + 140,
        y: yPosition,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize + 5;
    });

    // Total
    yPosition -= fontSize;
    page.drawText("Total:", {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    page.drawText(`$${totalAmount.toFixed(2)}`, {
      x: margin + 140,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    // Footer
    yPosition -= fontSize + 10;
    page.drawText("Thank you for your purchase!", {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    return await pdfDoc.save();
  };

  const handlePreviewReceipt = async () => {
    if (!selectedClient) {
      alert("Please select a client before previewing the receipt.");
      return;
    }

    try {
      const selectedFormat = printFormat;
      let docWidth, docHeight;
      if (selectedFormat === "letter") {
        docWidth = 200;
        docHeight = 612;
      } else if (selectedFormat === "thermal") {
        docWidth = 400; // Tamaño en mm para ticket
        docHeight = 792; // Altura dinámica, se puede ajustar si se necesita
      }
      // Simular datos del carrito, tienda y total (reemplaza esto con los datos reales)
      const storeInformation = {
        name: store?.name,
        location: store?.location,
      };

      const totalAmount = calculateTotal(); // Asegúrate de que esta función calcule correctamente el total // Cambia a "letter" si necesitas otro formato

      // Llama a generateReceiptPDF con los argumentos requeridos
      const pdfBytes = await generateReceiptPDF(
        selectedFormat,
        cart,
        storeInformation,
        totalAmount
      );

      const blob = new Blob([pdfBytes!], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(`/api/posStore?storeId=${storeId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch store");
        }
        const storeData = await res.json();
        setStore(storeData);
      } catch (error) {
        console.error(error);
      }
    };

    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, [storeId]);

  return (
    <div className="p-8 flex w-full justify-between min-h-[93vh]">
      <div>
        {store ? (
          <>
            <h1 className="text-xl font-bold">{store.name}</h1>
            <p className="text-gray-600">{store.location}</p>
          </>
        ) : (
          <p>Loading store details...</p>
        )}

        {/* Client Dropdown */}
        <div className="mb-6">
          <select
            id="clientDropdown"
            value={selectedClient || ""}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full p-2 border rounded shadow-md dark:bg-slate-800"
          >
            <option value="" disabled className="dark:bg-slate-800">
              Choose a client...
            </option>
            {clients.map((client) => (
              <option
                key={client.id}
                value={client.id}
                className="dark:bg-slate-800"
              >
                {client.name} {client.email ? `(${client.email})` : ""}
              </option>
            ))}
          </select>
        </div>
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border rounded shadow-md dark:bg-slate-800"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8 w-full">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border p-4 dark:bg-slate-800 rounded-md h-auto"
            >
              <Image
                src="/productMockup.jpg"
                alt={`${product.name} photo`}
                width={1000}
                height={1000}
                className="w-full h-full max-w-[178.81px] max-h-[100px] rounded-md"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Store: {product.quantity}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-slate-900 text-white p-1 mt-2 rounded-md w-full hover:bg-slate-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="border rounded-md p-2 min-h-full min-w-[400px] flex flex-col justify-between">
        <div className=" p-4 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          {Object.values(cart).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <table className="w-full mb-4">
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
                          className="bg-slate-900 hover:bg-slate-700 text-white px-2 py-1 mr-2 rounded-md"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          className="bg-slate-900 hover:bg-slate-700 text-white px-2 py-1 rounded-md"
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
        {/* Paper Size */}
        <div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Select Print Format:
            </label>
            <select
              value={printFormat}
              onChange={(e) =>
                setPrintFormat(e.target.value as "thermal" | "letter")
              }
              className="p-2 border rounded shadow-md dark:bg-slate-800"
            >
              <option value="thermal" className="dark:bg-slate-800">
                Thermal (80x70mm)
              </option>
              <option value="letter" className="dark:bg-slate-800">
                Letter (8.5x11 inches)
              </option>
            </select>
          </div>
          {/* Register Sale Button */}
          <div className="w-full flex flex-col justify-stretch">
            <button
              onClick={handlePreviewReceipt}
              disabled={Object.keys(cart).length === 0 || !selectedClient}
              className="text-left"
            >
              Preview Receipt
            </button>
            <button
              onClick={handleRegisterSale}
              className="bg-slate-900 hover:bg-slate-700 text-white py-2 rounded-md 2-full"
              disabled={Object.keys(cart).length === 0 || !selectedClient}
            >
              Register Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProductsPage;
