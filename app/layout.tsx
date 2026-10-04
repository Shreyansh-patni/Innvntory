import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontPrimary, fontSecondary } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getResolvedThemePreference } from "@/lib/preferences/service";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innvntory — Modern Business Operating System",
  description:
    "A high-precision inventory and business management SaaS engineered for multi-warehouse businesses. Built by Sahaya Technologies Pvt. Ltd.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = await getResolvedThemePreference();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={theme === "dark" ? "dark" : ""}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var m = document.cookie.match(/(?:^|; )innvntory_theme=([^;]*)/);
                var t = m ? decodeURIComponent(m[1]) : localStorage.getItem('innvntory_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })()`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fontPrimary.variable} ${fontSecondary.variable} font-sans bg-background text-text-primary antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
