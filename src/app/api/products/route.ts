import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, price, quantity, storeId, providerId } = await request.json();

    const product = await prisma.product.create({
      data: { name, price, quantity, storeId, providerId },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  try {
    if (!storeId)
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );

    const products = await prisma.product.findMany({
      where: { storeId },
      include: { Provider: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name, price, quantity, providerId } = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, quantity, providerId },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE a Product
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (!id)
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
