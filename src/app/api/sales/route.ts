import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
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

    // Update product stock and log items
    for (const { productId, quantity } of products) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: { decrement: quantity },
        },
      });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register sale" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
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
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
