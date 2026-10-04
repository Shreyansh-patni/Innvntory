import type { Metadata } from "next";
import { fontPrimary, fontSecondary } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innvntory",
  description: "A modern business operating system for inventory-driven businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontPrimary.variable} ${fontSecondary.variable} font-sans min-h-screen bg-background text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
