"use client";
import { useState, useEffect } from "react";

interface Sale {
  id: string;
  totalAmount: number;
  date: string;
  Client?: {
    name: string;
  };
  Store?: {
    name: string;
  };
  saleItems: {
    Product: { name: string };
    quantity: number;
  }[];
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sales");
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales</h1>
      {isLoading ? (
        <p>Loading sales...</p>
      ) : sales.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Store</th>
                <th className="p-4 text-left">Products</th>
                <th className="p-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t">
                  <td className="p-4">
                    {new Date(sale.date).toLocaleString()}
                  </td>
                  <td className="p-4">{sale.Client?.name || "N/A"}</td>
                  <td className="p-4">{sale.Store?.name || "N/A"}</td>
                  <td className="p-4">
                    <ul>
                      {sale.saleItems.map((item, index) => (
                        <li key={index}>
                          {item.Product.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">${sale.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
