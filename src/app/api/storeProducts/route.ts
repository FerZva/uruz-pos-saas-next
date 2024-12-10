import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  if (!storeId) {
    return NextResponse.json(
      { error: "Store ID is required" },
      { status: 400 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: user.id,
        storeId: storeId, // Filtrar por storeId
      },
      include: { Provider: true, Store: { select: { name: true } } },
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
