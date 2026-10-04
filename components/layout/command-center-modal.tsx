"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Truck,
  Boxes,
  Warehouse,
  ArrowLeftRight,
  Sliders,
  History,
  ShoppingCart,
  FileText,
  RotateCcw,
  CreditCard,
  FileCheck,
  Receipt,
  Undo2,
  BarChart3,
  TrendingDown,
  PieChart,
  Calculator,
  Building2,
  UserCheck,
  ShieldAlert,
  Palette,
  Lock,
  Compass,
  X,
  CornerDownLeft,
} from "lucide-react";

interface NavCommand {
  id: string;
  category: "Navigation" | "Inventory" | "Sales" | "Purchases" | "Reports" | "Settings";
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const COMMAND_ITEMS: NavCommand[] = [
  // General & Dashboard
  {
    id: "dashboard",
    category: "Navigation",
    title: "Dashboard",
    description: "Operational KPIs, inventory valuation, and recent activity",
    href: "/app/dashboard",
    icon: LayoutDashboard,
    keywords: ["home", "kpis", "summary", "analytics", "overview"],
  },
  {
    id: "onboarding",
    category: "Navigation",
    title: "Workspace Tour / Onboarding",
    description: "Re-run first-time setup or demo walkthrough",
    href: "/app/onboarding",
    icon: Compass,
    keywords: ["guide", "setup", "wizard", "tour", "demo"],
  },

  // Business & Catalog
  {
    id: "products",
    category: "Navigation",
    title: "Products Catalog",
    description: "50 SKU catalog items, barcodes, and pricing",
    href: "/app/products",
    icon: Package,
    keywords: ["items", "skus", "goods", "catalog", "inventory"],
  },
  {
    id: "categories",
    category: "Navigation",
    title: "Product Categories",
    description: "HSN classification and GST tax slabs",
    href: "/app/categories",
    icon: Layers,
    keywords: ["tax", "gst", "hsn", "classification", "groups"],
  },
  {
    id: "customers",
    category: "Navigation",
    title: "Customers Directory",
    description: "B2B client accounts, GSTINs, and credit limits",
    href: "/app/customers",
    icon: Users,
    keywords: ["clients", "buyers", "accounts", "b2b", "receivables"],
  },
  {
    id: "suppliers",
    category: "Navigation",
    title: "Suppliers & Vendors",
    description: "Vendor profiles, payment terms, and vendor GSTINs",
    href: "/app/suppliers",
    icon: Truck,
    keywords: ["vendors", "procurement", "payables", "distributors"],
  },

  // Inventory Operations
  {
    id: "stock",
    category: "Inventory",
    title: "Stock Balances",
    description: "Real-time on-hand, allocated, and available inventory",
    href: "/app/inventory/stock",
    icon: Boxes,
    keywords: ["levels", "on hand", "valuation", "quantity", "warehouse balance"],
  },
  {
    id: "warehouses",
    category: "Inventory",
    title: "Warehouse Locations",
    description: "Bhiwandi Central, Bengaluru South, and Delhi NCR Hub",
    href: "/app/inventory/warehouses",
    icon: Warehouse,
    keywords: ["locations", "hubs", "storage", "facilities", "depots"],
  },
  {
    id: "transfers",
    category: "Inventory",
    title: "Inter-Warehouse Transfers",
    description: "Stock transit logs between primary hubs",
    href: "/app/inventory/transfers",
    icon: ArrowLeftRight,
    keywords: ["relocation", "transit", "dispatch", "inter-branch"],
  },
  {
    id: "adjustments",
    category: "Inventory",
    title: "Stock Adjustments",
    description: "Cycle count corrections, audit variances, and shrinkage write-offs",
    href: "/app/inventory/adjustments",
    icon: Sliders,
    keywords: ["reconciliation", "variance", "corrections", "write-off"],
  },
  {
    id: "movements",
    category: "Inventory",
    title: "Inventory Movements Ledger",
    description: "Immutable transactional movement audit log",
    href: "/app/inventory/movements",
    icon: History,
    keywords: ["ledger", "transactions", "audit", "traceability", "in-out"],
  },

  // Sales Operations
  {
    id: "sales-orders",
    category: "Sales",
    title: "Sales Orders",
    description: "Customer orders, fulfillment status, and order values",
    href: "/app/sales/orders",
    icon: ShoppingCart,
    keywords: ["orders", "deals", "fulfillment", "shipping"],
  },
  {
    id: "sales-invoices",
    category: "Sales",
    title: "Tax Invoices",
    description: "GST tax invoices, outstanding balances, and due dates",
    href: "/app/sales/invoices",
    icon: FileText,
    keywords: ["billing", "tax invoices", "gst", "receivables", "bills"],
  },
  {
    id: "sales-returns",
    category: "Sales",
    title: "Sales Returns (Credit Notes)",
    description: "Customer returns, credit notes, and stock restorations",
    href: "/app/sales/returns",
    icon: RotateCcw,
    keywords: ["credit notes", "reversals", "rma", "restoration"],
  },
  {
    id: "sales-payments",
    category: "Sales",
    title: "Customer Payments",
    description: "Settlements received, NEFT/RTGS/UPI allocations",
    href: "/app/sales/payments",
    icon: CreditCard,
    keywords: ["receipts", "collections", "settlements", "neft", "rtgs"],
  },

  // Purchase Operations
  {
    id: "purchase-orders",
    category: "Purchases",
    title: "Purchase Orders (POs)",
    description: "Procurement orders placed with registered suppliers",
    href: "/app/purchases/orders",
    icon: FileCheck,
    keywords: ["procurement", "pos", "buying", "requisitions"],
  },
  {
    id: "purchase-receipts",
    category: "Purchases",
    title: "Goods Receipts (GRNs)",
    description: "Inward warehouse receipts and physical stock intake",
    href: "/app/purchases/receipts",
    icon: Receipt,
    keywords: ["grn", "inward", "intake", "gate pass", "receiving"],
  },
  {
    id: "purchase-returns",
    category: "Purchases",
    title: "Purchase Returns (Debit Notes)",
    description: "Vendor returns, debit notes, and stock debits",
    href: "/app/purchases/returns",
    icon: Undo2,
    keywords: ["debit notes", "vendor return", "rejections", "defective"],
  },
  {
    id: "purchase-payments",
    category: "Purchases",
    title: "Vendor Payments",
    description: "Supplier disbursements, bank wire logs, and accounts payable",
    href: "/app/purchases/payments",
    icon: CreditCard,
    keywords: ["disbursements", "vendor settlements", "payables", "wire"],
  },

  // Reports
  {
    id: "report-sales",
    category: "Reports",
    title: "Sales Analytics Report",
    description: "Gross revenue, top selling SKUs, and customer margins",
    href: "/app/reports/sales",
    icon: BarChart3,
    keywords: ["revenue", "sales trend", "top products", "customer volume"],
  },
  {
    id: "report-purchases",
    category: "Reports",
    title: "Purchases & Procurement Report",
    description: "Procurement spending, supplier spend breakdown, and open POs",
    href: "/app/reports/purchases",
    icon: TrendingDown,
    keywords: ["procurement report", "vendor spend", "purchase cost"],
  },
  {
    id: "report-inventory",
    category: "Reports",
    title: "Inventory Valuation & Turnover",
    description: "Stock asset value, warehouse distribution, and dead stock",
    href: "/app/reports/inventory",
    icon: PieChart,
    keywords: ["valuation", "asset", "aging", "turnover", "stock report"],
  },
  {
    id: "report-financial",
    category: "Reports",
    title: "Financial P&L & Cash Flow",
    description: "Gross profit, receivables, payables, and net margin",
    href: "/app/reports/financial",
    icon: Calculator,
    keywords: ["p&l", "profit", "cash flow", "receivables", "payables", "margin"],
  },

  // Settings
  {
    id: "settings-org",
    category: "Settings",
    title: "Organization Profile",
    description: "Company registration, GSTINs, and default currency",
    href: "/app/settings/organization",
    icon: Building2,
    keywords: ["organization", "profile", "gstin", "currency", "company"],
  },
  {
    id: "settings-appearance",
    category: "Settings",
    title: "Appearance & Theme",
    description: "Toggle Light / Dark mode and contrast preferences",
    href: "/app/settings/appearance",
    icon: Palette,
    keywords: ["theme", "light", "dark", "color", "appearance", "mode"],
  },
  {
    id: "settings-users",
    category: "Settings",
    title: "Users & Team Members",
    description: "Manage team invitations and location access",
    href: "/app/settings/users",
    icon: UserCheck,
    keywords: ["team", "members", "staff", "invitations", "users"],
  },
  {
    id: "settings-roles",
    category: "Settings",
    title: "Roles & RBAC Permissions",
    description: "Review access levels and role security policies",
    href: "/app/settings/roles",
    icon: ShieldAlert,
    keywords: ["rbac", "roles", "permissions", "access control"],
  },
  {
    id: "settings-security",
    category: "Settings",
    title: "Security & Audit Logs",
    description: "PostgreSQL RLS verification, session controls, and MFA policies",
    href: "/app/settings/security",
    icon: Lock,
    keywords: ["security", "audit", "rls", "mfa", "sessions"],
  },
];

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandCenterModal({ isOpen, onClose }: CommandCenterModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return COMMAND_ITEMS;

    return COMMAND_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchDesc = item.description.toLowerCase().includes(trimmed);
      const matchCategory = item.category.toLowerCase().includes(trimmed);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(trimmed));
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    });
  }, [query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredCommands[selectedIndex].href);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, handleSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Center Search"
        className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191A] shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-neutral-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search products, orders, stock, reports, settings..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              No matching modules or operations found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-md border shrink-0 ${
                        isSelected
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-neutral-400 shrink-0">
                      <span>Jump</span>
                      <CornerDownLeft className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-neutral-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-neutral-800 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <span>Innvntory Operations Center</span>
        </div>
      </div>
    </div>
  );
}
