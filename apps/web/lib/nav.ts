/**
 * Navigation model.
 *
 * Mirrors the module structure in specification §42, restricted to the surfaces
 * this shell actually implements. Denser and more operational than the marketing
 * surface (DESIGN-SYSTEM.md §11).
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly description: string;
  /** Command palette keywords — navigation and actions only (spec §43). */
  readonly keywords: readonly string[];
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

export const APP_NAV: readonly NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/app",
        label: "Dashboard",
        description: "Business command center",
        keywords: ["home", "overview", "kpi", "brief", "dashboard"],
      },
    ],
  },
  {
    label: "Operate",
    items: [
      {
        href: "/app/inventory",
        label: "Inventory",
        description: "Stock levels, movements, locations",
        keywords: ["stock", "warehouse", "movement", "adjustment", "inventory"],
      },
      {
        href: "/app/products",
        label: "Products",
        description: "Catalogue, SKUs, pricing",
        keywords: ["sku", "catalogue", "product", "price", "catalog"],
      },
    ],
  },
  {
    label: "Trade",
    items: [
      {
        href: "/app/orders",
        label: "Orders",
        description: "Sales, invoices and payments",
        keywords: ["sales", "invoice", "payment", "order", "billing"],
      },
      {
        href: "/app/suppliers",
        label: "Suppliers",
        description: "Purchase orders and receiving",
        keywords: ["purchase", "vendor", "supplier", "receiving", "po"],
      },
      {
        href: "/app/customers",
        label: "Customers",
        description: "Accounts, balances, history",
        keywords: ["customer", "client", "account", "balance", "receivable"],
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        href: "/app/ai",
        label: "AI",
        description: "Contextual assistant, grounded in your data",
        keywords: ["ai", "assistant", "insight", "ask", "forecast", "brief"],
      },
    ],
  },
  {
    label: "Configure",
    items: [
      {
        href: "/app/settings",
        label: "Settings",
        description: "Organization, users, roles",
        keywords: ["settings", "organisation", "organization", "users", "roles", "team"],
      },
    ],
  },
] as const;

export const ALL_NAV_ITEMS: readonly NavItem[] = APP_NAV.flatMap((g) => g.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) => item.href === pathname);
}