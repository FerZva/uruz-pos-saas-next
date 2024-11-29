"use client";
import { useFetch } from "@/app/hooks/useFetch";
import { Sale } from "@/app/types/interfaces";

const SalesPage = () => {
  const { data: sales, loading, error } = useFetch<Sale[]>("/api/sales");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sales</h1>
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
            {sales?.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="p-4">{new Date(sale.date).toLocaleString()}</td>
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
    </div>
  );
};

export default SalesPage;
