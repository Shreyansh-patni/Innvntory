import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing & Plans", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Live Application", href: "/app/dashboard" },
  ],
  resources: [
    { label: "Getting Started", href: "/docs/getting-started" },
    { label: "Articles & Guides", href: "/articles" },
    { label: "REST API Docs", href: "/docs/api" },
    { label: "Support & Inquiries", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sahaya Technologies", href: "/about" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-background-subtle">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.resources.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Legal & Compliance
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border-subtle pt-8 sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-heading font-bold tracking-tight text-text-primary">
              Innvntory
            </span>
            <span className="text-xs text-text-muted">
              A product of Sahaya Technologies Pvt. Ltd.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-medium text-text-secondary">
                Systems Operational
              </span>
            </div>
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Sahaya Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
