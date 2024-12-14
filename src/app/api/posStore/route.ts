// GET Stores (all for a user or a specific store by ID)
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");

  try {
    if (storeId) {
      // Fetch specific store
      const store = await prisma.store.findFirst({
        where: { id: storeId, userId: user.id },
      });

      if (!store) {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
      }

      return NextResponse.json(store);
    }

    // Fetch all stores for the user
    const stores = await prisma.store.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, location: true }, // Only return necessary fields
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
