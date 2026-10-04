import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  Tags,
  Warehouse,
  ArrowLeftRight,
  ClipboardList,
  Activity,
  ShoppingCart,
  FileText,
  RotateCcw,
  CreditCard,
  Truck,
  Receipt,
  BarChart3,
  Building,
  UserCog,
  Shield,
  Plug,
  Wallet,
  Lock,
  Palette,
  type LucideIcon,
  Boxes,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navigation: (NavItem | NavSection)[] = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Business",
    items: [
      { label: "Products", href: "/app/products", icon: Package },
      { label: "Customers", href: "/app/customers", icon: Users },
      { label: "Suppliers", href: "/app/suppliers", icon: Building2 },
      { label: "Categories", href: "/app/categories", icon: Tags },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Stock", href: "/app/inventory/stock", icon: Boxes },
      { label: "Warehouses", href: "/app/inventory/warehouses", icon: Warehouse },
      { label: "Transfers", href: "/app/inventory/transfers", icon: ArrowLeftRight },
      { label: "Adjustments", href: "/app/inventory/adjustments", icon: ClipboardList },
      { label: "Movements", href: "/app/inventory/movements", icon: Activity },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/app/sales/orders", icon: ShoppingCart },
      { label: "Invoices", href: "/app/sales/invoices", icon: FileText },
      { label: "Returns", href: "/app/sales/returns", icon: RotateCcw },
      { label: "Payments", href: "/app/sales/payments", icon: CreditCard },
    ],
  },
  {
    label: "Purchases",
    items: [
      { label: "Purchase Orders", href: "/app/purchases/orders", icon: Truck },
      { label: "Receipts", href: "/app/purchases/receipts", icon: Receipt },
      { label: "Returns", href: "/app/purchases/returns", icon: RotateCcw },
      { label: "Payments", href: "/app/purchases/payments", icon: CreditCard },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Sales", href: "/app/reports/sales", icon: BarChart3 },
      { label: "Purchases", href: "/app/reports/purchases", icon: BarChart3 },
      { label: "Inventory", href: "/app/reports/inventory", icon: BarChart3 },
      { label: "Financial", href: "/app/reports/financial", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Appearance", href: "/app/settings/appearance", icon: Palette },
      { label: "Organization", href: "/app/settings/organization", icon: Building },
      { label: "Users", href: "/app/settings/users", icon: UserCog },
      { label: "Roles", href: "/app/settings/roles", icon: Shield },
      { label: "Integrations", href: "/app/settings/integrations", icon: Plug },
      { label: "Billing", href: "/app/settings/billing", icon: Wallet },
      { label: "Security", href: "/app/settings/security", icon: Lock },
    ],
  },
];

export function isNavSection(item: NavItem | NavSection): item is NavSection {
  return "items" in item;
}
