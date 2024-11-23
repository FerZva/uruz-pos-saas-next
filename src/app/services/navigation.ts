import {
  LayoutDashboardIcon,
  Settings,
  Shirt,
  ShoppingBag,
  SquareUserRound,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Navigation } from "../types/interfaces";

export const navigation: Navigation[] = [
  {
    linkId: 1,
    linkIcon: LayoutDashboardIcon,
    linkName: "Dashboard",
    linkUrl: "/dashboard",
  },
  {
    linkId: 2,
    linkIcon: Shirt,
    linkName: "Products",
    linkUrl: "/products",
  },
  {
    linkId: 3,
    linkIcon: Store,
    linkName: "POS",
    linkUrl: "/pos",
  },
  {
    linkId: 4,
    linkIcon: ShoppingBag,
    linkName: "Sales",
    linkUrl: "/sales",
  },
  {
    linkId: 5,
    linkIcon: Users,
    linkName: "Clients",
    linkUrl: "/clients",
  },
  {
    linkId: 6,
    linkIcon: SquareUserRound,
    linkName: "Employees",
    linkUrl: "/employees",
  },
  {
    linkId: 7,
    linkIcon: Truck,
    linkName: "Providers",
    linkUrl: "/providers",
  },
  {
    linkId: 8,
    linkIcon: Settings,
    linkName: "Settings",
    linkUrl: "/settings",
  },
];
