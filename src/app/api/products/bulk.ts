import { NextResponse } from "next/server";
import prisma from "../../lib/prisma"; // Configuración de Prisma
import * as XLSX from "xlsx";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Leer el archivo como Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Validar y procesar los datos
    const formattedProducts = jsonData.map((item) => ({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      price: parseFloat(item.price) || 0,
      costPrice: parseFloat(item.costPrice) || 0,
      taxes: parseFloat(item.taxes) || 0,
      quantity: parseInt(item.quantity) || 0,
      providerId: item.providerId || null,
      storeId: item.storeId || null,
      productImage: item.productImage || null,
    }));

    await prisma.product.createMany({
      data: formattedProducts,
    });

    return NextResponse.json({ message: "Products uploaded successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to upload products." },
      { status: 500 }
    );
  }
}
