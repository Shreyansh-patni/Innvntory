import type { Metadata } from "next";
import { fontPrimary, fontSecondary } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innvntory — Modern Business Operating System",
  description:
    "A high-precision inventory and business management SaaS engineered for multi-warehouse businesses. Built by Sahaya Technologies Pvt. Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontPrimary.variable} ${fontSecondary.variable} font-sans bg-background text-text-primary antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
