import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { clientId, storeId, totalAmount, products } = await req.json();

  try {
    // Register the sale
    const sale = await prisma.sale.create({
      data: {
        clientId,
        storeId,
        totalAmount,
        userId: user.id,
      },
    });

    for (const { productId, quantity } of products) {
      await prisma.saleItem.create({
        data: {
          saleId: sale.id,
          productId,
          quantity,
        },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: { decrement: quantity },
        },
      });
    }

    // Update product stock and log items

    return NextResponse.json(sale);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register sale" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const totalSales = await prisma.sale.count({
      where: { userId: user.id },
    });

    const sales = await prisma.sale.findMany({
      where: { userId: user.id },
      include: {
        Client: true,
        Store: true,
        saleItems: {
          include: { Product: true },
        },
      },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      sales,
      total: totalSales,
      page,
      pages: Math.ceil(totalSales / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
