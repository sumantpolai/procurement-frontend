import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  FileText,
  ReceiptText,
  Package,
  Building2Icon,
} from "lucide-react";

export type Route = {
  href?: string;
  name: string;
  icon: React.ElementType<{ className?: string }>;
  search?: {
    keywords?: string[];
    group?: string;
    hidden?: boolean;
  };
  children?: {
    href: string;
    name: string;
    icon?: React.ElementType<{ className?: string }>;
    search?: {
      keywords?: string[];
      group?: string;
      hidden?: boolean;
    };
  }[];
};

// Store Staff Routes
export const StoreStaffRoutes: Route[] = [
  {
    href: "/dashboard/store-staff",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Masters Data",
    icon: Layers,
    children: [
      {
        href: "/dashboard/store-staff/item-masters",
        name: "Item Master",
        icon: Package,
      },
      {
        href: "/dashboard/store-staff/vendor-masters",
        name: "Vendor Master",
        icon: Building2Icon,
      },
    ],
  },
  {
    name: "Transactions",
    icon: ClipboardList,
    children: [
      {
        href: "/dashboard/store-staff/pr",
        name: "Purchase Requisition",
        icon: FileText,
      },
      {
        href: "/dashboard/store-staff/purchase-orders",
        name: "Purchase Order",
        icon: ReceiptText,
      },
    ],
  },
];

// Store Manager Routes
export const StoreManagerRoutes: Route[] = [
  {
    href: "/dashboard/store-manager",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Masters Data",
    icon: Layers,
    children: [
      {
        href: "/dashboard/store-manager/item-masters",
        name: "Item Master",
        icon: Package,
      },
      {
        href: "/dashboard/store-manager/vendor-masters",
        name: "Vendor Master",
        icon: Building2Icon,
      },
    ],
  },
  {
    name: "Transactions",
    icon: ClipboardList,
    children: [
      {
        href: "/dashboard/store-manager/purchase-requisitions",
        name: "Purchase Requisition",
        icon: FileText,
      },
      {
        href: "/dashboard/store-manager/purchase-orders",
        name: "Purchase Order",
        icon: ReceiptText,
      },
    ],
  },
];

// Purchase Staff Routes
export const PurchaseStaffRoutes: Route[] = [
  {
    href: "/dashboard/purchase-staff",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Masters Data",
    icon: Layers,
    children: [
      {
        href: "/dashboard/purchase-staff/item-masters",
        name: "Item Master",
        icon: Package,
      },
      {
        href: "/dashboard/purchase-staff/vendor-master",
        name: "Vendor Master",
        icon: Building2Icon,
      },
    ],
  },
  {
    name: "Transactions",
    icon: ClipboardList,
    children: [
      {
        href: "/dashboard/purchase-staff/purchase-requisitions",
        name: "Purchase Requisition",
        icon: FileText,
      },
      {
        href: "/dashboard/purchase-staff/purchase-orders",
        name: "Purchase Order",
        icon: ReceiptText,
      },
    ],
  },
];

// Purchase Manager Routes
export const PurchaseManagerRoutes: Route[] = [
  {
    href: "/dashboard/purchase-manager",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Masters Data",
    icon: Layers,
    children: [
      {
        href: "/dashboard/purchase-manager/item-masters",
        name: "Item Master",
        icon: Package,
      },
      {
        href: "/dashboard/purchase-manager/vendor-masters",
        name: "Vendor Master",
        icon: Building2Icon,
      },
    ],
  },
  {
    name: "Transactions",
    icon: ClipboardList,
    children: [
      {
        href: "/dashboard/purchase-manager/purchase-requisitions",
        name: "Purchase Requisition",
        icon: FileText,
      },
      {
        href: "/dashboard/purchase-manager/purchase-orders",
        name: "Purchase Order",
        icon: ReceiptText,
      },
    ],
  },
];

// Map of roles to their standard display labels
export const ROLE_LABELS: Record<string, string> = {
  store_staff: "Store Staff",
  store_manager: "Store Manager",
  purchase_staff: "Purchase Staff",
  purchase_manager: "Purchase Manager",
};



// Map of roles to their route lists
export const ROLE_ROUTES: Record<string, Route[]> = {
  store_staff: StoreStaffRoutes,
  store_manager: StoreManagerRoutes,
  purchase_staff: PurchaseStaffRoutes,
  purchase_manager: PurchaseManagerRoutes,
};

// Function to get routes based on user role
export const getRoutesByRole = (role: string | null): Route[] => {
  if (!role) return [];
  return ROLE_ROUTES[role.toLowerCase()] || [];
};

// Function to get sidebar label based on user role
export const getSidebarLabel = (role: string | null): string => {
  if (!role) return "Dashboard";
  return ROLE_LABELS[role.toLowerCase()] || role;
};

