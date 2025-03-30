import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

function formatProductCode(count: number): string {
  const padLength = count > 9999999 ? 8 : 7;
  return "PROD" + count.toString().padStart(padLength, "0");
}

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const {
      productImage,
      name,
      description,
      category,
      price,
      costPrice,
      taxes,
      quantity,
      storeId,
      providerId,
    } = await request.json();

    const counter = await prisma.counter.upsert({
      where: { modelName: "Product" },
      update: { count: { increment: 1 } },
      create: { modelName: "Product", count: 1 },
    });

    const productCode = formatProductCode(counter.count);

    const product = await prisma.product.create({
      data: {
        productCode,
        productImage,
        name,
        description,
        category,
        price,
        costPrice,
        taxes,
        quantity,
        storeId,
        providerId,
        userId: user.id,
      },
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
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const storeId = searchParams.get("storeId");

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Calcular el rango para la paginación
    const skip = (page - 1) * limit;

    // Consulta de productos con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          userId: user.id,
          storeId: storeId || undefined, // Filtrar por storeId si está presente
        },
        include: { Provider: true, Store: { select: { name: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Ordenar por fecha de creación
      }),
      prisma.product.count({
        where: {
          userId: user.id,
          storeId: storeId || undefined,
        },
      }),
    ]);

    // Calcular el total de páginas
    const pages = Math.ceil(total / limit);

    return NextResponse.json({ products, total, page, pages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      description,
      price,
      costPrice,
      taxes,
      quantity,
      productImage,
      category,
      providerId,
      storeId,
    } = body;

    if (!id || !name || !price || !quantity || !providerId || !storeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : null,
        taxes: taxes ? parseFloat(taxes) : null,
        quantity,
        productImage,
        category,
        providerId,
        storeId,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
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
