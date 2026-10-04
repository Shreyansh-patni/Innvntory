export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  priceMonthly: string;
  priceAnnual: string;
  billingPeriod: string;
  highlighted?: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
  limits: {
    warehouses: string;
    teamMembers: string;
    skus: string;
    monthlyInvoices: string;
    support: string;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For single-location businesses exploring modern inventory management.",
    priceMonthly: "₹0",
    priceAnnual: "₹0",
    billingPeriod: "Forever free",
    ctaText: "Get Started Free",
    ctaHref: "/signup",
    features: [
      "1 Warehouse location",
      "Up to 2 team members",
      "Up to 250 SKUs",
      "Basic stock adjustments & movements",
      "Standard sales orders & invoices",
      "Community support",
    ],
    limits: {
      warehouses: "1 Warehouse",
      teamMembers: "2 Seats",
      skus: "250 SKUs",
      monthlyInvoices: "50 / mo",
      support: "Community",
    },
  },
  {
    id: "starter",
    name: "Starter",
    description: "For growing businesses managing expanding product catalogs and sales.",
    priceMonthly: "Provisional (TBD)",
    priceAnnual: "Provisional (TBD)",
    billingPeriod: "Billed annually or monthly",
    ctaText: "Start Starter Plan",
    ctaHref: "/signup",
    features: [
      "Up to 3 Warehouse locations",
      "Up to 5 team members",
      "Up to 2,500 SKUs",
      "Purchase orders & goods receipts",
      "Barcode generation & scanning",
      "Low stock automated alerts",
      "Email support (24h response)",
    ],
    limits: {
      warehouses: "3 Warehouses",
      teamMembers: "5 Seats",
      skus: "2,500 SKUs",
      monthlyInvoices: "500 / mo",
      support: "Email (24h)",
    },
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Most Popular",
    description: "For multi-warehouse operations demanding automated purchasing & reporting.",
    priceMonthly: "Provisional (TBD)",
    priceAnnual: "Provisional (TBD)",
    billingPeriod: "Billed annually or monthly",
    highlighted: true,
    ctaText: "Start Growth Plan",
    ctaHref: "/signup",
    features: [
      "Up to 10 Warehouse locations",
      "Up to 15 team members",
      "Up to 15,000 SKUs",
      "Inter-warehouse transfers & reconciliation",
      "Custom role-based permissions",
      "Advanced sales & inventory reports",
      "Priority email & chat support",
    ],
    limits: {
      warehouses: "10 Warehouses",
      teamMembers: "15 Seats",
      skus: "15,000 SKUs",
      monthlyInvoices: "2,500 / mo",
      support: "Priority 24/7",
    },
  },
  {
    id: "business",
    name: "Business",
    description: "For established retail, wholesale, and distributor networks requiring full scale.",
    priceMonthly: "Provisional (TBD)",
    priceAnnual: "Provisional (TBD)",
    billingPeriod: "Billed annually or monthly",
    ctaText: "Contact Sales",
    ctaHref: "/contact",
    features: [
      "Unlimited Warehouse locations",
      "Up to 50 team members",
      "Up to 100,000 SKUs",
      "Full REST API & webhook integrations",
      "Granular audit logs & compliance tracking",
      "Dedicated account manager",
      "Custom invoicing templates & multi-GSTN",
    ],
    limits: {
      warehouses: "Unlimited",
      teamMembers: "50 Seats",
      skus: "100,000 SKUs",
      monthlyInvoices: "10,000 / mo",
      support: "Dedicated Manager",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom compliance, on-premise, or SLA demands.",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    billingPeriod: "Custom contractual billing",
    ctaText: "Talk to Sales",
    ctaHref: "/contact",
    features: [
      "Unlimited Warehouses & Seats",
      "Custom SKU scale & high-frequency sync",
      "Custom ERP & accounting integrations",
      "99.99% uptime SLA guarantee",
      "SOC 2 / ISO compliance reporting",
      "Onboarding assistance & staff training",
    ],
    limits: {
      warehouses: "Custom",
      teamMembers: "Custom",
      skus: "Unlimited",
      monthlyInvoices: "Unlimited",
      support: "24/7 Dedicated SLA",
    },
  },
];
