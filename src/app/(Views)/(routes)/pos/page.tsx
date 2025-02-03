"use client";
import { useFetch } from "@/app/hooks/useFetch";
import { Store } from "@/app/types/interfaces";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pen, Ellipsis, Trash2, DoorOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const POSPage = () => {
  const router = useRouter();
  const { data: stores, loading, error } = useFetch<Store[]>("/api/stores");
  const [editingStore] = useState<Store | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isOpenCloseDialogOpen, setOpenCloseDialogOpen] = useState(false);
  const [isEditCreateDialogOpen, setEditCreateDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [dialogAction, setDialogAction] = useState<"open" | "close" | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    cashOpening: 0,
    status: "closed",
    location: "",
  });

  const [cashAmount, setCashAmount] = useState<number>(0);

  const handleTransaction = async () => {
    if (!selectedStore || !dialogAction) return;

    const transactionData =
      dialogAction === "open"
        ? {
            storeId: selectedStore.id,
            type: "open",
            cashOpening: cashAmount,
            cashClosing: 0,
          }
        : {
            storeId: selectedStore.id,
            type: "close",
            cashOpening: cashAmount,
            cashClosing: cashAmount,
          };

    const response = await fetch("/api/store-transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setOpenCloseDialogOpen(false);
      router.refresh(); // Refresca los datos en la página
    } else {
      console.error("Failed to process transaction");
    }
    window.location.reload();
  };

  const openDialogForStore = (store: Store, action: "open" | "close") => {
    setSelectedStore(store);
    setDialogAction(action);
    setCashAmount(0);
    setDialogOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    const endpoint = form.name ? "PATCH" : "POST";
    const body = form.name ? { id: selectedStore?.id, ...form } : form;

    await fetch("/api/stores", {
      method: endpoint,
      body: JSON.stringify(body),
    });

    setEditCreateDialogOpen(false);
    setForm({ name: "", cashOpening: 0, status: "closed", location: "" });
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/stores?id=${id}`, { method: "DELETE" });
    window.location.reload();
  };

  const openDialogForCreate = () => {
    setForm({ name: "", cashOpening: 0, status: "closed", location: "" });
    setEditCreateDialogOpen(true);
  };

  const openDialogForEdit = (store: Store) => {
    setForm({
      name: store.name,
      cashOpening: parseInt(store.cashOpening),
      status: store.status,
      location: store.location,
    });
    setEditCreateDialogOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <button
        onClick={openDialogForCreate}
        className="px-2 py-1 text-white bg-black rounded-md hover:bg-gray-800"
      >
        New store
      </button>

      {/* Store Cards */}
      <div className="w-full py-4 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10">
        {stores?.map((store) => (
          <Card
            key={store.id}
            className="dark:bg-slate-800 px-2 py-4 bg-white border rounded-md flex flex-wrap justify-between items-start"
          >
            <CardHeader className="flex justify-between p-0 pb-4">
              <CardTitle>{store.name}</CardTitle>
            </CardHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Ellipsis />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 bg-white border shadow-md dark:bg-slate-800 p-2 rounded-md">
                <DropdownMenuLabel className="w-full text-center ">
                  Store Menu
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mb-4 w-full" />
                <DropdownMenuGroup>
                  {store.status === "Open" && (
                    <DropdownMenuItem className="outline-none">
                      <button
                        className="flex justify-between w-full items-center text-left rounded-md hover:bg-slate-200 hover:dark:bg-slate-700 px-1 outline-none"
                        onClick={() => openDialogForStore(store, "close")}
                      >
                        <DoorOpen className="w-4 mr-2" />
                        <span className="w-full">Close store</span>
                      </button>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="flex justify-between mx-1 mb-2 outline-none">
                    <button
                      className="flex justify-between w-full items-center text-left rounded-md hover:bg-slate-200 hover:dark:bg-slate-700 px-1 outline-none"
                      onClick={() => openDialogForEdit(store)}
                    >
                      <Pen className="w-4 mr-2" />
                      <span className="w-full">Edit</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between mx-1 mb-2 outline-none">
                    <button
                      className="flex justify-between  w-full items-center text-left px-1 rounded-md hover:bg-slate-200 hover:dark:bg-slate-700 outline-none"
                      onClick={() => handleDelete(store.id)}
                    >
                      <Trash2 className="w-4 mr-2" />
                      <span className="w-full">Delete</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <CardContent className="flex flex-col px-0 w-full">
              <p>{store.status}</p>
              <p>Cash opening {store.cashOpening}</p>
              <p>Employees: 5</p>
              <p>{store.location}</p>
            </CardContent>
            <div className="flex justify-center w-full">
              {store.status == "Closed" && (
                <button
                  className="w-full bg-black hover:bg-gray-800 text-white rounded-md py-1"
                  onClick={() => openDialogForStore(store, "open")}
                >
                  Open store
                </button>
              )}

              {store.status == "Open" && (
                <button
                  className="w-full bg-black hover:bg-gray-800 text-white rounded-md py-1"
                  onClick={() => router.push(`/pos/stores/${store.id}`)}
                >
                  Go to store
                </button>
              )}
            </div>
          </Card>
        ))}
        {/* Open / Close Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "open" ? "Open Store" : "Close Store"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                placeholder={`Enter cash ${
                  dialogAction === "open" ? "opening" : "closing"
                } amount`}
              />
            </div>
            <DialogFooter>
              <button onClick={() => setDialogOpen(false)}>Cancel</button>
              <button onClick={handleTransaction}>
                {dialogAction === "open" ? "Open Store" : "Close Store"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Create, Edit Dialog */}
        <Dialog
          open={isEditCreateDialogOpen}
          onOpenChange={setEditCreateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStore ? "Edit Store" : "Create Store"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Store Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 w-full"
              />
              <input
                type="number"
                placeholder="Cash Opening"
                value={form.cashOpening}
                onChange={(e) =>
                  setForm({ ...form, cashOpening: parseFloat(e.target.value) })
                }
                className="border p-2 w-full"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 w-full"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="border p-2 w-full"
              />
            </div>
            <DialogFooter>
              <button
                onClick={handleCreateOrUpdate}
                className="bg-blue-500 text-white"
              >
                {selectedStore ? "Update" : "Create"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default POSPage;
