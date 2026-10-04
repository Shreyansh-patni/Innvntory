export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const landingFaqs: FAQItem[] = [
  {
    question: "What makes Innvntory different from legacy inventory or ERP software?",
    answer: "Innvntory is built on modern web technologies with an obsession for speed, hairline precision, and zero-compromise data integrity. Unlike bloated legacy software, every screen is responsive, intuitive, and designed for operational velocity without tedious configuration.",
  },
  {
    question: "Can I manage multiple warehouses and retail locations?",
    answer: "Yes. Innvntory is engineered from the ground up for multi-facility operations. You can track real-time stock levels, initiate transfers, manage location-specific bin assignments, and fulfill orders from any warehouse.",
  },
  {
    question: "Is Innvntory compliant with Indian GST requirements?",
    answer: "Yes. Innvntory includes built-in support for Indian GST, HSN/SAC codes, CGST/SGST/IGST tax breakdowns, state-wise tax reporting, and clean PDF invoices compliant with tax standards.",
  },
  {
    question: "How does tenant security and data isolation work?",
    answer: "Every organization operates in strict tenant isolation at the database layer. Your products, customers, transactions, and audit logs are completely isolated and protected by server-side authorization and encryption.",
  },
  {
    question: "Can I migrate my existing data from spreadsheets or older systems?",
    answer: "Yes. Innvntory provides structured CSV and Excel import utilities for product catalogs, customer databases, vendor records, and initial stock quantities to ensure a seamless transition.",
  },
  {
    question: "Is there a developer API available for custom integrations?",
    answer: "Yes. Innvntory features a modern RESTful API (`/api/v1/...`) and webhook system for connecting eCommerce platforms, third-party logistics (3PLs), accounting software, and custom internal tools.",
  },
];
