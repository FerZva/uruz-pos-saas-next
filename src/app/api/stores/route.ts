import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// CREATE a Store
export async function POST(req: Request) {
  try {
    const { name, cashOpening, status, location } = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!name || !location || cashOpening == null || !status) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId: user.id,
        cashOpening,
        status,
        location,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}

// GET all Stores for a User
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
    const stores = await prisma.store.findMany({
      where: { userId: user.id },
      // select: { id: true, name: true, location: true },
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

// UPDATE a Store
export async function PATCH(req: Request) {
  try {
    const { id, name, cashOpening, status, location } = await req.json();

    if (!id || !name || cashOpening == null || !status || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name, cashOpening, status, location },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

// DELETE a Store
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    await prisma.store.delete({ where: { id } });

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
