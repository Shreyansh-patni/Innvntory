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
  Settings,
  Building,
  UserCog,
  Shield,
  Plug,
  Wallet,
  Lock,
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
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Business",
    items: [
      { label: "Products", href: "/products", icon: Package },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Suppliers", href: "/suppliers", icon: Building2 },
      { label: "Categories", href: "/categories", icon: Tags },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Stock", href: "/inventory/stock", icon: Boxes },
      { label: "Warehouses", href: "/inventory/warehouses", icon: Warehouse },
      { label: "Transfers", href: "/inventory/transfers", icon: ArrowLeftRight },
      { label: "Adjustments", href: "/inventory/adjustments", icon: ClipboardList },
      { label: "Movements", href: "/inventory/movements", icon: Activity },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/sales/orders", icon: ShoppingCart },
      { label: "Invoices", href: "/sales/invoices", icon: FileText },
      { label: "Returns", href: "/sales/returns", icon: RotateCcw },
      { label: "Payments", href: "/sales/payments", icon: CreditCard },
    ],
  },
  {
    label: "Purchases",
    items: [
      { label: "Purchase Orders", href: "/purchases/orders", icon: Truck },
      { label: "Receipts", href: "/purchases/receipts", icon: Receipt },
      { label: "Returns", href: "/purchases/returns", icon: RotateCcw },
      { label: "Payments", href: "/purchases/payments", icon: CreditCard },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Sales", href: "/reports/sales", icon: BarChart3 },
      { label: "Purchases", href: "/reports/purchases", icon: BarChart3 },
      { label: "Inventory", href: "/reports/inventory", icon: BarChart3 },
      { label: "Financial", href: "/reports/financial", icon: BarChart3 },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Organization", href: "/settings/organization", icon: Building },
      { label: "Users", href: "/settings/users", icon: UserCog },
      { label: "Roles", href: "/settings/roles", icon: Shield },
      { label: "Integrations", href: "/settings/integrations", icon: Plug },
      { label: "Billing", href: "/settings/billing", icon: Wallet },
      { label: "Security", href: "/settings/security", icon: Lock },
    ],
  },
];

export function isNavSection(item: NavItem | NavSection): item is NavSection {
  return "items" in item;
}
