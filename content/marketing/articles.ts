export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  category: string;
  featured?: boolean;
  content: {
    sectionHeading: string;
    paragraphs: string[];
    callout?: string;
  }[];
}

export const articles: Article[] = [
  {
    slug: "rethinking-inventory-accuracy-in-multi-warehouse-commerce",
    title: "Rethinking Inventory Accuracy in Multi-Warehouse Operations",
    excerpt: "Why disconnected spreadsheets and batch sync architectures fail growing businesses, and how a real-time event ledger solves discrepancy headaches.",
    date: "October 2026",
    readTime: "5 min read",
    category: "Operations",
    featured: true,
    author: {
      name: "Sahaya Engineering",
      role: "Architecture Team",
    },
    content: [
      {
        sectionHeading: "The Cost of Ghost Stock",
        paragraphs: [
          "For modern inventory-driven businesses, inventory discrepancies are rarely a failure of warehouse staff diligence. They are almost universally a structural flaw in the underlying software architecture.",
          "When sales channels, purchase orders, and stock movements operate on delayed batch synchronizations, 'ghost stock' emerges—units shown as available in one warehouse that have already been allocated to an order in another.",
        ],
        callout: "Data integrity is not an afterthought in inventory management—it is the bedrock upon which business trust and fulfillment reliability exist.",
      },
      {
        sectionHeading: "Transitioning from CRUD to an Immutable Stock Ledger",
        paragraphs: [
          "Traditional inventory software overwrites numeric stock quantities directly in database records. In contrast, modern high-reliability systems model every stock delta as an immutable transaction.",
          "By treating every receipt, transfer, pick, and return as a first-class event, operations teams gain 100% auditability and eliminate unexplained quantity drift across facilities.",
        ],
      },
      {
        sectionHeading: "Operational Simplicity at Scale",
        paragraphs: [
          "Eliminating complexity does not mean stripping features—it means designing workflows that make the correct operational path the easiest path for everyday operators.",
        ],
      },
    ],
  },
  {
    slug: "designing-clean-procurement-workflows",
    title: "Designing Clean Procurement Workflows: From PO to 3-Way Match",
    excerpt: "A practical guide to eliminating invoice discrepancies and streamlining supplier fulfillment through automated goods receipts.",
    date: "September 2026",
    readTime: "4 min read",
    category: "Procurement",
    author: {
      name: "Sahaya Engineering",
      role: "Product Team",
    },
    content: [
      {
        sectionHeading: "The Friction of Manual Procurement",
        paragraphs: [
          "Procurement is where cash leaves the business. Yet in many mid-market businesses, purchase orders are still tracked via PDFs and WhatsApp messages, resulting in payment for damaged or missing goods.",
          "Implementing a strict three-way match—linking the original Purchase Order, the Warehouse Goods Receipt, and the Vendor Invoice—prevents overpayment and accelerates supplier reconciliation.",
        ],
      },
      {
        sectionHeading: "Empowering Warehouse Receivers",
        paragraphs: [
          "When dock workers can scan items against expected shipment manifests in real time, partial deliveries and damaged goods are flagged before signing the bill of lading.",
        ],
      },
    ],
  },
  {
    slug: "modern-saas-architecture-for-indian-enterprises",
    title: "Architecting Next-Generation Business OS for Indian Enterprises",
    excerpt: "How modern web standards, strict tenant isolation, and localized tax compliance create the foundation for Innvntory.",
    date: "September 2026",
    readTime: "6 min read",
    category: "Architecture",
    author: {
      name: "Sahaya Engineering",
      role: "Core Platform",
    },
    content: [
      {
        sectionHeading: "Bridging the Gap Between Legacy ERP and Lightweight Apps",
        paragraphs: [
          "Indian businesses have historically faced a false dichotomy: either struggle with complex, expensive legacy ERPs with outdated user interfaces, or settle for simplistic billing apps that crumble under multi-warehouse complexity.",
          "Innvntory is built to provide enterprise-grade reliability and strict relational integrity paired with the lightning-fast responsiveness and beauty of modern cloud software.",
        ],
      },
    ],
  },
];
