import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET() {
  try {
    const sales = await prisma.sale.groupBy({
      by: ["storeId"],
      _sum: { totalAmount: true },
    });

    const stores = await prisma.store.findMany();
    const labels = stores.map((store) => store.name);

    const salesData = labels.map((label) => {
      const storeSales = sales.find((sale) => sale.storeId === label);
      return storeSales ? storeSales._sum.totalAmount || 0 : 0;
    });

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale._sum.totalAmount || 0),
      0
    );

    return NextResponse.json({ salesData, labels, totalRevenue });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
