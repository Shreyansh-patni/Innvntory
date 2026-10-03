import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Innvntory — Inventory and business operations, made clear",
    template: "%s · Innvntory",
  },
  description:
    "Innvntory is an AI-native inventory and business operations platform. Products, stock, purchasing, sales, billing and reporting in one system.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}