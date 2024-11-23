import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// CREATE a Store
export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: { name, userId },
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
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const stores = await prisma.store.findMany({
      where: { userId },
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
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name },
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
