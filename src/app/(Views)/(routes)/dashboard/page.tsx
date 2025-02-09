"use server";
import prisma from "../../../lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { ChartBars } from "@/app/components/ChartsBars";

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");

  const userProfile = await prisma.user.findUnique({
    where: { email: user.email || "" },
    include: {
      sales: {
        include: { saleItems: true },
      },
      products: true,
    },
  });

  if (userProfile?.plan === "free") return redirect("/");

  const sales = userProfile?.sales || [];
  const products = userProfile?.products || [];

  // Procesar los datos
  const totalSalesAmount = sales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );
  const transactionsCount = sales.length;
  const itemsSold = sales.reduce((sum, sale) => {
    return (
      sum + sale.saleItems.reduce((count, item) => count + item.quantity, 0)
    );
  }, 0);
  const averageSale =
    transactionsCount > 0 ? totalSalesAmount / transactionsCount : 0;

  // Obtener los productos más vendidos
  const productSales = products.map((product) => {
    const salesCount = sales.reduce((sum, sale) => {
      return (
        sum +
        sale.saleItems
          .filter((item) => item.productId === product.id)
          .reduce((total, item) => total + item.quantity, 0)
      );
    }, 0);
    const revenue = salesCount * product.price;
    return {
      name: product.name,
      sales: salesCount,
      revenue,
    };
  });

  const topProducts = productSales
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const recentTransactions = sales.slice(-5).map((sale) => ({
    id: sale.id,
    time: sale.date.toLocaleTimeString(),
    items: sale.saleItems.reduce((count, item) => count + item.quantity, 0),
    total: sale.totalAmount,
  }));

  return (
    <div className="w-full mx-auto px-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Today&apos;s Sales</CardTitle>
            <CardDescription>Total sales amount</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalSalesAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Number of transactions today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{transactionsCount}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Average Sale</CardTitle>
            <CardDescription>Average transaction value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${averageSale.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Items Sold</CardTitle>
            <CardDescription>Total number of items sold</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{itemsSold}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBars />
        <Card className="dark:bg-slate-800">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing items today</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>${product.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                  <TableCell>${transaction.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
