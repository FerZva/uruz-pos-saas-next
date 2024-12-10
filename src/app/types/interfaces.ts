import { LucideIcon } from "lucide-react";

export interface Navigation {
  linkId: number;
  linkIcon: LucideIcon;
  linkName: string;
  linkUrl: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  salary: number;
  schedule: string;
}

export interface Store {
  id: string;
  name: string;
  cashOpening: string;
  location: string;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  providerId?: string;
  Provider?: { name: string };
  Store?: { id: string; name: string };
}

export interface Sale {
  id: string;
  totalAmount: number;
  date: string;
  Client?: {
    name: string;
  };
  Store?: {
    name: string;
  };
  saleItems: {
    Product: { name: string };
    quantity: number;
  }[];
}
