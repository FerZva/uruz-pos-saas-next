"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  taxes: number;
  stock: number;
  provider: string;
  store: string;
}

interface SpreadsheetUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (products: Product[]) => void;
}

export function SpreadsheetUpload({
  isOpen,
  onClose,
  onUploadSuccess,
}: SpreadsheetUploadProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Validate and process the data
      const processedData = jsonData.map((item: any, index) => ({
        id: `imported-${index}`,
        name: item.name || "",
        description: item.description || "",
        category: item.category || "",
        price: Number(item.price) || 0,
        costPrice: Number(item.costPrice) || 0,
        taxes: Number(item.taxes) || 0,
        stock: Number(item.quantity) || 0,
        provider: item.provider || "",
        store: item.store || "",
      }));

      setProducts(processedData);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleImport = () => {
    onUploadSuccess(products);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-slate-800">
        <DialogHeader>
          <DialogTitle>Upload Product Spreadsheet</DialogTitle>
          <DialogDescription>
            Upload an Excel spreadsheet (.xlsx or .xls) containing your product
            information.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg">Drop the spreadsheet here ...</p>
            ) : (
              <p className="text-lg">
                Drag & drop a spreadsheet here, or click to select one
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: .xlsx, .xls
            </p>
          </div>

          {products.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Preview of Uploaded Products
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Store</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 5).map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.provider}</TableCell>
                        <TableCell>{product.store}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {products.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing 5 of {products.length} products
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center">
              {products.length > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {products.length} products loaded
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    No spreadsheet uploaded yet
                  </span>
                </>
              )}
            </div>
            <Button onClick={handleImport} disabled={products.length === 0}>
              <Upload className="w-4 h-4 mr-2" />
              Import Products
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
