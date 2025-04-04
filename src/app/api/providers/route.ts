import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// CREATE a Provider
export async function POST(req: Request) {
  try {
    const { name, email, phone, address } = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        name,
        email,
        phone,
        address,
        userId: user.id,
      },
    });

    return NextResponse.json(provider, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}

// GET all Providers
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
    const providers = await prisma.provider.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

// UPDATE a Provider
export async function PATCH(req: Request) {
  try {
    const { id, name, email, phone, address } = await req.json();

    if (!id || !name || !email || !phone || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: { name, email, phone, address },
    });

    return NextResponse.json(updatedProvider);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

// DELETE a Provider
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    await prisma.provider.delete({ where: { id } });

    return NextResponse.json({ message: "Provider deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
