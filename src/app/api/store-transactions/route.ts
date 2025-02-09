// src/app/api/store-transactions/route.ts
import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { storeId, type, cashOpening, cashClosing, name, location } =
      await req.json();

    // Validar campos necesarios para apertura o cierre
    if (!storeId || !type || (type !== "open" && type !== "close")) {
      return NextResponse.json(
        { error: "Invalid data: storeId and type are required." },
        { status: 400 }
      );
    }

    if (type === "open" && cashOpening == null) {
      return NextResponse.json(
        { error: "cashOpening is required for opening a store." },
        { status: 400 }
      );
    }

    if (type === "close" && cashClosing == null) {
      return NextResponse.json(
        { error: "cashClosing is required for closing a store." },
        { status: 400 }
      );
    }

    // Crear transacción
    const transaction = await prisma.storeTransaction.create({
      data: {
        storeId,
        type,
        cashOpening: cashOpening,
        cashClosing: cashClosing,
      },
    });

    // Actualizar estado de la tienda
    await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        location,
        status: type === "open" ? "Open" : "Closed",
        cashOpening,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
